"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/admin";
import { Trash2, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserList({ initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const router = useRouter();

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
            await deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
            router.refresh();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-3 overflow-hidden">
                                            {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role === 'admin' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            <Shield className="w-3 h-3 mr-1" /> Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            <User className="w-3 h-3 mr-1" /> User
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
