"use client";

import { deleteItem, markAsSold } from "@/app/actions/item";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import EditItemModal from "../items/EditItemModal";

export default function ItemActions({ item, hideView = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            setLoading(true);
            const result = await deleteItem(item._id);
            if (result.success) {
                setLoading(false);
            } else {
                alert(result.error);
                setLoading(false);
            }
        }
    };

    const handleMarkAsSold = async () => {
        if (confirm("Mark this item as Sold?")) {
            setLoading(true);
            const result = await markAsSold(item._id);
            if (result.success) {
                setLoading(false);
            } else {
                alert(result.error);
                setLoading(false);
            }
        }
    };

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {!hideView && (
                    <Link
                        href={`/items/${item._id}`}
                        className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center"
                    >
                        Preview
                    </Link>
                )}

                {item.status !== 'Sold' && (
                    <button
                        onClick={handleMarkAsSold}
                        disabled={loading}
                        className="px-4 py-2 bg-green-50 text-[10px] font-black uppercase tracking-widest text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center"
                    >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                        Mark Sold
                    </button>
                )}

                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center"
                >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Modify
                </button>

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center"
                >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Drop
                </button>
            </div>

            {isEditing && (
                <EditItemModal
                    item={item}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
}
