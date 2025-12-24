"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ShieldCheck, Truck, CreditCard, ChevronRight, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { cartItems, loading, toggleCart } = useCart() || { cartItems: [] };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const delivery = cartItems.length > 0 ? 20 : 0;
    const discount = cartItems.length > 0 ? 10 : 0;
    const total = subtotal + delivery - discount;

    return (
        <div className="min-h-screen bg-white relative overflow-hidden pb-24 font-inter">
            {/* Background Blobs (Reference Style) */}
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-sky-200/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-pink-100/30 blur-[100px] rounded-full"></div>
            <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-yellow-100/20 blur-[80px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
                {/* Header & Breadcrumbs */}
                <div className="mb-12">
                     <h1 className="text-[40px] font-black text-gray-900 tracking-tighter mb-4">Shopping Cart</h1>
                     <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Link href="/" className="hover:text-sky-500 transition-colors">Homepage</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/items" className="hover:text-sky-500 transition-colors">Marketplace</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900">My Shopping Cart</span>
                     </nav>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] border border-white p-20 text-center flex flex-col items-center justify-center min-h-[500px] shadow-2xl shadow-sky-900/5 animate-fade-in-up">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl rotate-6">
                            <ShoppingBag className="w-10 h-10 text-sky-200" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">The bag is empty.</h2>
                        <p className="text-gray-400 mb-10 max-w-sm leading-relaxed font-medium">
                            Your curation list is looking a bit lonely. Discover unique items from our verified community sellers.
                        </p>
                        <Link
                            href="/dashboard"
                            className="group bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 transition-all shadow-xl shadow-sky-900/10 flex items-center gap-3"
                        >
                            Explore Marketplace
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* LEFT COLUMN: STEPS & ITEMS */}
                        <div className="flex-1 space-y-8">
                            {/* Step A: Verified Status */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl shadow-sky-900/5 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-black">a</div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</h3>
                                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">Verified Marketplace Access</p>
                                    </div>
                                </div>
                                <button className="text-[9px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600">Info</button>
                            </div>

                            {/* Step B: Cart Items */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white shadow-xl shadow-sky-900/5">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-black">b</div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cart Contents</h3>
                                </div>

                                <div className="space-y-10">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex flex-col md:flex-row items-center gap-8 group animate-fade-in-up">
                                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-sky-500/10 transition-all duration-500 border border-gray-100 flex-shrink-0">
                                                {item.images && item.images[0] ? (
                                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                        <ShoppingBag className="w-10 h-10" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-sky-500 transition-colors uppercase leading-tight font-serif italic truncate max-w-[300px]">
                                                            {item.title}
                                                        </h4>
                                                        <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                                                            <div className="flex items-center bg-gray-50 rounded-xl p-1 px-3 border border-gray-100">
                                                                <button className="p-1 hover:text-sky-500 transition-colors"><Minus className="w-3 h-3" /></button>
                                                                <span className="mx-3 text-xs font-black text-gray-900">01</span>
                                                                <button className="p-1 hover:text-sky-500 transition-colors"><Plus className="w-3 h-3" /></button>
                                                            </div>
                                                            <button 
                                                                onClick={() => toggleCart(item._id)}
                                                                className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="md:text-right">
                                                        <p className="text-2xl font-black text-gray-900 tracking-tight">${item.price?.toLocaleString()}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Per Unit</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 pt-12 border-t border-gray-50">
                                    <Link href="/dashboard" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SUMMARY */}
                        <div className="w-full lg:w-[400px] shrink-0 sticky top-32">
                            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-[0_40px_80px_-20px_rgba(0,102,255,0.1)]">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Your Order</h3>
                                    <ShoppingBag className="w-5 h-5 text-sky-500" />
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                        <span className="text-sm font-black text-gray-900">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Delivery</span>
                                        <span className="text-sm font-black text-gray-900">${delivery.toLocaleString()} <span className="text-[9px] text-sky-500 ml-1">Express</span></span>
                                    </div>
                                    <div className="flex justify-between items-center pb-8">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Discount</span>
                                        <span className="text-sm font-black text-rose-500">-${discount.toLocaleString()}</span>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">Total</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-sky-500 tracking-tighter">${total.toLocaleString()}</span>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">USD (INC. TAXES)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <Link
                                            key={item._id}
                                            href={`/checkout/${item._id}`}
                                            className="group relative flex items-center justify-between w-full p-5 bg-gray-950 hover:bg-sky-500 text-white rounded-3xl transition-all duration-500 overflow-hidden shadow-2xl shadow-sky-900/10 active:scale-95"
                                        >
                                            <div className="relative z-10">
                                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50">Purchase Item</p>
                                                <p className="text-[11px] font-black uppercase tracking-widest truncate max-w-[150px]">{item.title}</p>
                                            </div>
                                            <div className="relative z-10 flex items-center gap-3">
                                                <span className="text-lg font-black tracking-tighter">${item.price}</span>
                                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-10 flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    Security Guaranteed by ReGoods
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
