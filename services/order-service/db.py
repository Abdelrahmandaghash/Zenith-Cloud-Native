"""
Postgres persistence for the ZENITH order service.

The storage backend is chosen from the DATABASE_URL environment variable:

  * set    -> PostgreSQL (docker-compose and AWS ECS both provide it)
  * unset  -> in-memory list in main.py, so `python main.py` still works

This module only implements the PostgreSQL side; main.py picks between the
two. Every public query function raises DatabaseError when Postgres is
reachable but a query fails, so callers can translate that into a 503.
"""

import logging
import os
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

try:
    import psycopg2
    from psycopg2 import pool
    from psycopg2.extras import Json, RealDictCursor
    _PSYCOPG2_ERROR: Optional[type] = psycopg2.Error
except ImportError:  # driver not installed -> memory mode still works
    psycopg2 = None
    pool = None
    Json = RealDictCursor = None
    _PSYCOPG2_ERROR = RuntimeError

logger = logging.getLogger("order-service.db")

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# FastAPI runs these sync endpoints in a threadpool, so connections are
# handed out from a small thread-safe pool rather than shared directly.
_pool: Optional[Any] = None

# Idempotent, so it is safe to run on every boot.
CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS orders (
    id               TEXT PRIMARY KEY,
    order_code       TEXT NOT NULL,
    customer_name    TEXT NOT NULL,
    customer_email   TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    items            JSONB NOT NULL,
    subtotal         NUMERIC(12, 2) NOT NULL,
    shipping_cost    NUMERIC(12, 2) NOT NULL,
    tax              NUMERIC(12, 2) NOT NULL,
    total            NUMERIC(12, 2) NOT NULL,
    status           TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
"""

_INSERT_SQL = """
INSERT INTO orders (
    id, order_code, customer_name, customer_email, shipping_address,
    items, subtotal, shipping_cost, tax, total, status, created_at
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (id) DO NOTHING
"""


class DatabaseError(RuntimeError):
    """PostgreSQL is unreachable or rejected a query."""


def enabled() -> bool:
    """True when the service can persist to PostgreSQL."""
    return bool(DATABASE_URL) and psycopg2 is not None


def init_db(seed: Optional[List[dict]] = None, retries: int = 5, delay: float = 3.0) -> None:
    """Open the connection pool, create the schema and seed demo rows.

    Called once at startup from the FastAPI lifespan hook. Retries a few
    times to ride out RDS/DNS coming up slightly after the task, then gives
    up so the container restarts instead of serving an order service that
    cannot store orders.
    """
    global _pool
    if not DATABASE_URL:
        logger.warning(
            "DATABASE_URL is not set - running with in-memory storage "
            "(orders are lost when the process stops)"
        )
        return
    if psycopg2 is None:
        logger.error(
            "DATABASE_URL is set but psycopg2 is not installed - "
            "install requirements.txt to enable persistence"
        )
        return
    if _pool is not None:
        return

    last_error: Optional[BaseException] = None
    for attempt in range(1, retries + 1):
        try:
            _pool = pool.SimpleConnectionPool(minconn=1, maxconn=5, dsn=DATABASE_URL)
            break
        except psycopg2.OperationalError as exc:
            last_error = exc
            logger.warning(
                "PostgreSQL not reachable (attempt %d/%d): %s", attempt, retries, exc
            )
            time.sleep(delay)
    else:
        raise DatabaseError(f"could not connect to PostgreSQL: {last_error}")

    with _cursor() as cur:
        cur.execute(CREATE_TABLE_SQL)
    logger.info("PostgreSQL schema ready")

    if seed:
        _seed_if_empty(seed)


def close() -> None:
    """Shut the pool down (FastAPI lifespan teardown)."""
    global _pool
    if _pool is not None:
        _pool.closeall()
        _pool = None


@contextmanager
def _cursor():
    """Yield a cursor on a pooled connection.

    Commits on success, rolls back on failure, and discards the connection
    if anything went wrong so a broken socket is never handed out again.
    """
    if _pool is None:
        raise DatabaseError("connection pool is not initialised")
    conn = _pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
            conn.commit()
    except Exception:
        try:
            conn.rollback()
        except Exception:
            pass
        _pool.putconn(conn, close=True)
        raise
    else:
        _pool.putconn(conn)


def _seed_if_empty(seed: List[dict]) -> None:
    """Insert demo orders once, so a fresh database is not empty."""
    with _cursor() as cur:
        cur.execute("SELECT COUNT(*) AS n FROM orders")
        if int(cur.fetchone()["n"]) > 0:
            return
        for order in seed:
            _insert(cur, order)
    logger.info("Seeded %d demo order(s)", len(seed))


def _insert(cur, order: dict) -> None:
    cur.execute(
        _INSERT_SQL,
        (
            order["id"],
            order["order_code"],
            order["customer_name"],
            order["customer_email"],
            order["shipping_address"],
            Json(order["items"]),
            order["subtotal"],
            order["shipping_cost"],
            order["tax"],
            order["total"],
            order["status"],
            order["created_at"],
        ),
    )


def list_orders() -> List[dict]:
    """Return every order, newest first."""
    try:
        with _cursor() as cur:
            cur.execute("SELECT * FROM orders ORDER BY created_at DESC, id DESC")
            return [_to_order(row) for row in cur.fetchall()]
    except _PSYCOPG2_ERROR as exc:
        raise DatabaseError(str(exc)) from exc


def create_order(order: dict) -> None:
    """Persist a new order (the caller has already validated it)."""
    try:
        with _cursor() as cur:
            _insert(cur, order)
    except _PSYCOPG2_ERROR as exc:
        raise DatabaseError(str(exc)) from exc


def health() -> Dict[str, Any]:
    """Cheap detail for /health; never raises."""
    if not enabled():
        return {"mode": "memory", "connected": False, "orders": None}
    try:
        with _cursor() as cur:
            cur.execute("SELECT COUNT(*) AS n FROM orders")
            count = int(cur.fetchone()["n"])
        return {"mode": "postgres", "connected": True, "orders": count}
    except Exception as exc:  # health must never blow up
        logger.error("database health check failed: %s", exc)
        return {"mode": "postgres", "connected": False, "orders": None}


def _to_order(row: dict) -> dict:
    """Map a database row to the JSON shape the API has always returned."""
    created = row["created_at"]
    if isinstance(created, datetime):
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        created = created.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {
        "id": row["id"],
        "order_code": row["order_code"],
        "customer_name": row["customer_name"],
        "customer_email": row["customer_email"],
        "shipping_address": row["shipping_address"],
        "items": row["items"],
        "subtotal": float(row["subtotal"]),
        "shipping_cost": float(row["shipping_cost"]),
        "tax": float(row["tax"]),
        "total": float(row["total"]),
        "status": row["status"],
        "created_at": created,
    }
