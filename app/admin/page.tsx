"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/Motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Ticket, 
  Plus, 
  Trash2, 
  Calendar,
  DollarSign,
  Search
} from "lucide-react";

export default function AdminDashboard() {
  // --- STATE ---
  const [coupons, setCoupons] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]); // This would fetch from /api/orders
  const [loading, setLoading] = useState(true);

  // Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    startDate: "",
    endDate: ""
  });

  // --- DATA FETCHING ---
  // --- DATA FETCHING (UPDATED) ---
  const fetchData = async () => {
    try {
      const [couponRes, salesRes] = await Promise.all([
        fetch("/api/coupons"),
        fetch("/api/orders"), // <--- NOW FETCHES REAL DB DATA
      ]);

      const cData = await couponRes.json();
      const sData = await salesRes.json();

      setCoupons(Array.isArray(cData) ? cData : []);
      
      // Safety check to ensure sData is an array before setting state
      if (Array.isArray(sData)) {
        setSalesData(sData);
      } else {
        console.error("Sales data is not an array:", sData);
        setSalesData([]); 
      }
      
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) return;

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      
      if (res.ok) {
        alert("Coupon Created!");
        setNewCoupon({ code: "", discount: "", startDate: "", endDate: "" });
        fetchData(); // Refresh list
      }
    } catch (err) {
      alert("Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  // --- CALCULATIONS ---
  const totalRevenue = salesData
    .filter(s => s.type === "SALE_IN")
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalRefunds = salesData
    .filter(s => s.type === "REFUND_OUT")
    .reduce((acc, curr) => acc + Math.abs(curr.total), 0);

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#C9D1D9] text-sm">Overview of sales performance and marketing.</p>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FadeIn delay={0.1} className="bg-[#133159] p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                 <TrendingUp size={24} />
              </div>
              <span className="text-[#C9D1D9] text-sm uppercase font-bold">Total Sales (In)</span>
           </div>
           <p className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
        </FadeIn>

        <FadeIn delay={0.2} className="bg-[#133159] p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                 <TrendingDown size={24} />
              </div>
              <span className="text-[#C9D1D9] text-sm uppercase font-bold">Refunds (Out)</span>
           </div>
           <p className="text-3xl font-bold text-white">₹{totalRefunds.toLocaleString()}</p>
        </FadeIn>

        <FadeIn delay={0.3} className="bg-[#133159] p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                 <Ticket size={24} />
              </div>
              <span className="text-[#C9D1D9] text-sm uppercase font-bold">Active Coupons</span>
           </div>
           <p className="text-3xl font-bold text-white">{coupons.filter(c => c.isActive).length}</p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. SALES LEDGER (In/Out Record) */}
        <FadeIn delay={0.4} className="bg-[#133159] p-6 rounded-2xl border border-white/5 h-full">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign size={20} className="text-green-400"/> Recent Transactions
            </h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0A1A2F] text-[#C9D1D9] uppercase text-xs">
                        <tr>
                            <th className="p-4 rounded-l-lg">Type</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 rounded-r-lg text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-white space-y-2">
                        {salesData.map((sale, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        sale.type === 'SALE_IN' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {sale.type === 'SALE_IN' ? 'CREDIT' : 'DEBIT'}
                                    </span>
                                </td>
                                <td className="p-4 font-medium">{sale.customer}</td>
                                <td className="p-4 text-[#C9D1D9]">{sale.date}</td>
                                <td className={`p-4 text-right font-mono ${
                                    sale.type === 'SALE_IN' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {sale.type === 'SALE_IN' ? '+' : ''}₹{Math.abs(sale.total).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {salesData.length === 0 && <p className="text-center text-white/30 py-8">No transactions found.</p>}
            </div>
        </FadeIn>

        {/* 3. COUPON MANAGER */}
        <FadeIn delay={0.5} className="bg-[#133159] p-6 rounded-2xl border border-white/5 h-full">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Ticket size={20} className="text-blue-400"/> Coupon Manager
            </h2>

            {/* Create Form */}
            <form onSubmit={handleCreateCoupon} className="bg-[#0A1A2F] p-4 rounded-xl border border-white/10 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] uppercase text-[#C9D1D9] font-bold block mb-1">Coupon Code</label>
                        <input 
                            type="text" 
                            placeholder="e.g. SUMMER25"
                            className="w-full bg-[#133159] border border-white/10 rounded-lg p-2 text-white text-sm outline-none uppercase"
                            value={newCoupon.code}
                            onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-[#C9D1D9] font-bold block mb-1">Discount (%)</label>
                        <input 
                            type="number" 
                            placeholder="10"
                            className="w-full bg-[#133159] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                            value={newCoupon.discount}
                            onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="text-[10px] uppercase text-[#C9D1D9] font-bold block mb-1">Start Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-[#133159] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                            value={newCoupon.startDate}
                            onChange={e => setNewCoupon({...newCoupon, startDate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-[#C9D1D9] font-bold block mb-1">End Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-[#133159] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                            value={newCoupon.endDate}
                            onChange={e => setNewCoupon({...newCoupon, endDate: e.target.value})}
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                    + Create Coupon
                </button>
            </form>

            {/* Coupons List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between p-3 bg-[#0A1A2F]/50 rounded-lg border border-white/5">
                        <div>
                            <p className="text-white font-bold font-mono tracking-wider">{coupon.code}</p>
                            <p className="text-xs text-[#C9D1D9]">{coupon.discount}% Off • Expires {new Date(coupon.endDate).toLocaleDateString()}</p>
                        </div>
                        <button 
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {coupons.length === 0 && <p className="text-center text-white/30 text-xs">No active coupons.</p>}
            </div>
        </FadeIn>

      </div>
    </div>
  );
}