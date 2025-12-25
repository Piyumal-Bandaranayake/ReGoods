"use client";

import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { Heart, ShoppingBag, ChevronRight, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
    const { wishlistItems = [], toggleWishlist } = useWishlist() || {};
    const { toggleCart, cartItems = [] } = useCart() || {};
    const { status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin"></div>
            </div>
        );
    }

    // Helper function to check if item is in cart
    const isItemInCart = (itemId) => {
        return cartItems.some(cartItem => cartItem._id === itemId);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24 font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                {/* Simplified Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Wishlist</h1>
                        <p className="text-sm text-gray-400 font-medium">You have {wishlistItems.length} items saved in your collection.</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm">Start adding items you love to your collection!</p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-500 transition-all shadow-lg shadow-sky-900/10"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {wishlistItems.map((item) => {
                            const inCart = isItemInCart(item._id);

                            return (
                                <div
                                    key={item._id}
                                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-sky-900/5 transition-all duration-300"
                                >
                                    {/* Image Area */}
                                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <ShoppingBag className="w-10 h-10" />
                                            </div>
                                        )}

                                        {/* Quick Actions */}
                                        <button
                                            onClick={() => toggleWishlist(item._id)}
                                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl text-rose-500 shadow-sm hover:bg-rose-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-sky-500 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.category}</p>
                                            </div>
                                            <p className="font-black text-gray-900 text-sm">${item.price?.toLocaleString()}</p>
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => {
                                                    if (!inCart) {
                                                        toggleCart(item._id);
                                                        toggleWishlist(item._id);
                                                    }
                                                }}
                                                disabled={inCart}
                                                className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 active:scale-95 ${inCart
                                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                                                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                                                    }`}
                                            >
                                                <ShoppingCart className="w-3 h-3" />
                                                {inCart ? 'Already in Cart' : 'Add to Cart'}
                                            </button>
                                            <Link
                                                href={`/items/${item._id}`}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
}
