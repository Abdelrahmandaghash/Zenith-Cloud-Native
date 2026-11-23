import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
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

        {/* Product Image */}
        <div className="md:w-1/2 relative bg-zenith-forest/20 min-h-[280px] md:min-h-full flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-zenith-stone/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover max-h-[380px] rounded-lg shadow-xl"
          />
          {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-zenith-accent text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow">
              Summit Pick
            </span>
          )}
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zenith-accent font-bold">
                {product.category?.toUpperCase() || 'ALPINE GEAR'}
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-zenith-offwhite mt-1 leading-snug">
                {product.name}
              </h3>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-zenith-accent">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="font-mono text-sm text-zenith-stone/50 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-zenith-offwhite">{product.rating}</span>
                <span className="text-zenith-stone/60">({product.reviews})</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zenith-stone/80 leading-relaxed">
              {product.description}
            </p>

            {/* Specs Table */}
            {product.specs && (
              <div className="bg-zenith-forest/30 border border-zenith-stone/10 rounded-lg p-3 text-xs space-y-1.5 font-mono">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-zenith-stone/5 pb-1 last:border-0 last:pb-0">
                    <span className="text-zenith-stone/60">{key}:</span>
                    <span className="text-zenith-offwhite font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-zenith-stone/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-zenith-stone/20 rounded-md bg-zenith-forest/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm text-zenith-stone hover:text-white"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-bold text-zenith-offwhite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-sm text-zenith-stone hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className="flex-1 py-3 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 shadow-lg disabled:bg-green-600"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Gear Bag
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zenith-stone/60">
              <ShieldCheck className="w-3.5 h-3.5 text-zenith-accent" />
              <span>Full ZENITH Lifetime Alpine Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
