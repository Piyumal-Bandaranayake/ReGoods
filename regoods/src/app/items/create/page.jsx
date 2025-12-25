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
    const [formValues, setFormValues] = useState({
        title: "",
        price: "",
        category: "General",
        condition: "New",
        location: "",
        delivery: "Meet-up",
        returnPolicy: "No Returns",
        description: "",
        negotiable: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        const checkStatus = async () => {
            const status = await getCurrentUserStatus();
            setUserStatus(status);
            setPageLoading(false);
        };
        checkStatus();
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        const newImages = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        minFiles: 1
    });

    const removeImage = (index) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        if (newImages.length === 0) {
            setFormErrors(prev => ({ ...prev, images: "Please upload at least 1 image." }));
        }
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "title":
                if (!value.trim()) error = "Title is required";
                else if (value.length < 5) error = "Title must be at least 5 characters";
                break;
            case "price":
                if (!value) error = "Price is required";
                else if (parseFloat(value) <= 0) error = "Price must be greater than 0";
                break;
            case "location":
                if (!value.trim()) error = "Location is required";
                else if (value.trim().length < 3) error = "Include city and state (min 3 chars)";
                break;
            case "description":
                if (!value.trim()) error = "Description is required";
                else if (value.length < 20) error = "Please provide a more detailed description (min 20 chars)";
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
        setFormValues(prev => ({ ...prev, [name]: val }));
        if (touched[name]) {
            validateField(name, val);
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
        if (uploadedImages.length < 1) errors.images = "Please upload at least 1 image.";
        errors.title = validateField("title", formValues.title);
        errors.price = validateField("price", formValues.price);
        errors.location = validateField("location", formValues.location);
        errors.description = validateField("description", formValues.description);

        setTouched({
            title: true,
            price: true,
            location: true,
            description: true,
            images: true
        });

        const hasErrors = Object.values(errors).some(err => err);
        if (hasErrors) {
            setError("Please correct the errors before submitting.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key]);
        });

        uploadedImages.forEach((img) => {
            formData.append("images", img.file);
        });

        const result = await createItem(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard");
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

    const showVerificationModal = !pageLoading && (!userStatus || userStatus.verificationStatus !== "Verified");

    return (
        <div className="h-screen fixed inset-0 z-40 overflow-hidden flex bg-white font-inter">
            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
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
                                href='/account/verify'
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

            <div className="w-[40%] bg-gray-50 p-8 pt-24 flex flex-col h-full border-r border-gray-100">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">List Item</h1>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Add photos and details to sell.</p>
                </div>

                <div className="flex flex-col gap-4 min-h-0">
                    <div
                        {...getRootProps()}
                        className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all ${isDragActive ? 'border-black bg-white' : (touched.images && formErrors.images ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-400 bg-white')
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className={`h-6 w-6 ${touched.images && formErrors.images ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                        <p className={`text-sm font-bold ${touched.images && formErrors.images ? 'text-red-600' : 'text-gray-900'}`}>Click to Upload</p>
                        <p className="text-[10px] text-gray-400 mt-1">or drag and drop (Min 1)</p>
                    </div>
                    {touched.images && formErrors.images && <p className="text-[10px] text-red-500 font-bold px-1 mt-1">{formErrors.images}</p>}

                    <div className="flex-1 overflow-y-auto scrollbar-hide grid grid-cols-3 gap-3 auto-rows-min">
                        {uploadedImages.map((file, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-white">
                                <img src={file.preview} alt="preview" className="w-full h-full object-cover [image-rendering:-webkit-optimize-contrast]" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - uploadedImages.length) }).map((_, i) => (
                            <div key={`placeholder-${i}`} className="aspect-square rounded-xl border border-gray-100 bg-gray-100/50"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-[60%] bg-white p-8 pt-24 h-full flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                        <div className="col-span-2">
                            <label htmlFor="title" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formValues.title}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                className={`w-full py-3 px-4 bg-gray-50 border rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all placeholder:font-medium ${touched.title && formErrors.title ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-100'}`}
                                placeholder="Item Name"
                            />
                            {touched.title && formErrors.title && <p className="text-[9px] text-red-500 font-bold mt-1 px-1">{formErrors.title}</p>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Price</label>
                            <div className="relative">
                                <span className={`absolute left-3 top-2.5 text-xs font-bold ${touched.price && formErrors.price ? 'text-red-400' : 'text-gray-400'}`}>$</span>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    value={formValues.price}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    min="0"
                                    step="0.01"
                                    required
                                    className={`w-full py-3 pl-6 pr-4 bg-gray-50 border rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all ${touched.price && formErrors.price ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-100'}`}
                                    placeholder="0.00"
                                />
                            </div>
                            {touched.price && formErrors.price && <p className="text-[9px] text-red-500 font-bold mt-1 px-1">{formErrors.price}</p>}
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formValues.category}
                                onChange={handleInputChange}
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                            >
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
                            <select
                                name="condition"
                                value={formValues.condition}
                                onChange={handleInputChange}
                                required
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                            >
                                <option value="New">New</option>
                                <option value="Like New">Used - Like New</option>
                                <option value="Good">Used - Good</option>
                                <option value="Fair">Used - Fair</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formValues.location}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                className={`w-full py-3 px-4 bg-gray-50 border rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all ${touched.location && formErrors.location ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-100'}`}
                                placeholder="City, State"
                            />
                            {touched.location && formErrors.location && <p className="text-[9px] text-red-500 font-bold mt-1 px-1">{formErrors.location}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery</label>
                            <select
                                name="delivery"
                                value={formValues.delivery}
                                onChange={handleInputChange}
                                required
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                            >
                                <option value="Meet-up">Meet-up</option>
                                <option value="Courier">Courier</option>
                                <option value="Meet-up / Courier">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Returns</label>
                            <select
                                name="returnPolicy"
                                value={formValues.returnPolicy}
                                onChange={handleInputChange}
                                required
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                            >
                                <option value="No Returns">No Returns</option>
                                <option value="Returns Accepted (7 days)">7 Days</option>
                                <option value="Returns Accepted (14 days)">14 Days</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-28 mb-4">
                        <label htmlFor="description" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`w-full h-full py-3 px-4 bg-gray-50 border rounded-xl text-xs font-medium text-gray-900 focus:ring-1 focus:ring-black outline-none transition-all resize-none placeholder:text-gray-400 ${touched.description && formErrors.description ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-100'}`}
                            placeholder="Describe item condition, features..."
                        />
                        {touched.description && formErrors.description && <p className="text-[9px] text-red-500 font-bold mt-1 px-1">{formErrors.description}</p>}
                    </div>

                    <div className="mt-2 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                id="negotiable"
                                name="negotiable"
                                type="checkbox"
                                checked={formValues.negotiable}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                            />
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

function AlertCircle(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
