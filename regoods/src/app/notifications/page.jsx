"use client";

import { useState, useEffect } from "react";
import { Bell, Check, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notification";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            if (!data.error) {
                setNotifications(data);
                // Mark all as read on serve side, but keep UI state as is for this view for "unread" look until refresh
                if (data.some(n => !n.read)) {
                    await markAllAsRead();
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated") {
            fetchNotifications();
        }
    }, [status]);

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        // Optimistic update
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h1 className="text-2xl font-serif font-bold text-gray-900">
                            Notifications
                        </h1>
                        <span className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {notifications.filter(n => !n.read).length} Unread
                        </span>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`p-6 hover:bg-gray-50 transition relative group ${!n.read ? 'bg-blue-50/20' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className={`text-base font-bold ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {n.title}
                                        </h2>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                            </span>
                                            {!n.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(n._id)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-2xl">
                                        {n.content}
                                    </p>

                                    {n.link && (
                                        <Link
                                            href={n.link}
                                            onClick={() => handleMarkAsRead(n._id)}
                                            className="inline-flex items-center text-xs font-bold text-blue-900 hover:underline uppercase tracking-widest"
                                        >
                                            View Details <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No notifications</h3>
                                <p className="text-gray-500 text-sm">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
