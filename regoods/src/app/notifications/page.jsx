"use client";

import { useState, useEffect } from "react";
import { Bell, Check, ExternalLink, Clock, ShieldCheck, XCircle, Tag, MessageSquare, AlertTriangle, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
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
        <div className="min-h-screen bg-[#FAFAFA] pb-24">
            {/* 1. CINEMATIC HEADER */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                                <Sparkles className="w-4 h-4" />
                                Interactive Logs
                            </div>
                            <h1 className="text-4xl md:text-7xl font-serif font-bold text-gray-900 leading-tight">
                                Live <span className="italic text-blue-500">Activity</span>.
                            </h1>
                            <p className="mt-4 text-gray-500 text-sm md:text-lg max-w-lg leading-relaxed italic">
                                Real-time updates on your marketplace interactions, settlements, and security status.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-3 animate-fade-in-up delay-100">
                             <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                {unreadCount} Priority Alerts
                            </div>
                            <Link 
                                href="/dashboard" 
                                className="group flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to Control
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in-up delay-200">
                    <div className="divide-y divide-gray-50">
                        {notifications.length > 0 ? (
                            notifications.map((n, index) => (
                                <div
                                    key={n._id}
                                    className={`relative p-8 hover:bg-blue-50/30 transition-all duration-300 group ${!n.read ? 'bg-blue-50/10' : ''}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                        <div className="flex items-start gap-6 flex-1 min-w-0">
                                            <div className={`p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-500 ${!n.read ? 'bg-white shadow-xl ring-1 ring-blue-500/10' : 'bg-gray-50'}`}>
                                                {getNotificationIcon(n.type)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                                                    <h2 className={`text-xl font-serif font-bold truncate group-hover:text-blue-500 transition-colors ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {n.title}
                                                    </h2>
                                                </div>
                                                <p className="text-sm text-gray-500 leading-relaxed italic pr-4">
                                                    {n.content}
                                                </p>
                                                
                                                <div className="mt-6 flex items-center gap-4">
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5 mr-2 text-blue-300" />
                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                    </span>
                                                    
                                                    {n.link && (
                                                        <Link
                                                            href={n.link}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkAsRead(n._id);
                                                            }}
                                                            className="flex items-center text-[10px] font-black text-blue-500 hover:text-gray-950 uppercase tracking-[0.2em] transition-colors"
                                                        >
                                                            Inspect Details <ExternalLink className="w-3 h-3 ml-2" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {!n.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(n._id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                                                title="Acknowledge Alert"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {!n.read && (
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-24 text-center">
                                <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                                    <Bell className="w-10 h-10 text-blue-200" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-3">Silent <span className="italic text-blue-300">Frontier</span></h3>
                                <p className="text-gray-500 text-sm italic max-w-xs mx-auto leading-relaxed">You're completely caught up. New updates will appearing here as they happen.</p>
                                <Link 
                                    href="/dashboard"
                                    className="mt-10 group inline-flex items-center px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10"
                                >
                                    Go to Marketplace
                                    <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                
                <p className="mt-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                    End of Transmission
                </p>
            </div>
        </div>
    );
}
