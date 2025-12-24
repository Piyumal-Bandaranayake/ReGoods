"use client";

import { useState } from "react";
import { X, Loader2, ShieldCheck, Lock } from "lucide-react";
import { updatePassword } from "@/app/actions/user";
import { signOut } from "next-auth/react";

export default function AdminPasswordResetModal({ isOpen, onClose, isForced }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData(e.currentTarget);
        const result = await updatePassword(formData);

        if (result.success) {
            setMessage({ type: "success", text: result.message + " You will be signed out in a moment." });
            setTimeout(async () => {
                await signOut({ redirect: false });
                window.location.href = "/auth/login";
            }, 3000);
        } else {
            setMessage({ type: "error", text: result.error });
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Secret Key</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update Admin Security</p>
                        </div>
                    </div>
                    {!isForced && (
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isForced && (
                    <div className="px-8 pt-8">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-tight mb-1">Action Required</h4>
                            <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                                Welcome to the ReGoods Admin Team! For security reasons, you must reset your temporary password before accessing the system dashboard.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Current Key</label>
                            <input
                                name="currentPassword"
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Secret Key</label>
                            <input
                                name="newPassword"
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                placeholder="Min. 8 characters"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verify Key</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                placeholder="Repeat new key"
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border ${
                            message.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-zinc-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                VALIDATE & UPDATE
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
