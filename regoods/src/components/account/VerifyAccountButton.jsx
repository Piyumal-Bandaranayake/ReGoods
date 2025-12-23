"use client";

import { useState } from "react";
import { ShieldCheck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import VerifyAccountModal from "./VerifyAccountModal";

export default function VerifyAccountButton({ currentStatus }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (currentStatus === "Verified") {
        return null;
    }

    if (currentStatus === "Pending") {
        return (
            <div className="flex items-center px-4 py-2 bg-amber-50 text-amber-600 rounded-full border border-amber-100 shadow-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verification Pending</span>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-6 py-3 bg-blue-900 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-blue-900/20"
            >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify Account
                {currentStatus === "Rejected" && (
                    <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-[8px]">Rejected</span>
                )}
            </button>

            <VerifyAccountModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentStatus={currentStatus}
            />
        </>
    );
}
