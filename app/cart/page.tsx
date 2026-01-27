"use client";

import Link from "next/link";
import { Minus, Plus, X, ArrowRight, ShoppingBag, Tag, Trash2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useStore } from "@/context/StoreContext";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    applyCoupon, 
    removeCoupon, 
    coupon, 
    cartTotal 
  } = useStore();

  // Local state for the input box
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponMsg(null);
    
    const result = await applyCoupon(couponInput);
    
    setCouponMsg({
        type: result.success ? 'success' : 'error',
        text: result.message
    });

    if (result.success) {
      setCouponInput("");
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // --- EMPTY STATE ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#133159] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-[#C9D1D9]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-[#C9D1D9] mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link 
          href="/shop"
          className="bg-[#C9D1D9] text-[#0A1A2F] px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        <Breadcrumbs items={[{ label: "Shopping Cart", href: "/cart" }]} />

        <h1 className="text-4xl font-bold text-white mb-12">Your Cart ({cart.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => {
              const uniqueId = `${item.id}-${item.variant}-${item.size||''}`;
              
              return (
                <div key={uniqueId} className="flex gap-6 py-8 border-b border-[#C9D1D9]/10">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#133159] rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                    {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">No Img</div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <p className="text-lg text-white font-light">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-[#C9D1D9] space-y-1">
                          {item.size && <p className="flex items-center gap-2"><span className="opacity-50">Size:</span> {item.size}</p>}
                          <p className="flex items-center gap-2"><span className="opacity-50">Color:</span> {item.variant}</p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-end mt-4">
                      
                      <div className="flex items-center border border-[#C9D1D9]/30 rounded-lg">
                        <button 
                          onClick={() => updateCartQuantity(uniqueId, -1)}
                          className="p-2 hover:text-white text-[#C9D1D9] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-[#C9D1D9] text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(uniqueId, 1)}
                          className="p-2 hover:text-white text-[#C9D1D9] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(uniqueId)}
                        className="text-[#C9D1D9]/60 hover:text-red-400 text-sm flex items-center gap-1 transition-colors underline decoration-transparent hover:decoration-red-400 underline-offset-4"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-[#133159]/10 border border-[#C9D1D9]/10 rounded-2xl p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-[#C9D1D9] text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal.subtotal)}</span>
                </div>
                
                {/* DISCOUNT ROW (Only shows if coupon active) */}
                {coupon && (
                    <div className="flex justify-between text-green-400">
                        <span className="flex items-center gap-2"><Tag size={14} /> Discount ({coupon.code})</span>
                        <span>- {formatPrice(cartTotal.discount)}</span>
                    </div>
                )}

                {/* COUPON INPUT SECTION */}
                {!coupon ? (
                    <div className="pt-4 border-t border-[#C9D1D9]/10">
                        <div className="flex gap-2">
                            <input 
                            type="text" 
                            placeholder="Coupon Code" 
                            className="w-full bg-transparent border border-[#C9D1D9]/30 rounded-lg px-4 py-2 text-sm text-white placeholder-[#C9D1D9]/40 focus:outline-none focus:border-white transition-colors uppercase"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                className="bg-white/10 hover:bg-white text-white hover:text-[#0A1A2F] px-4 rounded-lg text-sm font-bold uppercase transition-colors"
                            >
                            Apply
                            </button>
                        </div>
                        {couponMsg && (
                            <p className={`text-xs mt-2 ${couponMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {couponMsg.text}
                            </p>
                        )}
                    </div>
                ) : (
                    // ACTIVE COUPON DISPLAY
                    <div className="pt-4 border-t border-[#C9D1D9]/10 flex justify-between items-center">
                        <span className="text-green-400 text-sm font-mono border border-green-500/30 bg-green-500/10 px-2 py-1 rounded">
                            {coupon.code} APPLIED
                        </span>
                        <button onClick={() => { removeCoupon(); setCouponMsg(null); setCouponInput(""); }} className="text-white/40 hover:text-red-400 text-xs underline flex items-center gap-1">
                            <Trash2 size={12}/> Remove
                        </button>
                    </div>
                )}

                <div className="border-t border-[#C9D1D9]/10 pt-4 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal.finalTotal)}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-[#C9D1D9] text-[#0A1A2F] py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 group"
              >
                Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="text-center text-[#C9D1D9]/40 text-xs mt-4">
                Prices include taxes. Secure Razorpay Checkout.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}