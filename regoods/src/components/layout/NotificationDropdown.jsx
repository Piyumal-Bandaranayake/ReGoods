"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getNotifications } from "@/app/actions/notification";

export default function NotificationDropdown() {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        // We handle potential errors gracefully
        try {
            const data = await getNotifications();
            if (data && !data.error && Array.isArray(data)) {
                setUnreadCount(data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Link href="/notifications" className="relative group p-2 text-gray-500 hover:text-blue-900 transition">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {unreadCount}
                </span>
            )}
        </Link>
    );
}
