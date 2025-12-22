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
                    <DollarSign className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">When buyers make offers on your negotiable items, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {offers.map((offer) => (
                <div key={offer._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                        {/* Item Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                {offer.itemId?.images?.[0] ? (
                                    <img src={offer.itemId.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <Link href={`/items/${offer.itemId?._id}`} className="font-bold text-gray-900 truncate block hover:underline">
                                    {offer.itemId?.title || "Unknown Item"}
                                </Link>
                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Original: ${offer.itemId?.price}</p>
                            </div>
                        </div>

                        {/* Offer Amount */}
                        <div className="bg-blue-50/50 px-6 py-3 rounded-2xl border border-blue-100 text-center flex-shrink-0">
                            <span className="block text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-1">Offered Price</span>
                            <span className="text-2xl font-bold text-blue-950 font-serif">${offer.offerAmount}</span>
                        </div>

                        {/* Buyer Info */}
                        <div className="flex items-center gap-3 px-4 border-l border-r border-gray-50 hidden md:flex min-w-[150px]">
                            <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden">
                                {offer.buyerId?.image ? <img src={offer.buyerId.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-4 h-4" /></div>}
                            </div>
                            <div className="text-sm">
                                <span className="block font-bold text-gray-900 truncate max-w-[100px]">{offer.buyerId?.name}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">{new Date(offer.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3 ml-auto">
                            {offer.status === "Pending" ? (
                                <>
                                    <button
                                        onClick={() => handleReject(offer._id)}
                                        disabled={loadingId === offer._id}
                                        className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition shadow-sm disabled:opacity-50"
                                        title="Reject Offer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleAccept(offer._id)}
                                        disabled={loadingId === offer._id}
                                        className="px-6 py-3 bg-blue-950 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loadingId === offer._id ? "Processing..." : (
                                            <>
                                                <Check className="w-4 h-4" /> Accept
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                                    offer.status === "Accepted" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}>
                                    {offer.status === "Accepted" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    {offer.status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
