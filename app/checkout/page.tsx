"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useStore();
  const router = useRouter();

  // Form State
  const [form, setForm] = useState({
    email: "",
    name: "",
    street: "",
    city: "",
    state: "", // Will determine Tax Type
    pincode: "",
  });
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + taxAmount + shipping - discount;

  // AUTO-DETECT STATE FROM PINCODE
  // (Simple lookup for demo, can be replaced with API)
  const handlePincodeChange = async (pin: string) => {
     setForm({...form, pincode: pin});
     if(pin.length === 6) {
        // Fetch from a free API like api.postalpincode.in
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await res.json();
            if(data[0].Status === "Success") {
                const stateName = data[0].PostOffice[0].State;
                const cityName = data[0].PostOffice[0].District;
                setForm(prev => ({ ...prev, state: stateName, city: cityName, pincode: pin }));
            }
        } catch(e) { console.error("Pin lookup failed"); }
     }
  };

  const verifyCoupon = async () => {
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

  const handlePayment = async () => {
    setLoading(true);

    // 1. Create Order on Server
    const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        body: JSON.stringify({
            email: form.email,
            name: form.name,
            shippingAddress: {
                street: form.street,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                country: "India"
            },
            cartItems: cart,
            couponCode
        })
    });

    const data = await res.json();

    if(!res.ok) {
        alert("Order failed");
        setLoading(false);
        return;
    }

    // 2. Open Razorpay
    const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Ferixo Store",
        description: "Premium Purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
            alert("Payment Successful! Order ID: " + response.razorpay_payment_id);
            // Here you would call another API to update Order Status to 'PAID'
            router.push("/success");
        },
        prefill: {
            name: form.name,
            email: form.email,
        },
        theme: {
            color: "#0A1A2F"
        }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white pt-32 px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: FORM */}
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
            
            <input 
              placeholder="Email (Account will be auto-created)" 
              className="w-full bg-[#133159] border border-white/10 p-4 rounded"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            />
            <input 
              placeholder="Full Name" 
              className="w-full bg-[#133159] border border-white/10 p-4 rounded"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Pincode" 
                  className="bg-[#133159] border border-white/10 p-4 rounded"
                  value={form.pincode} onChange={e => handlePincodeChange(e.target.value)}
                />
                <input 
                  placeholder="State" 
                  className="bg-[#133159] border border-white/10 p-4 rounded"
                  value={form.state} readOnly // Auto-filled
                />
            </div>
            <input 
                  placeholder="City" 
                  className="w-full bg-[#133159] border border-white/10 p-4 rounded"
                  value={form.city} readOnly
            />
            <input 
              placeholder="Street Address" 
              className="w-full bg-[#133159] border border-white/10 p-4 rounded"
              value={form.street} onChange={e => setForm({...form, street: e.target.value})}
            />
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-[#133159]/30 p-8 rounded-xl border border-white/10 h-fit">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-3 mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>
                
                {/* GST DISPLAY */}
                {form.state.toLowerCase() === "punjab" ? (
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

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
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
                   className="flex-1 bg-transparent border border-white/20 p-2 rounded"
                   value={couponCode}
                   onChange={e => setCouponCode(e.target.value)}
                />
                <button onClick={verifyCoupon} className="bg-white/10 px-4 rounded hover:bg-white/20">Apply</button>
            </div>

            <div className="flex justify-between text-2xl font-bold mb-8">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
            </div>

            <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-500 py-4 rounded font-bold hover:bg-blue-600 transition-colors"
            >
                {loading ? "Processing..." : "Pay Now with Razorpay"}
            </button>
        </div>

      </div>
    </div>
  );
}