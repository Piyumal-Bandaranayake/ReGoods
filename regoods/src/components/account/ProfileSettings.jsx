"use client";

import { useState, useRef } from "react";
import { updateProfile, updatePassword } from "@/app/actions/user";
import { signOut } from "next-auth/react";
import { Loader2, Camera, Upload, User, Mail, Phone, Globe, FileText, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function ProfileSettings({ user }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("identity");
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user.image || null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [formValues, setFormValues] = useState({
        name: user.name || "",
        phone: user.phone || "",
        nationality: user.nationality || "",
        bio: user.bio || ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "name":
                if (!value.trim()) error = "Name is required";
                else if (value.trim().length < 3) error = "Name must be at least 3 characters";
                else if (!/^[a-zA-Z\s]+$/.test(value)) error = "Name can only contain letters";
                break;
            case "phone":
                if (value) {
                    const phoneRegex = /^\+?[0-9\s-]{10,20}$/;
                    if (!phoneRegex.test(value)) error = "Invalid format (min 10 digits)";
                }
                break;
            case "nationality":
                if (value && value.trim().length < 3) error = "Min 3 characters required";
                break;
            default:
                break;
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

        const errors = {};
        Object.keys(formValues).forEach(key => {
            errors[key] = validateField(key, formValues[key]);
        });
        setTouched({ name: true, phone: true, nationality: true, bio: true });

        if (Object.values(errors).some(err => err)) {
            return;
        }

        setLoading(true);

        const formData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => formData.append(key, value));

        // Handle image if selected
        if (fileInputRef.current?.files?.[0]) {
            formData.append("image", fileInputRef.current.files[0]);
        }

        const result = await updateProfile(formData);

        if (result.success) {
            setIsEditing(false);
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id
                ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                : "text-gray-400 hover:text-sky-500 hover:bg-sky-50"
                }`}
        >
            {label}
        </button>
    );

    if (!isEditing) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-50 pb-6">
                    <div className="flex bg-gray-50 p-1 rounded-2xl w-fit">
                        <TabButton id="identity" label="Identity" />
                        <TabButton id="security" label="Security" />
                    </div>
                    {activeTab === 'identity' && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-sky-500 transition-all shadow-lg shadow-zinc-900/10"
                        >
                            Modify Details
                        </button>
                    )}
                </div>

                {activeTab === 'identity' ? (
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-14 pt-4">
                        {/* Avatar Display */}
                        <div className="flex flex-col items-center shrink-0">
                            <div className="relative group">
                                <div className="h-32 w-32 md:h-44 md:w-44 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden bg-sky-50 flex items-center justify-center transition-transform hover:scale-105 duration-500">
                                    {user.image ? (
                                        <img src={user.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold text-sky-200">{user.name[0].toUpperCase()}</span>
                                    )}
                                </div>
                                {user.isVerified ? (
                                    <div className="absolute -bottom-2 -right-2 bg-sky-500 p-2 rounded-2xl border-4 border-white shadow-lg">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                ) : (
                                    <Link
                                        href="/account/verify"
                                        className="absolute -bottom-2 -right-2 bg-amber-500 hover:bg-zinc-900 p-2.5 rounded-2xl border-4 border-white shadow-lg transition-all active:scale-95 group"
                                        title="Verify Now"
                                    >
                                        <Shield className="w-5 h-5 text-white" />
                                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            Verify Identity
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="flex-1 w-full space-y-10">
                            <section className="bg-sky-50/50 p-8 rounded-[2rem] border border-sky-100/50">
                                <label className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <FileText className="w-3.5 h-3.5 mr-2 text-sky-500" />
                                    Personal Bio
                                </label>
                                <p className="text-gray-600 text-[15px] leading-relaxed italic font-medium">
                                    "{user.bio || "No biography provided. Share a bit about your journey to build trust within the ReGoods community."}"
                                </p>
                            </section>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 px-2 lg:px-4">
                                <InfoField label="Full Name" value={user.name} icon={<User />} />
                                <InfoField label="Email Status" value={user.email} icon={<Mail />} verified />
                                <InfoField label="Phone Contact" value={user.phone || "Not provided"} icon={<Phone />} />
                                <InfoField label="Primary Region" value={user.nationality || "International"} icon={<Globe />} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <PasswordSection />
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Edit Identity</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Update your information</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                        Discard Changes
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center shrink-0">
                        <div
                            className="group relative h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-dashed border-sky-100 overflow-hidden bg-sky-50/50 flex items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all duration-500"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewImage ? (
                                <>
                                    <img src={previewImage} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    <div className="absolute inset-0 bg-sky-500/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                        <Camera className="w-10 h-10 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-sky-200 group-hover:text-sky-500 transition-colors">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <p className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                            JPG/PNG RECOMMENDED
                        </p>
                    </div>

                    {/* Form Fields Section */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Display Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formValues.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`block w-full rounded-2xl border py-2.5 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none transition-all text-sm font-medium ${touched.name && formErrors.name ? 'border-red-400 bg-red-50/10' : 'border-sky-50 bg-sky-50/30'}`}
                                placeholder="Full Name"
                            />
                            {touched.name && formErrors.name && <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase px-1">{formErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Email Address (Read-only)</label>
                            <div className="block w-full rounded-2xl border border-sky-50 py-2.5 px-5 text-gray-400 bg-sky-50/50 cursor-not-allowed text-xs font-bold uppercase tracking-wider">
                                {user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Contact Number</label>
                            <input
                                name="phone"
                                type="tel"
                                value={formValues.phone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`block w-full rounded-2xl border py-2.5 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none transition-all text-sm font-medium ${touched.phone && formErrors.phone ? 'border-red-400 bg-red-50/10' : 'border-sky-50 bg-sky-50/30'}`}
                                placeholder="+1 234 567 890"
                            />
                            {touched.phone && formErrors.phone && <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase px-1">{formErrors.phone}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Nationality / Primary Region</label>
                            <input
                                name="nationality"
                                type="text"
                                value={formValues.nationality}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`block w-full rounded-2xl border py-2.5 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none transition-all text-sm font-medium ${touched.nationality && formErrors.nationality ? 'border-red-400 bg-red-50/10' : 'border-sky-50 bg-sky-50/30'}`}
                                placeholder="e.g. United Kingdom"
                            />
                            {touched.nationality && formErrors.nationality && <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase px-1">{formErrors.nationality}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Identity Bio</label>
                            <textarea
                                name="bio"
                                rows={3}
                                value={formValues.bio}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="block w-full rounded-2xl border border-sky-50 py-3 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none bg-sky-50/30 transition-all resize-none text-sm font-medium leading-relaxed"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-sky-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-3 px-8 py-3.5 bg-sky-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-900 transition-all disabled:opacity-70 shadow-xl shadow-sky-500/20 active:scale-95"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Save Changes"}
                        {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </button>
                </div>
            </form>
        </div>
    );
}

function PasswordSection() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [formValues, setFormValues] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "currentPassword":
                if (!value) error = "Current password is required";
                break;
            case "newPassword":
                if (!value) error = "New password is required";
                else if (value.length < 8) error = "Must be at least 8 characters";
                else if (!/[A-Z]/.test(value)) error = "Include an uppercase letter";
                else if (!/[a-z]/.test(value)) error = "Include a lowercase letter";
                else if (!/[0-9]/.test(value)) error = "Include a number";
                else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = "Include a special character";
                break;
            case "confirmPassword":
                if (!value) error = "Confirmation is required";
                else if (value !== formValues.newPassword) error = "Passwords do not match";
                break;
            default:
                break;
        }
        setFormErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => {
            const newValues = { ...prev, [name]: value };
            if (name === "newPassword" && prev.confirmPassword) {
                validateField("confirmPassword", prev.confirmPassword);
            }
            return newValues;
        });
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Full validation
        const errors = {};
        Object.keys(formValues).forEach(key => {
            errors[key] = validateField(key, formValues[key]);
        });
        setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });

        if (Object.values(errors).some(err => err)) {
            setMessage({ type: "error", text: "Please fix the validation errors before submitting." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => formData.append(key, value));

        const result = await updatePassword(formData);

        if (result.success) {
            setMessage({ type: "success", text: result.message + " Signing out for security..." });
            setFormValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(async () => {
                await signOut({ redirect: false });
                window.location.href = "/auth/login";
            }, 3000);
        } else {
            setMessage({ type: "error", text: result.error });
            setLoading(false);
        }
    };

    const getStrength = () => {
        const p = formValues.newPassword;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) s++;
        return s;
    };

    const inputClasses = (name) => `block w-full rounded-2xl border py-2.5 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none transition-all text-sm font-medium ${touched[name] && formErrors[name] ? 'border-red-400 bg-red-50/10' : 'border-sky-50 bg-sky-50/30'}`;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Update your account password</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            value={formValues.currentPassword}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={inputClasses("currentPassword")}
                            placeholder="••••••••"
                        />
                        {touched.currentPassword && formErrors.currentPassword && <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase px-1">{formErrors.currentPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 flex justify-between">
                            New Password
                            {formValues.newPassword && (
                                <span className={`text-[8px] px-2 py-0.5 rounded-full border ${getStrength() <= 1 ? 'border-red-200 text-red-500' : getStrength() <= 3 ? 'border-amber-200 text-amber-500' : 'border-emerald-200 text-emerald-500'}`}>
                                    {getStrength() <= 1 ? 'Weak' : getStrength() <= 3 ? 'Fair' : 'Strong'}
                                </span>
                            )}
                        </label>
                        <input
                            name="newPassword"
                            type="password"
                            value={formValues.newPassword}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={inputClasses("newPassword")}
                            placeholder="Min. 8 characters + mixed"
                        />
                        {touched.newPassword && formErrors.newPassword && <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase px-1 leading-tight">{formErrors.newPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Confirm New Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formValues.confirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={inputClasses("confirmPassword")}
                            placeholder="Repeat new password"
                        />
                        {touched.confirmPassword && formErrors.confirmPassword && <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase px-1">{formErrors.confirmPassword}</p>}
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-2xl text-[11px] font-bold uppercase tracking-tight flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {message.type === 'error' && <AlertCircle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                <div className="flex justify-start pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-3 px-10 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-sky-500 transition-all disabled:opacity-70 shadow-xl shadow-zinc-900/10 active:scale-95 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Update Password"}
                        {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    </button>
                </div>
            </form>
        </div>
    );
}

function InfoField({ label, value, icon, verified }) {
    return (
        <div className="group">
            <label className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                <span className="text-sky-500 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">{React.cloneElement(icon, { className: "w-3.5 h-3.5" })}</span>
                {label}
            </label>
            <div className="flex items-center">
                <p className="text-gray-950 font-bold text-base md:text-lg tracking-tight truncate">{value}</p>
                {verified && <CheckCircle className="w-4 h-4 ml-2.5 text-sky-500 flex-shrink-0" />}
            </div>
        </div>
    );
}
