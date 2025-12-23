"use client";

import { useWishlist } from "@/components/providers/WishlistProvider";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag, Sparkles, ChevronRight, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WishlistPage() {
    const { wishlistItems = [] } = useWishlist() || {};
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-blue-50 border-t-blue-500 animate-spin"></div>
                    <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 animate-pulse" />
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Syncing Curation</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24">
            {/* 1. CINEMATIC HEADER */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                                <Sparkles className="w-4 h-4" />
                                Personalized Curation
                            </div>
                            <h1 className="text-4xl md:text-7xl font-serif font-bold text-gray-900 leading-tight">
                                Your <span className="italic text-blue-500">Wishlist</span>.
                            </h1>
                            <p className="mt-4 text-gray-500 text-sm md:text-lg max-w-lg leading-relaxed italic">
                                A curated selection of pieces you've discovered and saved from across our marketplace.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-3 animate-fade-in-up delay-100">
                             <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                {wishlistItems.length} Saved Essentials
                            </div>
                            <Link 
                                href="/dashboard" 
                                className="group flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Return to Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((item, index) => (
                            <div 
                                key={item._id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link
                                    href={`/items/${item._id}`}
                                    className="group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <ShoppingBag className="w-12 h-12" />
                                            </div>
                                        )}
                                        
                                        {/* Dynamic Price Tag */}
                                        <div className="absolute top-6 left-6">
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold shadow-xl border border-white text-blue-500">
                                                ${item.price?.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Heart Icon Overlay */}
                                        <div className="absolute bottom-6 right-6">
                                            <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg ring-4 ring-white shadow-blue-500/20">
                                                <Heart className="w-5 h-5 fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[8px] font-black bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">Verified Listing</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-xl font-serif mb-2 group-hover:text-blue-500 transition-colors truncate uppercase tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-8 line-clamp-2 italic leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 group/btn">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">Acquire Item</span>
                                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:rotate-45">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-fade-in-up">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                            <Heart className="w-10 h-10 text-blue-200" />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">No curation <span className="italic text-blue-300">yet</span>.</h2>
                        <p className="text-gray-500 mb-12 max-w-sm mx-auto leading-relaxed italic">
                            Your curation list is looking a bit empty. Explore the marketplace to find pieces that resonate with your style.
                        </p>
                        <Link
                            href="/dashboard"
                            className="group inline-flex items-center px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/10"
                        >
                            Browse Collections
                            <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
