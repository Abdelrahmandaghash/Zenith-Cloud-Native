import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, subtotal, cartCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  if (!isCartOpen) return null;

  const shippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 15.0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      customer_name: customerName,
      customer_email: customerEmail,
      shipping_address: shippingAddress,
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total
    };

    try {
      const result = await submitOrder(orderPayload);
      setOrderComplete(result);
      clearCart();
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsCheckingOut(false);
    setOrderComplete(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zenith-dark border-l border-zenith-stone/15 text-zenith-offwhite shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-zenith-stone/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-zenith-accent" />
              <h2 className="font-cinzel text-lg font-bold tracking-wide">
                Expedition Gear Bag
              </h2>
              <span className="text-xs bg-zenith-forest px-2 py-0.5 rounded text-zenith-accent border border-zenith-stone/20 font-mono">
                {cartCount} items
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-zenith-forest/60 text-zenith-stone hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {orderComplete ? (
              /* Order Success View */
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zenith-forest/80 border border-zenith-accent text-zenith-accent mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-zenith-offwhite">
                  Order Confirmed
                </h3>
                <p className="text-xs text-zenith-stone/80 max-w-xs mx-auto">
                  Thank you, <span className="text-zenith-offwhite font-semibold">{orderComplete.customer_name}</span>. Your high-altitude gear has been dispatched to our alpine fulfillment center.
                </p>
                <div className="bg-zenith-forest/40 border border-zenith-stone/15 rounded-lg p-4 text-xs font-mono space-y-1 text-left my-4">
                  <div className="flex justify-between">
                    <span className="text-zenith-stone/60">Order ID:</span>
                    <span className="text-zenith-accent font-bold">{orderComplete.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zenith-stone/60">Total:</span>
                    <span>${orderComplete.total?.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zenith-stone/60">Status:</span>
                    <span className="text-green-400 font-semibold uppercase">{orderComplete.status}</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-lg"
                >
                  Continue Exploring
                </button>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form View */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zenith-stone/10">
                  <h3 className="font-cinzel text-base font-bold text-zenith-accent">
                    Dispatch Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-zenith-stone hover:text-white"
                  >
                    ← Back to items
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zenith-stone/70">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded-md px-3.5 py-2 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zenith-stone/70">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="alex@mountaineering.com"
                    className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded-md px-3.5 py-2 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zenith-stone/70">Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="452 Alpine Ridge Way, Boulder, CO 80302"
                    className="w-full bg-zenith-forest/40 border border-zenith-stone/20 rounded-md px-3.5 py-2 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent resize-none"
                  />
                </div>

                <div className="bg-zenith-forest/30 border border-zenith-stone/10 p-3 rounded text-xs text-zenith-stone/80 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zenith-stone/10 font-bold text-zenith-offwhite text-sm">
                    <span>Total Due:</span>
                    <span className="text-zenith-accent">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Processing Order...' : 'Confirm & Place Order'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : cartItems.length === 0 ? (
              /* Empty Cart */
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-zenith-stone/30 mx-auto" />
                <h3 className="font-cinzel text-lg font-semibold text-zenith-stone">Your Bag is Empty</h3>
                <p className="text-xs text-zenith-stone/60 max-w-xs mx-auto">
                  Browse our high-altitude boots, technical ice tools, and 4-season expedition tents.
                </p>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-4">
                {/* Free shipping bar */}
                <div className="bg-zenith-forest/40 border border-zenith-stone/15 p-3 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>{subtotal >= 150 ? '🎉 Free Expedition Shipping Unlocked!' : `Add $${(150 - subtotal).toFixed(2)} more for Free Shipping`}</span>
                    <span className="text-zenith-accent font-semibold">{Math.min(100, Math.round((subtotal / 150) * 100))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zenith-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zenith-accent transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                    />
                  </div>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-zenith-forest/30 border border-zenith-stone/10 rounded-lg group hover:border-zenith-stone/20 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded bg-zenith-dark shrink-0 border border-zenith-stone/10"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-zenith-offwhite leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zenith-stone/50 hover:text-red-400 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-zenith-stone/20 rounded bg-zenith-dark/60">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-zenith-accent transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-zenith-accent transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-zenith-accent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Summary Action (Only when items exist and not checked out) */}
          {cartItems.length > 0 && !isCheckingOut && !orderComplete && (
            <div className="p-6 border-t border-zenith-stone/10 bg-zenith-dark/95 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zenith-stone/70">
                  <span>Subtotal</span>
                  <span className="font-mono text-zenith-offwhite">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zenith-stone/70">
                  <span>Standard Shipping</span>
                  <span className="font-mono text-zenith-offwhite">
                    {shippingCost === 0 ? <span className="text-green-400">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-zenith-stone/70">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-zenith-offwhite">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zenith-stone/10 text-sm font-bold text-zenith-offwhite">
                  <span>Total</span>
                  <span className="font-mono text-zenith-accent text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 bg-zenith-accent hover:bg-zenith-accentHover text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-xl"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zenith-stone/50">
                <ShieldCheck className="w-3.5 h-3.5 text-zenith-accent" />
                <span>Microservice Order Dispatch via Port 8003</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
