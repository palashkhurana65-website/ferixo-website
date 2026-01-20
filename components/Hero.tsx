"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/ui/Motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0A1A2F] overflow-hidden pt-32 pb-20">
      
      {/* 1. BACKGROUND IMAGE (Desktop Only) */}
      <div className="hidden md:block absolute inset-0 z-0">
        <Image 
          src="/images/hero/1.jpg" 
          alt="Ferixo Premium Bottle"
          fill
          className="object-cover object-right"
          priority
          quality={100}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" /> 
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-20 w-full px-6 md:px-[80px] flex flex-col md:block items-center md:items-start text-center md:text-left">
        <div className="max-w-2xl">
          
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-10 md:mb-20 tracking-wide text-white drop-shadow-xl">
              Premium Hydration.<br />
              <span className="text-[#C9D1D9] font-medium">Designed for Everyday.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl leading-relaxed mb-10 text-[#C9D1D9] drop-shadow-md max-w-lg mx-auto md:mx-0">
              Experience the perfect balance of aesthetics and performance. 
              Engineered to keep your drinks cold for 10 hours.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="flex gap-4 justify-center md:justify-start">
            
            {/* SHOP BUTTON - Forced Colors */}
            <Link href="/shop">
              <button 
                className="bg-[#C9D1D9] text-[#0A1A2F] font-bold transition-transform duration-300 transform hover:scale-105 uppercase tracking-wide text-sm flex items-center justify-center shadow-lg"
                style={{ width: '126px', height: '44px', borderRadius: '10px' }}
              >
                Shop
              </button>
            </Link>
            
            {/* STORY BUTTON - Forced Colors */}
            <Link href="/story">
              <button 
                className="bg-[#C9D1D9] text-[#0A1A2F] font-bold transition-transform duration-300 transform hover:scale-105 uppercase tracking-wide text-sm flex items-center justify-center shadow-lg px-6"
                style={{ height: '44px', borderRadius: '10px' }}
              >
                Our Story
              </button>
            </Link>

          </FadeIn>

        </div>
      </div>
    </section>
  );
}