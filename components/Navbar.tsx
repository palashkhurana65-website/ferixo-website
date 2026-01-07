"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, ChevronRight } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Temporary: Change this to false to test "Guest" view once we have Auth
  const isLoggedIn = true; 

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-[#0A1A2F] border-b border-[#C9D1D9]/10 h-[70px]"
            : "bg-transparent h-[90px]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          
          {/* ==================== MOBILE VIEW ==================== */}
          <div className="md:hidden flex items-center justify-between w-full">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-[#C9D1D9] p-1"
            >
              <Menu className="w-8 h-8" />
            </button>

            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
              <Image 
                src="/logo/1.svg" 
                alt="FERIXO" 
                width={100} 
                height={25} 
                className="h-6 w-auto object-contain brightness-0 invert" 
              />
            </Link>

            <button 
              onClick={() => setSearchOpen(true)}
              className="text-[#C9D1D9] p-1"
            >
              <Search className="w-7 h-7" />
            </button>
          </div>

          {/* ==================== DESKTOP VIEW ==================== */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Logo Left */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/logo/1.svg" 
                alt="FERIXO" 
                width={120} 
                height={30} 
                className="h-8 w-auto object-contain brightness-0 invert" 
                priority
              />
            </Link>

            {/* Links Center */}
            <div className="flex gap-12 text-sm font-medium tracking-widest text-[#C9D1D9]">
              {['SHOP', 'STORY', 'SUPPORT'].map((item) => (
                <Link 
                  key={item} 
                  href={`/${item.toLowerCase()}`} 
                  className="hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Icons Right */}
            <div className="flex items-center gap-8 text-[#C9D1D9]">
              <button 
                onClick={() => setSearchOpen(true)}
                className="group flex items-center gap-2 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              {/* UPDATED: User Icon Logic */}
              <Link 
                href={isLoggedIn ? "/sign-in" : "/sign-in"} 
                className="group hover:text-white transition-colors"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              
              {/* UPDATED: Cart Icon Wrapped in Link */}
              <Link href="/cart" className="relative cursor-pointer group hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-white text-[#0A1A2F] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ==================== MOBILE MENU OVERLAY ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#0A1A2F] md:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#C9D1D9]/10">
              <span className="text-[#C9D1D9] text-lg tracking-widest font-bold">MENU</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#C9D1D9]">
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col p-6 gap-6">
              {['SHOP', 'STORY', 'SUPPORT'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-light text-[#C9D1D9] flex items-center justify-between border-b border-[#C9D1D9]/5 pb-4"
                >
                  {item}
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              ))}
              
              {/* UPDATED: Mobile Account & Cart Links */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Link 
                  href={isLoggedIn ? "/dashboard" : "/sign-in"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center bg-[#133159] p-6 rounded-lg text-[#C9D1D9]"
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className="text-sm tracking-widest">ACCOUNT</span>
                </Link>
                
                <Link 
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center bg-[#C9D1D9] p-6 rounded-lg text-[#0A1A2F]"
                >
                  <ShoppingBag className="w-6 h-6 mb-2" />
                  <span className="text-sm tracking-widest font-bold">CART (0)</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== SEARCH OVERLAY ==================== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[70] bg-[#0A1A2F]/95 backdrop-blur-xl flex items-start justify-center pt-32 px-6"
          >
            <button 
              onClick={() => setSearchOpen(false)} 
              className="absolute top-8 right-8 text-[#C9D1D9]"
            >
              <X className="w-10 h-10" />
            </button>

            <div className="w-full max-w-3xl">
              <div className="relative border-b-2 border-[#C9D1D9]">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C9D1D9] w-8 h-8" />
                <input 
                  type="text" 
                  placeholder="Search products, series, categories..." 
                  className="w-full bg-transparent py-6 pl-14 text-2xl text-white placeholder-[#C9D1D9]/50 focus:outline-none font-light"
                  autoFocus
                />
              </div>
              <p className="mt-4 text-[#C9D1D9]/60 text-sm tracking-wide">
                PRESS ENTER TO SEARCH
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}