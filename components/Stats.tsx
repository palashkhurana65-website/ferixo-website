"use client";

import { FadeIn } from "@/components/ui/Motion";
import { Snowflake, Flame, Droplet, ShieldCheck } from "lucide-react";

export default function Stats() {
  const stats = [
    { label: "24h Cold", icon: Snowflake },
    { label: "12h Hot", icon: Flame },
    { label: "Leakproof", icon: Droplet },
    { label: "Lifetime Warranty", icon: ShieldCheck },
  ];

  return (
    // Updated background to match your Shop/Dashboard pages
    <section className="py-20 bg-[#0A1A2F] border-y border-white/10">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.1}>
            <div className="flex flex-col items-center gap-4 group cursor-default">
              
              {/* Icon Container with Hover Glow */}
              <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-blue-400/50 transition-all duration-300">
                <stat.icon 
                  className="w-8 h-8 text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300" 
                  strokeWidth={1.5}
                />
              </div>

              {/* Text & Underline */}
              <div>
                <p className="text-xl md:text-2xl font-bold text-white mb-3">
                  {stat.label}
                </p>
                {/* Animated Underline */}
                <div className="h-1 w-8 bg-blue-500/50 mx-auto rounded-full group-hover:w-16 group-hover:bg-blue-400 transition-all duration-300" />
              </div>

            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}