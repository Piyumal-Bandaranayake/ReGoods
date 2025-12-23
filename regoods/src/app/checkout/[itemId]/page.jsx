import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import { notFound, redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Package, Tag } from "lucide-react";

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
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-gray-100 animate-fade-in-up">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                        <Package className="w-10 h-10 text-blue-300" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold mb-4 text-gray-900">Wait a minute</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed">
                        You are the owner of this curated item. Purchasing your own listing is restricted in our community.
                    </p>
                    <Link href={`/items/${itemId}`} className="block w-full py-4 bg-gray-900 text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10">
                        Return to Listing
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-x-hidden">

            {/* LEFT COLUMN: CINEMATIC SUMMARY (45% width) */}
            <div className="w-full lg:w-[45%] bg-[#F9FAFB] min-h-[50vh] lg:min-h-screen p-6 md:p-12 lg:p-20 flex flex-col justify-center relative border-r border-gray-100">
                <div className="lg:absolute lg:top-12 lg:left-12 mb-8 lg:mb-0">
                    <Link href={`/cart`} className="group inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Bag
                    </Link>
                </div>

                <div className="w-full max-w-lg mx-auto">
                    <div className="mb-10 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-8 bg-blue-500 rounded-full"></span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Purchase Review</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-[1.1] mb-4">
                            Curated <br/> <span className="italic text-blue-500">Acquisition</span>.
                        </h1>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm italic">
                            You're acquiring a piece of history. Review the specifics before finalizing your order.
                        </p>
                    </div>

                    {/* Item Spotlight Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-gray-200/50 border border-white mb-10 animate-fade-in-up delay-100">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner group">
                                {item.images[0] && (
                                    <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[8px] font-black bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full uppercase mb-2 inline-block border border-blue-100">{item.category}</span>
                                <h3 className="font-bold text-gray-900 text-xl truncate uppercase tracking-tight">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <Tag className="w-3 h-3 text-blue-300" />
                                    Seller: {item.sellerId?.name || "Premium Store"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-6 animate-fade-in-up delay-200">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Merchant Valuation</span>
                            <span className="font-bold text-gray-900">${item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Secure Logistics</span>
                                <Truck className="w-3 h-3 text-blue-300" />
                            </div>
                            <span className="font-bold text-gray-900">$40.00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Protection Fee</span>
                                <ShieldCheck className="w-3 h-3 text-green-300" />
                            </div>
                            <span className="font-bold text-gray-400 line-through">$2.00</span>
                        </div>
                        
                        <div className="pt-8 border-t border-gray-200 flex justify-between items-baseline">
                            <div className="flex flex-col">
                                <span className="text-xl font-serif font-bold text-gray-900 uppercase">Final Total</span>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">USD Currency</span>
                            </div>
                            <span className="text-4xl md:text-5xl font-serif font-bold text-blue-500">
                                ${(item.price + 40).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE FORM (55% width) */}
            <div className="w-full lg:w-[55%] bg-white p-8 md:p-12 lg:p-20 flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full">
                    <div className="mb-12 animate-fade-in-up">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Checkout Details</h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Authorized Transaction Form</p>
                    </div>

                    <CheckoutClient item={item} />

                    <div className="mt-12 text-center animate-fade-in-up delay-300">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-8 bg-gray-100"></div>
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Verified Secure Payment</p>
                            <div className="h-px w-8 bg-gray-100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
