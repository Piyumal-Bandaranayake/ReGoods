"use client";

import { useState, useRef } from "react";
import { updateProfile } from "@/app/actions/user";
import { Loader2, Camera, Upload, User, Mail, Phone, Globe, FileText, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProfileSettings({ user }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result.success) {
            setIsEditing(false);
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    if (!isEditing) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Personal Identity</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your public persona</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-900 transition-all shadow-lg shadow-sky-200/50"
                    >
                        Modify Details
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-14">
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
                            {user.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-sky-500 p-2 rounded-2xl border-4 border-white shadow-lg">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
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
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-500">
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
                        className="group relative h-40 w-40 md:h-52 md:w-52 rounded-[3rem] border-4 border-dashed border-sky-100 overflow-hidden bg-sky-50/50 flex items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all duration-500"
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
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Display Name</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={user.name}
                            required
                            className="block w-full rounded-2xl border border-sky-50 py-4 px-6 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none bg-sky-50/30 transition-all text-sm font-medium"
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Email Address (Read-only)</label>
                        <div className="block w-full rounded-2xl border border-sky-50 py-4 px-6 text-gray-400 bg-sky-50/50 cursor-not-allowed text-xs font-bold uppercase tracking-wider">
                            {user.email}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Contact Number</label>
                        <input
                            name="phone"
                            type="tel"
                            defaultValue={user.phone}
                            className="block w-full rounded-2xl border border-sky-50 py-4 px-6 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none bg-sky-50/30 transition-all text-sm font-medium"
                            placeholder="+1 234 567 890"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Nationality / Primary Region</label>
                        <input
                            name="nationality"
                            type="text"
                            defaultValue={user.nationality}
                            className="block w-full rounded-2xl border border-sky-50 py-4 px-6 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none bg-sky-50/30 transition-all text-sm font-medium"
                            placeholder="e.g. United Kingdom"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Identity Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            defaultValue={user.bio}
                            className="block w-full rounded-2xl border border-sky-50 py-4 px-6 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/5 focus:border-sky-300 outline-none bg-sky-50/30 transition-all resize-none text-sm font-medium leading-relaxed"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-sky-50 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-sky-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-900 transition-all disabled:opacity-70 shadow-xl shadow-sky-500/20 active:scale-95"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Save Changes"}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
            </div>
        </form>
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
