"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeIn, HoverCard } from "@/components/ui/Motion";
import { ArrowRight } from "lucide-react";
import { seriesList } from "@/lib/data";

// UPDATED GRID LAYOUT: All items are now equal (Square/Standard)
const layoutConfig: Record<string, { cols: string }> = {
  "HydroPro": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  "ThermoSmart": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  "Allure": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  "BrewMaster": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  "MiniSip": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  "FlexHandle": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  "Fleur": { cols: "col-span-1 md:col-span-2 lg:col-span-1" },
  // FIXED: Changed from 'col-span-4' to standard 'col-span-1'
  "Home Living": { cols: "col-span-1 md:col-span-2 lg:col-span-1" }, 
};

export default function SeriesShowcase() {
  return (
    <section className="py-24 px-6 bg-[#0A1A2F]">
      <div className="container mx-auto">
        
        {/* Header */}
        <FadeIn className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Curated Series
          </h2>
          <p className="text-[#C9D1D9]">
            Explore our specialized collections, engineered for every part of your day.
          </p>
        </FadeIn>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {seriesList.map((series, index) => {
            // Default to 1 column if config is missing
            const layout = layoutConfig[series.id] || { cols: "col-span-1" };

            return (
              <FadeIn key={series.id} delay={index * 0.05} className={layout.cols}>
                <HoverCard className="h-full">
                  <Link href={`/shop/${series.id.toLowerCase()}`} className="block h-full">
                    {/* FIXED: Removed 'isBanner' logic. All cards are now h-[280px] */}
                    <div 
                      className="relative h-[280px] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between transition-all duration-500 group bg-[#133159]"
                    >
                      
                      {/* IMAGE BACKGROUND & DARK OVERLAY */}
                      <div className="absolute inset-0">
                         <Image 
                           src={series.image || "/placeholder.jpg"} 
                           alt={series.id}
                           fill
                           className="object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         {/* Clean dark overlay (no blue gradient) */}
                         <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                      </div>
                      
                      {/* Content Wrapper */}
                      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                          {/* Top Content */}
                          <div>
                            <h3 className="font-bold text-2xl tracking-tight mb-1 text-white">
                              {series.id}
                            </h3>
                            <p className="text-sm text-[#C9D1D9] font-medium tracking-wide opacity-80">
                              {series.tagline}
                            </p>
                          </div>

                          {/* Bottom Action */}
                          <div className="flex items-center gap-2 text-[#C9D1D9] group-hover:text-white transition-colors">
                            <span className="text-xs font-bold uppercase tracking-widest">Shop Series</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                      </div>

                    </div>
                  </Link>
                </HoverCard>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}