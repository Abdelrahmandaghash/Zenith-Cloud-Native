import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ArrowRight, ShieldCheck, Compass, Award, Star, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { PRODUCTS, TOURS } from '../data/sampleData';
import { useCart } from '../context/CartContext';
import ProductModal from '../components/ProductModal';
import TourModal from '../components/TourModal';

export default function HomePage() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);

  const featuredProducts = PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
  const popularTours = TOURS.slice(0, 3);

  return (
    <div className="min-h-screen bg-zenith-dark">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with High Alpine Atmosphere */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
            alt="Cinematic Himalayan Mountain Ridge"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Deep Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-zenith-dark via-zenith-dark/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(16,21,19,0.7)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zenith-forest/80 border border-zenith-stone/20 text-zenith-accent text-xs font-semibold tracking-widest uppercase shadow-lg backdrop-blur-md">
            <Compass className="w-3.5 h-3.5" /> High-Altitude Engineering & Guided Summits
          </div>

          <div className="space-y-4">
            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zenith-offwhite leading-[1.1] drop-shadow-2xl">
              BEYOND THE <span className="text-zenith-accent">SUMMIT</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zenith-stone/90 leading-relaxed font-light drop-shadow">
              Equipping the world's boldest alpinists for extreme verticality. From Death-Zone double boots to guided high-altitude expeditions on Everest, Kilimanjaro, and Mont Blanc.
            </p>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-all shadow-xl hover:shadow-zenith-accent/30 flex items-center justify-center gap-2 group"
            >
              Explore Equipment Store
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/expeditions"
              className="w-full sm:w-auto px-8 py-4 bg-zenith-forest/90 hover:bg-zenith-forest text-zenith-offwhite border border-zenith-stone/30 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              Discover Expeditions
              <Mountain className="w-4 h-4 text-zenith-accent" />
            </Link>
          </div>

          {/* Micro-Features Row */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-zenith-stone/15 text-xs text-zenith-stone/80">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zenith-accent shrink-0" />
              <span>UIAA & CE Standards</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-zenith-accent shrink-0" />
              <span>IFMGA Lead Guides</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mountain className="w-4 h-4 text-zenith-accent shrink-0" />
              <span>8,000m Summit Tested</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-zenith-accent shrink-0" />
              <span>Microservices Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Equipment Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 border-b border-zenith-stone/10 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-zenith-accent">
              Alpine Hardware & Gear
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-zenith-offwhite mt-1">
              Featured Mountaineering Equipment
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-zenith-stone hover:text-zenith-accent flex items-center gap-1 transition-colors"
          >
            View All 15 Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-zenith-forest/20 border border-zenith-stone/10 rounded-xl overflow-hidden hover:border-zenith-accent/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
            >
              <div
                className="relative overflow-hidden cursor-pointer bg-zenith-forest/40 aspect-square"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-zenith-accent text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                  Summit Pick
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-zenith-stone/60 mb-1">
                    <span className="uppercase tracking-widest">{product.category}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {product.rating}
                    </span>
                  </div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-cinzel text-sm font-bold text-zenith-offwhite group-hover:text-zenith-accent transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-zenith-stone/70 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zenith-stone/10 flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-zenith-accent">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-3.5 py-1.5 bg-zenith-forest border border-zenith-stone/30 hover:bg-zenith-accent hover:border-zenith-accent text-white text-xs font-semibold rounded transition-all shadow"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Popular Mountain Expeditions Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-zenith-forest/10 to-transparent border-y border-zenith-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-zenith-accent">
                Guided Alpine Adventures
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-zenith-offwhite mt-1">
                Popular Mountain Expeditions
              </h2>
            </div>
            <Link
              to="/expeditions"
              className="text-xs font-bold uppercase tracking-wider text-zenith-stone hover:text-zenith-accent flex items-center gap-1 transition-colors"
            >
              Explore All 6 Summits <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => setSelectedTour(tour)}
                className="group relative rounded-xl overflow-hidden border border-zenith-stone/15 bg-zenith-dark cursor-pointer shadow-xl hover:border-zenith-accent/40 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zenith-dark via-zenith-dark/40 to-transparent" />
                  
                  <span className="absolute top-3 right-3 bg-zenith-dark/80 backdrop-blur-md border border-zenith-stone/20 text-zenith-accent text-xs font-mono font-bold px-2.5 py-1 rounded">
                    {tour.elevation}
                  </span>
                </div>

                <div className="p-6 space-y-3 relative -mt-8">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zenith-accent">
                    {tour.destination}
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-zenith-offwhite group-hover:text-zenith-accent transition-colors leading-snug">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-zenith-stone/80 line-clamp-2 leading-relaxed">
                    {tour.highlight}
                  </p>

                  <div className="pt-3 border-t border-zenith-stone/10 flex items-center justify-between text-xs">
                    <span className="text-zenith-stone/60">{tour.duration} • {tour.difficulty}</span>
                    <span className="font-mono text-base font-bold text-zenith-accent">
                      ${tour.price.toLocaleString()} <span className="text-[10px] text-zenith-stone/60">USD</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose ZENITH Section */}
      <section id="why-zenith" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-zenith-accent">
            The Alpine Standard
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-zenith-offwhite">
            Why Alpinists Trust ZENITH
          </h2>
          <p className="text-sm text-zenith-stone/80 leading-relaxed">
            When you're bivouacked on a wind-scoured ledge at 7,000 meters, failure is not an option. Every piece of equipment and guided itinerary is built on uncompromised discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-xl space-y-4 hover:border-zenith-accent/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-zenith-forest flex items-center justify-center text-zenith-accent border border-zenith-stone/20">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-zenith-offwhite">
              Death-Zone Certified Gear
            </h3>
            <p className="text-xs text-zenith-stone/80 leading-relaxed">
              Every boot, ice tool, and 4-season tent is tested in extreme thermal chambers to -50°C and proven on 8,000m Himalayan summits before being offered in our catalog.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-xl space-y-4 hover:border-zenith-accent/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-zenith-forest flex items-center justify-center text-zenith-accent border border-zenith-stone/20">
              <Award className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-zenith-offwhite">
              Certified IFMGA Guides
            </h3>
            <p className="text-xs text-zenith-stone/80 leading-relaxed">
              Our expedition leaders hold international UIAGM/IFMGA credentials and average over 15 years of high-altitude guiding in the Himalayas, Alps, and Andes.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-xl space-y-4 hover:border-zenith-accent/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-zenith-forest flex items-center justify-center text-zenith-accent border border-zenith-stone/20">
              <Mountain className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-zenith-offwhite">
              100% Safety & Evacuation Cover
            </h3>
            <p className="text-xs text-zenith-stone/80 leading-relaxed">
              All expeditions are monitored by 24/7 global satellite dispatch with stationed Gamow hyperbaric bags, emergency bottled oxygen, and helicopter evacuation standby.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Adventure Statistics */}
      <section className="py-16 bg-zenith-forest/30 border-y border-zenith-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-zenith-accent">
                8,848m
              </div>
              <div className="text-xs text-zenith-stone/70 uppercase tracking-widest font-semibold">
                Highest Summit Reached
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-zenith-accent">
                98.4%
              </div>
              <div className="text-xs text-zenith-stone/70 uppercase tracking-widest font-semibold">
                Summit Success Rate
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-zenith-accent">
                14,200+
              </div>
              <div className="text-xs text-zenith-stone/70 uppercase tracking-widest font-semibold">
                Climbers Equipped
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-zenith-accent">
                0
              </div>
              <div className="text-xs text-zenith-stone/70 uppercase tracking-widest font-semibold">
                Serious Safety Incidents
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-zenith-accent">
            From the High Camps
          </span>
          <h2 className="font-cinzel text-3xl font-bold text-zenith-offwhite">
            Expedition Reports
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-zenith-stone/90 italic leading-relaxed">
              "The Apex 8000 boots were flawless during our summit push across the Hillary Step. Warm, precise with automatic crampons, and zero cold spots even at -38°C."
            </p>
            <div className="pt-2 border-t border-zenith-stone/10 text-xs">
              <span className="font-bold text-zenith-offwhite block">Marcus Vance</span>
              <span className="text-zenith-stone/60">Everest South Col Expedition</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-zenith-stone/90 italic leading-relaxed">
              "Tsering and the ZENITH Sherpa team ran the most professional Kilimanjaro expedition I've experienced. Pacing at Lava Tower was key to our 100% summit rate."
            </p>
            <div className="pt-2 border-t border-zenith-stone/10 text-xs">
              <span className="font-bold text-zenith-offwhite block">Elena Rostova</span>
              <span className="text-zenith-stone/60">Kilimanjaro Machame Route</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-zenith-stone/90 italic leading-relaxed">
              "The K2 4-Season geodesic tent held firm through a 90 mph blizzard on the Mont Blanc ridge when other groups had their poles snapped. Pure reliability."
            </p>
            <div className="pt-2 border-t border-zenith-stone/10 text-xs">
              <span className="font-bold text-zenith-offwhite block">David Henderson</span>
              <span className="text-zenith-stone/60">Chamonix Alpine Club</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
    </div>
  );
}
