"use client";

import { seriesList } from "@/lib/data"; 
import { FadeIn } from "@/components/ui/Motion";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Image as ImageIcon, 
  UploadCloud, 
  Plus, 
  Trash2 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";

// --- TYPES ---
type VariantOption = { name: string; stock: number; images: string[] };
type VariantGroup = { capacity: string; options: VariantOption[] };

export default function ProductEditor() { 
  const params = useParams(); 
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);
  const [isCustomSeries, setIsCustomSeries] = useState(false);

  // Active Modal State (Moved INSIDE the component)
  const [activeVariantIndices, setActiveVariantIndices] = useState<{g: number, o: number} | null>(null);

  // Main Form Data
  const [formData, setFormData] = useState<any>({
    name: "",
    series: "HydroPro",
    description: "",
    basePrice: 0,
    stock: 0,
    capacity: "", 
    images: [""], // Main Product Images (Hero)
    features: [""],
  });

  // Grouped Variants State (Size -> Colors -> Images)
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([
    { capacity: "", options: [{ name: "", stock: 0, images: [] }] } 
  ]);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchProductData = async () => {
      const id = params?.id; 
      if (!id) return;

      if (id === "new") {
        setIsNewMode(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        
        const data = await res.json();
        
        // Populate Basic Info
        setFormData({
            ...data,
            images: data.images?.length ? data.images : [""],
            features: data.features?.length ? data.features : [""],
        });

        // RE-GROUP VARIANTS (Flattened DB -> Grouped UI)
        if (data.variants && data.variants.length > 0) {
            const groups: Record<string, VariantOption[]> = {};
            
            data.variants.forEach((v: any) => {
                const cap = v.capacity || "Standard";
                if (!groups[cap]) groups[cap] = [];
                
                // Parse images: Ensure it's always an array
                let vImages: string[] = [];
                if (Array.isArray(v.images)) {
                    vImages = v.images;
                } else if (typeof v.images === 'string') {
                    // Handle legacy or single string cases if any
                    vImages = [v.images];
                }

                groups[cap].push({ 
                    name: v.name, 
                    stock: v.stock, 
                    images: vImages
                });
            });

            // Convert map to array for state
            setVariantGroups(Object.entries(groups).map(([capacity, options]) => ({
                capacity,
                options
            })));
        } else {
             setVariantGroups([{ capacity: "", options: [{ name: "", stock: 0, images: [] }] }]);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params?.id]);


  // --- 2. HELPERS & HANDLERS ---

  // Basic Field Handlers
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

  // Group Handlers
  const addGroup = () => {
    setVariantGroups([...variantGroups, { capacity: "", options: [{ name: "", stock: 0, images: [] }] }]);
  };
  const removeGroup = (groupIdx: number) => {
    const newGroups = [...variantGroups];
    newGroups.splice(groupIdx, 1);
    setVariantGroups(newGroups);
  };
  const handleGroupCapacityChange = (groupIdx: number, val: string) => {
    const newGroups = [...variantGroups];
    newGroups[groupIdx].capacity = val;
    setVariantGroups(newGroups);
  };

  // Option (Variant) Handlers
  const addOptionToGroup = (groupIdx: number) => {
    const newGroups = [...variantGroups];
    newGroups[groupIdx].options.push({ name: "", stock: 0, images: [] });
    setVariantGroups(newGroups);
  };
  const removeOption = (groupIdx: number, optIdx: number) => {
    const newGroups = [...variantGroups];
    newGroups[groupIdx].options.splice(optIdx, 1);
    setVariantGroups(newGroups);
  };
  const handleOptionChange = (groupIdx: number, optIdx: number, field: keyof VariantOption, val: string | number) => {
    const newGroups = [...variantGroups];
    // @ts-ignore - dynamic assignment
    newGroups[groupIdx].options[optIdx][field] = val;
    setVariantGroups(newGroups);
  };

  // --- VARIANT MEDIA HANDLERS (Used in Modal) ---
  const addImageToVariant = (groupIdx: number, optIdx: number) => {
    const newGroups = [...variantGroups];
    if (!newGroups[groupIdx].options[optIdx].images) newGroups[groupIdx].options[optIdx].images = [];
    newGroups[groupIdx].options[optIdx].images.push("");
    setVariantGroups(newGroups);
  };
  const updateVariantImage = (groupIdx: number, optIdx: number, imgIdx: number, val: string) => {
    const newGroups = [...variantGroups];
    newGroups[groupIdx].options[optIdx].images[imgIdx] = val;
    setVariantGroups(newGroups);
  };
  const removeVariantImage = (groupIdx: number, optIdx: number, imgIdx: number) => {
    const newGroups = [...variantGroups];
    newGroups[groupIdx].options[optIdx].images.splice(imgIdx, 1);
    setVariantGroups(newGroups);
  };

  
// --- 3. SAVE HANDLER (UPDATED) ---
  const handleSave = async () => {
    // 1. Flatten Groups back to Database Structure
    const flatVariants = variantGroups.flatMap(group => 
        group.options.map(opt => ({
            name: opt.name,
            capacity: group.capacity,
            stock: opt.stock,
            images: opt.images // Send the array of images
        }))
    );

    // 2. VALIDATION: Check for incomplete variants
    // Instead of silently filtering, we check if any variant is missing a name
    const incompleteVariant = flatVariants.find(v => !v.name || v.name.trim() === "");
    
    if (incompleteVariant) {
        alert(`Error: The variant for size "${incompleteVariant.capacity || 'Unknown'}" is missing a Color/Variant Name. Please fill it in.`);
        return; // STOP SAVE
    }

    // 3. Calculate Total Stock
    const totalStock = flatVariants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);

    const payload = { 
        ...formData, 
        stock: totalStock,
        variants: flatVariants 
    };

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
       alert("Error saving product. Check console for details.");
    }
  };

  // --- 4. RENDER ---
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

            {/* 2. Hero Image (Restricted to 1) */}
            <FadeIn delay={0.1} className="bg-[#133159] p-8 rounded-2xl border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-[#C9D1D9]" /> Hero / Cover Image
                </h2>
                <p className="text-xs text-[#C9D1D9]/60 mb-4">This is the main image shown on the series page.</p>
                
                <div className="flex gap-4 items-start">
                     <div className="relative w-32 h-32 bg-[#0A1A2F] border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center overflow-hidden group flex-shrink-0">
                        {formData.images[0] ? (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={formData.images[0]} alt="Hero" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => handleArrayChange('images', 0, "")}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="text-white" />
                                </button>
                            </>
                        ) : (
                            <ImageIcon className="text-white/20" />
                        )}
                     </div>
                     <div className="flex-1">
                        <label className="text-[10px] uppercase text-[#C9D1D9] font-bold block mb-2">Image URL</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#0A1A2F] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500"
                            placeholder="https://..."
                            value={formData.images[0] || ""}
                            onChange={(e) => handleArrayChange('images', 0, e.target.value)}
                        />
                     </div>
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
            
            {/* 4. Pricing & Stock */}
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

            {/* 5. GROUPED VARIANTS UI */}
            <FadeIn delay={0.3} className="bg-[#133159] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Product Variants</h2>
                    <button onClick={addGroup} className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded font-bold hover:bg-blue-400">
                        + Add Size Group
                    </button>
                </div>
                
                <div className="space-y-6">
                    {variantGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="bg-[#0A1A2F] p-4 rounded-xl border border-white/10 relative">
                            
                            {/* Group Header (Capacity) */}
                            <div className="flex gap-4 items-center mb-4 border-b border-white/5 pb-4">
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase text-[#C9D1D9] font-bold block mb-1">Size / Capacity</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 1000ml"
                                        className="w-full bg-[#133159] border border-white/10 rounded-lg p-2 text-white text-sm font-bold outline-none focus:border-blue-500"
                                        value={group.capacity}
                                        onChange={(e) => handleGroupCapacityChange(groupIdx, e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={() => removeGroup(groupIdx)}
                                    className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg mt-4"
                                    title="Remove Group"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Options (Colors) */}
                            <div className="space-y-2 pl-2">
                                {group.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex gap-3 items-center mb-2 bg-[#133159] p-3 rounded-lg border border-white/5">
                                        
                                        {/* Color Name Input */}
                                        <div className="flex-1">
                                            <input 
                                                type="text" 
                                                placeholder="Color Name (e.g. Navy Blue)"
                                                className="w-full bg-transparent text-white text-sm font-bold outline-none placeholder-white/20"
                                                value={opt.name}
                                                onChange={(e) => handleOptionChange(groupIdx, optIdx, 'name', e.target.value)}
                                            />
                                            <div className="text-xs text-blue-400 mt-1">
                                                {opt.stock} in stock • {opt.images?.length || 0} images
                                            </div>
                                        </div>

                                        {/* MANAGE BUTTON (Opens Modal) */}
                                        <button 
                                            onClick={() => setActiveVariantIndices({ g: groupIdx, o: optIdx })}
                                            className="px-4 py-2 bg-blue-500/10 text-blue-400 text-xs font-bold rounded hover:bg-blue-500 hover:text-white transition-colors whitespace-nowrap"
                                        >
                                            Manage Media & Stock
                                        </button>

                                        {/* Remove Variant */}
                                        <button 
                                          onClick={() => removeOption(groupIdx, optIdx)}
                                          className="p-2 text-red-400 opacity-50 hover:opacity-100"
                                        >
                                          <X size={16} />
                                        </button>
                                    </div>
                                ))}

                                <button 
                                    onClick={() => addOptionToGroup(groupIdx)}
                                    className="w-full py-2 mt-2 border border-dashed border-white/10 rounded-lg text-xs text-[#C9D1D9] hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    + Add Variant Color
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </div>

      </div>

      {/* --- VARIANT EDITOR MODAL (POPUP) --- */}
      {activeVariantIndices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#0A1A2F] border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                 <div>
                    <h3 className="text-xl font-bold text-white">Edit Variant Details</h3>
                    <p className="text-sm text-[#C9D1D9]">
                        {variantGroups[activeVariantIndices.g].capacity} - {variantGroups[activeVariantIndices.g].options[activeVariantIndices.o].name}
                    </p>
                 </div>
                 <button onClick={() => setActiveVariantIndices(null)} className="p-2 bg-[#133159] rounded-lg text-white hover:bg-red-500 transition-colors">
                    <X size={20} />
                 </button>
              </div>

              {/* 1. STOCK SECTION */}
              <div className="mb-8">
                 <label className="text-xs uppercase text-[#C9D1D9] font-bold block mb-2">Stock Quantity</label>
                 <input 
                    type="number" 
                    className="w-full bg-[#133159] border border-white/10 rounded-xl p-4 text-white text-xl font-mono outline-none focus:border-blue-500"
                    value={variantGroups[activeVariantIndices.g].options[activeVariantIndices.o].stock}
                    onChange={(e) => handleOptionChange(activeVariantIndices.g, activeVariantIndices.o, 'stock', parseInt(e.target.value))}
                 />
              </div>

              {/* 2. MEDIA GALLERY SECTION */}
              <div>
                 <div className="flex justify-between items-end mb-4">
                    <label className="text-xs uppercase text-[#C9D1D9] font-bold">Variant Media Gallery</label>
                    <button 
                        onClick={() => addImageToVariant(activeVariantIndices.g, activeVariantIndices.o)}
                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded font-bold hover:bg-blue-400"
                    >
                        + Add Image URL
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    {variantGroups[activeVariantIndices.g].options[activeVariantIndices.o].images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="flex gap-4 items-center group">
                            <div className="w-16 h-16 bg-[#133159] rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
                                {img ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={img} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={16}/></div>
                                )}
                            </div>
                            <input 
                                type="text"
                                placeholder="Paste Image URL..."
                                className="flex-1 bg-[#133159] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500"
                                value={img}
                                onChange={(e) => updateVariantImage(activeVariantIndices.g, activeVariantIndices.o, imgIdx, e.target.value)}
                            />
                            <button 
                                onClick={() => removeVariantImage(activeVariantIndices.g, activeVariantIndices.o, imgIdx)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {(!variantGroups[activeVariantIndices.g].options[activeVariantIndices.o].images || variantGroups[activeVariantIndices.g].options[activeVariantIndices.o].images.length === 0) && (
                        <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl text-white/30 text-sm">
                            No images added for this variant yet.
                        </div>
                    )}
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                 <button 
                    onClick={() => setActiveVariantIndices(null)}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600"
                 >
                    Done
                 </button>
              </div>

           </div>
        </div>
      )}

    </div>
  );
}