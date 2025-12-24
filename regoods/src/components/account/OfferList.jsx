"use client";

import { useState } from "react";
import { acceptOffer, rejectOffer } from "@/app/actions/offer";
import { Check, X, Clock, DollarSign, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OfferList({ offers }) {
    const [loadingId, setLoadingId] = useState(null);
    const router = useRouter();

    const handleAccept = async (offerId) => {
        if (loadingId) return;
        setLoadingId(offerId);
        const result = await acceptOffer(offerId);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Failed to accept offer");
        }
        setLoadingId(null);
    };

    const handleReject = async (offerId) => {
        if (loadingId) return;
        setLoadingId(offerId);
        const result = await rejectOffer(offerId);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Failed to reject offer");
        }
        setLoadingId(null);
    };

    if (!offers || offers.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                    <DollarSign className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">When buyers make offers on your negotiable items, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {offers.map((offer) => (
                <div key={offer._id} className="bg-white rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-sm transition-all border border-transparent hover:border-gray-50">

                    {/* Item Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                            {offer.itemId?.images?.[0] ? (
                                <img src={offer.itemId.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <Link href={`/items/${offer.itemId?._id}`} className="font-bold text-gray-900 truncate block hover:text-sky-500 transition-colors text-sm">
                                {offer.itemId?.title || "Unknown Item"}
                            </Link>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Original: ${offer.itemId?.price}</p>
                        </div>
                    </div>

                    {/* Offer Price */}
                    <div className="flex flex-col items-end md:items-center px-4">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Offer</span>
                        <span className="text-lg font-black text-gray-900">${offer.offerAmount}</span>
                    </div>

                    {/* Buyer Info */}
                    <div className="flex items-center gap-3 px-4 hidden md:flex min-w-[140px]">
                        <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden border border-white shadow-sm">
                            {offer.buyerId?.image ? <img src={offer.buyerId.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-4 h-4" /></div>}
                        </div>
                        <div className="text-xs">
                            <span className="block font-bold text-gray-900 truncate max-w-[90px]">{offer.buyerId?.name}</span>
                            <span className="text-[9px] text-gray-400 font-medium">{new Date(offer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto pl-4 border-l border-gray-50">
                        {offer.status === "Pending" ? (
                            <>
                                <button
                                    onClick={() => handleReject(offer._id)}
                                    disabled={loadingId === offer._id}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-md shadow-red-200"
                                    title="Reject"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleAccept(offer._id)}
                                    disabled={loadingId === offer._id}
                                    className="h-8 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-green-200"
                                >
                                    {loadingId === offer._id ? "..." : "Accept"}
                                </button>
                            </>
                        ) : (
                            <span className={`text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full ${offer.status === "Accepted" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                                }`}>
                                {offer.status}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
