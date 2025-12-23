"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ShieldCheck, Truck, CreditCard, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { cartItems, loading, toggleCart } = useCart() || { cartItems: [] };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24">
            {/* 1. MINIMAL HERO HEADER */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                                <ShoppingBag className="w-4 h-4" />
                                Your Shopping Bag
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-none">
                                Review <span className="italic text-blue-500">Cart</span>.
                            </h1>
                        </div>
                        <Link 
                            href="/dashboard" 
                            className="group flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to Collection
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center flex flex-col items-center justify-center min-h-[500px] shadow-sm animate-fade-in-up">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 rotate-6">
                            <ShoppingBag className="w-10 h-10 text-blue-200" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">The Bag is Empty</h2>
                        <p className="text-gray-500 mb-10 max-w-sm leading-relaxed">
                            Your curation list is looking a bit lonely. Discover unique items from our verified community sellers.
                        </p>
                        <Link
                            href="/dashboard"
                            className="group bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/10 flex items-center gap-3"
                        >
                            Explore Marketplace
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* 2. ITEM LIST SECTTION */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between px-4 mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cartItems.length} Handpicked Items</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing (USD)</span>
                            </div>
                            
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row items-center gap-8 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group animate-fade-in-up">
                                        {/* Image Container */}
                                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 group-hover:rotate-1 transition-transform duration-500">
                                            {item.images && item.images[0] ? (
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                    <ShoppingBag className="w-10 h-10" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors"></div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="flex-1 text-center sm:text-left min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1 pr-4">
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                                        <span className="text-[8px] font-black bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">Market Item</span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Available</span>
                                                    </div>
                                                    <Link href={`/items/${item._id}`} className="block text-xl md:text-2xl font-serif font-bold text-gray-900 hover:text-blue-500 transition-colors truncate">
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center justify-center sm:justify-start">
                                                        Seller: {item.sellerId?.name || "Premium Merchant"}
                                                    </p>
                                                </div>
                                                <div className="text-center sm:text-right shrink-0">
                                                    <p className="text-2xl font-serif font-bold text-gray-900">${item.price?.toLocaleString()}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Net Total</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-8">
                                                <Link
                                                    href={`/items/${item._id}`}
                                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-gray-900 transition-colors"
                                                >
                                                    View Listing
                                                </Link>
                                                <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                                                <button
                                                    onClick={() => toggleCart(item._id)}
                                                    className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. ORDER SUMMARY SECTION */}
                        <div className="lg:w-96 shrink-0">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 sticky top-24 shadow-xl shadow-gray-200/50">
                                <h2 className="text-xl font-bold font-serif text-gray-900 mb-8 flex items-center justify-between">
                                    Summary
                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Curation Subtotal</span>
                                        <span className="font-bold text-gray-900">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Estimated Logistics</span>
                                            <Truck className="w-3 h-3 text-gray-300" />
                                        </div>
                                        <span className="font-bold text-gray-500 text-[10px] uppercase tracking-tighter">At Checkout</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50 flex justify-between items-baseline">
                                        <span className="text-xl font-serif font-bold text-gray-900">Total Bill</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-serif font-bold text-blue-500">${subtotal.toLocaleString()}</span>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">USD (Taxes Included)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50 mb-6">
                                        <p className="text-[10px] text-blue-500 font-bold leading-relaxed flex gap-3">
                                            <CreditCard className="w-8 h-8 shrink-0" />
                                            Per-merchant checkout is active. You will finalize the payment for each item individually to ensure shipping accuracy.
                                        </p>
                                    </div>

                                    {cartItems.map(item => (
                                        <Link
                                            key={item._id}
                                            href={`/checkout/${item._id}`}
                                            className="group relative flex items-center justify-between w-full p-4 bg-gray-900 hover:bg-blue-500 text-white rounded-2xl transition-all duration-300 overflow-hidden shadow-xl shadow-blue-500/10"
                                        >
                                            <div className="relative z-10 flex flex-col items-start">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-1 group-hover:text-white/70">Individual Checkout</span>
                                                <span className="text-[10px] font-bold truncate max-w-[150px] uppercase tracking-wider">{item.title}</span>
                                            </div>
                                            <div className="relative z-10 font-serif font-bold text-lg group-hover:scale-110 transition-transform">
                                                ${item.price}
                                            </div>
                                            <div className="absolute top-0 right-0 h-full w-20 bg-white/10 skew-x-[-20deg] translate-x-10 group-hover:translate-x-4 transition-transform duration-500"></div>
                                        </Link>
                                    ))}

                                    <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Encrypted & Secure Transaction</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
