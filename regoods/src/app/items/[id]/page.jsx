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

import Offer from "@/lib/models/Offer";

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
    const isOwner = session?.user?.id === seller?._id?.toString();
    const isSold = item.status === "Sold";

    // ⚡ Check if the current user has an ACCEPTED offer for this item
    let acceptedOffer = null;
    if (session && !isOwner) {
        acceptedOffer = await Offer.findOne({
            itemId: item._id,
            buyerId: session.user.id,
            status: "Accepted"
        });
    }

    const displayPrice = acceptedOffer ? acceptedOffer.offerAmount : item.price;

    // Fetch user interactions (wishlist/cart status)
    const { wishlist, cart } = await getUserInteractions();
    const isWishlisted = wishlist.includes(item._id);
    const isInCart = cart.includes(item._id);

    return (
        <div className="min-h-screen bg-white">


            <main className="lg:flex h-screen overflow-hidden">

                {/* LEFT: Image Section (White Background) */}
                <ItemImageGallery images={item.images} title={item.title} isSold={isSold} />

                {/* RIGHT: Details Section (White, Clean) */}
                <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center p-8 lg:p-12 relative overflow-y-auto h-full scrollbar-hide">

                    <div className="max-w-xl mx-auto w-full">

                        {/* 1. Header: Seller Name - Updated for Visibility */}
                        <div className="mb-6 flex items-center justify-between">
                            <Link href={`/profile/${seller?._id}`} className="group flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden border border-gray-100 group-hover:border-blue-500 transition-colors shadow-sm">
                                    {seller?.image ? (
                                        <img src={seller.image} alt={seller.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-bold text-gray-400 bg-gray-100">
                                            {seller?.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Sold by</p>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{seller?.name || "Unknown Seller"}</h3>
                                        {seller?.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />}
                                    </div>
                                </div>
                            </Link>

                            {/* Owner Controls (Top Right) */}
                            <div className="flex items-center gap-3">
                                {isOwner && (
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-gray-100 ${isSold ? 'text-red-500' : 'text-green-600'}`}>
                                        {isSold ? 'Sold' : 'Active'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 2. Title */}
                        <h1 className="text-2xl lg:text-3xl font-sans font-bold text-gray-900 mb-3 leading-[1.1] tracking-tight">
                            {item.title}
                        </h1>

                        {/* 3. Description */}
                        <div className="mb-6 text-gray-500 leading-relaxed font-medium text-xs max-w-md">
                            <p>{item.description}</p>
                        </div>

                        {/* 4. Price Display - Always visible */}
                        {!isSold && (
                            <div className="mb-6 border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                            ${displayPrice.toLocaleString()}
                                        </h2>
                                        {acceptedOffer && !isOwner && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded">Offer Accepted</span>
                                                <span className="text-[10px] text-gray-400 font-medium line-through">${item.price.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {!acceptedOffer && item.negotiable && <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Negotiable</span>}
                                    </div>
                                    {/* Buy Button - Only for non-owners */}
                                    {!isOwner && (
                                        <div className="flex items-center gap-4 w-60">
                                            <BuyNowButton itemId={item._id} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {isSold && (
                            <div className="mb-6 border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-400 tracking-tight line-through">
                                        ${item.price.toLocaleString()}
                                    </h2>
                                    <button disabled className="px-6 py-3 bg-gray-100 text-gray-400 font-bold text-xs uppercase tracking-widest cursor-not-allowed rounded-full">
                                        Item Sold
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 5. Details List (Dimensions & Weight Style) */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-3">Details & Specifications</h3>

                            <dl className="space-y-2 text-xs">
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
                            <div className="flex items-center gap-3 pt-4">
                                <div className="flex-1">
                                    <AddToCartButton itemId={item._id} initialIsInCart={isInCart} />
                                </div>

                                <div className="flex-1">
                                    {item.negotiable ? (
                                        <NegotiateButton itemId={item._id} currentPrice={item.price} />
                                    ) : (
                                        <Link
                                            href={`/inbox/${seller._id}?itemId=${item._id}`}
                                            className="w-full py-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition"
                                        >
                                            Chat
                                        </Link>
                                    )}
                                </div>

                                <WishlistButton itemId={item._id} initialIsWishlisted={isWishlisted} />

                                <div className="ml-2">
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
