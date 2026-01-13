"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/Motion";
import { Plus, Search, Edit2, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Real Data from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Delete Product via API
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Remove from UI immediately without refreshing
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted.");
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      alert("Error deleting product.");
    }
  };

  // Filter logic
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.series.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory</h1>
          <p className="text-[#C9D1D9] text-sm">Manage products, stock levels, and variations.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9D1D9] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-[#133159] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/admin/products/new">
            <button className="bg-white text-[#0A1A2F] font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#C9D1D9] transition-colors">
              <Plus size={18} /> Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <FadeIn className="bg-[#133159] rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#C9D1D9] flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" /> Loading Inventory...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#0A1A2F] text-[#C9D1D9] text-sm uppercase tracking-wider">
              <tr>
                <th className="p-6">Product</th>
                <th className="p-6">Series</th>
                <th className="p-6">Price</th>
                <th className="p-6">Total Stock</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#C9D1D9] opacity-50">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-xs text-[#C9D1D9] opacity-70">
                        {product.variants?.length || 0} Variants
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                        {product.series}
                      </span>
                    </td>
                    <td className="p-6">₹{product.basePrice.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`${product.stock < 10 ? "text-red-400 font-bold" : "text-green-400"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="p-2 hover:bg-white/10 rounded-lg text-[#C9D1D9] hover:text-white" title="Edit">
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </FadeIn>
    </div>
  );
}