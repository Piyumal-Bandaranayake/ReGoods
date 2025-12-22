"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function ItemImageGallery({ images, title, isSold }) {
    const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : null);

    return (
        <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 lg:p-20 relative">

            {/* Main Image Container */}
            <div className="relative w-full max-w-lg aspect-square mb-8">
                {/* Sold Badge (Clean, No Rotation) */}
                {isSold && (
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm shadow-md">
                            Sold Out
                        </span>
                    </div>
                )}

                {mainImage ? (
                    <>
                        {/* Blurred Background for Premium Feel */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl">
                            <img
                                src={mainImage}
                                alt=""
                                className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
                            />
                        </div>

                        {/* Main Image */}
                        <img
                            src={mainImage}
                            alt={title}
                            className={`relative z-10 w-full h-full object-contain drop-shadow-xl transition-all duration-500 rounded-lg ${isSold ? 'grayscale opacity-80' : ''}`}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-3xl">
                        <ShoppingBag className="w-24 h-24 text-gray-200" />
                    </div>
                )}
            </div>

            {/* Thumbnails Row */}
            {images && images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-4 max-w-full px-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`w-20 h-20 bg-gray-50 rounded-2xl p-2 border transition shrink-0 ${mainImage === img ? 'border-black ring-1 ring-black' : 'border-blue-50 hover:border-gray-300'
                                }`}
                        >
                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
