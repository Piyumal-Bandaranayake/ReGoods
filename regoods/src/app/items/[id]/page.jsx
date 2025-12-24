import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import User from "@/lib/models/User";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Heart,
    MessageCircle,
    ShoppingBag,
    ShoppingCart,
    MapPin,
    Package,
    ShieldCheck,
    Share2,
    Flag,
    CheckCircle,
    Star
} from "lucide-react";
import ReportUserButton from "@/components/account/ReportUserButton";
import ItemActions from "@/components/account/ItemActions";
import ItemImageGallery from "@/components/items/ItemImageGallery";
import { getUserInteractions } from "@/app/actions/user";
import { WishlistButton, AddToCartButton, BuyNowButton, NegotiateButton } from "@/components/items/ItemInteractionButtons";

async function getItem(id) {
    await dbConnect();
    const item = await Item.findById(id).populate("sellerId", "name email image role warningCount isBanned isVerified createdAt averageRating reviewCount");
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
}

export default async function ItemPage({ params }) {
    const { id } = await params;
    const item = await getItem(id);
    const session = await getServerSession(authOptions);

    if (!item) {
        return notFound();
    }

    const seller = item.sellerId;
    const isOwner = session?.user?.email === seller?.email;
    const isSold = item.status === "Sold";

    // Fetch user interactions (wishlist/cart status)
    const { wishlist, cart } = await getUserInteractions();
    const isWishlisted = wishlist.includes(item._id);
    const isInCart = cart.includes(item._id);

    return (
        <div className="min-h-screen bg-white">


            <main className="lg:flex min-h-screen">

                {/* LEFT: Image Section (White Background) */}
                <ItemImageGallery images={item.images} title={item.title} isSold={isSold} />

                {/* RIGHT: Details Section (White, Clean) */}
                <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center p-8 lg:p-24 relative">

                    <div className="max-w-xl mx-auto w-full">

                        {/* 1. Header: Seller Name */}
                        <div className="mb-4 flex items-center justify-between">
                            <Link href={`/profile/${seller?._id}`} className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition flex items-center gap-2">
                                {seller?.name || "Unknown Seller"}
                                {seller?.isVerified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                            </Link>

                            {/* Owner / Wishlist Controls (Top Right) */}
                            <div className="flex items-center gap-3">
                                {!isOwner && <WishlistButton itemId={item._id} initialIsWishlisted={isWishlisted} />}
                                {isOwner && (
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-gray-100 ${isSold ? 'text-red-500' : 'text-green-600'}`}>
                                        {isSold ? 'Sold' : 'Active'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 2. Title */}
                        <h1 className="text-4xl lg:text-6xl font-sans font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                            {item.title}
                        </h1>

                        {/* 3. Description */}
                        <div className="mb-10 text-gray-500 leading-relaxed font-medium text-sm max-w-md">
                            <p>{item.description}</p>
                        </div>

                        {/* 4. Price & Buy Action */}
                        {!isOwner && !isSold && (
                            <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-12">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        ${item.price.toLocaleString()}
                                    </h2>
                                    {item.negotiable && <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Negotiable</span>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <BuyNowButton itemId={item._id} />
                                </div>
                            </div>
                        )}

                        {isSold && (
                            <div className="mb-12 border-b border-gray-100 pb-12">
                                <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest cursor-not-allowed rounded-full">
                                    Item Sold
                                </button>
                            </div>
                        )}

                        {/* 5. Details List (Dimensions & Weight Style) */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Details & Specifications</h3>

                            <dl className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <dt className="text-gray-400 font-medium">Category</dt>
                                    <dd className="text-gray-900 font-bold">{item.category}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <dt className="text-gray-400 font-medium">Condition</dt>
                                    <dd className="text-gray-900 font-bold">{item.condition}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <dt className="text-gray-400 font-medium">Location</dt>
                                    <dd className="text-gray-900 font-bold truncate max-w-[200px]">{item.location || "Not Listed"}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <dt className="text-gray-400 font-medium">Delivery</dt>
                                    <dd className="text-gray-900 font-bold">{item.delivery || "Arranged by Seller"}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <dt className="text-gray-400 font-medium">Return Policy</dt>
                                    <dd className="text-gray-900 font-bold">{item.returnPolicy || "No Returns"}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* 6. Secondary Actions (Chat / Add to Cart / Report) */}
                        {!isOwner && !isSold && (
                            <div className="flex items-center gap-4 pt-4">
                                <AddToCartButton itemId={item._id} initialIsInCart={isInCart} />

                                {item.negotiable ? (
                                    <NegotiateButton itemId={item._id} currentPrice={item.price} />
                                ) : (
                                    <Link
                                        href={`/inbox/${seller._id}?itemId=${item._id}`}
                                        className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition"
                                        title="Chat with Seller"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                    </Link>
                                )}

                                <div className="ml-auto">
                                    <ReportUserButton userId={seller._id} userName={seller.name} iconOnly={true} />
                                </div>
                            </div>
                        )}

                        {isOwner && (
                            <div className="mt-8">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Manage Item</p>
                                <ItemActions item={item} hideView={true} />
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
