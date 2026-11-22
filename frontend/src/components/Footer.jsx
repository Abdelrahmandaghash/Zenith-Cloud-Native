import React from 'react';
import { Mountain, Mail, ArrowRight, ShieldCheck, Award, Globe, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-zenith-dark border-t border-zenith-stone/10 pt-16 pb-12 text-zenith-stone/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zenith-forest flex items-center justify-center text-zenith-accent border border-zenith-stone/20">
                <Mountain className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-cinzel text-2xl font-bold tracking-wider text-zenith-offwhite">
                ZENITH
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zenith-stone/70 max-w-sm">
              Engineered for the Death Zone. ZENITH designs relentless mountain equipment and organizes world-class high-altitude expeditions to the world’s most formidable summits.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs text-zenith-stone/60">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-zenith-accent" /> UIAA & CE Certified</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-zenith-accent" /> IFMGA Guided</span>
            </div>
          </div>

          {/* Equipment Store Links */}
          <div>
            <h4 className="font-cinzel text-sm font-bold tracking-wider text-zenith-offwhite mb-4 uppercase">
              Equipment Store
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop?category=boots" className="hover:text-zenith-accent transition-colors">Mountaineering Boots</Link></li>
              <li><Link to="/shop?category=ropes" className="hover:text-zenith-accent transition-colors">Ropes & Harnesses</Link></li>
              <li><Link to="/shop?category=ice" className="hover:text-zenith-accent transition-colors">Ice Axes & Crampons</Link></li>
              <li><Link to="/shop?category=tents" className="hover:text-zenith-accent transition-colors">4-Season Tents & Bags</Link></li>
              <li><Link to="/shop?category=apparel" className="hover:text-zenith-accent transition-colors">Technical Alpine Shells</Link></li>
            </ul>
          </div>

          {/* Expeditions Links */}
          <div>
            <h4 className="font-cinzel text-sm font-bold tracking-wider text-zenith-offwhite mb-4 uppercase">
              Expeditions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/expeditions" className="hover:text-zenith-accent transition-colors">Everest Base Camp</Link></li>
              <li><Link to="/expeditions" className="hover:text-zenith-accent transition-colors">Mount Kilimanjaro</Link></li>
              <li><Link to="/expeditions" className="hover:text-zenith-accent transition-colors">Mont Blanc Summit</Link></li>
              <li><Link to="/expeditions" className="hover:text-zenith-accent transition-colors">Mount Elbrus</Link></li>
              <li><Link to="/expeditions" className="hover:text-zenith-accent transition-colors">Mount Toubkal</Link></li>
              <li><Link to="/expeditions" className="hover:text-zenith-accent transition-colors">Mount Sinai Sunrise</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-cinzel text-sm font-bold tracking-wider text-zenith-offwhite mb-4 uppercase">
              The Alpine Dispatch
            </h4>
            <p className="text-xs text-zenith-stone/70 mb-3">
              Receive route conditions, new expedition dates, and technical gear reviews.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to the Alpine Dispatch!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="alpinist@summit.com"
                  className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded-md px-3.5 py-2 text-xs text-zenith-offwhite placeholder:text-zenith-stone/40 focus:outline-none focus:border-zenith-accent"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-zenith-accent hover:bg-zenith-accentHover text-white rounded text-xs flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zenith-stone/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zenith-stone/50 gap-4">
          <p>© {new Date().getFullYear()} ZENITH Outdoors Inc. Beyond the Summit. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-zenith-stone transition-colors cursor-pointer">Expedition Safety Protocols</span>
            <span className="hover:text-zenith-stone transition-colors cursor-pointer">Privacy & Terms</span>
            <span className="hover:text-zenith-stone transition-colors cursor-pointer">DevOps Cloud Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
