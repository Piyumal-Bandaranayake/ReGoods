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
        const nicNumber = formData.get("nicNumber");

        // Client-side validation
        const oldNICRegex = /^[0-9]{9}[vVxX]$/;
        const newNICRegex = /^[0-9]{12}$/;
        
        if (!oldNICRegex.test(nicNumber) && !newNICRegex.test(nicNumber)) {
            alert("Invalid NIC number format. Use 123456789V or 200012345678 format.");
            setLoading(false);
            return;
        }
        
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                <div className="flex flex-col md:flex-row min-h-[500px]">
                    {/* Left Column: Information & Branding */}
                    <div className="md:w-[35%] bg-blue-50/50 p-10 flex flex-col justify-between border-r border-gray-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-blue-500/10 flex items-center justify-center mb-8 rotate-3">
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-950 mb-4 leading-tight">
                                Professional <br/> Verification
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                                Join our elite circle of verified sellers. A verified profile increases buyer trust and boost your sales potential.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest bg-white/80 backdrop-blur px-4 py-3 rounded-xl border border-blue-100 shadow-sm">
                                    <CheckCircle className="w-4 h-4 mr-3" />
                                    Identity Verified
                                </div>
                                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest px-4 py-3">
                                    <CheckCircle className="w-4 h-4 mr-3" />
                                    Account Secured
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 p-5 bg-blue-500/5 rounded-2xl border border-blue-100/50">
                            <p className="text-[10px] text-blue-800 leading-relaxed font-bold uppercase tracking-widest mb-2">Encryption Standard</p>
                            <p className="text-[11px] text-blue-700/70 leading-relaxed font-medium">
                                Your data is protected with military-grade encryption and will never be shared with third parties.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="md:w-[65%] p-10 relative">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-900">Submission Form</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Provide your credentials</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Legal Full Name</label>
                                    <input 
                                        name="fullName"
                                        type="text"
                                        required
                                        placeholder="Ex: John Doe"
                                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">NIC Identifier</label>
                                    </div>
                                    <input 
                                        name="nicNumber"
                                        type="text"
                                        required
                                        placeholder="NIC Number"
                                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">NIC Front Elevation</label>
                                    <label className="group relative aspect-[3/2] rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all overflow-hidden bg-gray-50/30">
                                        {previews.front ? (
                                            <img src={previews.front} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="NIC Front" />
                                        ) : (
                                            <div className="text-center group-hover:translate-y-[-4px] transition-transform">
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 mx-auto">
                                                    <Camera className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Select Image</span>
                                            </div>
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

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">NIC Reverse Elevation</label>
                                    <label className="group relative aspect-[3/2] rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all overflow-hidden bg-gray-50/30">
                                        {previews.back ? (
                                            <img src={previews.back} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="NIC Back" />
                                        ) : (
                                            <div className="text-center group-hover:translate-y-[-4px] transition-transform">
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 mx-auto">
                                                    <Camera className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Select Image</span>
                                            </div>
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

                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-5 px-6 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-5 px-8 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-95 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Submit Credentials
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
