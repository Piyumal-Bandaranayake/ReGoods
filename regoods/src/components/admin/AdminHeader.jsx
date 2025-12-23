"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function AdminHeader({ adminName, adminImage }) {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{adminName}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200">
                        {adminImage ? (
                            <img src={adminImage} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                </div>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition"
                    title="Sign Out"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </button>
            </div>
        </header>
    );
}
