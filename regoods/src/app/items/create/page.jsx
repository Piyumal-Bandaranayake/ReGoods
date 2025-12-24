"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createItem } from "@/app/actions/item";
import { getCurrentUserStatus } from "@/app/actions/user";
import { Loader2, Upload, DollarSign, Tag, FileText, X, ShieldAlert, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";

export default function CreateItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [userStatus, setUserStatus] = useState(null);
    const [error, setError] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        const checkStatus = async () => {
            const status = await getCurrentUserStatus();
            setUserStatus(status);
            setPageLoading(false);
        };
        checkStatus();
    }, []);

    // Mock Dropzone Handler - In a real app, you would upload to AWS S3/Cloudinary here
    const onDrop = useCallback((acceptedFiles) => {
        // For this demo, we will create object URLs. 
        // In production, these should be uploaded to a storage provider, and the URLs returned.
        const newImages = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        minFiles: 2 // Requirement: 2 pics minimum (we'll validate on submit)
    });

    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (uploadedImages.length < 2) {
            setError("Please upload at least 2 images.");
            setLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);

        // Append files from the dropzone
        uploadedImages.forEach((file) => {
            formData.append("images", file);
        });

        // Remove any empty "images" strings that might be there from potential hidden inputs or previous logic
        // (though we are removing the manual inputs, keeping this clean is good practice)

        const result = await createItem(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push(`/items/${result.itemId}`);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-900 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Checking authorization...</p>
                </div>
            </div>
        );
    }

    // Verification Modal
    const showVerificationModal = !pageLoading && (!userStatus || userStatus.verificationStatus !== "Verified");

    return (
        <div className="h-screen fixed inset-0 z-40 overflow-hidden flex bg-white font-inter">
            {/* Verification Modal Overlay */}
            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    {/* ... (Keep minimal modal content if needed, strictly minimal) ... */}
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-amber-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Required</h2>
                        <p className="text-gray-500 mb-6 text-xs">
                            Only verified sellers can list items.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href={userStatus?._id ? `/profile/${userStatus._id}` : '/auth/login'}
                                className="block w-full bg-blue-900 text-white font-bold py-3 px-6 rounded-xl text-sm"
                            >
                                Go to Verification
                            </Link>
                            <button onClick={() => router.back()} className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-black">
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LEFT: Image Upload (40% Width) */}
            <div className="w-[40%] bg-gray-50 p-8 pt-24 flex flex-col h-full border-r border-gray-100">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">List Item</h1>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Add photos and details to sell.</p>
                </div>

                {/* Dropzone Area - Fixed Height */}
                <div className="flex flex-col gap-4 min-h-0">
                    <div
                        {...getRootProps()}
                        className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all ${isDragActive ? 'border-black bg-white' : 'border-gray-200 hover:border-gray-400 bg-white'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">Click to Upload</p>
                        <p className="text-[10px] text-gray-400 mt-1">or drag and drop (Min 2)</p>
                    </div>

                    {/* Preview Grid (Scrollable if too many, but typically limited) */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide grid grid-cols-3 gap-3 auto-rows-min">
                        {uploadedImages.map((file, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-white">
                                <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {/* Placeholders to fill grid visually if empty */}
                        {Array.from({ length: Math.max(0, 3 - uploadedImages.length) }).map((_, i) => (
                            <div key={`placeholder-${i}`} className="aspect-square rounded-xl border border-gray-100 bg-gray-100/50"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Form Details (60% Width) */}
            <div className="w-[60%] bg-white p-8 pt-24 h-full flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">

                    {/* Top Row Inputs */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                        <div className="col-span-2">
                            <label htmlFor="title" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Title</label>
                            <input type="text" name="title" id="title" required className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all placeholder:font-medium" placeholder="Item Name" />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">$</span>
                                <input type="number" name="price" id="price" min="0" step="0.01" required className="w-full py-3 pl-6 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                            <select id="category" name="category" className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer">
                                <option>General</option>
                                <option>Electronics</option>
                                <option>Clothing</option>
                                <option>Home & Garden</option>
                                <option>Collectibles</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Condition</label>
                            <select name="condition" required className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer">
                                <option value="New">New</option>
                                <option value="Like New">Used - Like New</option>
                                <option value="Good">Used - Good</option>
                                <option value="Fair">Used - Fair</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Location</label>
                            <input type="text" name="location" required className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all" placeholder="City, State" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery</label>
                            <select name="delivery" required className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer">
                                <option value="Meet-up">Meet-up</option>
                                <option value="Courier">Courier</option>
                                <option value="Meet-up / Courier">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Returns</label>
                            <select name="returnPolicy" required className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer">
                                <option value="No Returns">No Returns</option>
                                <option value="Returns Accepted (7 days)">7 Days</option>
                                <option value="Returns Accepted (14 days)">14 Days</option>
                            </select>
                        </div>
                    </div>

                    {/* Description - Compact */}
                    <div className="h-24 mb-4">
                        <label htmlFor="description" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            className="w-full h-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all resize-none placeholder:text-gray-400"
                            placeholder="Describe item condition, features..."
                        />
                    </div>

                    <div className="mt-2 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-4">
                            <input id="negotiable" name="negotiable" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer" />
                            <label htmlFor="negotiable" className="text-xs font-bold text-gray-900 cursor-pointer">Price is Negotiable</label>
                        </div>

                        <div className="flex items-center gap-4">
                            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {loading ? "Publishing..." : "Post Item Now"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper icon
function AlertCircle(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
