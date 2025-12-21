"use client";

import EditItemForm from "./EditItemForm";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditItemModal({ item, onClose }) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {/* Overlay click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative z-10 animate-fade-in-up">
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900">Edit Item</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-500 hover:text-black"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <EditItemForm
                    item={item}
                    onSuccess={() => {
                        router.refresh();
                        onClose();
                    }}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}
