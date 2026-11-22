import time
import uuid
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(
    title="ZENITH Order Service",
    description="Lightweight microservice handling cart checkout and order processing.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Prometheus Metrics Tracking -----------------
START_TIME = time.time()
REQUEST_COUNTS = {}
REQUEST_LATENCIES = []
ORDERS_CREATED_TOTAL = 1  # starts with demo order

@app.middleware("http")
async def track_metrics_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    path = request.url.path
    status = str(response.status_code)
    metric_key = f'zenith_http_requests_total{{service="order-service",endpoint="{path}",status="{status}"}}'
    REQUEST_COUNTS[metric_key] = REQUEST_COUNTS.get(metric_key, 0) + 1
    REQUEST_LATENCIES.append(duration)
    if len(REQUEST_LATENCIES) > 500:
        REQUEST_LATENCIES.pop(0)

    return response

# ----------------- Pydantic Models -----------------
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    shipping_address: str
    items: List[OrderItem]
    subtotal: float
    shipping_cost: float = 0.0
    tax: float = 0.0
    total: float

class OrderResponse(BaseModel):
    id: str
    order_code: str
    customer_name: str
    customer_email: str
    shipping_address: str
    items: List[OrderItem]
    total: float
    status: str
    created_at: str

# ----------------- In-Memory Sample Orders -----------------
ORDERS: List[dict] = [
    {
        "id": "ord-demo-01",
        "order_code": "ZEN-ORD-90412",
        "customer_name": "Alex Mercer",
        "customer_email": "alex.climber@zenith.com",
        "shipping_address": "452 Alpine Ridge Way, Boulder, CO 80302",
        "items": [
            {
                "product_id": "p1",
                "name": "ZENITH Apex 8000 Expedition Boot",
                "price": 1199.00,
                "quantity": 1
            },
            {
                "product_id": "p4",
                "name": "Valkyrie 9.1mm Dry Dynamic Rope 70m",
                "price": 319.00,
                "quantity": 1
            }
        ],
        "subtotal": 1518.00,
        "shipping_cost": 0.0,
        "tax": 121.44,
        "total": 1639.44,
        "status": "confirmed",
        "created_at": "2026-11-20T14:30:00Z"
    }
]

# ----------------- Endpoints -----------------
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "order-service",
        "port": 8003,
        "total_orders": len(ORDERS),
        "uptime_seconds": int(time.time() - START_TIME)
    }

@app.get("/api/orders", tags=["Orders"])
def get_orders():
    return ORDERS

@app.post("/api/orders", response_model=OrderResponse, tags=["Orders"])
def create_order(order_in: OrderCreate):
    global ORDERS_CREATED_TOTAL
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot place an empty order")

    order_id = f"ord-{uuid.uuid4().hex[:8]}"
    order_code = f"ZEN-ORD-{random.randint(10000, 99999)}"
    now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    new_order = {
        "id": order_id,
        "order_code": order_code,
        "customer_name": order_in.customer_name,
        "customer_email": order_in.customer_email,
        "shipping_address": order_in.shipping_address,
        "items": [item.model_dump() for item in order_in.items],
        "subtotal": order_in.subtotal,
        "shipping_cost": order_in.shipping_cost,
        "tax": order_in.tax,
        "total": order_in.total,
        "status": "confirmed",
        "created_at": now_iso
    }

    ORDERS.insert(0, new_order)
    ORDERS_CREATED_TOTAL += 1

    return new_order

@app.get("/metrics", tags=["Monitoring"])
def metrics():
    lines = [
        "# HELP zenith_http_requests_total Total HTTP requests processed by Order Service",
        "# TYPE zenith_http_requests_total counter"
    ]
    for key, count in REQUEST_COUNTS.items():
        lines.append(f"{key} {count}")

    avg_latency = sum(REQUEST_LATENCIES) / len(REQUEST_LATENCIES) if REQUEST_LATENCIES else 0.0
    lines.extend([
        "# HELP zenith_http_request_duration_seconds Average request latency in seconds",
        "# TYPE zenith_http_request_duration_seconds gauge",
        f'zenith_http_request_duration_seconds{{service="order-service"}} {avg_latency:.4f}',
        "# HELP zenith_orders_created_total Total successful orders placed",
        "# TYPE zenith_orders_created_total counter",
        f'zenith_orders_created_total{{service="order-service"}} {ORDERS_CREATED_TOTAL}',
        "# HELP zenith_service_uptime_seconds Service uptime in seconds",
        "# TYPE zenith_service_uptime_seconds gauge",
        f'zenith_service_uptime_seconds{{service="order-service"}} {int(time.time() - START_TIME)}'
    ])
    return Response(content="\n".join(lines) + "\n", media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
