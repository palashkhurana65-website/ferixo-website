import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import SeriesShowcase from "@/components/SeriesShowcase";
import FeaturedGrid from "@/components/FeaturedGrid";
import Lifestyle from "@/components/Lifestyle";

export default function Home() {
  return (
    <main className="bg-[#0A1A2F] min-h-screen">
      
      {/* 1. Hero Section (Full Screen) */}
      <Hero />
      
      {/* 2. Performance Stats (Bar) */}
      <Stats />
      
      {/* 3. Series Showcase (Bento Grid - NEW) */}
      <SeriesShowcase />
      
      {/* 4. Featured Products (Standard Grid) */}
      <FeaturedGrid />
      
      {/* 5. Lifestyle / Brand Statement */}
      <Lifestyle />

    </main>
  );
}