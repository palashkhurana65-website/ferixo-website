"use client";

import { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { FadeIn } from "@/components/ui/Motion";
import { useRouter } from "next/navigation"; // Added for redirection
import { 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Star, 
  ShoppingCart, 
  Minus, 
  Plus,
  Zap // Added for Buy Now
} from "lucide-react";

export default function ProductView({ product }: { product: any }) {
  const { addToCart } = useStore();
  const router = useRouter(); // Initialize router
  
  // 1. STATE
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]?.url || "/placeholder.jpg");

  // Helper object for adding item
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.basePrice,
    image: activeImage,
    quantity: quantity,
    variant: selectedVariant?.name || "Standard"
  };

  // Handle "Add to Cart"
  const handleAddToCart = () => {
    addToCart(cartItem);
    alert("Added to Cart!");
  };

  // Handle "Buy Now"
  const handleBuyNow = () => {
    addToCart(cartItem); // Add item
    router.push("/checkout"); // Redirect immediately
  };

  return (
    <main className="min-h-screen bg-[#0A1A2F] text-white pt-32 pb-20">
      
      {/* --- TOP SECTION: GALLERY + INFO --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        
        {/* LEFT: MAIN GALLERY */}
        <FadeIn className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#133159]">
            <Image 
              src={activeImage} 
              alt={product.name}
              fill 
              className="object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img: any, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveImage(img.url)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === img.url ? "border-blue-400 opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </FadeIn>

        {/* RIGHT: DETAILS & ACTIONS */}
        <FadeIn delay={0.2} className="flex flex-col h-full">
          
          {/* SERIES LABEL */}
          <span className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase mb-2">
            {product.series} Collection
          </span>

       {/* TITLE & PRICE */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-mono">₹{product.basePrice}</span>
            
            <div className="flex items-center text-yellow-400 text-sm">
              <Star size={16} fill="currentColor" />
              
              {/* DYNAMIC RATING CALCULATION */}
              <span className="ml-1 font-bold">
                {product.reviews && product.reviews.length > 0
                  ? (
                      product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / 
                      product.reviews.length
                    ).toFixed(1)
                  : "0.0"
                }
              </span>
              
              <span className="text-white/40 ml-1">
                ({product.reviews?.length || 0} Reviews)
              </span>
            </div>
          </div>

          {/* FEATURES LIST */}
          <div className="mb-8 p-6 bg-[#133159]/50 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Key Features</h3>
            <ul className="space-y-3">
              {product.features.map((feature: any, i: number) => (
                <li key={i} className="flex items-center gap-3 text-[#C9D1D9]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>

          {/* VARIANTS SELECTOR */}
          {product.variants.length > 0 && (
            <div className="mb-8">
              <label className="block text-xs uppercase font-bold text-white/50 mb-3">Select Variant</label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-3 rounded-lg border text-sm transition-all ${
                      selectedVariant?.name === v.name
                        ? "bg-white text-[#0A1A2F] border-white font-bold"
                        : "bg-transparent text-white border-white/20 hover:border-white/50"
                    }`}
                  >
                    {v.name} <span className="opacity-50 ml-1">({v.capacity})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        
          {/* QUANTITY & BUTTONS */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center bg-[#133159] rounded-lg border border-white/10 px-2 h-14">
                <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-blue-400 transition-colors"
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center font-mono font-bold">{quantity}</span>
                <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:text-blue-400 transition-colors"
                >
                    <Plus size={16} />
                </button>
                </div>
                
                {/* Add to Cart */}
                <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#133159] border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 font-bold rounded-lg h-14 flex items-center justify-center gap-2 transition-all"
                >
                <ShoppingCart size={20} /> Add to Cart
                </button>
            </div>

            {/* Buy Now (Full Width) */}
            <button 
                onClick={handleBuyNow}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg h-14 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
                <Zap size={20} fill="currentColor" /> Buy Now
            </button>
          </div>

          {/* TRUST BADGE */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="text-center">
               <div className="w-10 h-10 mx-auto bg-[#133159] rounded-full flex items-center justify-center mb-2 text-blue-400">
                 <ShieldCheck size={20} />
               </div>
               <p className="text-[10px] text-white/60">7-Day Replacement</p>
            </div>
            <div className="text-center">
               <div className="w-10 h-10 mx-auto bg-[#133159] rounded-full flex items-center justify-center mb-2 text-green-400">
                 <Leaf size={20} />
               </div>
               <p className="text-[10px] text-white/60">BPA Free Material</p>
            </div>
            <div className="text-center">
               <div className="w-10 h-10 mx-auto bg-[#133159] rounded-full flex items-center justify-center mb-2 text-yellow-400">
                 <Truck size={20} />
               </div>
               <p className="text-[10px] text-white/60">Cash on Delivery</p>
            </div>
          </div>

        </FadeIn>
      </div>

      {/* --- DESCRIPTION SECTION (NEW) --- */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
          <FadeIn className="bg-[#133159]/20 border border-white/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Product Description</h2>
            <div className="prose prose-invert max-w-none text-[#C9D1D9] leading-relaxed">
                {product.description || "Experience premium quality designed for your daily life. This product combines durability with modern aesthetics."}
            </div>
          </FadeIn>
      </div>

      {/* --- SECTION 2: CINEMATIC SHOWCASE --- */}
      <section className="bg-black/20 py-24 mb-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <FadeIn className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Visual Experience</h2>
              <p className="text-white/50">See the {product.name} in detail.</p>
           </FadeIn>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
              {/* Large Feature Image */}
              <div className="relative rounded-2xl overflow-hidden md:col-span-1 h-full border border-white/5">
                 <Image src={product.images[0]?.url} alt="Feature" fill className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              {/* Grid of smaller detail shots */}
              <div className="grid grid-rows-2 gap-4 h-full">
                 <div className="relative rounded-2xl overflow-hidden border border-white/5">
                    <Image src={product.images[1]?.url || product.images[0]?.url} alt="Detail" fill className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
                 </div>
                 <div className="relative rounded-2xl overflow-hidden border border-white/5">
                    <Image src={product.images[2]?.url || product.images[0]?.url} alt="Detail" fill className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- SECTION 3: REVIEWS & RELATED --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* REVIEWS COLUMN (CONNECTED TO DB) */}
        <div className="lg:col-span-2">
           <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
             Customer Reviews <span className="text-sm font-normal text-white/40">({product.reviews?.length || 0} Verified)</span>
           </h3>
           
           <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <div key={review.id} className="p-6 bg-[#133159]/30 rounded-xl border border-white/5">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-xs text-white/30">{new Date(review.createdAt).toLocaleDateString()}</span>
                     </div>
                     <h4 className="font-bold text-sm mb-1 text-white">{review.userName || "Verified Customer"}</h4>
                     <p className="text-white/60 text-sm">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-white/40">
                    No reviews yet. Be the first to share your thoughts!
                </div>
              )}
           </div>
        </div>

        {/* RELATED PRODUCTS (Placeholder) */}
        <div>
           <h3 className="text-xl font-bold mb-8">You Might Also Like</h3>
           <div className="space-y-4">
              <div className="h-24 bg-[#133159] rounded-lg border border-white/5 flex items-center p-4 gap-4">
                 <div className="w-16 h-16 bg-black/40 rounded flex-shrink-0" />
                 <div>
                    <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-12 bg-white/10 rounded" />
                 </div>
              </div>
              <div className="h-24 bg-[#133159] rounded-lg border border-white/5 flex items-center p-4 gap-4">
                 <div className="w-16 h-16 bg-black/40 rounded flex-shrink-0" />
                 <div>
                    <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-12 bg-white/10 rounded" />
                 </div>
              </div>
           </div>
        </div>

      </div>

    </main>
  );
}