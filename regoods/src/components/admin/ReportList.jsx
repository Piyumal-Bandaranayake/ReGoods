"use client";

import { useState } from "react";
import { resolveReport } from "@/app/actions/admin";
import { CheckCircle, Trash2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportList({ initialReports }) {
    const [reports, setReports] = useState(initialReports);
    const router = useRouter();

    const handleResolve = async (id, action) => {
        if (confirm(`Are you sure you want to ${action} this report?`)) {
            await resolveReport(id, action);
            setReports(reports.filter(r => r._id !== id));
            router.refresh();
        }
    };

    return (
        <div className="grid gap-4">
            {reports.map((report) => (
                <div key={report._id} className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-bold text-gray-900">{report.senderId?.name}</span>
                            <span>→</span>
                            <span className="font-bold text-gray-900">{report.receiverId?.name}</span>
                            <span className="text-gray-300">•</span>
                            <span>{new Date(report.createdAt).toLocaleString()}</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-gray-800 border border-gray-100 italic">
                            "{report.content}"
                        </div>

                        {report.image && (
                            <img src={report.image} className="h-32 rounded-lg object-cover border border-gray-200" />
                        )}

                        {report.reportReason && (
                            <p className="text-red-600 text-sm font-bold flex items-center">
                                <span className="uppercase text-[10px] tracking-widest mr-2 bg-red-100 px-2 py-1 rounded">Reason</span>
                                {report.reportReason}
                            </p>
                        )}
                    </div>

                    <div className="flex bg-gray-50 p-3 rounded-lg flex-col justify-center gap-2 border border-gray-100">
                        <button
                            onClick={() => handleResolve(report._id, "dismiss")}
                            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition text-sm font-medium shadow-sm"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Dismiss
                        </button>
                        <button
                            onClick={() => handleResolve(report._id, "delete")}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Msg
                        </button>
                    </div>
                </div>
            ))}

            {reports.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
                    <p className="text-gray-500">No reported messages at the moment.</p>
                </div>
            )}
        </div>
    );
}
