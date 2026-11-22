import time
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="ZENITH Product Service",
    description="Lightweight microservice serving mountain equipment catalog and categories.",
    version="1.0.0"
)

# Enable CORS for frontend communication
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

@app.middleware("http")
async def track_metrics_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    path = request.url.path
    status = str(response.status_code)
    metric_key = f'zenith_http_requests_total{{service="product-service",endpoint="{path}",status="{status}"}}'
    REQUEST_COUNTS[metric_key] = REQUEST_COUNTS.get(metric_key, 0) + 1
    REQUEST_LATENCIES.append(duration)
    if len(REQUEST_LATENCIES) > 500:
        REQUEST_LATENCIES.pop(0)

    return response

# ----------------- Sample Data -----------------
CATEGORIES = [
  {"id": "boots", "name": "Mountaineering Boots", "slug": "boots", "count": 3},
  {"id": "ropes", "name": "Climbing Ropes & Harnesses", "slug": "ropes", "count": 3},
  {"id": "ice", "name": "Ice Axes & Crampons", "slug": "ice", "count": 3},
  {"id": "tents", "name": "Backpacks & 4-Season Tents", "slug": "tents", "count": 3},
  {"id": "apparel", "name": "Technical Apparel & Safety", "slug": "apparel", "count": 3}
]

PRODUCTS = [
  {
    "id": "p1",
    "name": "ZENITH Apex 8000 Expedition Boot",
    "category": "boots",
    "price": 1199.00,
    "comparePrice": 1299.00,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 28,
    "isFeatured": True,
    "description": "Designed for 8,000m summits. Features an insulated Cordura outer gaiter, aerogel footbed, carbon fiber midsole, and Vibram Matterhorn tread with step-in automatic crampon bails.",
    "specs": {"Altitude Rating": "8,000m+", "Crampon Compatibility": "Automatic (C3)", "Insulation": "Aerogel + Primaloft Gold", "Weight": "1320g"}
  },
  {
    "id": "p2",
    "name": "Matterhorn Pro Alpine GTX Boot",
    "category": "boots",
    "price": 549.00,
    "comparePrice": 599.00,
    "image": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
    "rating": 4.8,
    "reviews": 19,
    "isFeatured": False,
    "description": "Rigid 4-season mixed alpine boot with Gore-Tex Insulated Comfort. 3mm Perwanger leather protected with 360-degree rubber rand.",
    "specs": {"Altitude Rating": "5,000m", "Crampon Compatibility": "Semi-Automatic (C2)", "Upper": "Perwanger Leather", "Weight": "880g"}
  },
  {
    "id": "p3",
    "name": "Cirque Carbon Approach Shoes",
    "category": "boots",
    "price": 229.00,
    "comparePrice": None,
    "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "rating": 4.7,
    "reviews": 14,
    "isFeatured": False,
    "description": "Sticky Megagrip rubber approach shoe with carbon shank support for scrambling and rocky alpine ascents.",
    "specs": {"Sole": "Vibram Megagrip", "Shank": "Carbon Composite", "Weight": "440g"}
  },
  {
    "id": "p4",
    "name": "Valkyrie 9.1mm Dry Dynamic Rope 70m",
    "category": "ropes",
    "price": 319.00,
    "comparePrice": 349.00,
    "image": "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    "rating": 5.0,
    "reviews": 42,
    "isFeatured": True,
    "description": "Triple-rated UIAA Water Repellent dry dynamic rope with ThermoShield treatment. Perfect for glacier travel, ridge crossings, and high alpine faces.",
    "specs": {"Diameter": "9.1mm", "Length": "70m", "Impact Force": "8.5 kN", "Weight": "3710g"}
  },
  {
    "id": "p5",
    "name": "Glacier Pass Ultralight Alpine Harness",
    "category": "ropes",
    "price": 139.00,
    "comparePrice": None,
    "image": "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    "rating": 4.8,
    "reviews": 17,
    "isFeatured": False,
    "description": "175g Dyneema monofilament alpine harness designed to be stepped into without removing crampons or skis.",
    "specs": {"Weight": "175g", "Material": "UHMWPE Dyneema", "Certification": "CE EN 12277 type C"}
  },
  {
    "id": "p6",
    "name": "Aegis Carbon Kevlar Climbing Helmet",
    "category": "ropes",
    "price": 189.00,
    "comparePrice": 210.00,
    "image": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 35,
    "isFeatured": False,
    "description": "EPP foam core encased in a carbon fiber reinforced Kevlar shell. Built-in headlamp clips and generous ventilation.",
    "specs": {"Weight": "210g", "Shell": "Carbon Kevlar Composite", "Foam": "EPP Core"}
  },
  {
    "id": "p7",
    "name": "Couloir Carbon Technical Ice Tool Pair",
    "category": "ice",
    "price": 580.00,
    "comparePrice": 640.00,
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    "rating": 5.0,
    "reviews": 29,
    "isFeatured": True,
    "description": "Carbon-wrapped technical ice climbing tool pair designed for steep couloirs, vertical waterfall ice, and hard mixed terrain.",
    "specs": {"Shaft": "T-Rated Carbon Wrapped", "Pick": "T-Rated 3.3mm Ice Pick", "Weight per tool": "495g"}
  },
  {
    "id": "p8",
    "name": "Nanga Parbat Classic Piolet 65cm",
    "category": "ice",
    "price": 165.00,
    "comparePrice": 185.00,
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    "rating": 4.8,
    "reviews": 38,
    "isFeatured": False,
    "description": "Hot-forged chromoly steel head with curved pick for confident self-arrest on glaciated peaks.",
    "specs": {"Length": "65cm", "Head": "Forged Chromoly Steel", "Shaft": "7075 Aluminum", "Weight": "435g"}
  },
  {
    "id": "p9",
    "name": "Viper 14-Point Forged Crampons",
    "category": "ice",
    "price": 275.00,
    "comparePrice": 310.00,
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 22,
    "isFeatured": False,
    "description": "Convertible mono/dual point forged ice and mixed climbing crampons with step-in automatic wire bails.",
    "specs": {"Points": "14 points", "Binding": "Automatic Step-In", "Weight": "980g pair"}
  },
  {
    "id": "p10",
    "name": "K2 Sanctuary 4-Season Geodesic Tent",
    "category": "tents",
    "price": 1050.00,
    "comparePrice": 1180.00,
    "image": "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 34,
    "isFeatured": True,
    "description": "Storm-tested in 100 mph winds on high-altitude ridges. 5-pole geodesic architecture with snow flaps and dual vestibules.",
    "specs": {"Capacity": "3 Person", "Poles": "DAC Featherlite NSL", "Fly": "70D Ripstop Nylon 5000mm", "Weight": "4450g"}
  },
  {
    "id": "p11",
    "name": "Everest Sub-Zero -40°C Down Sleeping Bag",
    "category": "tents",
    "price": 980.00,
    "comparePrice": 1080.00,
    "image": "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
    "rating": 5.0,
    "reviews": 27,
    "isFeatured": False,
    "description": "Packed with 1,250g of 900+ fill power hydrophobic goose down wrapped in weather-resistant Pertex Quantum Pro shell.",
    "specs": {"Comfort Rating": "-32°C", "Extreme": "-42°C", "Down": "900+ FP Goose Down", "Weight": "1780g"}
  },
  {
    "id": "p12",
    "name": "High-Haul 85L Expedition Backpack",
    "category": "tents",
    "price": 460.00,
    "comparePrice": 495.00,
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 45,
    "isFeatured": False,
    "description": "Heavy-load mountaineering pack built from Spectra ripstop and 500D Cordura with pivot-flex hip belt.",
    "specs": {"Volume": "85L + 15L collar", "Frame": "Dual Aluminum Stays", "Weight": "2250g"}
  },
  {
    "id": "p13",
    "name": "Summit Pro Gore-Tex Hardshell Jacket",
    "category": "apparel",
    "price": 699.00,
    "comparePrice": 750.00,
    "image": "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80",
    "rating": 5.0,
    "reviews": 52,
    "isFeatured": True,
    "description": "3-layer Gore-Tex Pro Most Rugged 80D shell. Helmet-compatible StormHood, harness-friendly high pockets, and pit zips.",
    "specs": {"Membrane": "Gore-Tex Pro 3L", "Waterproof": "28,000mm", "Weight": "495g"}
  },
  {
    "id": "p14",
    "name": "Beacon-3 Digital Avalanche Transceiver",
    "category": "apparel",
    "price": 420.00,
    "comparePrice": 460.00,
    "image": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 33,
    "isFeatured": False,
    "description": "Three-antenna digital avalanche beacon with 70-meter circular search strip, multiple burial marking, and group check mode.",
    "specs": {"Antennas": "3", "Search Strip": "70 meters", "Frequency": "457 kHz", "Battery Life": "300h"}
  },
  {
    "id": "p15",
    "name": "Expedition Aviator Glacier Sunglasses (Cat 4)",
    "category": "apparel",
    "price": 195.00,
    "comparePrice": None,
    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "reviews": 25,
    "isFeatured": False,
    "description": "Category 4 mineral glass lenses offering 95% visible light absorption for high alpine glare with magnetic leather side shields.",
    "specs": {"Lens": "Cat 4 Mineral Glass", "UV Protection": "100% UVA/B/C", "Frame": "Titanium Alloy"}
  }
]

