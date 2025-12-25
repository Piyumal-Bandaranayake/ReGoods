"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Phone, HelpCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created! Please log in.");
    }
  }, [searchParams]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Invalid email format";
    } else if (name === "password") {
      if (!value) error = "Password is required";
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all
    const eError = validateField("email", formValues.email);
    const pError = validateField("password", formValues.password);

    setTouched({ email: true, password: true });

    if (eError || pError) {
      setError("Please enter valid credentials.");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email: formValues.email,
      password: formValues.password,
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
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  const inputClasses = (name) => `w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/5 ${touched[name] && formErrors[name] ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-white/5 focus:border-sky-400/20'}`;

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,102,255,0.12)] overflow-hidden flex flex-col md:flex-row relative border border-white">

        {/* LEFT SIDE: BRANDING & ILLUSTRATION (WHITE) */}
        <div className="w-full md:w-[45%] p-8 flex flex-col justify-between relative bg-white z-10 overflow-hidden text-sky-900">
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">R</div>
              <div>
                <h2 className="text-xs font-black text-gray-900 tracking-tighter uppercase leading-none">ReGoods</h2>
                <p className="text-[8px] font-bold text-sky-500 tracking-[0.2em] uppercase">Verified Identity</p>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-[1] tracking-tighter">
                Premium <br /> Sustainable <br /> <span className="text-sky-500 underline decoration-sky-100 underline-offset-4">Marketplace.</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-xs uppercase tracking-tight opacity-60">
                Join thousands of eco-conscious traders in our secure community.
              </p>
            </div>
          </div>

          <div className="relative z-20 mt-6 flex justify-center">
            <img
              src="/regoods_login_illustration.png"
              alt="Sustainability"
              className="w-full max-w-[180px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="relative z-20 mt-4 flex items-center justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
            <span>© 2024 REGOODS. GLOBAL</span>
            <span>Est. 2023</span>
          </div>
        </div>

        {/* ORGANIC CURVE DIVIDER */}
        <div className="absolute top-0 left-[45%] h-full w-[150px] hidden md:block z-20 -translate-x-1/2 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 0 L 20 0 C 80 30, 80 70, 20 100 L 0 100 Z" fill="white" />
          </svg>
        </div>

        {/* RIGHT SIDE: AUTH FORM (SKY-900) */}
        <div className="w-full md:w-[55%] bg-[#1A365D] p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-400/5 rounded-full blur-[60px] -ml-20 -mb-20"></div>

          <div className="relative z-30 max-w-xs mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Login</h2>
              <p className="text-sky-200/40 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Secure access for verified <br /> community members.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400 text-[8px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Identity (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={inputClasses("email")}
                    placeholder="Enter your email"
                  />
                </div>
                {touched.email && formErrors.email && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em]">Secret Key (Password)</label>
                  <Link href="#" className="text-[8px] font-black text-sky-400/60 hover:text-sky-300 transition-colors uppercase tracking-tight">Recover Key?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={inputClasses("password")}
                    placeholder="••••••••"
                  />
                </div>
                {touched.password && formErrors.password && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.password}</p>}
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl text-rose-400 text-[8px] font-black uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00A3FF] hover:bg-[#0088FF] active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_-5px_rgba(0,163,255,0.3)] overflow-hidden relative group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" />
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    ENTER DASHBOARD
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold text-sky-200/30 uppercase tracking-tighter">
                New to the community?{" "}
                <Link href="/auth/register" className="text-sky-400 font-black hover:underline underline-offset-4 decoration-2 ml-1">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
