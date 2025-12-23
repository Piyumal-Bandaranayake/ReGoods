"use client";

import { useState } from "react";
import { ShieldCheck, Loader2, X, Upload, Camera, CheckCircle } from "lucide-react";
import { submitVerification } from "@/app/actions/user";

export default function VerifyAccountModal({ isOpen, onClose, currentStatus }) {
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState({ front: null, back: null });

    if (!isOpen) return null;

    const handleFileChange = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            setPreviews(prev => ({
                ...prev,
                [side]: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        try {
            const result = await submitVerification(formData);
            if (result.success) {
                alert(result.message);
                onClose();
            } else {
                alert(result.error || "Something went wrong.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-gray-900">Verify Your Identity</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-0.5">Secure your account & build trust</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name (as per NIC)</label>
                            <input 
                                name="fullName"
                                type="text"
                                required
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">NIC Number</label>
                            <input 
                                name="nicNumber"
                                type="text"
                                required
                                placeholder="Enter your NIC card number"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">NIC Front Side</label>
                            <label className="relative aspect-[3/2] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition overflow-hidden">
                                {previews.front ? (
                                    <img src={previews.front} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Camera className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Front</span>
                                    </>
                                )}
                                <input 
                                    name="nicFront"
                                    type="file" 
                                    accept="image/*" 
                                    required
                                    onChange={(e) => handleFileChange(e, 'front')}
                                    className="hidden" 
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">NIC Back Side</label>
                            <label className="relative aspect-[3/2] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition overflow-hidden">
                                {previews.back ? (
                                    <img src={previews.back} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Camera className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Back</span>
                                    </>
                                )}
                                <input 
                                    name="nicBack"
                                    type="file" 
                                    accept="image/*" 
                                    required
                                    onChange={(e) => handleFileChange(e, 'back')}
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
                        <ShieldCheck className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div className="text-xs text-blue-800 leading-relaxed font-medium">
                            Your identity information is stored securely and only used for verification purposes. Once verified, a blue badge will appear on your profile.
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-blue-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-900/10"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit for Verification"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
