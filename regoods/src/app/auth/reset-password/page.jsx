"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/auth";
import { Loader2, Lock, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid Request: No security token provided.");
        }
    }, [token]);

    const getPasswordStrength = () => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Protocol failure: Reset token missing.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Security mismatch: Passwords do not match.");
            return;
        }

        setLoading(true);
        const result = await resetPassword(token, password);
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,102,255,0.12)] p-10 text-center border border-white animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500 shadow-xl shadow-emerald-500/10">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Security Updated</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                        Your credentials have been successfully updated. <br /> Redirecting to the secure login gateway...
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,102,255,0.12)] overflow-hidden flex flex-col md:flex-row relative border border-white">
                
                {/* LEFT SIDE: BRANDING (WHITE) */}
                <div className="w-full md:w-[45%] p-8 flex flex-col justify-between relative bg-white z-10 overflow-hidden text-sky-900">
                    <div className="relative z-20">
                        <div className="flex items-center gap-3 mb-8 group">
                            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-sky-500/20">R</div>
                            <div>
                                <h2 className="text-xs font-black text-gray-900 tracking-tighter uppercase leading-none">ReGoods</h2>
                                <p className="text-[8px] font-bold text-sky-500 tracking-[0.2em] uppercase">Security Portal</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-black text-gray-900 leading-[1] tracking-tighter uppercase">
                                Update Your <br /> Access <span className="text-sky-500">Keys.</span>
                            </h1>
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-xs uppercase tracking-tight opacity-60">
                                Choose a strong, unique password to maintain your account's integrity.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-20 bg-sky-50 p-6 rounded-[2rem] border border-sky-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">Encrypted Reset</h4>
                            <p className="text-[8px] font-bold text-sky-500 uppercase tracking-widest opacity-60">AES-256 Bit Security</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: RESET FORM (SKY-900) */}
                <div className="w-full md:w-[55%] bg-[#1A365D] p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    
                    <div className="relative z-30 max-w-xs mx-auto w-full">
                        <div className="mb-8 font-black text-white">
                            <h2 className="text-2xl tracking-tighter uppercase mb-2">Reset Password</h2>
                            <p className="text-sky-200/40 text-[9px] uppercase tracking-widest">Global Marketplace Standard</p>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-rose-400 text-[9px] font-black uppercase tracking-widest text-center mb-6 flex items-center justify-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[9px] font-black text-sky-200/30 uppercase tracking-[0.2em]">New Access Key</label>
                                    {password && (
                                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full border ${getPasswordStrength() <= 1 ? 'border-rose-500/30 text-rose-400' :
                                            getPasswordStrength() <= 3 ? 'border-amber-500/30 text-amber-400' :
                                                'border-emerald-500/30 text-emerald-400'
                                            }`}>
                                            STRENGTH: {getPasswordStrength() <= 1 ? 'WEAK' : getPasswordStrength() <= 3 ? 'MEDIUM' : 'STRONG'}
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-200/20 hover:text-sky-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Verify Identity</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full py-4 bg-[#00A3FF] hover:bg-[#0088FF] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-sky-500/20 disabled:opacity-50 mt-4 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        INITIALIZE SECURE UPDATE
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <Link href="/auth/login" className="text-[10px] font-black text-sky-400/60 hover:text-sky-400 transition-colors uppercase tracking-widest">
                                Return to Authenticate
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#F8FAFF] font-black text-sky-500">INITIALIZING SECURITY...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
