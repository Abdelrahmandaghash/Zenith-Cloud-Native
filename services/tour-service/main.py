import time
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ZENITH Tour Service",
    description="Lightweight microservice serving mountain expeditions, itineraries, and destinations.",
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

@app.middleware("http")
async def track_metrics_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    path = request.url.path
    status = str(response.status_code)
    metric_key = f'zenith_http_requests_total{{service="tour-service",endpoint="{path}",status="{status}"}}'
    REQUEST_COUNTS[metric_key] = REQUEST_COUNTS.get(metric_key, 0) + 1
    REQUEST_LATENCIES.append(duration)
    if len(REQUEST_LATENCIES) > 500:
        REQUEST_LATENCIES.pop(0)

    return response

# ----------------- Sample Tours -----------------
TOURS = [
  {
    "id": "t1",
    "title": "Mount Everest Base Camp & Kala Patthar",
    "destination": "Khumbu Valley, Nepal",
    "country": "Nepal",
    "mountainRange": "Mahalangur Himalayas",
    "elevation": "5,364m",
    "difficulty": "Challenging",
    "duration": "14 Days",
    "price": 2490,
    "maxGroupSize": 12,
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "highlight": "Stand before the Khumbu Icefall beneath Everest's south face and greet dawn from Kala Patthar.",
    "description": "The ultimate Himalayan pilgrimage. From the flight into Lukla, trek through Namche Bazaar, Tengboche Monastery, Dingboche, and Lobuche, culminating at Everest Base Camp (5,364m) and the iconic dawn summit of Kala Patthar (5,545m).",
    "guide": "Tsering Norbu Sherpa (IFMGA Certified, 9x Everest Summits)",
    "included": ["Kathmandu-Lukla domestic flights", "Sherpa guides and porters", "Teahouse lodges and meals", "Sagarmatha permits"]
  },
  {
    "id": "t2",
    "title": "Mount Kilimanjaro — Machame Route",
    "destination": "Uhuru Peak, Tanzania",
    "country": "Tanzania",
    "mountainRange": "Eastern Rift Range",
    "elevation": "5,895m",
    "difficulty": "Challenging",
    "duration": "8 Days",
    "price": 2790,
    "maxGroupSize": 10,
    "image": "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1200&q=80",
    "highlight": "Ascend the Roof of Africa via the scenic Machame 'Whiskey' Route with optimal acclimatization.",
    "description": "Traverse cloud forests, moorlands, and the Lava Tower (4,600m) before scrambling the Barranco Wall. Midnight summit push across arctic glaciers to Uhuru Peak (5,895m) for sunrise above the clouds.",
    "guide": "Baraka Mrema (Senior KINAPA Guide, 140+ Summits)",
    "included": ["Park rescue & conservation fees", "4-season geodesic tents", "Camp chef and porters", "Oxygen safety standby"]
  },
  {
    "id": "t3",
    "title": "Mont Blanc Summit via Goûter Route",
    "destination": "Chamonix-Mont-Blanc, France / Italy",
    "country": "France / Italy",
    "mountainRange": "Graian Alps",
    "elevation": "4,809m",
    "difficulty": "Extreme Alpine",
    "duration": "6 Days",
    "price": 3150,
    "maxGroupSize": 4,
    "image": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    "highlight": "Western Europe's highest peak with a strict 1:2 guide ratio, crampon training, and Goûter hut refuge.",
    "description": "Serious mountaineering undertaking requiring alpine crampon technique and glacier traversal. Includes glacier training on Aiguille du Midi and an ascent across the razor-sharp Bosses Ridge to the summit dome.",
    "guide": "Jean-Luc Moreau (ENSA Chamonix High Mountain Guide, 85 Summits)",
    "included": ["1:2 Guide-to-Climber ratio with IFMGA guide", "Goûter & Tête Rousse hut reservations", "Cable car & tramway passes", "Safety gear rental"]
  },
  {
    "id": "t4",
    "title": "Mount Elbrus South Route Expedition",
    "destination": "West Peak, Caucasus",
    "country": "Russia",
    "mountainRange": "Caucasus Mountains",
    "elevation": "5,642m",
    "difficulty": "Challenging",
    "duration": "9 Days",
    "price": 2250,
    "maxGroupSize": 8,
    "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    "highlight": "Climb the highest peak in Europe and one of the world's coveted Seven Summits.",
    "description": "Ascend the extinct volcanic double cone of Mount Elbrus. Features alpine hut accommodation at 3,800m, acclimatization hikes on Pastukhov Rocks, and an alpine snow push to the West Peak.",
    "guide": "Dmitry Volkov (Russian Mountain Guide Association, 62 Summits)",
    "included": ["Park permits & cable car lifts", "Mountain huts at 3,800m", "Expedition chef and meals", "Snowcat emergency standby"]
  },
  {
    "id": "t5",
    "title": "Mount Toubkal & Berber High Atlas Trek",
    "destination": "Jebel Toubkal, High Atlas",
    "country": "Morocco",
    "mountainRange": "High Atlas Mountains",
    "elevation": "4,167m",
    "difficulty": "Moderate",
    "duration": "5 Days",
    "price": 1150,
    "maxGroupSize": 12,
    "image": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80",
    "highlight": "Ascend North Africa's highest summit through dramatic gorges and authentic Berber villages.",
    "description": "Only 90 minutes from Marrakech, this trek winds through terraced walnut groves in Imlil, sacred shrines at Sidi Chamarouch, and the rocky South Col to Toubkal's pyramid summit overlooking the Sahara.",
    "guide": "Rachid Ait Benhaddou (CFAMM High Mountain Guide, 210 Summits)",
    "included": ["Private transfers from Marrakech", "Berber mountain guide & mule team", "Refuge du Toubkal stays", "Traditional tagine meals"]
  },
  {
    "id": "t6",
    "title": "Mount Sinai Sunrise Pilgrimage & St. Catherine",
    "destination": "Jabal Musa (Mount Sinai), South Sinai",
    "country": "Egypt",
    "mountainRange": "Sinai High Mountains",
    "elevation": "2,285m",
    "difficulty": "Moderate",
    "duration": "4 Days",
    "price": 890,
    "maxGroupSize": 14,
    "image": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    "highlight": "Ascend the sacred mountain of Moses under desert stars and explore the 6th-century UNESCO monastery.",
    "description": "Climb the Siket El Bashait camel trail by headlamp beneath billions of stars, ascending the 750 Steps of Repentance to Jabal Musa for a sunrise over granite mountain ridges.",
    "guide": "Suleiman Al-Jabali (Sinai Trail Association Lead Bedouin Guide)",
    "included": ["AC private transfers", "Bedouin mountain guide", "St. Catherine Monastery guided tour", "Desert eco-lodge accommodation"]
  }
]

