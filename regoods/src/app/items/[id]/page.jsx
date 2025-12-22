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
    ArrowLeft,
    ShoppingBag,
    ShoppingCart,
    MapPin,
    Package,
    ShieldCheck,
    Share2
} from "lucide-react";
import ItemActions from "@/components/account/ItemActions";
import ItemImageGallery from "@/components/items/ItemImageGallery";
import { getUserInteractions } from "@/app/actions/user";
import { WishlistButton, AddToCartButton, BuyNowButton } from "@/components/items/ItemInteractionButtons";

async function getItem(id) {
    await dbConnect();
    const item = await Item.findById(id).populate("sellerId", "name email image role warningCount isBanned createdAt");
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
            {/* Nav / Breadcrumbs - Floating on desktop to match clean look */}
            <div className="fixed top-0 left-0 p-6 z-50">
                <Link href="/dashboard" className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Link>
            </div>

            <main className="lg:flex min-h-screen">

                {/* LEFT: Image Section (White Background) */}
                <ItemImageGallery images={item.images} title={item.title} isSold={isSold} />

                {/* RIGHT: Details Section (Light Gray Background) */}
                <div className="w-full lg:w-1/2 bg-[#F8F9FA] flex flex-col justify-center p-8 lg:p-24 relative">

                    <div className="max-w-xl mx-auto w-full">
                        {/* Category Label */}
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                                {item.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-sans font-bold text-gray-900 mb-6 leading-tight">
                            {item.title}
                        </h1>

                        {/* Description */}
                        <div className="mb-10 text-gray-600 leading-relaxed font-light">
                            <p>{item.description}</p>
                        </div>

                        {/* Specs Boxes (Condition | Location) */}
                        <div className="flex border border-gray-200 rounded-sm mb-10 bg-white">
                            <div className="flex-1 p-4 border-r border-gray-200 text-center">
                                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Condition</span>
                                <span className="text-lg font-bold text-gray-900">{item.condition}</span>
                            </div>
                            <div className="flex-1 p-4 text-center">
                                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Location</span>
                                <span className="text-lg font-bold text-gray-900 truncate px-2">{item.location}</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-10">
                            <h2 className="text-4xl font-bold text-gray-900">
                                ${item.price}
                            </h2>
                            {item.negotiable && <span className="text-sm text-gray-500 mt-1 block">Price is negotiable</span>}
                        </div>

                        {/* Actions */}
                        <div className="mb-12">
                            {!isOwner ? (
                                isSold ? (
                                    <button disabled className="w-full py-5 bg-gray-200 text-gray-400 font-bold text-sm uppercase tracking-widest cursor-not-allowed">
                                        Item No Longer Available
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Row 1: Chat, Cart, Wishlist */}
                                        <div className="flex gap-3 items-center">
                                            <Link
                                                href={`/inbox/${seller._id}?itemId=${item._id}`}
                                                className="flex-1 py-4 rounded-full bg-white border border-gray-200 text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-50 hover:border-black transition shadow-sm text-center flex items-center justify-center"
                                            >
                                                Chat / Offer
                                            </Link>

                                            <div className="flex-1">
                                                <AddToCartButton itemId={item._id} initialIsInCart={isInCart} />
                                            </div>

                                            <div className="flex-none">
                                                <WishlistButton itemId={item._id} initialIsWishlisted={isWishlisted} />
                                            </div>
                                        </div>

                                        {/* Row 2: Buy Now */}
                                        <BuyNowButton itemId={item._id} />
                                    </div>
                                )
                            ) : (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Owner Controls</span>
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded bg-gray-100 ${isSold ? 'text-red-500' : 'text-green-600'}`}>
                                            {isSold ? 'Sold' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="-ml-4">
                                        <ItemActions item={item} hideView={true} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Seller Info (Bottom) */}
                        <div className="flex items-center pt-8 border-t border-gray-200">
                            <Link href={`/profile/${seller?._id}`} className="h-12 w-12 rounded-full overflow-hidden bg-white border border-gray-200 mr-4 block hover:opacity-80 transition">
                                {seller?.image ? (
                                    <img src={seller.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold font-serif">
                                        {seller?.name?.[0]}
                                    </div>
                                )}
                            </Link>
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Listed By</p>
                                <Link href={`/profile/${seller?._id}`} className="text-sm font-bold text-gray-900 hover:underline">{seller?.name}</Link>
                            </div>
                            <div className="ml-auto flex space-x-3">
                                {!isOwner && (
                                    <Link href={`/inbox/${seller._id}?itemId=${item._id}`} className="p-2 border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition text-gray-400 hover:text-black">
                                        <MessageCircle className="w-5 h-5" />
                                    </Link>
                                )}


                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
