"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { products as initialProducts } from "@/lib/data";

// TYPES
type Product = any; 
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  variant: string; 
  size?: string;   
  quantity: number;
};

interface StoreContextType {
  // Admin State
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Product) => void;
  deleteProduct: (id: string) => Promise<void>;
  
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, change: number) => void;

  // NEW: Coupon State
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  cartTotal: { subtotal: number; discount: number; finalTotal: number };
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

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id)); // Optimistic
    try { await fetch(`/api/products/${id}`, { method: "DELETE" }); } catch (e) { console.error(e); }
  };

  // --- CART STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("ferixo_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) localStorage.setItem("ferixo_cart", JSON.stringify(cart));
  }, [cart, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.variant === newItem.variant && item.size === newItem.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.variant === newItem.variant && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, { ...newItem }];
    });
  };

  const removeFromCart = (uniqueId: string) => {
    setCart((prev) => prev.filter((item) => `${item.id}-${item.variant}-${item.size||''}` !== uniqueId));
  };

  const updateCartQuantity = (uniqueId: string, change: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (`${item.id}-${item.variant}-${item.size||''}` === uniqueId) {
          return { ...item, quantity: Math.max(1, item.quantity + change) };
        }
        return item;
      })
    );
  };

  // --- COUPON LOGIC (NEW) ---
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setCoupon({ code: data.code, discount: data.discount });
      return { success: true, message: `Coupon applied! ${data.discount}% Off.` };
    } catch (error: any) {
      setCoupon(null);
      return { success: false, message: error.message || "Invalid Code" };
    }
  };

  const removeCoupon = () => setCoupon(null);

  // Auto-calculate Totals
  const cartTotal = (() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = coupon ? (subtotal * coupon.discount) / 100 : 0;
    const finalTotal = subtotal - discountAmount;
    return { subtotal, discount: discountAmount, finalTotal };
  })();

  return (
    <StoreContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        cart, addToCart, removeFromCart, updateCartQuantity,
        coupon, applyCoupon, removeCoupon, cartTotal
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