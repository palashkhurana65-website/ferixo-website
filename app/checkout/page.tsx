"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckSquare, Square } from "lucide-react";


export default function CheckoutPage() {
  const { cart } = useStore();
  const router = useRouter();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [pendingPayment, setPendingPayment] = useState(false); // To verify address before paying

  // --- 1. STATE MANAGEMENT ---
  
  // Shipping Form
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "", // Determines Tax
    pincode: "",
  });

  // Fetch existing addresses to compare against
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Assuming you have an endpoint or using the user session to get addresses. 
        // If not, this serves as a placeholder for where that logic goes.
        // For now, we will assume empty if we can't fetch.
        // const res = await fetch("/api/user/addresses"); 
        // const data = await res.json();
        // setSavedAddresses(data);
      } catch (e) {
        console.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, []);

  // Billing Form
  const [billingForm, setBillingForm] = useState({
    name: "", // Usually same as shipping name, but kept flexible
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);


  // --- 2. CALCULATIONS ---
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Tax logic depends on SHIPPING STATE
  const taxRate = 0.18; 
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 5000 ? 0 : 99; // Adjusted threshold example
  const total = subtotal + taxAmount + shippingCost - discount;

  // --- 3. HELPERS ---

  // Auto-fill state/city from Pincode
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

  const verifyCoupon = async () => {
    // Keeping existing coupon logic
    const res = await fetch("/api/coupons/verify", {
        method: "POST",
        body: JSON.stringify({ code: couponCode }),
    });
    const data = await res.json();
    if(res.ok) {
        const discVal = (subtotal * data.discount) / 100;
        setDiscount(data.maxAmount ? Math.min(discVal, data.maxAmount) : discVal);
        alert("Coupon Applied!");
    } else {
        alert(data.error);
    }
  };

  // 1. Helper to check if address exists
  const isAddressSaved = (currentAddr: any) => {
    return savedAddresses.some(addr => 
      addr.street.toLowerCase() === currentAddr.street.toLowerCase() &&
      addr.pincode === currentAddr.pincode
    );
  };

  // 2. The new Trigger function
  const initiatePayment = () => {
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.street || !shippingForm.pincode) {
        alert("Please fill in all shipping details");
        return;
    }

    // Check if address is new (and user has saved addresses previously)
    if (savedAddresses.length > 0 && !isAddressSaved(shippingForm)) {
      setShowSaveModal(true); // Open Popup
    } else {
      processPayment(true); // Default to save/ignore if already saved
    }
  };

  // 3. The Execution function
  const processPayment = async (saveToProfile: boolean) => {
    setShowSaveModal(false);
    setLoading(true);

    const generatedEmail = `guest_${shippingForm.phone.replace(/\D/g, '')}@ferixo.com`;
    const finalBilling = sameAsShipping ? shippingForm : billingForm;

    // Create Order
    const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        body: JSON.stringify({
            email: generatedEmail,
            name: shippingForm.name,
            phone: shippingForm.phone,
            shippingAddress: { ...shippingForm, country: "India", type: "SHIPPING" },
            billingAddress: { ...finalBilling, country: "India", type: "BILLING" },
            cartItems: cart,
            couponCode,
            saveToProfile: saveToProfile // <--- SEND FLAG
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
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white pt-32 pb-20 px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT COLUMN: FORMS (Shipping & Billing) --- */}
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
                            className="bg-[#133159]/50 border border-white/10 p-4 rounded text-white/50 cursor-not-allowed"
                            value={shippingForm.state} 
                            readOnly 
                        />
                    </div>
                    <input 
                        placeholder="City" 
                        className="w-full bg-[#133159]/50 border border-white/10 p-4 rounded text-white/50 cursor-not-allowed"
                        value={shippingForm.city} 
                        readOnly
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
                                className="bg-[#133159]/50 border border-white/10 p-4 rounded text-white/50"
                                value={billingForm.state} 
                                readOnly 
                            />
                        </div>
                        <input 
                            placeholder="City" 
                            className="w-full bg-[#133159]/50 border border-white/10 p-4 rounded text-white/50"
                            value={billingForm.city} 
                            readOnly
                        />
                    </div>
                )}
            </div>
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-5">
            <div className="bg-[#133159]/30 p-8 rounded-xl border border-white/10 sticky top-32">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                {/* Product List */}
                <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-black/20 border border-white/5 flex-shrink-0">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-white/20">IMG</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-white truncate">{item.name}</p>
                                <p className="text-xs text-white/50">{item.variant}</p>
                                <p className="text-xs text-white/70 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-mono text-white">
                                ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3 mb-6">
                    <div className="flex justify-between text-[#C9D1D9]">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {/* GST Logic based on Shipping State */}
                    {shippingForm.state.toLowerCase() === "punjab" ? (
                        <>
                            <div className="flex justify-between text-sm text-white/60">
                                <span>CGST (9%)</span>
                                <span>₹{(taxAmount/2).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-white/60">
                                <span>SGST (9%)</span>
                                <span>₹{(taxAmount/2).toFixed(2)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-between text-sm text-white/60">
                            <span>IGST (18%)</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-[#C9D1D9]">
                        <span>Shipping</span>
                        <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                            <span>Discount</span>
                            <span>-₹{discount}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mb-6">
                    <input 
                    placeholder="Coupon Code" 
                    className="flex-1 bg-transparent border border-white/20 p-2 rounded text-sm"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    />
                    <button onClick={verifyCoupon} className="bg-white/10 px-4 rounded hover:bg-white/20 text-sm font-bold">Apply</button>
                </div>

                <div className="flex justify-between text-2xl font-bold mb-8 pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                </div>

                <button 
    onClick={initiatePayment} 
    disabled={loading}
    className="w-full bg-blue-500 py-4 rounded-lg font-bold..."
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