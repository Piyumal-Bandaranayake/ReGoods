"use client";

import { useState } from "react";
import { deleteUser, unbanUser } from "@/app/actions/admin";
import { Trash2, Shield, User, Search, X, MoreHorizontal, Filter, CheckCircle, Plus, Ban, Power } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateUserModal from "./CreateUserModal";

export default function UserList({ initialUsers }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("sellers");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const router = useRouter();

    const filteredUsers = initialUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === "sellers") return matchesSearch && user.isVerified && user.role !== 'admin' && !user.isBanned;
        if (activeTab === "buyers") return matchesSearch && !user.isVerified && user.role !== 'admin' && !user.isBanned;
        if (activeTab === "admins") return matchesSearch && user.role === 'admin';
        if (activeTab === "banned") return matchesSearch && user.isBanned;
        return matchesSearch;
    });

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
            await deleteUser(id);
            router.refresh();
        }
    };

    const handleUnban = async (id) => {
        if (confirm("Are you sure you want to restore access for this user?")) {
            const result = await unbanUser(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        }
    };

    const tabs = [
        { id: "sellers", label: "Verified Sellers", icon: CheckCircle },
        { id: "buyers", label: "Buyers", icon: User },
        { id: "admins", label: "Administrators", icon: Shield },
        { id: "banned", label: "Banned Sellers", icon: Ban },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Tabs Navigation */}
            <div className="flex items-center space-x-1 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === tab.id 
                            ? "bg-white text-blue-500 shadow-sm" 
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header/Search */}
                <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center flex-1 max-w-md relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Search ${activeTab === 'all' ? 'users' : activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">User Profile</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status & Role</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Registration</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-3 overflow-hidden border-2 border-white shadow-sm font-serif">
                                                {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 flex items-center">
                                                    {user.name}
                                                    {user.isVerified && (
                                                        <CheckCircle className="w-3.5 h-3.5 ml-1.5 text-blue-500 fill-blue-50" />
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-medium tracking-tight">ID: {user._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col space-y-1">
                                            {user.isBanned ? (
                                                <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                                                    <Ban className="w-3 h-3 mr-1" /> Banned
                                                </span>
                                            ) : user.role === 'admin' ? (
                                                <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-900 text-white">
                                                    <Shield className="w-3 h-3 mr-1" /> Admin
                                                </span>
                                            ) : user.isVerified ? (
                                                <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-500 border border-blue-100">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Verified Seller
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100">
                                                    <User className="w-3 h-3 mr-1" /> Buyer
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500 underline decoration-gray-200 underline-offset-4">{user.email}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                        {activeTab === 'banned' ? (
                                            <span className="text-rose-500 text-xs italic">{user.banReason || "Policy violation"}</span>
                                        ) : (
                                            new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.isBanned ? (
                                                <button
                                                    onClick={() => handleUnban(user._id)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                                    title="Reactivate Account"
                                                >
                                                    <Power className="w-3 h-3" />
                                                    <span>Reactivate</span>
                                                </button>
                                            ) : (
                                                <>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button className="p-2 text-gray-400 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-24 bg-gray-50/30">
                        <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No results found in {activeTab}</p>
                    </div>
                )}
            </div>

            <CreateUserModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}