# ----------------- Endpoints -----------------
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "tour-service",
        "port": 8002,
        "uptime_seconds": int(time.time() - START_TIME)
    }

@app.get("/api/tours", tags=["Tours"])
def get_tours(difficulty: Optional[str] = None):
    results = TOURS
    if difficulty and difficulty.lower() != "all":
        results = [t for t in results if t.get("difficulty", "").lower() == difficulty.lower()]
    return results

@app.get("/api/tours/{tour_id}", tags=["Tours"])
def get_tour_by_id(tour_id: str):
    for t in TOURS:
        if t["id"] == tour_id:
            return t
    raise HTTPException(status_code=404, detail="Tour not found")

@app.get("/metrics", tags=["Monitoring"])
def metrics():
    lines = [
        "# HELP zenith_http_requests_total Total HTTP requests processed by Tour Service",
        "# TYPE zenith_http_requests_total counter"
    ]
    for key, count in REQUEST_COUNTS.items():
        lines.append(f"{key} {count}")

    avg_latency = sum(REQUEST_LATENCIES) / len(REQUEST_LATENCIES) if REQUEST_LATENCIES else 0.0
    lines.extend([
        "# HELP zenith_http_request_duration_seconds Average request latency in seconds",
        "# TYPE zenith_http_request_duration_seconds gauge",
        f'zenith_http_request_duration_seconds{{service="tour-service"}} {avg_latency:.4f}',
        "# HELP zenith_service_uptime_seconds Service uptime in seconds",
        "# TYPE zenith_service_uptime_seconds gauge",
        f'zenith_service_uptime_seconds{{service="tour-service"}} {int(time.time() - START_TIME)}'
    ])
    return Response(content="\n".join(lines) + "\n", media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
