"use client";

import { useState, useRef } from "react";
import { updateProfile } from "@/app/actions/user";
import { Loader2, Camera, Upload, User, Mail, Phone, Globe, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
            <div className="space-y-10 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-900">Personal Identity</h3>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 bg-blue-50 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                    >
                        Modify Details
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
                    {/* Avatar Display */}
                    <div className="flex flex-col items-center shrink-0">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-blue-50 flex items-center justify-center md:rotate-2 transition-transform duration-500">
                            {user.image ? (
                                <img src={user.image} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl md:text-5xl font-serif italic text-blue-200">{user.name[0].toUpperCase()}</span>
                            )}
                        </div>
                        <p className="mt-4 md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Identity</p>
                    </div>

                    {/* Info Grid */}
                    <div className="flex-1 w-full space-y-8 text-center md:text-left">
                        <section className="bg-gray-50/50 p-6 rounded-2xl md:bg-transparent md:p-0">
                            <label className="flex items-center justify-center md:justify-start text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                                <FileText className="w-3 h-3 mr-2 text-blue-500" />
                                Account Bio
                            </label>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-xl italic">
                                "{user.bio || "No biography provided. Use the modify button to introduce yourself to the community."}"
                            </p>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                            <InfoField label="Full Name" value={user.name} icon={<User />} />
                            <InfoField label="Email Status" value={user.email} icon={<Mail />} verified />
                            <InfoField label="Phone Contact" value={user.phone || "Not provided"} icon={<Phone />} />
                            <InfoField label="Primary Region" value={user.nationality || "Global"} icon={<Globe />} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900">Edit Identity</h3>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                    Discard Changes
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Photo Upload Section */}
                <div className="flex flex-col items-center shrink-0">
                    <div 
                        className="group relative h-40 w-40 md:h-48 md:w-48 rounded-[2.5rem] border-4 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-500"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewImage ? (
                            <>
                                <img src={previewImage} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <Camera className="w-10 h-10 text-white" />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">New Photo</span>
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
                    <p className="mt-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest lg:w-40 leading-relaxed px-4 lg:px-0">
                        Square format recommended. <br className="hidden lg:block"/> JPG or PNG only.
                    </p>
                </div>

                {/* Form Fields Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={user.name}
                            required
                            className="block w-full rounded-2xl border border-gray-100 py-4 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 transition-all"
                            placeholder="How should we address you?"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Primary Email (Locked)</label>
                        <div className="block w-full rounded-2xl border border-gray-50 py-4 px-5 text-gray-400 bg-gray-50 cursor-not-allowed text-sm font-medium">
                            {user.email}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            defaultValue={user.phone}
                            className="block w-full rounded-2xl border border-gray-100 py-4 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 transition-all"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Nationality / Region</label>
                        <input
                            name="nationality"
                            type="text"
                            defaultValue={user.nationality}
                            className="block w-full rounded-2xl border border-gray-100 py-4 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 transition-all"
                            placeholder="e.g. United Kingdom, Tokyo based, etc."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Personal Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            defaultValue={user.bio}
                            className="block w-full rounded-2xl border border-gray-100 py-4 px-5 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 transition-all resize-none"
                            placeholder="Tell your story. Shared interests build trust in our community."
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="group w-full sm:w-auto px-10 py-4 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-900 transition-all disabled:opacity-70 flex items-center justify-center shadow-xl shadow-blue-500/20 order-1 sm:order-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <div className="w-2 h-2 rounded-full bg-white mr-3 group-hover:scale-150 transition-transform" />}
                    Confirm Identity Update
                </button>
            </div>
        </form>
    );
}

function InfoField({ label, value, icon, verified }) {
    return (
        <div className="group text-center sm:text-left bg-white p-4 sm:p-0 rounded-2xl sm:rounded-none">
            <label className="flex items-center justify-center sm:justify-start text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <span className="text-blue-500 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">{icon && typeof icon === 'object' ? React.cloneElement(icon, { className: "w-3 h-3" }) : icon}</span>
                {label}
            </label>
            <div className="flex items-center justify-center sm:justify-start">
                <p className="text-gray-900 font-bold text-base md:text-lg break-all">{value}</p>
                {verified && <CheckCircle className="w-4 h-4 ml-2 text-green-500 flex-shrink-0" />}
            </div>
        </div>
    );
}

import React from "react";
