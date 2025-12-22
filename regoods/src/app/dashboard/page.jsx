import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import Link from "next/link";
import { PlusCircle, ShoppingBag } from "lucide-react";

async function getItems(filters = {}) {
    await dbConnect();
    const query = { status: { $in: ["Active", "Sold"] } };

    if (filters.category) {
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
        .populate("sellerId", "name"); // Get seller name

    // Serialize Mongoose documents to plain objects to avoid serialization issues in Next.js
    return JSON.parse(JSON.stringify(items));
}

export default async function DashboardPage({ searchParams }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    const resolvedParams = await searchParams;
    const category = resolvedParams?.category;
    const search = resolvedParams?.search;

    const items = await getItems({ category, search });

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
                            {category ? category : (search ? `Results for "${search}"` : "Marketplace")}
                        </h1>
                        <p className="mt-4 text-gray-500 font-light text-lg">
                            {category
                                ? `Curated selection of ${category.toLowerCase()}`
                                : (search ? `Matches found for your search` : "Discover unique pre-loved treasures")}
                        </p>
                    </div>
                </div>

                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6 border border-gray-100">
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            We couldn't find matches for this category. Why not be the first to list something?
                        </p>
                        <Link
                            href="/items/create"
                            className="inline-flex items-center px-8 py-3 border border-transparent shadow-lg text-sm font-bold rounded-full text-white bg-black hover:scale-105 transition-transform"
                        >
                            <PlusCircle className="-ml-1 mr-2 h-4 w-4" />
                            START SELLING
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {items.map((item) => (
                            <Link
                                key={item._id}
                                href={`/items/${item._id}`}
                                className="group block cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-4">
                                    {item.status === "Sold" && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 bg-red-600 rounded-full bg-opacity-90 shadow-lg z-10 pointer-events-none">
                                            <span className="text-white text-xs font-bold uppercase tracking-widest text-center rotate-[-15deg]">Sold</span>
                                        </div>
                                    )}
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${item.status === 'Sold' ? 'grayscale opacity-75' : 'group-hover:scale-105'}`}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <ShoppingBag className="h-10 w-10 opacity-50" />
                                        </div>
                                    )}
                                    {/* Overlay Gradient on Hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-gray-900 truncate pr-4">
                                        {item.title}
                                    </h3>

                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-medium text-gray-500">
                                            ${item.price}
                                        </p>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                                            via {item.sellerId?.name || "Seller"}
                                        </p>
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
