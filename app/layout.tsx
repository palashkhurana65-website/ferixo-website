import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/context/StoreContext"; // <--- IMPORT THIS
import Providers from "@/components/Providers";
import MarketingPopup from "@/components/ui/Toaster";
import Toaster from "@/components/ui/Toaster";
import type { Metadata, Viewport } from "next";

// 1. Viewport (Mobile Optimization)
export const viewport: Viewport = {
  themeColor: "#0A1A2F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Global Metadata
export const metadata: Metadata = {
  // CRITICAL: Replace with your actual deployed domain (e.g., https://ferixo.com)
  // This is required for Canonical URLs to work correctly.
  metadataBase: new URL("https://ferixo.com"), 

  // Auto-generate Canonical URL for every page relative to base
  alternates: {
    canonical: "./",
  },

  title: {
    default: "Ferixo | Premium Hydration Gear",
    template: "%s | Ferixo", // Inner pages will show: "Product Name | Ferixo"
  },
  description: "Experience premium quality designed for your daily life. Durable, aesthetic, and built for performance.",
  
  // Favicons (Next.js automatically finds files in /app, but this is explicit)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Search Engine Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Social Media Cards
  openGraph: {
    title: "Ferixo | Premium Hydration Gear",
    description: "Upgrade your daily hydration with Ferixo's cinematic series.",
    url: "https://ferixo.com",
    siteName: "Ferixo",
    locale: "en_US",
    type: "website",
  },
};

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.className} bg-[#0A1A2F] text-[#C9D1D9] antialiased selection:bg-[#C9D1D9] selection:text-[#0A1A2F]`}>
        {/* WRAP EVERYTHING INSIDE STOREPROVIDER */}
        <Providers>
        <StoreProvider>
          <Navbar />
          
           {children} 
          
          <Footer />
          <Toaster />
        </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}