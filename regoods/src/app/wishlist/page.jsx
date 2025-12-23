"use client";

import { useWishlist } from "@/components/providers/WishlistProvider";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WishlistPage() {
    const { wishlistItems = [] } = useWishlist() || {};
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900">Your Wishlist</h1>
                        <p className="mt-2 text-gray-500">Items you've saved for later</p>
                    </div>
                    <span className="bg-gray-100 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                        {wishlistItems.length} Saved
                    </span>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((item) => (
                            <Link
                                key={item._id}
                                href={`/items/${item._id}`}
                                className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
                            >
                                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                    {item.images && item.images[0] ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Heart className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                            ${item.price?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 truncate mb-1 text-lg font-serif">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">View Details</span>
                                        <div className="p-2 bg-gray-50 rounded-full group-hover:bg-blue-900 group-hover:text-white transition">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start exploring our unique collection and save your favorites here.</p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-8 py-3 bg-blue-900 text-white rounded-full font-bold text-sm tracking-wide hover:bg-black transition shadow-lg shadow-blue-900/20"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
