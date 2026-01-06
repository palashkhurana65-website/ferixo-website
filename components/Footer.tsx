"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0A1A2F] border-t border-white/5 py-16 px-6 text-sm">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="block">
            <Image 
              src="/logo/1.svg" 
              alt="FERIXO" 
              width={140} 
              height={40} 
              className="h-10 w-auto object-contain brightness-0 invert" // Remove 'invert' if your logo image is already white text
            />
          </Link>
          <p className="text-[#C9D1D9] leading-relaxed max-w-xs opacity-80">
            Premium hydration engineered for everyday movement. 
            Designed in India.
          </p>
        </div>

        {/* Shop Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">Shop</h3>
          <Link href="/shop" className="text-[#C9D1D9] hover:text-white transition-colors">All Products</Link>
          <Link href="/shop/bottles" className="text-[#C9D1D9] hover:text-white transition-colors">Bottles</Link>
          <Link href="/shop/tumblers" className="text-[#C9D1D9] hover:text-white transition-colors">Tumblers</Link>
          <Link href="/shop/accessories" className="text-[#C9D1D9] hover:text-white transition-colors">Accessories</Link>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">Support</h3>
          <Link href="/support" className="text-[#C9D1D9] hover:text-white transition-colors">Help Center</Link>
          <Link href="/support/shipping" className="text-[#C9D1D9] hover:text-white transition-colors">Shipping & Returns</Link>
          <Link href="/support/warranty" className="text-[#C9D1D9] hover:text-white transition-colors">Warranty</Link>
          <Link href="/contact" className="text-[#C9D1D9] hover:text-white transition-colors">Contact Us</Link>
        </div>

        {/* Social / Newsletter Column */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-widest mb-4">Follow Us</h3>
          <div className="flex gap-4 text-[#C9D1D9]">
            <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

      </div>

      {/* Copyright Strip */}
      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-[#C9D1D9]/50">
        <p>© {new Date().getFullYear()} Ferixo Premium Hydration. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}