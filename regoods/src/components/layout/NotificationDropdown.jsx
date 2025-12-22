"use client";

import { useState, useEffect } from "react";
import { Bell, Check, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { getNotifications, markAsRead } from "@/app/actions/notification";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        const data = await getNotifications();
        if (!data.error) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        fetchNotifications();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-blue-950 transition relative"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold font-serif text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((n) => (
                                        <div 
                                            key={n._id} 
                                            className={`p-4 hover:bg-gray-50 transition relative group ${!n.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h4 className={`text-sm font-bold ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                                                {!n.read && (
                                                    <button 
                                                        onClick={() => handleMarkAsRead(n._id)}
                                                        className="text-blue-500 hover:text-blue-700 transition"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{n.content}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-gray-400 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </span>
                                                {n.link && (
                                                    <Link 
                                                        href={n.link}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleMarkAsRead(n._id);
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center uppercase tracking-widest"
                                                    >
                                                        View <ExternalLink className="w-3 h-3 ml-1" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-500">No notifications yet</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-50 text-center bg-gray-50/30">
                            <Link 
                                href="/account?tab=messages" 
                                className="text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-widest"
                                onClick={() => setIsOpen(false)}
                            >
                                View All Activity
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
