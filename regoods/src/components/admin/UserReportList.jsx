"use client";

import { useState } from "react";
import { resolveUserReport } from "@/app/actions/admin";
import { CheckCircle, Ban, User, Flag, Calendar, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserReportList({ initialReports }) {
    const [reports, setReports] = useState(initialReports);
    const [selectedImage, setSelectedImage] = useState(null);
    const router = useRouter();

    const handleResolve = async (id, action, customReason) => {
        const confirmMsg = action === "dismiss" 
            ? "Are you sure you want to dismiss this report?" 
            : "Are you sure you want to BAN this user? This will prevent them from accessing the platform.";
            
        if (confirm(confirmMsg)) {
            const result = await resolveUserReport(id, action, customReason);
            if (result.success) {
                if (action === "ban") {
                    const bannedReport = reports.find(r => r._id === id);
                    if (bannedReport) {
                        setReports(reports.filter(r => r.reportedUserId?._id !== bannedReport.reportedUserId?._id));
                    }
                } else {
                    setReports(reports.filter(r => r._id !== id));
                }
                router.refresh();
            } else {
                alert(result.error || "Failed to resolve report");
            }
        }
    };

    const groupedReports = reports.reduce((acc, report) => {
        const seller = report.reportedUserId;
        if (!seller || seller.isBanned) return acc;
        
        const sellerId = seller._id;
        if (!acc[sellerId]) {
            acc[sellerId] = {
                seller: seller,
                reports: []
            };
        }
        acc[sellerId].reports.push(report);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {Object.values(groupedReports).map(({ seller, reports: sellerReports }) => (
                <div key={seller._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Seller Header */}
                    <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm mr-3 border-2 border-white shadow-sm">
                                {seller?.name?.[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-900">{seller?.name}</h3>
                                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                        {seller?.warningCount || 0} Warnings
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">{seller?.email}</p>
                            </div>
                        </div>

                        {/* Seller Level Actions */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    id={`reason-${seller._id}`}
                                    placeholder="Reason for ban..."
                                    className="px-3 py-2 text-[10px] border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none bg-white w-40"
                                    disabled={seller?.warningCount < 5}
                                />
                                <button
                                    onClick={() => {
                                        const reason = document.getElementById(`reason-${seller._id}`).value;
                                        // Use the first report ID to trigger the ban action for the user
                                        handleResolve(sellerReports[0]._id, "ban", reason);
                                    }}
                                    disabled={seller?.warningCount < 5}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition flex items-center justify-center ${
                                        seller?.warningCount < 5 
                                        ? "bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200" 
                                        : "bg-red-600 text-white hover:bg-black shadow-lg shadow-red-100"
                                    }`}
                                >
                                    <Ban className="w-3.5 h-3.5 mr-1.5" /> Ban Seller
                                </button>
                            </div>
                            {seller?.warningCount < 5 && (
                                <span className="text-[9px] text-amber-600 font-bold uppercase tracking-tight bg-amber-50 px-2 py-1 rounded">
                                    Min 5 warnings Req.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="divide-y divide-gray-50">
                        {sellerReports.map((report) => (
                            <div key={report._id} className="p-5 flex flex-col lg:flex-row gap-6 hover:bg-gray-50/30 transition-colors">
                                <div className="lg:w-1/4">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Reporter</label>
                                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                            {report.reporterId?.name?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{report.reporterId?.name}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{report.reporterId?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                                                {report.reason}
                                            </span>
                                            <span className="flex items-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                <Calendar className="w-2.5 h-2.5 mr-1" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleResolve(report._id, "dismiss")}
                                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all group"
                                            title="Dismiss this report"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                        {report.description}
                                    </div>

                                    {report.images && report.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {report.images.map((img, idx) => (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => setSelectedImage(img)}
                                                    className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 hover:border-black transition group relative"
                                                >
                                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                                        <Eye className="w-3 h-3 text-white" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
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
