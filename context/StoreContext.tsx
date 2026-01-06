"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { products as initialProducts, Product } from "@/lib/data";

interface StoreContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordSale: (id: string, quantity: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Initialize with the data from data.ts
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    // Generate a simple ID if "new" is passed
    const newProduct = { 
      ...product, 
      id: product.id === "new" ? `prod-${Date.now()}` : product.id 
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => 
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const recordSale = (id: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
           return { 
             ...p, 
             sales: p.sales + quantity, 
             stock: Math.max(0, p.stock - quantity) 
           };
        }
        return p;
      })
    );
  };

  return (
    <StoreContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, recordSale }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom Hook for easy access
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}