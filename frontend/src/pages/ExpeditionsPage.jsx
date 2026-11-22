import React, { useState, useEffect } from 'react';
import { Mountain, Clock, Users, ArrowRight, ShieldCheck, Compass, MapPin } from 'lucide-react';
import { TOURS } from '../data/sampleData';
import { fetchTours } from '../services/api';
import TourModal from '../components/TourModal';

export default function ExpeditionsPage() {
  const [tours, setTours] = useState(TOURS);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    fetchTours().then(data => {
      if (data && data.length > 0) setTours(data);
    });
  }, []);

  const difficulties = ['all', 'Moderate', 'Challenging', 'Extreme Alpine'];

  const filteredTours = tours.filter(tour => {
    if (selectedDifficulty === 'all') return true;
    return tour.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-zenith-dark pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-zenith-accent uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" /> High-Altitude Guided Summits
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-zenith-offwhite">
            Mountain Expeditions & Guided Tours
          </h1>
          <p className="text-sm text-zenith-stone/70 max-w-2xl leading-relaxed">
            Stand above the clouds. Fully supported high-altitude ascents led by certified UIAGM/IFMGA mountain guides across the Himalayas, Rift Valley, European Alps, Caucasus, and Atlas Mountains.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 border-b border-zenith-stone/10">
          <span className="text-xs text-zenith-stone/60 mr-2 shrink-0">Difficulty:</span>
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDifficulty === diff
                  ? 'bg-zenith-accent text-white shadow-md'
                  : 'bg-zenith-forest/40 text-zenith-stone hover:text-white border border-zenith-stone/15'
              }`}
            >
              {diff === 'all' ? 'All Expeditions' : diff}
            </button>
          ))}
        </div>

        {/* Expeditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="group bg-zenith-forest/20 border border-zenith-stone/15 rounded-xl overflow-hidden hover:border-zenith-accent/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
            >
              {/* Landscape Image with Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zenith-dark">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zenith-dark via-transparent to-black/30" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-zenith-accent text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow">
                    {tour.difficulty}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-zenith-dark/85 backdrop-blur-md border border-zenith-stone/20 text-zenith-accent text-xs font-mono font-bold px-2.5 py-1 rounded flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5" /> {tour.elevation}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/90 drop-shadow">
                  <MapPin className="w-3.5 h-3.5 text-zenith-accent" />
                  <span>{tour.destination}</span>
                </div>
              </div>

              {/* Tour Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-zenith-stone/60 font-semibold">
                    {tour.mountainRange} • {tour.country}
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-zenith-offwhite group-hover:text-zenith-accent transition-colors leading-snug">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-zenith-stone/80 line-clamp-3 leading-relaxed">
                    {tour.highlight || tour.description}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="pt-3 border-t border-zenith-stone/10 flex items-center justify-between text-xs text-zenith-stone/70">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zenith-accent" /> {tour.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-zenith-accent" /> Max {tour.maxGroupSize}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zenith-accent" /> Guided
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-zenith-stone/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-zenith-stone/50 block">Per Climber</span>
                    <span className="font-mono text-xl font-bold text-zenith-accent">
                      ${tour.price.toLocaleString()} <span className="text-xs text-zenith-stone/60">USD</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedTour(tour)}
                    className="px-4 py-2.5 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-lg group-hover:shadow-zenith-accent/20"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tour Detail & Reservation Modal */}
      <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
    </div>
  );
}