# ----------------- Endpoints -----------------
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "product-service",
        "port": 8001,
        "uptime_seconds": int(time.time() - START_TIME)
    }

@app.get("/api/products", tags=["Products"])
def get_products(category: Optional[str] = None, search: Optional[str] = None):
    results = PRODUCTS
    if category and category != "all":
        results = [p for p in results if p.get("category") == category]
    if search:
        s = search.lower()
        results = [p for p in results if s in p["name"].lower() or s in p["description"].lower()]
    return results

@app.get("/api/products/{product_id}", tags=["Products"])
def get_product_by_id(product_id: str):
    for p in PRODUCTS:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="Product not found")

@app.get("/api/categories", tags=["Categories"])
def get_categories():
    return CATEGORIES

@app.get("/metrics", tags=["Monitoring"])
def metrics():
    lines = [
        "# HELP zenith_http_requests_total Total HTTP requests processed by Product Service",
        "# TYPE zenith_http_requests_total counter"
    ]
    for key, count in REQUEST_COUNTS.items():
        lines.append(f"{key} {count}")

    avg_latency = sum(REQUEST_LATENCIES) / len(REQUEST_LATENCIES) if REQUEST_LATENCIES else 0.0
    lines.extend([
        "# HELP zenith_http_request_duration_seconds Average request latency in seconds",
        "# TYPE zenith_http_request_duration_seconds gauge",
        f'zenith_http_request_duration_seconds{{service="product-service"}} {avg_latency:.4f}',
        "# HELP zenith_service_uptime_seconds Service uptime in seconds",
        "# TYPE zenith_service_uptime_seconds gauge",
        f'zenith_service_uptime_seconds{{service="product-service"}} {int(time.time() - START_TIME)}'
    ])
    return Response(content="\n".join(lines) + "\n", media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
