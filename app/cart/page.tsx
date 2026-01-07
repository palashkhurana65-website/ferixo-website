"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useState } from "react";

// --- DUMMY DATA (Updated for INR) ---
const INITIAL_CART = [
  {
    id: 1,
    name: "Obsidian Pro Tumbler",
    variant: "Matte Black",
    price: 1299.00, // Realistic INR price
    quantity: 1,
    image: "/product-1.jpg", 
  },
  {
    id: 2,
    name: "Nomad Shoe Rack",
    variant: "3-Tier / Industrial Grey",
    price: 4999.00, // Realistic INR price
    quantity: 2,
    image: "/product-2.jpg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  // Simple calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 99.00; // Realistic shipping cost
  const total = subtotal + shipping;

  // Helper to format Rupees (e.g. 1,200.00)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, // Removes decimals like .00 for cleaner look
    }).format(amount);
  };

  // Handler to remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Handler to update quantity
  const updateQuantity = (id: number, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // --- EMPTY STATE ---
  if (cartItems.length === 0) {
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
    <main className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        <Breadcrumbs items={[{ label: "Shopping Cart", href: "/cart" }]} />

        <h1 className="text-4xl font-bold text-white mb-12">Your Cart ({cartItems.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* --- LEFT: CART ITEMS LIST --- */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-6 py-8 border-b border-[#C9D1D9]/10"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#133159] rounded-lg overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-[#C9D1D9]/20 font-bold">
                    IMG
                  </div>
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
                    <p className="text-[#C9D1D9] text-sm mt-1">{item.variant}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-between items-end mt-4">
                    
                    {/* Quantity */}
                    <div className="flex items-center border border-[#C9D1D9]/30 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:text-white text-[#C9D1D9] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-[#C9D1D9] text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:text-white text-[#C9D1D9] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-[#C9D1D9]/60 hover:text-red-400 text-sm flex items-center gap-1 transition-colors underline decoration-transparent hover:decoration-red-400 underline-offset-4"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- RIGHT: ORDER SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-[#133159]/10 border border-[#C9D1D9]/10 rounded-2xl p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[#C9D1D9]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#C9D1D9]">
                  <span>Shipping Estimate</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                
                {/* Coupon Code Input Placeholder */}
                <div className="pt-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      className="w-full bg-transparent border border-[#C9D1D9]/30 rounded-lg px-4 py-2 text-sm text-white placeholder-[#C9D1D9]/40 focus:outline-none focus:border-[#C9D1D9]"
                    />
                    <button className="text-[#C9D1D9] hover:text-white text-sm font-bold uppercase">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#C9D1D9]/10 pt-4 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
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
    </main>
  );
}