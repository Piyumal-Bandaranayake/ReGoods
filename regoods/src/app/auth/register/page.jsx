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

  // Form State
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Legal name is required";
        else if (value.trim().length < 3) error = "Name must be at least 3 characters";
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = "Name can only contain letters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = "Email is required";
        else if (!emailRegex.test(value)) error = "Invalid email format";
        break;
      case "phone":
        const phoneRegex = /^\+?[0-9\s-]{10,20}$/;
        if (!value.trim()) error = "Phone number is required";
        else if (!phoneRegex.test(value)) error = "Invalid format (min 10 digits)";
        break;
      case "nationality":
        if (!value.trim()) error = "Jurisdiction is required";
        else if (value.trim().length < 3) error = "Include full region (min 3 chars)";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Must be at least 8 characters";
        else if (!/[A-Z]/.test(value)) error = "Include at least one uppercase letter";
        else if (!/[a-z]/.test(value)) error = "Include at least one lowercase letter";
        else if (!/[0-9]/.test(value)) error = "Include at least one number";
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = "Include at least one special character";
        break;
      case "confirmPassword":
        if (!value) error = "Confirmation is required";
        else if (value !== formValues.password) error = "Passwords do not match";
        break;
      case "terms":
        if (!value) error = "Acceptance required";
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormValues(prev => {
      const newValues = { ...prev, [name]: val };
      // If password is changed, re-validate confirmPassword
      if (name === "password" && prev.confirmPassword) {
        validateField("confirmPassword", prev.confirmPassword);
      }
      return newValues;
    });
    if (touched[name]) {
      validateField(name, val);
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const errors = {};
    Object.keys(formValues).forEach(key => {
      errors[key] = validateField(key, formValues[key]);
    });

    setTouched({
      name: true,
      email: true,
      phone: true,
      nationality: true,
      password: true,
      confirmPassword: true,
      terms: true
    });

    const hasErrors = Object.values(errors).some(err => err);
    if (hasErrors) {
      setError("Compliance failure: Please resolve all validation errors.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  };

  const inputClasses = (name) => `w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-xs font-bold text-white focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/5 ${touched[name] && formErrors[name] ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-white/5 focus:border-sky-400/20'}`;

  // Helper for password strength indicators
  const getPasswordStrength = () => {
    const p = formValues.password;
    if (!p) return 0;
    let strength = 0;
    if (p.length >= 8) strength++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) strength++;
    return strength;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,102,255,0.12)] overflow-hidden flex flex-col lg:flex-row relative border border-white">

        {/* LEFT SIDE: BRANDING & BENEFITS (WHITE) */}
        <div className="w-full lg:w-[40%] p-8 flex flex-col justify-between relative bg-white z-10 overflow-hidden text-sky-900">
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
                    <input
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={inputClasses("name")}
                      placeholder="John Doe"
                    />
                  </div>
                  {touched.name && formErrors.name && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Business Contact</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={inputClasses("email")}
                      placeholder="name@company.com"
                    />
                  </div>
                  {touched.email && formErrors.email && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Identity Token (Phone)</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      name="phone"
                      type="tel"
                      value={formValues.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={inputClasses("phone")}
                      placeholder="+1 (234) 567 890"
                    />
                  </div>
                  {touched.phone && formErrors.phone && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.phone}</p>}
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Jurisdiction</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      name="nationality"
                      type="text"
                      value={formValues.nationality}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={inputClasses("nationality")}
                      placeholder="United States"
                    />
                  </div>
                  {touched.nationality && formErrors.nationality && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.nationality}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1 flex justify-between items-center">
                    Access Key
                    {formValues.password && (
                      <span className={`text-[7px] px-1.5 py-0.5 rounded-full border ${getPasswordStrength() <= 1 ? 'border-rose-500/30 text-rose-400' :
                        getPasswordStrength() <= 3 ? 'border-amber-500/30 text-amber-400' :
                          'border-emerald-500/30 text-emerald-400'
                        }`}>
                        Strength: {getPasswordStrength() <= 1 ? 'Weak' : getPasswordStrength() <= 3 ? 'Medium' : 'Strong'}
                      </span>
                    )}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-200/20 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formValues.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={inputClasses("password")}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-200/20 hover:text-sky-400 transition-colors">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {touched.password && formErrors.password && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1 leading-tight">{formErrors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-200/30 uppercase tracking-[0.2em] px-1">Verify Key</label>
                  <div className="relative group">
                    <Check className={`absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${formValues.confirmPassword && formValues.password === formValues.confirmPassword ? 'text-emerald-400' : 'text-sky-200/20'}`} />
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formValues.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={inputClasses("confirmPassword")}
                      placeholder="••••••••"
                    />
                  </div>
                  {touched.confirmPassword && formErrors.confirmPassword && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-1">{formErrors.confirmPassword}</p>}
                </div>
              </div>

              <div className={`flex items-start gap-3 p-4 bg-white/5 border rounded-2xl mt-4 group transition-all ${touched.terms && formErrors.terms ? 'border-rose-500/30 ring-1 ring-rose-500/20' : 'border-white/5 hover:border-sky-400/20'}`}>
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formValues.terms}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-500 focus:ring-sky-500/20 transition-all cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="text-[9px] font-bold text-sky-200/50 leading-relaxed cursor-pointer group-hover:text-sky-200/70 transition-colors">
                  Authorized Agreement to the <button type="button" onClick={() => setIsTermsOpen(true)} className="text-sky-400 hover:underline underline-offset-4 decoration-2">Verified Merchant Protocols</button> and our encrypted data standards.
                </label>
              </div>
              {touched.terms && formErrors.terms && <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest px-4">{formErrors.terms}</p>}

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
