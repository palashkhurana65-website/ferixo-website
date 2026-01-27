"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckSquare, Square, Trash2, Tag, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  // 1. Get Global Store Data & Actions
  const { cart, removeFromCart, applyCoupon, removeCoupon, coupon, cartTotal } = useStore();
  const router = useRouter();

  // --- STATE ---
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Coupon Local State
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Shipping Form
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "", 
    pincode: "",
  });

  const [billingForm, setBillingForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  // --- EFFECTS ---

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
        router.replace("/cart");
    }
  }, [cart, router]);

  // Fetch addresses (Placeholder)
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // const res = await fetch("/api/user/addresses"); 
        // const data = await res.json();
        // setSavedAddresses(data);
      } catch (e) {
        console.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, []);

  // --- HANDLERS ---

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    
    const result = await applyCoupon(couponInput);
    
    setCouponMsg({
        type: result.success ? 'success' : 'error',
        text: result.message
    });
    setCouponLoading(false);
    if (result.success) setCouponInput("");
  };

  const handlePincodeChange = async (pin: string, type: 'shipping' | 'billing') => {
    const updateFn = type === 'shipping' ? setShippingForm : setBillingForm;
    const currentForm = type === 'shipping' ? shippingForm : billingForm;

    updateFn({ ...currentForm, pincode: pin });

    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const stateName = data[0].PostOffice[0].State;
          const cityName = data[0].PostOffice[0].District;
          updateFn(prev => ({ ...prev, state: stateName, city: cityName, pincode: pin }));
        }
      } catch (e) { console.error("Pin lookup failed"); }
    }
  };

  const isAddressSaved = (currentAddr: any) => {
    return savedAddresses.some(addr => 
      addr.street.toLowerCase() === currentAddr.street.toLowerCase() &&
      addr.pincode === currentAddr.pincode
    );
  };

  const initiatePayment = () => {
    if (
      !shippingForm.name || 
      !shippingForm.phone || 
      !shippingForm.street || 
      !shippingForm.pincode ||
      !shippingForm.city ||   
      !shippingForm.state     
    ) {
        alert("Please fill in all shipping details (City and State are required)");
        return;
    }

    if (savedAddresses.length > 0 && !isAddressSaved(shippingForm)) {
      setShowSaveModal(true); 
    } else {
      processPayment(true); 
    }
  };

  const processPayment = async (saveToProfile: boolean) => {
    setShowSaveModal(false);
    setLoading(true);

    const generatedEmail = `guest_${shippingForm.phone.replace(/\D/g, '')}@ferixo.com`;
    const finalBilling = sameAsShipping ? shippingForm : billingForm;

    try {
        // Create Order
        const res = await fetch("/api/checkout/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: generatedEmail,
                name: shippingForm.name,
                phone: shippingForm.phone,
                shippingAddress: { ...shippingForm, country: "India", type: "SHIPPING" },
                billingAddress: { ...finalBilling, country: "India", type: "BILLING" },
                cartItems: cart,
                couponCode: coupon?.code, 
                saveToProfile: saveToProfile 
            })
        });

        const data = await res.json();

        if(!res.ok) {
            alert("Order failed: " + (data.error || "Unknown error"));
            setLoading(false);
            return;
        }

        // Open Razorpay
        const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            name: "Ferixo Store",
            description: "Premium Purchase",
            order_id: data.razorpayOrderId,
            handler: async function (response: any) {
                router.push("/success");
            },
            prefill: {
                name: shippingForm.name,
                contact: shippingForm.phone,
                email: generatedEmail,
            },
            theme: { color: "#0A1A2F" }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
    } catch (error) {
        console.error("Payment Error", error);
        alert("Payment initialization failed");
    } finally {
        setLoading(false);
    }
  };

  // Tax calculation for display
  const taxAmount = cartTotal.subtotal - (cartTotal.subtotal / 1.18);

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white pt-32 pb-20 px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT COLUMN: FORMS --- */}
        <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Contact Info */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-xs w-6 h-6 rounded-full flex items-center justify-center">1</span>
                    Contact Details
                </h2>
                <div className="space-y-4">
                    <input 
                        placeholder="Full Name" 
                        className="w-full bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                        value={shippingForm.name} 
                        onChange={e => setShippingForm({...shippingForm, name: e.target.value})}
                    />
                    <div className="flex bg-[#133159] border border-white/10 rounded overflow-hidden">
                        <span className="p-4 bg-white/5 text-[#C9D1D9] border-r border-white/10 select-none">
                            +91
                        </span>
                        <input 
                            placeholder="Phone Number" 
                            className="flex-1 bg-transparent p-4 focus:outline-none"
                            value={shippingForm.phone} 
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setShippingForm({...shippingForm, phone: val});
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-xs w-6 h-6 rounded-full flex items-center justify-center">2</span>
                    Shipping Address
                </h2>
                <div className="space-y-4">
                    <input 
                        placeholder="Street Address / Flat No." 
                        className="w-full bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                        value={shippingForm.street} 
                        onChange={e => setShippingForm({...shippingForm, street: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            placeholder="Pincode" 
                            className="bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                            value={shippingForm.pincode} 
                            onChange={e => handlePincodeChange(e.target.value, 'shipping')}
                        />
                        <input 
                            placeholder="State" 
                            className="bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                            value={shippingForm.state} 
                            onChange={e => setShippingForm({...shippingForm, state: e.target.value})}
                        />
                    </div>
                    <input 
                        placeholder="City" 
                        className="w-full bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                        value={shippingForm.city} 
                        onChange={e => setShippingForm({...shippingForm, city: e.target.value})}
                    />
                </div>
            </div>

            {/* 3. Billing Address */}
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-xs w-6 h-6 rounded-full flex items-center justify-center">3</span>
                    Billing Address
                </h2>
                
                <label 
                    className="flex items-center gap-3 cursor-pointer mb-6 select-none"
                    onClick={() => setSameAsShipping(!sameAsShipping)}
                >
                    {sameAsShipping ? (
                        <CheckSquare className="text-blue-400" />
                    ) : (
                        <Square className="text-white/20" />
                    )}
                    <span className="text-[#C9D1D9]">Same as shipping address</span>
                </label>

                {!sameAsShipping && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <input 
                            placeholder="Street Address" 
                            className="w-full bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                            value={billingForm.street} 
                            onChange={e => setBillingForm({...billingForm, street: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Pincode" 
                                className="bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                                value={billingForm.pincode} 
                                onChange={e => handlePincodeChange(e.target.value, 'billing')}
                            />
                            <input 
                                placeholder="State" 
                                className="bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                                value={billingForm.state} 
                                onChange={e => setBillingForm({...billingForm, state: e.target.value})}
                            />
                        </div>
                        <input 
                            placeholder="City" 
                            className="w-full bg-[#133159] border border-white/10 p-4 rounded focus:outline-none focus:border-blue-400"
                            value={billingForm.city} 
                            onChange={e => setBillingForm({...billingForm, city: e.target.value})}
                        />
                    </div>
                )}
            </div>
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-5">
            <div className="bg-[#133159]/30 p-8 rounded-xl border border-white/10 sticky top-32">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                {/* 1. PRODUCT LIST (With Remove Button) */}
                <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item, idx) => {
                        const uniqueId = `${item.id}-${item.variant}-${item.size||''}`;
                        return (
                            <div key={`${uniqueId}-${idx}`} className="flex gap-4 items-center group">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-black/20 border border-white/5 flex-shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-white/20">IMG</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-white truncate">{item.name}</p>
                                    <p className="text-xs text-white/50">{item.variant} {item.size && `• ${item.size}`}</p>
                                    <p className="text-xs text-white/70 mt-1">Qty: {item.quantity}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-sm font-mono text-white">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(uniqueId)}
                                        className="text-white/20 hover:text-red-400 transition-colors p-1"
                                        title="Remove Item"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3 mb-6">
                    <div className="flex justify-between text-[#C9D1D9]">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.subtotal.toLocaleString()}</span>
                    </div>
                    
                    {/* GST Display */}
                    {shippingForm.state.toLowerCase() === "punjab" ? (
                        <>
                            <div className="flex justify-between text-sm text-white/40">
                                <span>CGST (9% Included)</span>
                                <span>₹{(taxAmount/2).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-white/40">
                                <span>SGST (9% Included)</span>
                                <span>₹{(taxAmount/2).toFixed(2)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-between text-sm text-white/40">
                            <span>IGST (18% Included)</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-[#C9D1D9]">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    {/* Discount Display */}
                    {coupon && (
                         <div className="flex justify-between text-green-400">
                             <span>Discount ({coupon.code})</span>
                             <span>-₹{cartTotal.discount.toLocaleString()}</span>
                         </div>
                    )}
                </div>

                {/* 2. COUPON SECTION (Input or Active State) */}
                <div className="mb-6 pt-4 border-t border-white/10">
                    {coupon ? (
                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-green-400">
                                <Tag size={16} />
                                <span className="font-mono font-bold text-sm">{coupon.code}</span>
                                <span className="text-xs text-green-400/60">Applied</span>
                            </div>
                            <button 
                                onClick={() => { removeCoupon(); setCouponMsg(null); }}
                                className="text-xs text-white/40 hover:text-white underline"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div>
                             <div className="flex gap-2">
                                <input 
                                    placeholder="Coupon Code" 
                                    className="flex-1 bg-transparent border border-white/20 p-2 rounded text-sm text-white focus:border-blue-400 outline-none uppercase"
                                    value={couponInput}
                                    onChange={e => setCouponInput(e.target.value)}
                                    disabled={couponLoading}
                                />
                                <button 
                                    onClick={handleApplyCoupon} 
                                    className="bg-white/10 px-4 rounded hover:bg-white/20 text-sm font-bold text-white transition-colors disabled:opacity-50"
                                    disabled={couponLoading || !couponInput.trim()}
                                >
                                    {couponLoading ? <Loader2 size={16} className="animate-spin"/> : "Apply"}
                                </button>
                            </div>
                            {couponMsg && (
                                <p className={`text-xs mt-2 ${couponMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {couponMsg.text}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-between text-2xl font-bold mb-8 pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span>₹{cartTotal.finalTotal.toFixed(0)}</span>
                </div>

                <button 
                    onClick={initiatePayment} 
                    disabled={loading || cart.length === 0}
                    className="w-full bg-blue-500 py-4 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>

                <p className="text-center text-[#C9D1D9]/40 text-xs mt-4">
                    Secure Payment via Razorpay
                </p>
            </div>
        </div>

      </div>
      
      {/* ADDRESS SAVE POPUP */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#133159] border border-white/10 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Save this Address?</h3>
            <p className="text-[#C9D1D9] mb-6">
              You are using a new shipping address. Would you like to save it to your profile for future orders?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => processPayment(false)}
                className="flex-1 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
              >
                No, Don't Save
              </button>
              <button 
                onClick={() => processPayment(true)}
                className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
              >
                Yes, Save It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}