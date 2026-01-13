"use client";

import { seriesList } from "@/lib/data"; 
import { FadeIn } from "@/components/ui/Motion";
import { ArrowLeft, Save, X, Image as ImageIcon, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";


export default function ProductEditor() { 
  // 1. Get parameters safely
  const params = useParams(); 
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // New Error State
  const [isNewMode, setIsNewMode] = useState(false);
  const [isCustomSeries, setIsCustomSeries] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({
    name: "",
    series: "HydroPro",
    description: "",
    basePrice: 0,
    stock: 0,
    capacity: "", 
    images: [""], 
    features: [""],
    variants: [{ name: "", capacity: "", stock: 0 }] 
  });

  // 2. DATA FETCHING EFFECT
  useEffect(() => {
    const fetchProductData = async () => {
      const id = params?.id; 
      
      // If no ID yet, wait.
      if (!id) return;

      console.log("Admin Editor: Fetching ID ->", id);

      // CASE A: Create New
      if (id === "new") {
        setIsNewMode(true);
        setLoading(false);
        return;
      }

      // CASE B: Edit Existing
      try {
        const res = await fetch(`/api/products/${id}`);
        
        console.log("Admin Editor: API Response Status ->", res.status);

        if (!res.ok) {
            // Throw specific error to be caught below
            if (res.status === 404) throw new Error(`Product with ID '${id}' not found in database.`);
            throw new Error(`API Error: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Admin Editor: Data Received ->", data);
        
        // Populate Form
        setFormData({
            ...data,
            images: data.images && data.images.length > 0 ? data.images : [""],
            features: data.features && data.features.length > 0 ? data.features : [""],
            variants: data.variants && data.variants.length > 0 ? data.variants : [{ name: "", capacity: "", stock: 0 }]
        });
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message); // Set visible error
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params?.id]);


  // 3. HANDLERS
  const handleSave = async () => {
    // Recalculate stock from variants before saving
    const totalVariantStock = formData.variants?.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0) || 0;
    const payload = { ...formData, stock: totalVariantStock };

    try {
      const url = isNewMode ? '/api/products' : `/api/products/${params?.id}`;
      const method = isNewMode ? 'POST' : 'PUT';

      const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save operation failed");
      
      alert(isNewMode ? "Product Created!" : "Product Updated!");
      router.push("/admin/products");
    } catch (error) {
       console.error(error);
       alert("Error saving product. Check console.");
    }
  };
  
  // Array Helper Functions
  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  const addArrayItem = (field: string) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ""] });
  };
  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };
  const handleVariantChange = (index: number, field: string, value: string | number) => {
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

  // 4. CONDITIONAL RENDERING
  if (loading) return <div className="p-10 text-white text-center">Loading Editor...</div>;
  
  if (error) return (
      <div className="p-20 text-center">
          <h2 className="text-2xl text-red-500 font-bold mb-4">Error Loading Product</h2>
          <p className="text-white mb-6">{error}</p>
          <Link href="/admin/products" className="bg-white/10 px-4 py-2 rounded text-white hover:bg-white/20">
              Go Back to List
          </Link>
      </div>
  );

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
              {isNewMode ? "Create a new listing" : `ID: ${params?.id}`}
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
                    
                    {/* SERIES SELECTOR */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C9D1D9] mb-2 font-bold">
                        Series
                      </label>
                      {!isCustomSeries ? (
                        <div className="relative">
                          <select
                            className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white outline-none appearance-none cursor-pointer focus:border-white/50 transition-colors"
                            value={formData.series}
                            onChange={(e) => {
                              if (e.target.value === "custom_new_entry") {
                                setIsCustomSeries(true);
                                setFormData({ ...formData, series: "" });
                              } else {
                                setFormData({ ...formData, series: e.target.value });
                              }
                            }}
                          >
                            <option value="" disabled>Select a Series</option>
                            {seriesList.map((s: any) => (
                              <option key={s.id} value={s.id}>{s.id}</option>
                            ))}
                            <option value="custom_new_entry" className="text-yellow-400 font-bold">
                              + Create New Series
                            </option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white focus:border-white/50 outline-none"
                            placeholder="Enter new series name..."
                            autoFocus
                            value={formData.series}
                            onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                          />
                          <button
                            onClick={() => { setIsCustomSeries(false); setFormData({ ...formData, series: "HydroPro" }); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg border border-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
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
                    {formData.images?.map((url: string, i: number) => (
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

            {/* 3. Features Section */}
            <FadeIn delay={0.15} className="bg-[#133159] p-8 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Features</h2>
                    <button onClick={() => addArrayItem('features')} className="text-xs bg-[#0A1A2F] text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/50 transition-colors">
                        + Add Feature
                    </button>
                </div>
                
                <div className="space-y-3">
                    {formData.features?.map((feat: string, i: number) => (
                        <div key={i} className="flex gap-4 items-center">
                            <span className="text-[#C9D1D9]/50 text-xs w-4">{i + 1}.</span>
                            <input 
                                type="text" 
                                placeholder="e.g. 24h Cold Retention"
                                className="flex-1 bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white text-sm outline-none"
                                value={feat}
                                onChange={(e) => handleArrayChange('features', i, e.target.value)}
                            />
                            <button onClick={() => removeArrayItem('features', i)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg">
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
                        disabled 
                    />
                    <p className="text-[10px] text-[#C9D1D9]/50 mt-1">Calculated from variants below</p>
                </div>
            </FadeIn>

            {/* 4. VARIANTS */}
            <FadeIn delay={0.3} className="bg-[#133159] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Variants</h2>
                    <button onClick={addVariant} className="text-xs bg-white text-[#0A1A2F] px-3 py-1.5 rounded font-bold hover:bg-[#C9D1D9]">
                        + Add
                    </button>
                </div>
                
                <div className="grid grid-cols-8 gap-2 mb-2 px-1">
                    <span className="col-span-3 text-[10px] uppercase text-[#C9D1D9] font-bold">Color</span>
                    <span className="col-span-3 text-[10px] uppercase text-[#C9D1D9] font-bold">Size</span>
                    <span className="col-span-2 text-[10px] uppercase text-[#C9D1D9] text-center font-bold">Qty</span>
                </div>

                <div className="space-y-3">
                    {formData.variants?.map((v: any, i: number) => (
                        <div key={i} className="grid grid-cols-8 gap-2 items-center relative group">
                            <input 
                                type="text" 
                                placeholder="Black"
                                className="col-span-3 bg-[#0A1A2F] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                                value={v.name}
                                onChange={(e) => handleVariantChange(i, 'name', e.target.value)}
                            />
                            <input 
                                type="text" 
                                placeholder="500ml"
                                className="col-span-3 bg-[#0A1A2F] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                                value={v.capacity}
                                onChange={(e) => handleVariantChange(i, 'capacity', e.target.value)}
                            />
                            <input 
                                type="number" 
                                placeholder="0"
                                className="col-span-2 bg-[#0A1A2F] border border-white/10 rounded-lg p-2 text-white text-sm text-center outline-none"
                                value={v.stock}
                                onChange={(e) => handleVariantChange(i, 'stock', parseInt(e.target.value))}
                            />
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