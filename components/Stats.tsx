"use client";
import { FadeIn } from "@/components/ui/Motion";

export default function Stats() {
  const stats = ["24h Cold", "12h Hot", "Leakproof", "Lifetime Warranty"];

  return (
    <section className="py-20 bg-ferixo-main border-y border-ferixo-secondary/10">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <FadeIn key={stat} delay={i * 0.1}>
            <p className="text-xl md:text-2xl font-bold text-ferixo-white mb-2">{stat}</p>
            <div className="h-1 w-8 bg-ferixo-secondary/30 mx-auto rounded-full" />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}