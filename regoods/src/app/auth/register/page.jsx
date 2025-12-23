"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, User, Mail, Phone, Globe, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden px-6 pt-[100px] pb-12">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-blue-50/50 rounded-full blur-[80px]"></div>
      
      <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl shadow-blue-500/5 overflow-hidden flex flex-col lg:flex-row border border-gray-100 animate-fade-in-up relative z-10">
        
        {/* Left Side: Branding & Why Join */}
        <div className="lg:w-[40%] bg-blue-50/30 p-10 md:p-14 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-50">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-baseline mb-12 group">
              <span className="font-serif italic text-3xl text-gray-950 font-black tracking-tight group-hover:text-blue-500 transition-colors">Re</span>
              <span className="font-sans font-black text-3xl tracking-tighter text-gray-900 underline decoration-blue-500 decoration-4 underline-offset-4">Goods</span>
              <span className="text-blue-500 text-4xl leading-none">.</span>
            </Link>

            <div className="space-y-8">
              <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-950 leading-tight">
                Join the <br/> Revolution.
              </h2>
              
              <div className="space-y-6">
                {[
                  "Access to curated premium collections",
                  "Verify your identity for secure trades",
                  "Lower carbon footprint with every purchase",
                  "Professional dashboard for sellers"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="bg-blue-500/10 p-1.5 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 group-hover:text-white" />
                    </div>
                    <p className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur rounded-[1.5rem] shadow-sm border border-blue-100">
               <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Identity Guard</p>
                  <p className="text-xs font-bold text-gray-900">Verified Marketplace Protocols</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-[60%] p-10 md:p-14 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
             <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Global Account</h3>
             <p className="text-gray-400 font-medium">Please provide your professional details below</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <User className="w-4 h-4" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Full Legal Name"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Mail className="w-4 h-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Phone className="w-4 h-4" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Contact Number"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Globe className="w-4 h-4" />
                </div>
                <input
                  name="nationality"
                  type="text"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Nationality"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Lock className="w-4 h-4" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Secure Password"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Lock className="w-4 h-4" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Confirm Access Key"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-5 w-5 rounded-lg border-gray-300 text-blue-500 focus:ring-blue-500/20 transition-all cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs font-bold text-gray-600 leading-none cursor-pointer">
                Authorized Agreement to the{" "}
                <a href="#" className="text-blue-500 hover:underline underline-offset-2 decoration-2">
                  Standard Terms and Conditions
                </a>
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center bg-red-50 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-gray-950 text-white rounded-[1.5rem] py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-blue-500 shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Initialize Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            Already part of ReGoods?{" "}
            <Link href="/auth/login" className="text-blue-500 font-bold hover:underline underline-offset-4 decoration-2">
              Authenticate here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
