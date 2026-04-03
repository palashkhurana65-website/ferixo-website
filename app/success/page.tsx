"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products for the "Explore More" Carousel
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Keep only the first 6-8 products for the carousel
          setProducts(data.slice(0, 8));
        }
      } catch (e) {
        console.error("Failed to load carousel products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* --- SUCCESS SECTION --- */}
      <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.15)]">
          <CheckCircle2 size={48} className="text-green-400" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
          Order Placed Successfully!
        </h1>
        
        <p className="text-[#C9D1D9] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Thank you for choosing Ferixo. Your order{" "}
          {orderId ? (
            <span className="text-white font-mono font-bold bg-white/10 px-2 py-1 rounded">
              #{orderId.slice(0, 8).toUpperCase()}
            </span>
          ) : (
            "is being processed"
          )}{" "}
          has been confirmed. We'll send a confirmation email with your tracking details shortly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/shop" 
            className="w-full sm:w-auto bg-[#133159] hover:bg-[#1e3a66] border border-white/10 px-8 py-4 rounded-lg font-bold transition-all text-white"
          >
            Continue Shopping
          </Link>
          
        </div>
      </div>

      {/* --- SHOP MORE / CAROUSEL SECTION --- */}
      <div className="border-t border-white/10 pt-16 animate-in fade-in duration-1000 delay-300 fill-mode-both">
        <div className="flex justify-between items-end mb-8 px-2">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white mb-1">Explore More</h2>
            <p className="text-[#C9D1D9]/60 text-sm">Complete your premium collection</p>
          </div>
          <Link 
            href="/shop" 
            className="text-blue-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto pb-8 px-2 custom-scrollbar snap-x snap-mandatory">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] bg-[#133159]/50 rounded-2xl h-[400px] animate-pulse border border-white/5 snap-center" />
            ))
          ) : products.length > 0 ? (
            // Render Products
            products.map((product) => (
              <Link 
                href={`/product/${product.id}`} 
                key={product.id} 
                className="min-w-[280px] sm:min-w-[320px] snap-center group"
              >
                <div className="bg-[#133159]/40 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square bg-black/40 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image 
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-2">
                        <ShoppingBag size={32} />
                        <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                      </div>
                    )}
                    
                    {/* Tag Overlay */}
                    {product.series && (
                      <div className="absolute top-4 left-4 bg-[#0A1A2F]/80 backdrop-blur-md px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border border-white/10 text-white">
                        {product.series}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-transparent to-black/20">
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[#C9D1D9]/70 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {product.description || "Premium quality product by Ferixo."}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-[#C9D1D9]/50 text-xs uppercase tracking-wider font-bold">
                        {product.variants?.length || 1} Variant{product.variants?.length > 1 ? 's' : ''}
                      </span>
                      <span className="font-mono font-bold text-lg text-white">
                        ₹{(product.basePrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[#C9D1D9]/50 w-full text-center py-10">No additional products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Page Component wrapped in Suspense for Next.js build requirements
export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0A1A2F] pt-32 pb-20 px-6">
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-[#C9D1D9]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}