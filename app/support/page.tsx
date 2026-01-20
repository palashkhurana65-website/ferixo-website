"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/Motion";
import { Mail, Phone, ChevronDown, Send } from "lucide-react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 1. ADD STATE FOR FORM FIELDS
  const [formData, setFormData] = useState({
    name: "",
    orderId: "",
    email: "",
    message: ""
  });

  const faqs = [
    { q: "How do I track my order?", a: "Once shipped, you will receive an SMS and Email with a live tracking link via our logistics partner." },
    { q: "What is the warranty period?", a: "All Ferixo products come with a standard 1-year warranty against manufacturing defects." },
    { q: "Can I cancel my order?", a: "You can cancel your order within 4 hours of placing it directly from your dashboard." },
    { q: "Do you ship internationally?", a: "Currently, we operate exclusively in India. Global shipping is coming soon." },
  ];

  // 2. HANDLER FUNCTION
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the email body
    const subject = `Support Request: ${formData.orderId || "General Inquiry"}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AOrder ID: ${formData.orderId}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    
    // Redirect to Email Client
    window.location.href = `mailto:info@ferixo.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT: INFO & FAQ */}
        <FadeIn>
           <h1 className="text-4xl font-bold mb-6">We're here to help.</h1>
           <p className="text-[#C9D1D9] mb-12">
             Have a query about your order or a product? Our team typically responds within 2 hours.
           </p>

           <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 p-4 bg-[#133159]/30 rounded-xl border border-white/5">
                 <Mail className="text-blue-400" />
                 <div>
                    <p className="text-xs text-white/50 uppercase font-bold">Email Us</p>
                    <p className="font-mono">info@ferixo.com</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#133159]/30 rounded-xl border border-white/5">
                 <Phone className="text-blue-400" />
                 <div>
                    <p className="text-xs text-white/50 uppercase font-bold">Call Us</p>
                    <p className="font-mono">+91 988 855 5860</p>
                 </div>
              </div>
           </div>

           <h3 className="text-xl font-bold mb-6">Frequently Asked</h3>
           <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-[#133159]/20">
                   <button 
                     onClick={() => setOpenFaq(openFaq === i ? null : i)}
                     className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-white/5 transition-colors"
                   >
                     {faq.q}
                     <ChevronDown size={16} className={`transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                   </button>
                   <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 p-4 pt-0 text-[#C9D1D9] text-sm" : "max-h-0"}`}>
                      {faq.a}
                   </div>
                </div>
              ))}
           </div>
        </FadeIn>

        {/* RIGHT: CONTACT FORM */}
        <FadeIn delay={0.2} className="bg-[#133159] p-8 md:p-10 rounded-2xl border border-white/10 h-fit sticky top-32">
           <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
           
           {/* FORM CONNECTED TO HANDLER */}
           <form className="space-y-4" onSubmit={handleSendMessage}>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Name</label>
                    <input 
                      required
                      className="w-full bg-[#0A1A2F] border border-white/10 p-3 rounded focus:border-blue-400 focus:outline-none" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Order ID</label>
                    <input 
                      className="w-full bg-[#0A1A2F] border border-white/10 p-3 rounded focus:border-blue-400 focus:outline-none" 
                      placeholder="#FER-1234" 
                      value={formData.orderId}
                      onChange={e => setFormData({...formData, orderId: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-white/50 uppercase">Email</label>
                 <input 
                   required
                   type="email"
                   className="w-full bg-[#0A1A2F] border border-white/10 p-3 rounded focus:border-blue-400 focus:outline-none" 
                   placeholder="john@example.com" 
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-white/50 uppercase">Message</label>
                 <textarea 
                   required
                   rows={5} 
                   className="w-full bg-[#0A1A2F] border border-white/10 p-3 rounded focus:border-blue-400 focus:outline-none" 
                   placeholder="Describe your issue..." 
                   value={formData.message}
                   onChange={e => setFormData({...formData, message: e.target.value})}
                 />
              </div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all">
                 <Send size={18} /> Send Message
              </button>
           </form>
        </FadeIn>

      </div>
    </div>
  );
}