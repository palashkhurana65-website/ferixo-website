"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { products as initialProducts } from "@/lib/data";

// 1. Define Types
type Product = any; 
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
};

interface StoreContextType {
  // Admin State
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Product) => void;
  
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, change: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // --- ADMIN STATE ---
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, { ...newProduct, id: Date.now().toString() }]);
  };

  const updateProduct = (id: string, updatedData: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  // --- CART STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); // <--- NEW FLAG

  // 1. Load Cart (Runs ONCE on mount)
  useEffect(() => {
    const savedCart = localStorage.getItem("ferixo_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true); // <--- Allow saving ONLY after loading is done
  }, []);

  // 2. Save Cart (Runs whenever cart changes, BUT blocked until initialized)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ferixo_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.variant === newItem.variant
      );

      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.variant === newItem.variant
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, { ...newItem }];
    });
  };

  const removeFromCart = (uniqueId: string) => {
    setCart((prev) => prev.filter((item) => `${item.id}-${item.variant}` !== uniqueId));
  };

  const updateCartQuantity = (uniqueId: string, change: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (`${item.id}-${item.variant}` === uniqueId) {
          const newQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};