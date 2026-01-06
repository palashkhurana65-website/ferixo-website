export type SeriesName = 
  | "HydroPro" | "ThermoSmart" | "Allure" | "MiniSip" 
  | "BrewMaster" | "FlexHandle" | "Home Living";

// UPDATED: Added 'capacity' to the Variant interface
export interface Variant {
  name: string;      // e.g. "Matte Black"
  capacity: string;  // e.g. "500ml" or "1L"
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  series: SeriesName;
  description: string;
  basePrice: number;
  features: string[];
  capacity: string;     // Base/Default capacity
  
  sales: number;
  stock: number;
  images: string[];
  variants: Variant[];
}

export const seriesList = [
  { id: "HydroPro", tagline: "Active Performance", image: "/images/series/hydropro.jpg" },
  { id: "ThermoSmart", tagline: "Digital Temperature Control", image: "/images/series/thermosmart.jpg" },
  { id: "Allure", tagline: "Aesthetic & Style", image: "/images/series/allure.jpg" },
  { id: "MiniSip", tagline: "Kids & Compact", image: "/images/series/minisip.jpg" },
  { id: "BrewMaster", tagline: "Coffee & Tea Connoisseur", image: "/images/series/brewmaster.jpg" },
  { id: "FlexHandle", tagline: "Utility & Carry", image: "/images/series/flexhandle.jpg" },
  { id: "Home Living", tagline: "Premium Shoe Racks & Organizers", image: "/images/series/homeliving.jpg" },
];

export const products: Product[] = [
  {
    id: "hp-1000", name: "HydroPro Active 1L", series: "HydroPro",
    description: "Rugged durability for the gym.", basePrice: 2499, capacity: "1L",
    features: ["Rubber Grip", "Impact Resistant"],
    sales: 1240, stock: 45,
    images: ["/images/products/hp-32-main.jpg", "/images/products/hp-32-side.jpg"],
    // UPDATED VARIANTS WITH CAPACITY
    variants: [
      { name: "Matte Black", capacity: "1L", stock: 20 }, 
      { name: "Navy Blue", capacity: "1L", stock: 25 },
      { name: "Matte Black", capacity: "750ml", stock: 10 } // Different size
    ]
  },
  {
    id: "ts-led", name: "ThermoSmart LED", series: "ThermoSmart",
    description: "Touch display temperature reading.", basePrice: 3499, capacity: "500ml",
    features: ["LED Display", "24h Battery"],
    sales: 850, stock: 12,
    images: ["/images/products/ts-led.jpg"],
    variants: [{ name: "Standard", capacity: "500ml", stock: 12 }]
  },
  {
    id: "sr-3tier", name: "Minimalist 3-Tier Rack", series: "Home Living",
    description: "Premium stainless steel organizer.", basePrice: 3999, capacity: "3-Tier",
    features: ["Rust Proof", "Easy Assembly"],
    sales: 2100, stock: 8,
    images: ["/images/products/rack.jpg"],
    variants: [{ name: "Silver", capacity: "3-Tier", stock: 8 }]
  },
];