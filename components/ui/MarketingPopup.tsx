"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, ArrowRight, Zap } from "lucide-react";

export default function MarketingPopup() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. SAFETY CHECK: Never show on Admin pages
    if (pathname?.startsWith("/admin")) return;

    // 2. COOKIE CHECK: Don't show if user already closed it
    const hasSeenPopup = localStorage.getItem("ferixo_welcome_popup");
    if (hasSeenPopup) return;

    // 3. TRIGGER: Show after 4 seconds of browsing
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    // Remember that user closed it (expires in a real app, strict here)
    localStorage.setItem("ferixo_welcome_popup", "true");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Welcome to the club! (Logic to be implemented)");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* BACKDROP (Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* POPUP CARD */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0A1A2F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            {/* Close Button */}
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10"
            >
                <X size={20} />
            </button>

            <div className="p-8 md:p-10 relative z-0">
                {/* Header */}
                <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <Zap className="text-white fill-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Unlock 10% Off</h2>
                    <p className="text-[#C9D1D9]/80">
                        Join the Ferixo Elite Club. Get exclusive access to new drops, premium discounts, and design insights.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required
                            className="w-full bg-[#133159] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-white text-[#0A1A2F] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#C9D1D9] transition-colors shadow-lg shadow-white/5 group"
                    >
                        Claim My Discount 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
                
                <p className="text-center text-[10px] text-white/30 mt-6">
                    No spam. Unsubscribe anytime.
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}