import React, { useState } from 'react';
import { X, Calendar, Mountain, Clock, Users, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TourModal({ tour, onClose }) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [climberName, setClimberName] = useState('');
  const [climberEmail, setClimberEmail] = useState('');
  const [climbersCount, setClimbersCount] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState('Spring 2026');

  if (!tour) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-zenith-dark border border-zenith-stone/20 rounded-xl overflow-hidden shadow-2xl z-10 my-8 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zenith-dark/70 text-zenith-stone hover:text-white transition-colors border border-zenith-stone/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tour Landscape Image */}
        <div className="md:w-5/12 relative bg-zenith-forest/20 min-h-[260px] md:min-h-full">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zenith-dark via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-4 right-4 text-xs space-y-1.5">
            <span className="inline-block bg-zenith-accent text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
              {tour.difficulty}
            </span>
            <div className="text-sm font-cinzel font-bold text-white">
              {tour.destination}
            </div>
            <div className="text-zenith-stone/80 text-[11px]">
              {tour.mountainRange}
            </div>
          </div>
        </div>

        {/* Details & Booking */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between space-y-6">
          {bookingConfirmed ? (
            /* Booking Confirmation View */
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zenith-forest border border-zenith-accent text-zenith-accent mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-zenith-offwhite">
                Expedition Reserved
              </h3>
              <p className="text-xs text-zenith-stone/80 max-w-sm mx-auto">
                Congratulations, <span className="text-zenith-offwhite font-semibold">{climberName}</span>! Your spot for <span className="text-zenith-accent font-semibold">{tour.title}</span> ({selectedSeason}) is confirmed.
              </p>
              <div className="bg-zenith-forest/40 border border-zenith-stone/15 rounded-lg p-4 text-xs font-mono text-left space-y-1 my-3">
                <div className="flex justify-between">
                  <span className="text-zenith-stone/60">Booking Code:</span>
                  <span className="text-zenith-accent font-bold">ZEN-EXP-{Math.floor(10000 + Math.random() * 90000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zenith-stone/60">Climbers:</span>
                  <span>{climbersCount} Person(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zenith-stone/60">Total Rate:</span>
                  <span>${(tour.price * climbersCount).toLocaleString()} USD</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            /* Booking Form & Info View */
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-zenith-offwhite leading-tight">
                    {tour.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zenith-stone/80">
                    <span className="flex items-center gap-1"><Mountain className="w-3.5 h-3.5 text-zenith-accent" /> {tour.elevation}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zenith-accent" /> {tour.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-zenith-accent" /> Max {tour.maxGroupSize}</span>
                  </div>
                </div>

                <p className="text-xs text-zenith-stone/80 leading-relaxed">
                  {tour.description}
                </p>

                {/* Guide Bio */}
                <div className="bg-zenith-forest/30 border border-zenith-stone/10 p-3 rounded-lg text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zenith-accent tracking-wider">
                    Lead Expedition Guide
                  </span>
                  <p className="text-zenith-offwhite font-medium">
                    {tour.guide}
                  </p>
                </div>

                {/* Reservation Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-zenith-stone/70">Full Name</label>
                      <input
                        type="text"
                        required
                        value={climberName}
                        onChange={(e) => setClimberName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded px-2.5 py-1.5 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-zenith-stone/70">Email Address</label>
                      <input
                        type="email"
                        required
                        value={climberEmail}
                        onChange={(e) => setClimberEmail(e.target.value)}
                        placeholder="alex@summit.com"
                        className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded px-2.5 py-1.5 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-zenith-stone/70">Target Season</label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="w-full bg-zenith-forest/60 border border-zenith-stone/20 rounded px-2.5 py-1.5 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent"
                      >
                        <option value="Spring 2026">Spring 2026 Season</option>
                        <option value="Autumn 2026">Autumn 2026 Season</option>
                        <option value="Winter 2026/27">Winter 2026/27 Season</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-zenith-stone/70">Climbers</label>
                      <input
                        type="number"
                        min="1"
                        max={tour.maxGroupSize}
                        value={climbersCount}
                        onChange={(e) => setClimbersCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded px-2.5 py-1.5 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-zenith-stone/60 uppercase">Price per Climber</span>
                      <div className="font-mono text-lg font-bold text-zenith-accent">
                        ${tour.price.toLocaleString()} <span className="text-xs text-zenith-stone/60">USD</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-lg"
                    >
                      Reserve Spot <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zenith-stone/50 border-t border-zenith-stone/10 pt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-zenith-accent" />
                <span>Secure reservation via ZENITH expedition desk</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
