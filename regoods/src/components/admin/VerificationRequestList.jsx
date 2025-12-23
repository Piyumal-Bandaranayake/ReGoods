"use client";

import { useState } from "react";
import { CheckCircle, XCircle, User, Calendar, ExternalLink, Image as ImageIcon, Eye } from "lucide-react";
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
                alert(`Verification ${action}d successfully.`);
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
            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
                <CheckCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending verification requests</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                    {/* User Info & Details */}
                    <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg mr-4">
                                {request.userId?.name?.[0].toUpperCase() || "?"}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{request.userId?.name}</h4>
                                <p className="text-sm text-gray-500">{request.userId?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Full Name</span>
                                <span className="text-sm font-bold text-gray-900">{request.fullName}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">NIC Number</span>
                                <span className="text-sm font-bold text-gray-900 text-blue-600">{request.nicNumber}</span>
                            </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-400 font-medium space-x-4">
                            <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Submitted {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* NIC Images */}
                    <div className="lg:w-96 p-6 bg-gray-50/50 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3 h-full">
                            <div className="relative group aspect-[3/2] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <img src={request.nicFront} className="w-full h-full object-cover" alt="NIC Front" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <button onClick={() => setPreviewImage(request.nicFront)} className="p-2 bg-white rounded-full text-black hover:scale-110 transition">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-[8px] font-black text-white rounded uppercase tracking-tighter">Front</div>
                            </div>
                            <div className="relative group aspect-[3/2] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <img src={request.nicBack} className="w-full h-full object-cover" alt="NIC Back" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <button onClick={() => setPreviewImage(request.nicBack)} className="p-2 bg-white rounded-full text-black hover:scale-110 transition">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-[8px] font-black text-white rounded uppercase tracking-tighter">Back</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 p-6 flex flex-col gap-3 justify-center items-center">
                        <button
                            onClick={() => handleResolve(request._id, "approve")}
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-blue-100 flex items-center justify-center"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </button>
                        <button
                            onClick={() => handleResolve(request._id, "reject")}
                            disabled={loading}
                            className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition flex items-center justify-center"
                        >
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                        </button>
                    </div>
                </div>
            ))}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-8" onClick={() => setPreviewImage(null)}>
                    <button className="absolute top-10 right-10 text-white hover:scale-110 transition">
                        <XCircle className="w-10 h-10" />
                    </button>
                    <img src={previewImage} className="max-w-full max-h-full object-contain" />
                </div>
            )}
        </div>
    );
}
