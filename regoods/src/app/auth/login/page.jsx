"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created! Please log in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error.includes("banned")) {
        setError(res.error);
      } else {
        setError("Invalid credentials. Please verify and try again.");
      }
      setLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden px-6 pt-[100px]">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50/50 rounded-full blur-[80px]"></div>
      
      <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl shadow-blue-500/5 overflow-hidden flex flex-col md:flex-row border border-gray-100 animate-fade-in-up relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="md:w-[45%] bg-blue-50/30 p-12 flex flex-col justify-between relative overflow-hidden border-r border-gray-50">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-baseline mb-16 group">
              <span className="font-serif italic text-3xl text-gray-950 font-black tracking-tight group-hover:text-blue-500 transition-colors">Re</span>
              <span className="font-sans font-black text-3xl tracking-tighter text-gray-900 underline decoration-blue-500 decoration-4 underline-offset-4">Goods</span>
              <span className="text-blue-500 text-4xl leading-none">.</span>
            </Link>

            <div className="space-y-6">
              <div className="w-16 h-1 w-12 bg-blue-500 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-950 leading-tight">
                Curating the <br/> Future of Thrift.
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                Join our premium community and experience sustainability through a curated lens of quality and style.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur rounded-[1.5rem] shadow-sm border border-blue-100">
               <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Security Standard</p>
                  <p className="text-xs font-bold text-black-900">End-to-end encrypted access</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-[55%] p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
             <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4 bg-blue-50 px-4 py-2 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>Member Portal</span>
             </div>
             <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h3>
             <p className="text-gray-400 font-medium">Please enter your verified credentials</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMsg && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-[11px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
                {successMsg}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Mail className="w-5 h-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                   <Lock className="w-5 h-5" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400"
                  placeholder="Password"
                />
              </div>
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
                  <span>Authenticate Access</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            First time at ReGoods?{" "}
            <Link href="/auth/register" className="text-blue-500 font-bold hover:underline underline-offset-4 decoration-2">
              Create a profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-vh-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
