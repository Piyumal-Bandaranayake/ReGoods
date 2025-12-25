"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ShieldCheck, Truck, CreditCard, ChevronRight, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { cartItems, loading, toggleCart } = useCart() || { cartItems: [] };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const delivery = 0;
    const discount = 0;
    const total = subtotal + delivery - discount;

    return (
        <div className="min-h-screen bg-gray-50/50 font-inter pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Your Cart</h1>
                    <p className="text-sm text-gray-400 font-medium">You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart.</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center flex flex-col items-center justify-center shadow-sm">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mb-6" />
                        <h2 className="text-2xl font-serif font-medium text-gray-900 mb-4">Your cart is empty</h2>
                        <Link
                            href="/items"
                            className="bg-blue-900 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-900/20"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* LEFT COLUMN: ITEMS */}
                        <div className="lg:col-span-8">
                            <div className="border-t border-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="group border-b border-gray-200 py-3 flex flex-col md:flex-row items-center gap-3 md:gap-4">

                                        {/* Remove X Button */}
                                        <button
                                            onClick={() => toggleCart(item._id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                            title="Remove Item"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        {/* Image */}
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                            {item.images && item.images[0] ? (
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 w-full md:w-auto text-center md:text-left">
                                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Single Item</p>
                                        </div>

                                        {/* Price & Options */}
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                                            <div className="flex flex-col items-end">
                                                <span className="font-serif font-bold text-sm text-gray-900">${item.price?.toFixed(2)}</span>
                                                {item.hasAcceptedOffer && (
                                                    <span className="text-[8px] text-sky-600 font-bold uppercase tracking-tighter bg-sky-50 px-1 rounded">Offer Accepted</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Qty */}
                                        <div className="flex items-center border border-gray-100 bg-gray-50/50 rounded-lg px-0.5">
                                            <button className="px-1.5 py-0.5 text-gray-400 hover:text-black transition-colors" disabled>-</button>
                                            <span className="px-1.5 text-[11px] font-bold text-gray-900">1</span>
                                            <button className="px-1.5 py-0.5 text-gray-400 hover:text-black transition-colors" disabled>+</button>
                                        </div>

                                        {/* Total */}
                                        <div className="text-sm font-serif font-bold text-gray-900 min-w-[70px] text-right">
                                            ${item.price?.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>

                        {/* RIGHT COLUMN: SUMMARY */}
                        <div className="lg:col-span-4 sticky top-12">
                            <h3 className="text-xl font-serif font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">Cart Totals</h3>

                            <div className="space-y-4 text-sm text-gray-600 mb-8 font-light">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">Free</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span>Tax (Est.)</span>
                                    <span className="font-medium text-gray-900">$0</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span>Subtotal</span>
                                    <span className="font-serif font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 pt-6">
                                    <span className="text-lg font-medium text-gray-900">Total</span>
                                    <span className="text-2xl font-serif font-bold text-gray-900">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Link
                                    href={cartItems.length > 0 ? `/checkout/${cartItems[0]._id}` : "#"}
                                    className="block w-full bg-blue-900 text-white text-center py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-900/20 rounded-full"
                                >
                                    Proceed to Checkout
                                </Link>

                                <div className="text-center">
                                    <Link href="/items" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-blue-900 transition-colors">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
