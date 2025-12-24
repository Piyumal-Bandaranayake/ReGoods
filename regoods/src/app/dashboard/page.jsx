import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import Link from "next/link";
import { PlusCircle, ShoppingBag, Filter, ArrowRight, MapPin, Star } from "lucide-react";



async function getItems(filters = {}) {
    await dbConnect();
    const query = { status: { $in: ["Active", "Sold"] } };

    if (filters.category && filters.category !== "All") {
        query.category = { $regex: new RegExp(`^${filters.category}$`, "i") };
    }

    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } }
        ];
    }

    // Fetch active items, sorted by newest first
    const items = await Item.find(query)
        .sort({ createdAt: -1 })
        .populate("sellerId", "name averageRating reviewCount"); // Get seller details

    // Serialize Mongoose documents to plain objects to avoid serialization issues in Next.js
    return JSON.parse(JSON.stringify(items));
}

const CATEGORIES = ["All", "Clothing", "Electronics", "Home", "Books", "Sports", "Other"];

export default async function DashboardPage({ searchParams }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    const resolvedParams = await searchParams;
    const currentCategory = resolvedParams?.category || "All";
    const search = resolvedParams?.search;

    const items = await getItems({ category: currentCategory === "All" ? undefined : currentCategory, search });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero / Header Section */}
            <div className="relative bg-gray-900 border-b border-gray-800">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop"
                        alt="Marketplace Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto pt-36 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center text-center gap-6">
                        <div className="w-full max-w-2xl flex flex-col items-center">
                            <h1 className="text-4xl md:text-6xl font-serif font-medium text-white tracking-tight drop-shadow-sm">
                                {search ? `Results for "${search}"` : "The Marketplace"}
                            </h1>
                            <p className="mt-4 text-gray-200 font-light text-lg max-w-xl drop-shadow-sm">
                                Discover unique items, connect with sellers, and find your next treasure in our community-driven market.
                            </p>
                        </div>
                    </div>

                    {/* Category Filter Bar */}
                    {!search && (
                        <div className="flex items-center justify-center space-x-2 overflow-x-auto mt-12 pb-2 scrollbar-hide">
                            <Filter className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat}
                                    href={cat === "All" ? "/dashboard" : `/dashboard?category=${cat}`}
                                    className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ${currentCategory === cat
                                        ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-serif text-gray-900 mb-3">No items found</h3>
                        <p className="text-gray-500 mb-8 max-w-md">
                            We couldn't find any items matching your criteria. Be the first to list something in this category!
                        </p>
                        <Link
                            href="/items/create"
                            className="inline-flex items-center px-8 py-3 bg-blue-900 text-white rounded-full font-bold hover:bg-black transition shadow-lg shadow-blue-900/20"
                        >
                            Start Selling Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {items.map((item) => (
                            <Link
                                key={item._id}
                                href={`/items/${item._id}`}
                                className="group flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 mb-4 shadow-sm border border-gray-100">
                                    {item.status === "Sold" && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transform -rotate-6">
                                                Sold Out
                                            </span>
                                        </div>
                                    )}

                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${item.status === 'Sold' ? 'opacity-75' : 'group-hover:scale-110'
                                                }`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingBag className="h-12 w-12 opacity-30" />
                                        </div>
                                    )}

                                    {/* Location Badge - Creative & Organized */}
                                    {item.location && (
                                        <div className="absolute top-3 left-3 z-20">
                                            <div className="bg-white/90 backdrop-blur-md border border-white/50 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105">
                                                <MapPin className="w-3 h-3 text-blue-900" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900 line-clamp-1 max-w-[100px]">
                                                    {item.location}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Info Overlay (optional, shows on hover) */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end">
                                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm">
                                            <ArrowRight className="w-4 h-4 text-black" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-1 px-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-medium text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="font-serif font-bold text-lg text-gray-900 ml-2">
                                            ${item.price}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 font-light">
                                        <p>by <span className="text-gray-700 font-medium">{item.sellerId?.name || "Seller"}</span></p>
                                        {item.sellerId?.reviewCount > 0 && (
                                            <div className="flex items-center text-yellow-500 font-bold text-xs">
                                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                                {item.sellerId.averageRating}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
