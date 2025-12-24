import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import { notFound, redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Package, Truck, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

async function getItem(id) {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;

    const item = await Item.findById(id).populate("sellerId", "name email");
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
}

export default async function CheckoutPage({ params }) {
    const { itemId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`/auth/login?callbackUrl=/checkout/${itemId}`);
    }

    const item = await getItem(itemId);

    if (!item) {
        return notFound();
    }

    if (item.sellerId?._id === session.user.id) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-inter">
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Package className="w-8 h-8 text-sky-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3 text-gray-900">Purchase Restricted</h1>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        You cannot purchase your own listing. Please browse other items in the marketplace.
                    </p>
                    <Link href={`/items/${itemId}`} className="block w-full py-4 bg-gray-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-sky-500 transition-all">
                        Back to Listing
                    </Link>
                </div>
            </div>
        )
    }

    const shippingFee = 40;
    const discount = 10;
    const total = item.price + shippingFee - discount;

    return (
        <div className="min-h-screen bg-gray-50/50 font-inter pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* FORM SIDE */}
                    <div className="flex-1 w-full">
                        <CheckoutClient item={item} session={session} />
                    </div>

                    {/* SUMMARY SIDE */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-32">
                            <h3 className="font-bold text-gray-900 text-lg mb-6">Order Summary</h3>
                            
                            {/* Item */}
                            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                                <div className="h-16 w-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                    {item.images[0] && (
                                        <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{item.category}</p>
                                    <p className="text-sm font-black text-gray-900 mt-1">${item.price.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-bold text-gray-900">${item.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="font-bold text-gray-900">${shippingFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-rose-500">
                                    <span>Discount</span>
                                    <span className="font-bold">-${discount.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-sky-500 tracking-tight">${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-center py-4 bg-gray-50 rounded-xl">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
