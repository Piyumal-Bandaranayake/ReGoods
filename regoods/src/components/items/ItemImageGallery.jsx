"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

export default function ItemImageGallery({ images, title, isSold }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const nextImage = (e) => {
        e?.stopPropagation();
        if (images && images.length > 1) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        if (images && images.length > 1) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const currentImage = images && images.length > 0 ? images[currentIndex] : null;
    const totalImages = images?.length || 0;

    return (
        <div className="w-full lg:w-[55%] bg-gray-50 relative flex flex-col justify-center items-center min-h-[600px] lg:min-h-screen p-8 lg:p-20 transition-colors duration-500">

            {/* Fullscreen Trigger */}
            <button
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-8 right-8 bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition text-gray-900 hidden lg:block z-20"
            >
                <Maximize2 className="w-5 h-5" />
            </button>

            {/* Main Image Card */}
            <div className="relative w-full max-w-xl aspect-square flex items-center justify-center bg-white rounded-[3rem] shadow-xl overflow-hidden">
                {isSold && (
                    <div className="absolute top-6 right-6 z-20">
                        <span className="bg-gray-900 text-white px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full">
                            Sold
                        </span>
                    </div>
                )}

                {currentImage ? (
                    <img
                        src={optimizeCloudinaryUrl(currentImage, 'q_auto:best,f_auto,w_1000')}
                        alt={title}
                        className={`w-full h-full object-cover transition-all duration-500 ease-out ${isSold ? 'grayscale opacity-90' : 'hover:scale-105'} [image-rendering:-webkit-optimize-contrast]`}
                        onClick={() => setIsZoomed(true)}
                    />
                ) : (
                    <div className="text-gray-400 font-bold text-2xl opacity-20 uppercase tracking-widest">
                        No Image
                    </div>
                )}
            </div>

            {/* Navigation Controls (If multiple images) */}
            {totalImages > 1 && (
                <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-4 lg:justify-end lg:pr-32 lg:bottom-16">
                    <button
                        onClick={prevImage}
                        className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white flex items-center justify-center transition"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <div className="flex items-center gap-4 font-bold font-mono text-gray-500">
                        <span className="text-gray-900 text-lg">
                            {String(currentIndex + 1).padStart(2, '0')}
                        </span>
                        <div className="w-12 h-[2px] bg-gray-300 relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-gray-900 transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / totalImages) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-sm">
                            {String(totalImages).padStart(2, '0')}
                        </span>
                    </div>

                    <button
                        onClick={nextImage}
                        className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white flex items-center justify-center transition"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            )}

            {/* Zoom Modal */}
            {isZoomed && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300">
                    <button
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition"
                    >
                        <ChevronLeft className="w-12 h-12" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition"
                    >
                        <ChevronRight className="w-12 h-12" />
                    </button>

                    <img
                        src={optimizeCloudinaryUrl(currentImage, 'q_auto:best,f_auto,w_2000')}
                        alt={title}
                        className="max-w-full max-h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                    />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 font-mono">
                        {currentIndex + 1} / {totalImages}
                    </div>
                </div>
            )}
        </div>
    );
}
