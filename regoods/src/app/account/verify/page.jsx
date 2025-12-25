"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, Upload, Camera, CheckCircle, ArrowLeft, Building2 } from "lucide-react";
import { submitVerification, getCurrentUserStatus } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerificationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [userStatus, setUserStatus] = useState(null);
    const [previews, setPreviews] = useState({ front: null, back: null });

    useEffect(() => {
        const fetchStatus = async () => {
            const status = await getCurrentUserStatus();
            setUserStatus(status);
            setPageLoading(false);
            if (status?.verificationStatus === "Verified") {
                router.push("/account");
            }
        };
        fetchStatus();
    }, [router]);

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

        // Client-side validation (matching modal logic)
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
                router.push("/account");
            } else {
                alert(result.error || "Something went wrong.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (userStatus?.verificationStatus === "Pending") {
        return (
            <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Pending</h2>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Our security team is currently reviewing your application. This process typically takes 24-48 hours. We'll notify you once it's complete.
                    </p>
                    <Link href="/account" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-600">
                        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white overflow-hidden flex items-center justify-center">
            <main className="max-w-6xl w-full mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Left: Info Section */}
                    <div className="lg:w-1/3">
                        <Link href="/account" className="inline-flex items-center text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Account
                        </Link>

                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-8 h-8 text-blue-500" />
                        </div>

                        <h1 className="text-4xl font-black text-gray-950 tracking-tight leading-tight mb-4 uppercase">
                            Seller <br /> Verification
                        </h1>

                        <p className="text-gray-600 text-sm leading-relaxed mb-8 font-medium max-w-xs">
                            Validate your identity to unlock premium selling features, build customer trust, and secure your transactions.
                        </p>

                        <div className="space-y-5">
                            <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Verified Seller Badge" description="Display trust badge on listings." />
                            <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Direct Payouts" description="Faster clearing for sales." />
                        </div>
                    </div>

                    {/* Right: The Form */}
                    <div className="lg:w-2/3 w-full">
                        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-10 md:p-12 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Legal Full Name</label>
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            placeholder="Full Name"
                                            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">NIC Identifier Number</label>
                                        <input
                                            name="nicNumber"
                                            type="text"
                                            required
                                            placeholder="Ex: 123456789V"
                                            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">NIC Front Elevation</label>
                                        <label className="group relative aspect-[16/9] rounded-[2rem] bg-white border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all overflow-hidden shadow-sm">
                                            {previews.front ? (
                                                <img src={previews.front} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="NIC Front" />
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                                        <Camera className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Select Image</span>
                                                </div>
                                            )}
                                            <input name="nicFront" type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'front')} className="hidden" />
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">NIC Reverse Elevation</label>
                                        <label className="group relative aspect-[16/9] rounded-[2rem] bg-white border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all overflow-hidden shadow-sm">
                                            {previews.back ? (
                                                <img src={previews.back} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="NIC Back" />
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                                        <Camera className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Select Image</span>
                                                </div>
                                            )}
                                            <input name="nicBack" type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'back')} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4 items-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto min-w-[300px] py-4 px-10 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-950 transition-all flex items-center justify-center disabled:opacity-50 shadow-2xl shadow-blue-500/20 active:scale-95 group"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </button>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Building2 className="w-3.5 h-3.5" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Secure AES-256 Submission</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FeatureItem({ icon, label, description }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-0.5">{icon}</div>
            <div>
                <p className="text-sm font-bold text-gray-900 leading-none mb-1.5">{label}</p>
                <p className="text-xs text-gray-500 font-medium leading-tight">{description}</p>
            </div>
        </div>
    );
}
