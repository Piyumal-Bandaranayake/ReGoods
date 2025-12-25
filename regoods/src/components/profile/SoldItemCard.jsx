"use client";

import { useState } from "react";
import { Package, X } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

export default function SoldItemCard({ item, disableModal = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => !disableModal && setIsModalOpen(true)}
                className={`bg-white rounded-3xl p-5 border border-white shadow-sm flex items-center justify-between group hover:shadow-md transition-all ${!disableModal ? 'cursor-pointer' : ''}`}
            >
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        {item.images?.[0] ? (
                            <img src={optimizeCloudinaryUrl(item.images[0], 'q_auto,f_auto,w_200')} className="w-full h-full object-cover grayscale opacity-60 [image-rendering:-webkit-optimize-contrast]" alt={item.title} />
                        ) : (
                            <Package className="w-8 h-8 text-gray-300 m-auto mt-6" />
                        )}
                        <div className="absolute inset-0 bg-sky-900/10"></div>
                        <div className="absolute top-1 right-1">
                            <span className="text-[8px] font-black text-white bg-gray-800 px-1.5 py-0.5 rounded-full uppercase">SOLD</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-sky-500 transition-colors">{item.title}</h4>
                        <p className="text-xs text-[#657786] font-medium mt-1">Completed on {new Date(item.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${item.price}</div>
                    <div className="text-[10px] font-bold text-[#657786] uppercase tracking-widest mt-1">Sold Price</div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                        {/* Header Image */}
                        <div className="h-32 bg-gray-100 relative">
                            {item.images?.[0] && (
                                <img src={optimizeCloudinaryUrl(item.images[0], 'q_auto,f_auto,w_400')} className="w-full h-full object-cover grayscale opacity-50 [image-rendering:-webkit-optimize-contrast]" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(false);
                                }}
                                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-500 transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-6 pb-6 -mt-12 relative z-10">

                            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 text-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h2>
                                <p className="text-xs font-medium text-gray-400">Sold for <span className="text-green-600 font-bold">${item.price}</span></p>
                            </div>

                            <div className="space-y-4">
                                {/* Key Details */}
                                <div>
                                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Transaction Details</h3>
                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                        <DetailRow label="Sold Date" value={new Date(item.updatedAt).toLocaleDateString()} />
                                        <DetailRow label="Location" value={item.location || "Online"} />
                                        <DetailRow label="Payment Method" value={item.paymentMethod || "Direct Payment"} />
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                {item.deliveryDetails && (
                                    <div>
                                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Delivery Information</h3>
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                            <DetailRow label="Recipient" value={item.deliveryDetails.fullName} />
                                            <DetailRow label="Address" value={item.deliveryDetails.address} />
                                            <DetailRow label="City / Zip" value={`${item.deliveryDetails.city}, ${item.deliveryDetails.postalCode}`} />
                                            <DetailRow label="Phone" value={item.deliveryDetails.phone} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                            <p className="text-[9px] text-gray-400 font-medium">
                                Transaction ID: #{item._id.substring(item._id.length - 8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-bold text-gray-900 text-right truncate max-w-[60%]">{value}</span>
        </div>
    );
}
