"use client";

import { products, seriesList, Product } from "@/lib/data";
import { FadeIn } from "@/components/ui/Motion";
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductEditor({ params }: PageProps) {
  const { products, addProduct, updateProduct } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isNewMode, setIsNewMode] = useState(false);

  // 1. INITIAL FORM STATE
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    series: "HydroPro",
    description: "",
    basePrice: 0,
    stock: 0,
    capacity: "", 
    images: [""], 
    features: [""],
    // UPDATED: Variants now include capacity
    variants: [{ name: "", capacity: "", stock: 0 }] 
  });

  // 2. LOAD DATA
  useEffect(() => {
    params.then((resolved) => {
      if (resolved.id === "new") {
        setIsNewMode(true);
        setFormData({
          ...formData,
          name: "New Product",
          series: "HydroPro",
          images: ["/images/placeholder.jpg"],
          capacity: "500ml"
        });
      } else {
        // CHANGED: This now looks inside the 'products' from useStore()
        const found = products.find(p => p.id === resolved.id);
        if (found) {
          setFormData(found);
        }
      }
      setLoading(false);
    });
  }, [params, products]); // <--- IMPORTANT: Add 'products' here

  // 3. HANDLERS
  const handleSave = () => {
    // Calculate total stock from variants
    const totalVariantStock = formData.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
    
    // Prepare the final product object
    const productToSave = { ...formData, stock: totalVariantStock } as Product;

    if (isNewMode) {
      // Create new
      addProduct(productToSave); 
      alert("Product Created Successfully!");
    } else {
      // Update existing
      if (formData.id) {
        updateProduct(formData.id, productToSave);
        alert("Product Updated Successfully!");
      }
    }

    router.push("/admin/products");
  };

  const handleArrayChange = (field: 'images' | 'features', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'images' | 'features') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ""] });
  };

  const removeArrayItem = (field: 'images' | 'features', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  // UPDATED HANDLER: Now accepts 'capacity'
  const handleVariantChange = (index: number, field: 'name' | 'stock' | 'capacity', value: string | number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...(formData.variants || []), { name: "", capacity: "", stock: 0 }] });
  };

  const removeVariant = (index: number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  if (loading) return <div className="p-10 text-white">Loading Editor...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white/5 rounded-lg text-[#C9D1D9] hover:bg-white/10 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNewMode ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-xs text-[#C9D1D9] uppercase tracking-wider">
              {isNewMode ? "Create a new listing" : `ID: ${formData.id || 'N/A'}`}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          className="bg-white text-[#0A1A2F] px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#C9D1D9] transition-colors shadow-lg shadow-white/5"
        >
          <Save size={18} /> Save Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Basic Info */}
            <FadeIn className="bg-[#133159] p-8 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">Product Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none"
                            placeholder="e.g. HydroPro Active"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">Series</label>
                        <select 
                            className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white outline-none"
                            value={formData.series}
                            onChange={(e) => setFormData({...formData, series: e.target.value as any})}
                        >
                            {seriesList.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">Base Capacity</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white outline-none"
                            placeholder="e.g. 1 Litre"
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">Description</label>
                    <textarea 
                        rows={4}
                        className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white outline-none resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>
            </FadeIn>

            {/* 2. Media Gallery */}
            <FadeIn delay={0.1} className="bg-[#133159] p-8 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <ImageIcon size={20} className="text-[#C9D1D9]" /> Media Gallery
                    </h2>
                    <button onClick={() => addArrayItem('images')} className="text-xs bg-[#0A1A2F] text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/50 transition-colors">
                        + Add URL
                    </button>
                </div>
                
                <div className="space-y-4">
                    {formData.images?.map((url, i) => (
                        <div key={i} className="flex gap-4 items-start">
                             <div className="w-16 h-16 bg-[#0A1A2F] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <UploadCloud size={20} className="text-[#C9D1D9] opacity-50" />
                                )}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Image URL..."
                                className="flex-1 bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white text-sm outline-none"
                                value={url}
                                onChange={(e) => handleArrayChange('images', i, e.target.value)}
                            />
                            <button onClick={() => removeArrayItem('images', i)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
            
            {/* 3. Pricing & Stock */}
            <FadeIn delay={0.2} className="bg-[#133159] p-6 rounded-2xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold text-white">Market Data</h2>
                
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">Price (₹)</label>
                    <input 
                        type="number" 
                        className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white font-mono text-lg outline-none"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({...formData, basePrice: parseInt(e.target.value)})}
                    />
                </div>
                
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">Total Stock</label>
                    <input 
                        type="number" 
                        className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white font-mono text-lg outline-none"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    />
                </div>
            </FadeIn>

            {/* 4. VARIANTS (UPDATED WITH SIZE) */}
            <FadeIn delay={0.3} className="bg-[#133159] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Variants</h2>
                    <button onClick={addVariant} className="text-xs bg-white text-[#0A1A2F] px-3 py-1.5 rounded font-bold hover:bg-[#C9D1D9]">
                        + Add
                    </button>
                </div>
                
                {/* Variant Headers */}
                <div className="grid grid-cols-8 gap-2 mb-2 px-1">
                    <span className="col-span-3 text-[10px] uppercase text-[#C9D1D9] font-bold">Color</span>
                    <span className="col-span-3 text-[10px] uppercase text-[#C9D1D9] font-bold">Size (ml/L)</span>
                    <span className="col-span-2 text-[10px] uppercase text-[#C9D1D9] text-center font-bold">Qty</span>
                </div>

                <div className="space-y-3">
                    {formData.variants?.map((v, i) => (
                        <div key={i} className="grid grid-cols-8 gap-2 items-center relative group">
                            
                            {/* Color Input */}
                            <input 
                                type="text" 
                                placeholder="Black"
                                className="col-span-3 bg-[#0A1A2F] border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-white/50"
                                value={v.name}
                                onChange={(e) => handleVariantChange(i, 'name', e.target.value)}
                            />

                            {/* Size Input (NEW) */}
                            <input 
                                type="text" 
                                placeholder="500ml"
                                className="col-span-3 bg-[#0A1A2F] border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-white/50"
                                value={v.capacity}
                                onChange={(e) => handleVariantChange(i, 'capacity', e.target.value)}
                            />

                            {/* Stock Input */}
                            <input 
                                type="number" 
                                placeholder="0"
                                className="col-span-2 bg-[#0A1A2F] border border-white/10 rounded-lg p-2 text-white text-sm text-center outline-none focus:border-white/50"
                                value={v.stock}
                                onChange={(e) => handleVariantChange(i, 'stock', parseInt(e.target.value))}
                            />

                            {/* Delete Button (Hover) */}
                            <button 
                              onClick={() => removeVariant(i)}
                              className="absolute -right-6 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </FadeIn>

        </div>

      </div>
    </div>
  );
}