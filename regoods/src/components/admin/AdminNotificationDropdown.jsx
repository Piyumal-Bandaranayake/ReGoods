"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Shield, Flag, MessageSquare, Clock, X } from "lucide-react";
import { getAdminNotifications, clearAllAdminNotifications } from "@/app/actions/admin";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasSeen, setHasSeen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await getAdminNotifications();
            setNotifications(data);
            setLoading(false);
        };

        if (isOpen) {
            fetchNotifications();
        } else {
            // Initial count check
            fetchNotifications();
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleClearAll = async () => {
        if (notifications.length === 0) return;
        if (confirm("Are you sure you want to clear all alerts? This will dismiss all pending reports and verifications.")) {
            setClearing(true);
            const result = await clearAllAdminNotifications();
            if (result.success) {
                setNotifications([]);
                router.refresh();
            } else {
                alert(result.error || "Failed to clear notifications");
            }
            setClearing(false);
            setIsOpen(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "verification": return <Shield className="w-4 h-4 text-blue-500" />;
            case "report": return <Flag className="w-4 h-4 text-rose-500" />;
            case "message_report": return <MessageSquare className="w-4 h-4 text-amber-500" />;
            default: return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setHasSeen(true);
                }}
                className={`p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all relative group ${isOpen ? 'text-gray-900 ring-2 ring-blue-500/10' : 'text-gray-400 hover:text-gray-900'}`}
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && !hasSeen && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[200] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                            <p className="text-[10px] text-gray-500 font-medium tracking-tight">You have {notifications.length} pending tasks</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    disabled={clearing}
                                    className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {clearing ? "Clearing..." : "Clear All"}
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Updating...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-gray-200" />
                                </div>
                                <p className="text-sm font-bold text-gray-900 mb-1">All Caught Up!</p>
                                <p className="text-xs text-gray-400">No new reports or verifications.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <Link
                                        key={notif.id}
                                        href={notif.link}
                                        onClick={() => setIsOpen(false)}
                                        className="flex gap-4 p-5 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'verification' ? 'bg-blue-50' :
                                                notif.type === 'report' ? 'bg-rose-50' : 'bg-amber-50'
                                            }`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{notif.title}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">{notif.content}</p>
                                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                < Clock className="w-3 h-3 mr-1" />
                                                {getTimeAgo(notif.createdAt)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href="/admin/reports"
                        onClick={() => setIsOpen(false)}
                        className="block p-4 bg-gray-50 text-center text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors border-t border-gray-50"
                    >
                        View All Activity Log
                    </Link>
                </div>
            )}
        </div>
    );
}
