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
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-900">Report Seller</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-0.5">Reporting {userName}</p>
                            </div>
                            <button 
                                onClick={toggleModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-900"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                            <div className="p-3 bg-amber-50 rounded-lg flex items-start text-amber-800 text-xs leading-relaxed">
                                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Please provide clear details. False reporting may lead to actions against your account.</span>
                            </div>

                            {/* Reason Dropdown */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Reason for report</label>
                                <select 
                                    name="reason" 
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition"
                                >
                                    <option value="">Select a reason...</option>
                                    {COMMON_REASONS.map(reason => (
                                        <option key={reason} value={reason}>{reason}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                                <textarea 
                                    name="description" 
                                    required
                                    rows={4}
                                    placeholder="Please provide specific details about the issue..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition resize-none"
                                ></textarea>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Evidence / Screenshots (Optional)</label>
                                <div className="grid grid-cols-4 gap-3 mt-2">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 5 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition">
                                            <Camera className="w-5 h-5 text-gray-400 mb-1" />
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Add Photo</span>
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
                                <p className="text-[10px] text-gray-400 mt-2 italic">Up to 5 images. Max 2MB each.</p>
                            </div>

                            {/* Footer / Action Buttons */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="flex-1 py-4 px-6 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 px-6 bg-black text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition flex items-center justify-center disabled:opacity-50 shadow-xl shadow-black/10"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting Report...
                                        </>
                                    ) : (
                                        "Submit Report"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
