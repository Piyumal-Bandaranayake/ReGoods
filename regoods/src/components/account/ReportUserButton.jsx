"use client";

import { useState } from "react";
import { Flag, Loader2, X, Upload, Camera, AlertCircle } from "lucide-react";
import { reportUser } from "@/app/actions/user";

export default function ReportUserButton({ userId, userName, iconOnly = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reported, setReported] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const COMMON_REASONS = [
        "Fraud/Scam",
        "Inappropriate Content",
        "Selling Prohibited Items",
        "Harassment",
        "Fake Account",
        "Other"
    ];

    const toggleModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsOpen(!isOpen);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("Maximum 5 images allowed.");
            return;
        }

        setImages(prev => [...prev, ...files]);
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("reportedUserId", userId);
        
        // Add images to form data
        images.forEach(image => {
            formData.append("images", image);
        });

        try {
            const result = await reportUser(formData);
            if (result.success) {
                setReported(true);
                setIsOpen(false);
                alert(result.message);
            } else {
                alert(result.error || "Failed to report seller.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (reported) {
        return iconOnly ? (
            <div className="p-2 border border-red-100 rounded-full bg-red-50 text-red-600" title="Reported">
                <Flag className="w-5 h-5 fill-current" />
            </div>
        ) : (
            <div className="px-6 py-3 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-sm border border-red-100 flex items-center">
                <Flag className="w-4 h-4 mr-2 fill-current" />
                Reported
            </div>
        );
    }

    return (
        <>
            {iconOnly ? (
                <button
                    onClick={toggleModal}
                    className="p-2 border border-gray-200 rounded-full hover:bg-red-50 hover:border-red-200 transition text-gray-400 hover:text-red-500"
                    title="Report Seller"
                >
                    <Flag className="w-5 h-5" />
                </button>
            ) : (
                <button
                    onClick={toggleModal}
                    className="px-6 py-3 border border-red-200 text-red-500 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-red-50 transition flex items-center"
                >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Seller
                </button>
            )}

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Modal Content */}
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight">Report Seller</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Target: {userName}</p>
                            </div>
                            <button 
                                onClick={toggleModal}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-900"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
                            <div className="p-2.5 bg-amber-50/50 rounded-xl flex items-start text-amber-800 text-[10px] leading-relaxed border border-amber-100/50">
                                <AlertCircle className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>False reporting may lead to account suspension. Please be specific.</span>
                            </div>

                            {/* Reason Dropdown */}
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Reason</label>
                                <select 
                                    name="reason" 
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition"
                                >
                                    <option value="">Select a reason...</option>
                                    {COMMON_REASONS.map(reason => (
                                        <option key={reason} value={reason}>{reason}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Details</label>
                                <textarea 
                                    name="description" 
                                    required
                                    rows={3}
                                    placeholder="Please provide specific details..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition resize-none"
                                ></textarea>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Evidence (Optional)</label>
                                <div className="grid grid-cols-5 gap-2 mt-1.5">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 5 && (
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-white transition group">
                                            <Camera className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                                            <span className="text-[7px] text-gray-300 mt-1 font-black group-hover:text-black transition-colors">ADD</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                multiple 
                                                onChange={handleImageChange}
                                                className="hidden" 
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Action Buttons */}
                            <div className="pt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="flex-1 py-3 px-4 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-3 px-4 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Send Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
