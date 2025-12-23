"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Your Cart</h1>
                    <Link href="/dashboard" className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Browse our marketplace to find great deals.</p>
                        <Link
                            href="/dashboard"
                            className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-black transition shadow-lg shadow-blue-900/20"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                <ul className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <li key={item._id} className="p-6 sm:flex sm:items-start group hover:bg-gray-50 transition">
                                            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                {item.images && item.images[0] ? (
                                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ShoppingBag className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col justify-between h-32">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            <Link href={`/items/${item._id}`} className="hover:text-indigo-600 transition">
                                                                {item.title}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-lg font-bold text-gray-900 font-serif">${item.price?.toLocaleString()}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.status}</p>
                                                </div>

                                                <div className="flex justify-between items-end mt-4">
                                                    <Link
                                                        href={`/items/${item._id}`}
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        View Details
                                                    </Link>

                                                    <button
                                                        onClick={() => toggleCart(item._id)}
                                                        className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-base text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-base text-gray-600">
                                        <span>Estimated Shipping</span>
                                        <span className="font-medium text-gray-900">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs text-gray-500 text-center mb-4">
                                        Checkout is currently processed per item due to marketplace structure.
                                    </p>
                                    {/* If we only have single item checkout, maybe just clear all or have multiple buttons? 
                                       For now I'll create a checkout button for each item or just a general button that warns or opens first item */}

                                    {cartItems.map(item => (
                                        <Link
                                            key={item._id}
                                            href={`/checkout/${item._id}`}
                                            className="block w-full py-3 bg-blue-900 text-white text-center font-bold text-sm uppercase tracking-widest rounded-full hover:bg-black transition mb-2 shadow-lg shadow-blue-900/20"
                                        >
                                            Checkout {item.title}
                                        </Link>
                                    ))}

                                </div>
                                <div className="mt-6 text-center">
                                    <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                        or Continue Shopping
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
