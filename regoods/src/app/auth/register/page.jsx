"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, User, Mail, Phone, Globe, Lock, ArrowRight, ShieldCheck, CheckCircle2, X, FileText, Scale, ShieldAlert, Eye, EyeOff, Check, AlertCircle, Sparkles } from "lucide-react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Credentials mismatch: Passwords do not align.");
      return;
    }

    const termsChecked = e.currentTarget.terms.checked;
    if (!termsChecked) {
      setError("Please accept the Terms and Conditions to proceed.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,102,255,0.12)] overflow-hidden flex flex-col lg:flex-row relative border border-white">

        {/* LEFT SIDE: BRANDING & BENEFITS (WHITE) */}
        <div className="w-full lg:w-[40%] p-8 flex flex-col justify-between relative bg-white z-10 overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">R</div>
              <div>
                <h2 className="text-xs font-black text-gray-900 tracking-tighter uppercase leading-none">ReGoods</h2>
                <p className="text-[8px] font-bold text-sky-500 tracking-[0.2em] uppercase">Verified Merchant</p>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-[1] tracking-tighter">
                Start Your <br /> <span className="text-sky-500">Eco-Friendly</span> <br /> Journey.
              </h1>

              <div className="space-y-4 pt-2">
                {[
                  "Verified Marketplace Protocol",
                  "Professional Seller Dashboard",
                  "Eco-Impact Tracking Tools",
                  "End-to-End Secure Escrow"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-20 mt-8 bg-sky-50 p-4 rounded-[1.5rem] border border-sky-100 flex items-center gap-4 group hover:scale-[1.02] transition-all">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight mb-0.5">Identity Guard</h4>
              <p className="text-[8px] font-bold text-sky-500 uppercase tracking-widest opacity-60">Military-Grade Encryption</p>
            </div>
          </div>
        </div>

        {/* ORGANIC CURVE DIVIDER */}
        <div className="absolute top-0 left-[40%] h-full w-[150px] hidden lg:block z-20 -translate-x-1/2 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 0 L 20 0 C 80 30, 80 70, 20 100 L 0 100 Z" fill="white" />
          </svg>
        </div>

        {/* RIGHT SIDE: REGISTER FORM (SKY-900) */}
        <div className="w-full lg:w-[60%] bg-[#1A365D] p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-400/5 rounded-full blur-[80px]"></div>

          <div className="relative z-30 w-full max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 border border-sky-400/20 rounded-full text-[8px] font-black text-sky-400 uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" />
                Registration Portal
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Register Profile</h2>
              <p className="text-sky-200/40 font-bold text-[10px] uppercase tracking-[0.15em] leading-relaxed">Join our network of verified sustainable merchants <br /> and start making an impact.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Legal Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input name="name" type="text" required className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5" placeholder="John Doe" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Business Contact</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input name="email" type="email" required className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5" placeholder="name@company.com" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Identity Token (Phone)</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input name="phone" type="tel" required className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5" placeholder="+1 (234) 567 890" />
                  </div>
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Jurisdiction</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input name="nationality" type="text" required className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5" placeholder="United States" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Access Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-sky-400/20 transition-all placeholder:text-white/5"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-200/20 hover:text-sky-400 transition-colors">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Verify Key</label>
                  <div className="relative group">
                    <Check className={`absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${passwordsMatch === true ? 'text-emerald-400' : 'text-sky-200/20'}`} />
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/5 ${passwordsMatch === true ? 'border-emerald-500/30' : passwordsMatch === false ? 'border-rose-500/30' : 'border-white/5 focus:border-sky-400/20'}`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl mt-4 group hover:border-sky-400/20 transition-all">
                <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-500 focus:ring-sky-500/20 transition-all cursor-pointer mt-0.5" />
                <label htmlFor="terms" className="text-[9px] font-bold text-sky-200/50 leading-relaxed cursor-pointer group-hover:text-sky-200/70 transition-colors">
                  Authorized Agreement to the <button type="button" onClick={() => setIsTermsOpen(true)} className="text-sky-400 hover:underline underline-offset-4 decoration-2">Verified Merchant Protocols</button> and our encrypted data standards.
                </label>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl text-rose-400 text-[8px] font-black uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00A3FF] hover:bg-[#0088FF] active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_-5px_rgba(0,163,255,0.3)] group disabled:opacity-50 overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" />
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    INITIALIZE VERIFICATION
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold text-sky-200/30 uppercase tracking-tighter">
                Already part of the network?{" "}
                <Link href="/auth/login" className="text-sky-400 font-black hover:underline underline-offset-4 decoration-2 ml-1">
                  Authenticate Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsTermsOpen(false)}></div>
          <div className="relative bg-[#1A365D] border border-white/10 rounded-[2rem] shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in duration-500">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tighter">Global Terms</h3>
                  <p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Authorized Agreements</p>
                </div>
              </div>
              <button onClick={() => setIsTermsOpen(false)} className="p-2 text-sky-200/20 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest">1. Verified Membership</h4>
                <p className="text-xs text-sky-200/60 leading-relaxed font-medium">As a ReGoods member, you agree to provide authentic identification documents upon request to maintain platform security. Professional conduct is required in all communications.</p>
              </div>
              <div className="space-y-2 border-l-2 border-sky-500 pl-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">2. Sustainable Trading</h4>
                <p className="text-xs text-sky-200/60 leading-relaxed font-medium italic">Members represent that all items are legally sourced and accurately described. Counterfeit items are strictly prohibited and result in immediate account termination.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest">3. Privacy & Security</h4>
                <p className="text-xs text-sky-200/60 leading-relaxed font-medium font-mono">RG-PROTO-ENCRYPT: All user data is processed through military-grade hashing (AES-256) to ensure the highest standards of digital safety.</p>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
              <p className="text-[8px] font-black text-sky-200/20 uppercase tracking-widest">Effective: Dec 2025</p>
              <button onClick={() => setIsTermsOpen(false)} className="px-8 py-3 bg-white text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-xl active:scale-95">I Understand</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
