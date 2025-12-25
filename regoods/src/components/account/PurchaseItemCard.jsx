"use client";

import { useState } from "react";
import { Package, X, Clock, MapPin, CreditCard, User, Mail, Phone, Home, Trash2 } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { removePurchaseFromHistory } from "@/app/actions/item";

export default function PurchaseItemCard({ item }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmDelete(false);
        setIsDeleting(true);
        const result = await removePurchaseFromHistory(item._id);
        if (!result.success) {
            alert(result.error);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className={`bg-white p-4 rounded-[2rem] border border-sky-50 flex items-center gap-5 hover:shadow-xl transition-all group cursor-pointer ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <div className="w-14 h-14 bg-sky-50 rounded-xl overflow-hidden shadow-inner relative flex-shrink-0">
                    {item.images?.[0] ? (
                        <img 
                            src={optimizeCloudinaryUrl(item.images[0], 'q_auto,f_auto,w_200')} 
                            className="w-full h-full object-cover [image-rendering:-webkit-optimize-contrast]" 
                            alt={item.title}
                        />
                    ) : (
                        <Package className="w-6 h-6 text-sky-200 m-auto mt-4" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[8px] font-black bg-sky-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm shadow-sky-200">VERIFIED</span>
                        <span className="text-[9px] font-bold text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base truncate uppercase tracking-tight group-hover:text-sky-500 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium">From {item.sellerId?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 tracking-tighter">${item.price}</div>
                        <div className="flex items-center justify-end gap-1 text-sky-500">
                            <Clock className="w-2.5 h-2.5" />
                            <span className="text-[8px] font-black uppercase">Complete</span>
                        </div>
                    </div>
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors group/del"
                        title="Remove from history"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Custom Confirm Delete Modal */}
            {showConfirmDelete && (
                <div 
                    className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setShowConfirmDelete(false)}
                >
                    <div 
                        className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Record?</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed px-4">
                            You are about to hide this item from your purchase history. This action cannot be undone.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="py-3.5 px-6 rounded-2xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="py-3.5 px-6 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-sky-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header Image */}
                        <div className="h-32 bg-sky-50 relative">
                            {item.images?.[0] && (
                                <img 
                                    src={optimizeCloudinaryUrl(item.images[0], 'q_auto,f_auto,w_600')} 
                                    className="w-full h-full object-cover [image-rendering:-webkit-optimize-contrast]" 
                                    alt={item.title}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full text-gray-500 transition-colors z-10 shadow-sm"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="px-6 pb-6 -mt-12 relative z-10">
                            {/* Title Card */}
                            <div className="bg-white p-4 rounded-2xl shadow-lg border border-sky-50 text-center mb-5">
                                <h2 className="text-xl font-bold text-gray-900 mb-0.5 tracking-tight">{item.title}</h2>
                                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Successful Purchase</p>
                            </div>

                            <div className="space-y-6">
                                {/* Details Sections */}
                                <div>
                                    <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <Package className="w-2.5 h-2.5" /> Purchase Overview
                                    </h3>
                                    <div className="bg-sky-50/50 rounded-[1.25rem] p-4 space-y-2.5">
                                        <DetailRow icon={<Clock className="w-3 h-3 text-sky-400" />} label="Order Date" value={new Date(item.updatedAt).toLocaleDateString()} />
                                        <DetailRow icon={<CreditCard className="w-3 h-3 text-sky-400" />} label="Paid Amount" value={`$${item.price}`} highlight />
                                        <DetailRow icon={<MapPin className="w-3 h-3 text-sky-400" />} label="Seller" value={item.sellerId?.name} />
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                {item.deliveryDetails && (
                                    <div className="animate-in slide-in-from-bottom-2 duration-400">
                                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <Home className="w-2.5 h-2.5" /> Delivery Address
                                        </h3>
                                        <div className="bg-sky-50/50 rounded-[1.25rem] p-4 space-y-2.5">
                                            <DetailRow icon={<User className="w-3 h-3 text-sky-400" />} label="Recipient" value={item.deliveryDetails.fullName} />
                                            <DetailRow icon={<Mail className="w-3 h-3 text-sky-400" />} label="Email" value={item.deliveryDetails.email} />
                                            <DetailRow icon={<Phone className="w-3 h-3 text-sky-400" />} label="Phone" value={item.deliveryDetails.phone} />
                                            <div className="pt-2 mt-1 border-t border-sky-100 flex items-start gap-3">
                                                <Home className="w-3 h-3 text-sky-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Shipping to:</p>
                                                    <p className="text-[13px] font-bold text-gray-900 leading-snug">
                                                        {item.deliveryDetails.address}, <br />
                                                        {item.deliveryDetails.city} {item.deliveryDetails.postalCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-sky-50/30 p-4 text-center border-t border-sky-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                Order ID: #{item._id.substring(item._id.length - 8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function DetailRow({ icon, label, value, highlight }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className={`text-sm font-bold truncate max-w-[60%] ${highlight ? 'text-sky-600 text-lg' : 'text-gray-900'}`}>
                {value}
            </span>
        </div>
    );
}
