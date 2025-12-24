"use client";

import { signOut } from "next-auth/react";
import { Bell, Search, Settings, User } from "lucide-react";
import { useState, useEffect } from "react";
import AdminNotificationDropdown from "./AdminNotificationDropdown";

export default function AdminHeader({ adminName, adminImage }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-[100] w-full bg-transparent">
            {/* Search Bar */}
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="w-full bg-white border-none rounded-2xl pl-14 pr-6 py-3.5 text-sm shadow-sm focus:ring-0 focus:shadow-md transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right side information */}
            <div className="flex items-center space-x-8">
                {/* Date Display */}
                <div className="hidden lg:block text-right">
                    <p className="text-sm font-bold text-gray-900">Today, {formatDate(currentTime)}</p>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-3">
                    <AdminNotificationDropdown />
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {adminImage ? (
                            <img src={adminImage} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
