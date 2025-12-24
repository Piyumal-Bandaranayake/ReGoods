"use client";

import { useState, useEffect } from "react";
import { Bell, Check, ExternalLink, Clock, ShieldCheck, XCircle, Tag, MessageSquare, AlertTriangle, Sparkles, ArrowLeft, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/app/actions/notification";
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

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'account_verified':
                return <ShieldCheck className="w-5 h-5 text-blue-500" />;
            case 'verification_rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'new_offer':
                return <Tag className="w-5 h-5 text-green-500" />;
            case 'message':
                return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case 'account_banned':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default:
                return <Bell className="w-5 h-5 text-blue-300" />;
        }
    };

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await deleteNotification(id);
        setNotifications(prev => prev.filter(n => n._id !== id));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-blue-50 border-t-blue-500 animate-spin"></div>
                    <Bell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 animate-pulse" />
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading Activity</p>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-white relative overflow-hidden pb-24 font-inter">
            {/* Background Blobs (Reference Style) */}
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-sky-200/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-pink-100/30 blur-[100px] rounded-full"></div>
            <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-yellow-100/20 blur-[80px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
                {/* Header & Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Notifications</h1>
                        <p className="text-sm text-gray-400 font-medium">Keep track of your latest updates and alerts.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900">Notifications</span>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] border border-white p-20 text-center flex flex-col items-center justify-center min-h-[500px] shadow-2xl shadow-sky-900/5 animate-fade-in-up">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl rotate-6">
                            <Bell className="w-10 h-10 text-sky-200" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">All caught up!</h2>
                        <p className="text-gray-400 mb-10 max-w-sm leading-relaxed font-medium">
                            You have no new notifications at the moment.
                        </p>
                        <Link
                            href="/dashboard"
                            className="group bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 transition-all shadow-xl shadow-sky-900/10 flex items-center gap-3"
                        >
                            Return to Dashboard
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl shadow-sky-900/5">
                        <div className="divide-y divide-gray-50">
                            {notifications.map((n, index) => (
                                <div
                                    key={n._id}
                                    className={`relative py-4 md:px-4 hover:bg-sky-50/50 rounded-2xl transition-all duration-300 group ${!n.read ? 'bg-sky-50/30' : ''}`}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className={`p-3 rounded-2xl flex-shrink-0 shadow-lg ${!n.read ? 'bg-white text-sky-500' : 'bg-gray-50 text-gray-400'}`}>
                                                {getNotificationIcon(n.type)}
                                            </div>
                                            <div className="min-w-0 pt-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></div>}
                                                    <h2 className={`text-sm font-bold truncate group-hover:text-sky-500 transition-colors ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {n.title}
                                                    </h2>
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded-md">
                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed font-medium pr-4 max-w-2xl">
                                                    {n.content}
                                                </p>

                                                {n.link && (
                                                    <div className="mt-2">
                                                        <Link
                                                            href={n.link}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkAsRead(n._id);
                                                            }}
                                                            className="inline-flex items-center text-[9px] font-black text-sky-500 hover:text-gray-900 uppercase tracking-[0.2em] transition-colors gap-2"
                                                        >
                                                            View Details <ExternalLink className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!n.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(n._id)}
                                                    className="p-2 bg-white border border-gray-100 text-sky-500 hover:bg-sky-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(e, n._id)}
                                                className="p-2 bg-white border border-gray-100 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
