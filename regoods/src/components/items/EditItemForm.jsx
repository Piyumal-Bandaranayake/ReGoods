"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateItem } from "@/app/actions/item";
import Link from "next/link";
import { Loader2, Upload, DollarSign, Tag, FileText, X, AlertCircle, ShieldAlert, CheckCircle, ChevronRight } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function EditItemForm({ item, onSuccess, onCancel, isVerified = true, userId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Split images into existing (URLs) and new (Files)
    // For the UI, we just need a list of "previewable" objects.
    // We'll track them together but distinguish on submit.
    const [images, setImages] = useState(
        item.images.map(url => ({ type: 'existing', url, preview: url }))
    );

    const onDrop = useCallback((acceptedFiles) => {
        const newImages = acceptedFiles.map(file => Object.assign(file, {
            type: 'new',
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
    });

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (images.length < 2) {
            setError("Please have at least 2 images for the listing.");
            setLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);

        const existingImages = [];
        images.forEach(img => {
            if (img.type === 'existing') {
                existingImages.push(img.url);
            } else if (img.type === 'new') {
                // It's a File object (extended with preview)
                formData.append("images", img);
            }
        });

        // Append existing images as multiple entries
        existingImages.forEach(url => formData.append("existingImages", url));

        const result = await updateItem(item._id, formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            if (onSuccess) {
                onSuccess();
            } else {
                router.push(`/items/${item._id}`);
                router.refresh();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
            {/* Verification Modal Overlay */}
            {!isVerified && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm rounded-b-2xl">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Verification Required</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            To maintain a safe community, only verified sellers can manage items on ReGoods.
                            Please complete your identity verification.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start bg-gray-50 p-4 rounded-2xl text-left">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Build Trust</h4>
                                    <p className="text-xs text-gray-500">Verified sellers get 3x more sales and trust from buyers.</p>
                                </div>
                            </div>

                            <Link
                                href={userId ? `/profile/${userId}` : '/auth/login'}
                                className="flex items-center justify-between w-full bg-blue-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-black transition-all group"
                            >
                                <span>Go to Verification</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors py-2"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Image Upload Section */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Item Images (Min 2 required)
                </label>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        Drag 'n' drop some photos here, or click to select files
                    </p>
                </div>

                {/* Preview Grid */}
                {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {images.map((file, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Item Title</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="title"
                        defaultValue={item.title}
                        required
                        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="price" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Price</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            name="price"
                            defaultValue={item.price}
                            min="0"
                            step="0.01"
                            required
                            className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        defaultValue={item.category}
                        className="block w-full rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    >
                        <option>General</option>
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Home & Garden</option>
                        <option>Collectibles</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>

            {/* Condition & Location */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="condition" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Condition</label>
                    <select
                        name="condition"
                        defaultValue={item.condition}
                        required
                        className="block w-full rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    >
                        <option value="New">New</option>
                        <option value="Like New">Used - Like New</option>
                        <option value="Good">Used - Good</option>
                        <option value="Fair">Used - Fair</option>
                        <option value="Poor">Used - Poor</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        defaultValue={item.location}
                        required
                        className="block w-full rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            {/* Delivery & Returns */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="delivery" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Delivery Options</label>
                    <select
                        name="delivery"
                        defaultValue={item.delivery}
                        required
                        className="block w-full rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    >
                        <option value="Meet-up">Meet-up</option>
                        <option value="Courier">Courier</option>
                        <option value="Meet-up / Courier">Meet-up / Courier</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="returnPolicy" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Return Policy</label>
                    <select
                        name="returnPolicy"
                        defaultValue={item.returnPolicy}
                        required
                        className="block w-full rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    >
                        <option value="No Returns">No Returns</option>
                        <option value="Returns Accepted (7 days)">Returns Accepted (7 days)</option>
                        <option value="Returns Accepted (14 days)">Returns Accepted (14 days)</option>
                        <option value="Returns Accepted (30 days)">Returns Accepted (30 days)</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    id="negotiable"
                    name="negotiable"
                    type="checkbox"
                    defaultChecked={item.negotiable}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="negotiable" className="ml-2 block text-sm text-gray-900">Price is Negotiable</label>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Description</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                        name="description"
                        defaultValue={item.description}
                        rows={6}
                        required
                        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-4 flex space-x-4">
                <button
                    type="button"
                    onClick={onCancel ? onCancel : () => router.back()}
                    className="flex-1 justify-center rounded-sm border border-gray-300 bg-white px-3 py-4 text-sm font-bold uppercase tracking-widest leading-6 text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 justify-center rounded-sm bg-blue-900 px-3 py-4 text-sm font-bold uppercase tracking-widest leading-6 text-white shadow-lg hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 disabled:opacity-70 transition-all shadow-blue-900/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </form>
    );
}
