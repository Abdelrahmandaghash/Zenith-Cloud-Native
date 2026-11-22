import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Compass, Mountain, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Equipment Store', path: '/shop' },
    { name: 'Expeditions', path: '/expeditions' },
    { name: 'Why ZENITH', path: '/#why-zenith' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-zenith-dark/90 via-zenith-dark/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-zenith-forest border border-zenith-stone/20 flex items-center justify-center text-zenith-accent group-hover:scale-105 transition-transform shadow-inner">
              <Mountain className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-zenith-offwhite group-hover:text-zenith-accent transition-colors">
                ZENITH
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-zenith-stone/70 font-semibold -mt-1">
                Beyond the Summit
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-zenith-accent ${
                    isActive ? 'text-zenith-accent font-semibold' : 'text-zenith-stone/90'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-zenith-forest/80 border border-zenith-stone/20 text-zenith-offwhite hover:text-zenith-accent hover:border-zenith-accent/40 transition-all shadow-md group"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-zenith-accent text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zenith-stone hover:text-white transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-zenith-stone/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-zenith-offwhite hover:text-zenith-accent py-1"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-zenith-stone/10 flex items-center justify-between text-xs text-zenith-stone/70">
            <span>High-Altitude Certified Gear</span>
            <span className="flex items-center gap-1 text-zenith-accent">
              <ShieldCheck className="w-4 h-4" /> UIAA Standards
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
