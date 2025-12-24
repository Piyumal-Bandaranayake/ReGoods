"use client";

import { useState } from "react";
import { Search, Filter, Download, Plus, MoreHorizontal, User as UserIcon, Trash2 } from "lucide-react";
import { deleteAdminItem } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function InventoryTable({ initialItems }) {
    const [items, setItems] = useState(initialItems);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const filteredItems = items.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sellerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this listing? This cannot be undone.")) {
            const result = await deleteAdminItem(id);
            if (result.success) {
                setItems(items.filter(item => item._id !== id));
                router.refresh();
            }
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header/Search */}
            <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center flex-1 max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by title, seller or status..."
                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Actual Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Item Details</th>
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Seller</th>
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Buyer / Info</th>
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Listed</th>
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredItems.map((item) => (
                            <tr key={item._id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                                            {item.images?.[0] ? (
                                                <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{item.title}</p>
                                            <p className="text-[10px] text-gray-400">#{item._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-500 uppercase">
                                            {item.sellerId?.name?.charAt(0) || "U"}
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">{item.sellerId?.name || "Unknown"}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    {item.status === 'Sold' ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-500 uppercase">
                                                {item.buyerId?.name?.charAt(0) || "B"}
                                            </div>
                                            <span className="text-xs font-bold text-gray-900">{item.buyerId?.name || "Purchased"}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Available</span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-gray-900">${item.price}</td>
                                <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                        item.status === 'Sold' 
                                            ? 'bg-green-50 text-green-600' 
                                            : 'bg-blue-50 text-blue-500'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Delete Listing"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredItems.length === 0 && (
                <div className="text-center py-24 bg-gray-50/30">
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No listings found</p>
                </div>
            )}
        </div>
    );
}
