"use client";

import { useState } from "react";
import { resolveUserReport } from "@/app/actions/admin";
import { CheckCircle, Ban, User, Flag, Calendar, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserReportList({ initialReports }) {
    const [reports, setReports] = useState(initialReports);
    const [selectedImage, setSelectedImage] = useState(null);
    const router = useRouter();

    const handleResolve = async (id, action) => {
        const confirmMsg = action === "dismiss" 
            ? "Are you sure you want to dismiss this report?" 
            : "Are you sure you want to BAN this user? This will prevent them from accessing the platform.";
            
        if (confirm(confirmMsg)) {
            const result = await resolveUserReport(id, action);
            if (result.success) {
                setReports(reports.filter(r => r._id !== id));
                router.refresh();
            } else {
                alert(result.error || "Failed to resolve report");
            }
        }
    };

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div key={report._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Side: Users Info */}
                            <div className="lg:w-1/3 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Reporter</label>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                            {report.reporterId?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{report.reporterId?.name}</p>
                                            <p className="text-[10px] text-gray-400">{report.reporterId?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 w-px h-6 bg-gray-200"></div>
                                    <div className="ml-4 pl-4 py-2 text-xs text-gray-400 font-medium">Reported the seller</div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Reported Seller</label>
                                    <div className="flex items-center p-3 bg-red-50 rounded-xl border border-red-100">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs mr-3">
                                            {report.reportedUserId?.name?.[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-gray-900">{report.reportedUserId?.name}</p>
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">{report.reportedUserId?.warningCount || 0} Warnings</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400">{report.reportedUserId?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Report Details */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            {report.reason}
                                        </span>
                                        <span className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {report.description}
                                </div>

                                {report.images && report.images.length > 0 && (
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Evidence Images</label>
                                        <div className="flex flex-wrap gap-2">
                                            {report.images.map((img, idx) => (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => setSelectedImage(img)}
                                                    className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-black transition group relative"
                                                >
                                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Actions */}
                            <div className="lg:w-48 flex flex-col gap-3 justify-center">
                                <div className="space-y-2">
                                    <input 
                                        type="text"
                                        id={`reason-${report._id}`}
                                        placeholder="Reason for ban..."
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                                        disabled={report.reportedUserId?.warningCount < 5}
                                    />
                                    <button
                                        onClick={() => {
                                            const reason = document.getElementById(`reason-${report._id}`).value;
                                            handleResolve(report._id, "ban", reason);
                                        }}
                                        disabled={report.reportedUserId?.warningCount < 5}
                                        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition flex items-center justify-center ${
                                            report.reportedUserId?.warningCount < 5 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                            : "bg-red-600 text-white hover:bg-black shadow-lg shadow-red-100"
                                        }`}
                                    >
                                        <Ban className="w-4 h-4 mr-2" /> Ban Seller
                                    </button>
                                    {report.reportedUserId?.warningCount < 5 && (
                                        <p className="text-[10px] text-amber-600 font-bold text-center leading-tight">
                                            Minimum 5 warnings required to ban account.
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleResolve(report._id, "dismiss")}
                                    className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition flex items-center justify-center"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {reports.length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900">No Pending Reports</h3>
                    <p className="text-gray-500 mt-1">The marketplace is clean. Great job!</p>
                </div>
            )}

            {/* Image Modal Preview */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-10 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-10 right-10 text-white hover:rotate-90 transition duration-300">
                        <X className="w-8 h-8" />
                    </button>
                    <img src={selectedImage} className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-200" />
                </div>
            )}
        </div>
    );
}

function X(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
