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
            <div className="ml-4 flex space-x-2">
                {!hideView && (
                    <Link
                        href={`/items/${item._id}`}
                        className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase hover:border-black hover:bg-black hover:text-white transition flex items-center"
                    >
                        View
                    </Link>
                )}

                {item.status !== 'Sold' && (
                    <button
                        onClick={handleMarkAsSold}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase hover:border-green-600 hover:bg-green-600 hover:text-white transition flex items-center text-green-600"
                    >
                        <CheckCircle className="w-3 h-3 md:mr-1" />
                        <span className="hidden md:inline">Mark Sold</span>
                    </button>
                )}

                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase hover:border-black hover:bg-black hover:text-white transition flex items-center"
                >
                    <Edit className="w-3 h-3 md:mr-1" />
                    <span className="hidden md:inline">Edit</span>
                </button>

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase hover:border-red-600 hover:bg-red-600 hover:text-white transition flex items-center text-red-600"
                >
                    <Trash2 className="w-3 h-3 md:mr-1" />
                    <span className="hidden md:inline">Delete</span>
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
