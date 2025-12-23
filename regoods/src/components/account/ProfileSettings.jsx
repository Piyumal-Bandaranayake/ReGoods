"use client";

import { useState, useRef } from "react";
import { updateProfile } from "@/app/actions/user";
import { Loader2, Camera, Upload } from "lucide-react";
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
            <div className="space-y-8">
                <h3 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">Profile Settings</h3>

                <div className="bg-white border border-gray-200 p-8">
                    <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-6">Personal Information</h4>

                    <div className="flex items-start mb-8">
                        <div className="h-24 w-24 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center text-4xl font-serif italic text-black mr-6">
                            {user.image ? (
                                <img src={user.image} className="w-full h-full object-cover" />
                            ) : (
                                user.name[0].toUpperCase()
                            )}
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 text-lg">{user.name}</h5>
                            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {user.role === 'admin' ? 'Admin' : 'Verified Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm">
                                {user.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm">
                                {user.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm">
                                {user.phone || "Not set"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nationality</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm">
                                {user.nationality || "Not set"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Member Since</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bio</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm min-h-[100px] whitespace-pre-wrap">
                                {user.bio || "No bio added yet."}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3 bg-blue-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-black transition shadow-lg shadow-blue-900/20"
                        >
                            Edit Details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h3 className="text-xl font-serif font-bold text-gray-900">Edit Profile</h3>
                <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-black hover:underline"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8">
                {/* Image Upload */}
                <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start">
                    <div
                        className="group relative h-32 w-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-black transition"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewImage ? (
                            <>
                                <img src={previewImage} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-black">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-bold uppercase">Upload</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        name="image"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                        <label className="block text-sm font-bold text-gray-900">Profile Photo</label>
                        <p className="text-xs text-gray-500 mt-1 mb-3">
                            Click the image to upload a new photo. <br />
                            JPG, GIF or PNG. Max size of 2MB.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={user.name}
                            required
                            className="block w-full rounded-none border border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black outline-none bg-white transition"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Read-Only Fields */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address (Read Only)</label>
                        <div className="block w-full rounded-none border border-gray-100 py-3 px-4 text-gray-500 bg-gray-50 cursor-not-allowed text-sm font-medium">
                            {user.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            defaultValue={user.phone}
                            className="block w-full rounded-none border border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black outline-none bg-white transition"
                            placeholder="e.g. +1 234 567 890"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Nationality</label>
                        <input
                            name="nationality"
                            type="text"
                            defaultValue={user.nationality}
                            className="block w-full rounded-none border border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black outline-none bg-white transition"
                            placeholder="e.g. American, British, etc."
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            defaultValue={user.bio}
                            className="block w-full rounded-none border border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black outline-none bg-white transition resize-none"
                            placeholder="Tell us a little about yourself..."
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-black transition disabled:opacity-70 flex items-center shadow-lg shadow-blue-900/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
