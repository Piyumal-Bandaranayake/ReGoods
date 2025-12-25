"use client";

import { ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export default function VerifyAccountButton({ currentStatus }) {
    if (currentStatus === "Verified") {
        return null;
    }

    if (currentStatus === "Pending") {
        return (
            <div className="flex items-center justify-center px-6 py-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 shadow-sm w-full">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verification Pending</span>
            </div>
        );
    }

    return (
        <Link
            href="/account/verify"
            className="w-full flex items-center justify-center px-8 py-4 bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition shadow-xl shadow-blue-500/20"
        >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Verify Identity
            {currentStatus === "Rejected" && (
                <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">Action Required</span>
            )}
        </Link>
    );
}
