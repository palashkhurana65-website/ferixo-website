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
  { id: "HydroPro", tagline: "Active Performance", image: "/shop/hydro 2.jpg" },
  { id: "ThermoSmart", tagline: "Digital Temperature Control", image: "/shop/thermo.jpg" },
    { id: "FlexHandle", tagline: "Utility & Carry", image: "/shop/flexhandle.jpg" },
    {
    id: "Fleur",
    tagline: "Floral Elegance",
    image: "/shop/fleur.jpg"
  },
  { id: "MiniSip", tagline: "Kids & Compact", image: "/shop/minisip.jpg" },
  { id: "Allure", tagline: "Aesthetic & Style", image: "/shop/allure.jpg" },
  { id: "BrewMaster", tagline: "Coffee & Tea Connoisseur", image: "/shop/brew.jpg" },

  { id: "Home Living", tagline: "Premium Shoe Racks & Organizers", image: "/shop/home.jpg" },

];

export const products: Product[] = []