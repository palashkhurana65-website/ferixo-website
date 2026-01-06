"use client";

import Link from "next/link";
import { ShoppingBag, Search, User } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // <--- 1. Import this

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname(); // <--- 2. Get current path

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // 3. HIDE ON ADMIN PAGES
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#0A1A2F]/95 backdrop-blur-md border-b border-white/5 h-[70px]"
          : "bg-transparent h-[90px]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
        
        {/* LOGO */}
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

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-10 text-sm font-medium tracking-wide text-[#C9D1D9]">
          <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
          <Link href="/about" className="hover:text-white transition-colors">STORY</Link>
          <Link href="/support" className="hover:text-white transition-colors">SUPPORT</Link>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6 text-[#C9D1D9]">
          <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <User className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          
          <div className="relative cursor-pointer group">
            <ShoppingBag className="w-5 h-5 group-hover:text-white transition-colors" />
            <span className="absolute -top-2 -right-2 bg-white text-[#0A1A2F] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </div>
        </div>

      </div>
    </motion.nav>
  );
}