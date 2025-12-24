"use client";

import { useState } from "react";
import { CheckCircle, XCircle, User, Calendar, ExternalLink, Image as ImageIcon, Eye, MoreHorizontal, ShieldCheck } from "lucide-react";
import { resolveVerification } from "@/app/actions/admin";

export default function VerificationRequestList({ requests }) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleResolve = async (id, action) => {
        let notes = "";
        if (action === 'reject') {
            notes = prompt(`Reason for rejection (Optional):`);
            if (notes === null) return; // Cancelled
        }

        setLoading(true);
        try {
            const result = await resolveVerification(id, action, notes);
            if (result.success) {
                window.location.reload();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert("Failed to resolve request.");
        } finally {
            setLoading(false);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-24 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm animate-fade-in">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
                <p className="text-gray-400 font-medium tracking-tight">No pending verification requests at the moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-md transition-all">
                    {/* User Info & Details */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg mr-4 border-2 border-white shadow-sm font-serif">
                                    {request.userId?.image ? (
                                        <img src={request.userId.image} className="w-full h-full object-cover rounded-2xl" alt="" />
                                    ) : (
                                        request.userId?.name?.[0].toUpperCase() || "?"
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-900 leading-tight">{request.userId?.name}</h4>
                                    <p className="text-xs font-medium text-gray-400">{request.userId?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-colors">
                                    <span className="block text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Full Name</span>
                                    <span className="text-xs font-bold text-gray-900">{request.fullName}</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-colors">
                                    <span className="block text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">NIC Number</span>
                                    <span className="text-xs font-bold text-blue-500">{request.nicNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center text-[9px] text-gray-400 font-bold uppercase tracking-widest px-1">
                            <Calendar className="w-3 h-3 mr-2" />
                            Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {/* NIC Images */}
                    <div className="lg:w-[320px] p-6 lg:p-8 bg-gray-50/50 flex flex-col justify-center border-l border-gray-50">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Documents</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative group/img aspect-[4/3] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <img src={request.nicFront} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="NIC Front" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                    <button onClick={() => setPreviewImage(request.nicFront)} className="p-2 bg-white rounded-xl text-gray-900 hover:scale-110 active:scale-95 transition-all">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md text-[7px] font-black text-gray-900 rounded-full uppercase tracking-widest border border-white/50 shadow-sm">Front</div>
                            </div>
                            <div className="relative group/img aspect-[4/3] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <img src={request.nicBack} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="NIC Back" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                    <button onClick={() => setPreviewImage(request.nicBack)} className="p-2 bg-white rounded-xl text-gray-900 hover:scale-110 active:scale-95 transition-all">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md text-[7px] font-black text-gray-900 rounded-full uppercase tracking-widest border border-white/50 shadow-sm">Back</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 p-6 lg:p-8 flex flex-col gap-2.5 justify-center border-l border-gray-50 bg-white">
                        <button
                            onClick={() => handleResolve(request._id, "approve")}
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                        >
                            <CheckCircle className="w-3.5 h-3.5 mr-2" /> Approve
                        </button>
                        <button
                            onClick={() => handleResolve(request._id, "reject")}
                            disabled={loading}
                            className="w-full py-3 bg-white border border-gray-100 text-gray-500 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            <XCircle className="w-3.5 h-3.5 mr-2" /> Reject
                        </button>
                        <button className="w-full py-2 text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-fade-in" onClick={() => setPreviewImage(null)}>
                    <button className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
                        <XCircle className="w-8 h-8" />
                    </button>
                    <div className="relative max-w-5xl max-h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <img src={previewImage} className="max-w-full max-h-full object-contain" alt="Identity Preview" />
                    </div>
                </div>
            )}
        </div>
    );
}
