import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import { notFound, redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getItem(id) {
    await dbConnect();
    // Validate that id is a valid ObjectId before querying
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

    if (item.status === 'Sold') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-100/50 backdrop-blur-md">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-scale-in border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h1 className="text-xl font-serif font-bold mb-2 text-gray-900">Item Unavailable</h1>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        This item has already been sold and is no longer available for purchase.
                    </p>
                    <Link
                        href="/dashboard"
                        className="block w-full py-3.5 bg-black text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-800 transition shadow-lg"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (item.sellerId?._id === session.user.id) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Wait a minute</h1>
                    <p className="text-gray-600 mb-6">You cannot purchase your own item.</p>
                    <Link href={`/items/${itemId}`} className="inline-block px-6 py-3 bg-black text-white font-bold rounded-full text-sm uppercase tracking-widest">
                        Back to Item
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen overflow-hidden bg-white flex flex-col lg:flex-row">

            {/* LEFT COLUMN: SUMMARY (40% width) */}
            <div className="w-full lg:w-[40%] bg-[#F5F5F7] h-full p-6 lg:p-8 flex flex-col relative border-r border-gray-200">
                <div className="absolute top-6 left-6 z-10">
                    <Link href={`/items/${itemId}`} className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto flex flex-col justify-start pt-16 lg:pt-20">
                    <div className="mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Pay for</span>
                        <h1 className="text-2xl lg:text-3xl font-serif font-medium text-gray-900 leading-tight mb-2">{item.title}</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.category}</p>
                    </div>

                    <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-4 max-h-[180px] w-auto self-start object-cover">
                        {item.images[0] && (
                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                        )}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span className="font-bold text-gray-900">${item.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Protection Fee</span>
                            <span className="text-gray-400 line-through">$2.00</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2 font-bold text-gray-900">
                            <span>Total</span>
                            <span>${item.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: FORM (60% width) */}
            <div className="w-full lg:w-[60%] h-full bg-white p-6 lg:p-8 overflow-hidden flex flex-col justify-start pt-8 lg:pt-12">
                <div className="max-w-xl mx-auto w-full">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-gray-900 mb-0.5">Checkout Details</h2>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Complete your purchase</p>
                    </div>

                    <CheckoutClient item={item} />
                </div>
            </div>
        </div>
    )
}
