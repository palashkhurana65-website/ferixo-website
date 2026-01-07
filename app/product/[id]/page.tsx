"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag, Minus, Plus, Heart, Share2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

// --- DUMMY DATA (Replace with DB fetch later) ---
const PRODUCT = {
  id: "1",
  name: "Obsidian Pro Tumbler",
  price: 45.00,
  rating: 4.8,
  reviews: 128,
  description: "Engineered for the absolute minimalist. The Obsidian Pro Tumbler features double-wall vacuum insulation to keep your beverages ice-cold for 24 hours or piping hot for 12. Finished in our signature Ferixo matte navy coating.",
  images: [
    "/product-1.jpg", // Replace with your actual image paths in /public
    "/product-2.jpg",
    "/product-3.jpg",
    "/product-4.jpg",
  ],
  features: ["24h Cold / 12h Hot", "Medical Grade Stainless Steel", "BPA-Free Lid", "Dishwasher Safe"],
};

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-[#C9D1D9] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Accessories", href: "/shop/accessories" },
            { label: PRODUCT.name, href: "#" },
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-[#133159]/20 rounded-lg overflow-hidden border border-[#C9D1D9]/10">
              {/* Note: Using a placeholder div. Replace src with PRODUCT.images[selectedImage] when real images exist */}
              <div className="absolute inset-0 flex items-center justify-center text-[#C9D1D9]/20 text-4xl font-bold">
                [Image {selectedImage + 1}]
                {/* <Image src={PRODUCT.images[selectedImage]} fill alt="Product" className="object-cover" /> */}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? "border-[#C9D1D9] opacity-100" 
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="w-full h-full bg-[#133159]/20" />
                  {/* <Image src={img} fill alt="Thumb" className="object-cover" /> */}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {PRODUCT.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-[#C9D1D9]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(PRODUCT.rating) ? "fill-current" : "opacity-30"}`} 
                  />
                ))}
              </div>
              <span className="text-sm opacity-60 underline cursor-pointer">
                {PRODUCT.reviews} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-light text-white mb-8">
              ${PRODUCT.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-[#C9D1D9]/80 leading-relaxed mb-8">
              {PRODUCT.description}
            </p>

            {/* Controls */}
            <div className="border-t border-b border-[#C9D1D9]/10 py-8 mb-8 space-y-6">
              <div className="flex items-center gap-8">
                <span className="uppercase text-sm font-bold tracking-widest">Quantity</span>
                <div className="flex items-center border border-[#C9D1D9]/30 rounded-full px-4 py-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-white">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="hover:text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-[#C9D1D9] text-[#0A1A2F] py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-4 border border-[#C9D1D9]/30 rounded-lg hover:border-[#C9D1D9] hover:text-white transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-4 border border-[#C9D1D9]/30 rounded-lg hover:border-[#C9D1D9] hover:text-white transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features List */}
            <div className="mt-12 space-y-3">
              {PRODUCT.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm opacity-80">
                  <div className="w-1.5 h-1.5 bg-[#C9D1D9] rounded-full" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: REVIEWS & DETAILS */}
        <div className="mt-32">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-[#C9D1D9]/10 mb-8">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab 
                    ? "text-white border-b-2 border-white" 
                    : "text-[#C9D1D9]/40 hover:text-[#C9D1D9]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[200px]">
            {activeTab === "reviews" ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((r) => (
                  <div key={r} className="bg-[#133159]/10 p-6 rounded-lg border border-[#C9D1D9]/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#C9D1D9]/20" />
                        <span className="font-bold text-white">Verified User</span>
                      </div>
                      <div className="flex text-[#C9D1D9]">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                    <p className="opacity-80">"Absolutely love the finish on this. Keeps my coffee hot for my entire commute and looks great on my desk."</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-[#C9D1D9]/80">
                <p>Full technical specifications and brand story goes here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}