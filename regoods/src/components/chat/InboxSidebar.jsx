"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Circle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function InboxSidebar({ conversations }) {
    const [search, setSearch] = useState("");
    const pathname = usePathname();

    const filteredConversations = conversations.filter(c =>
        c.user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100/50">
            {/* Search Header */}
            <div className="p-6 border-b border-gray-100/50">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6 px-1">Inbox</h1>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm italic">
                        No conversations found.
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const isActive = pathname === `/inbox/${conv.user.id}`;
                        const isUnread = !conv.lastMessage.read && !conv.lastMessage.isOwn;

                        return (
                            <Link
                                key={conv.user.id}
                                href={`/inbox/${conv.user.id}`}
                                className={`
                                    group block p-4 rounded-2xl transition-all duration-300
                                    ${isActive 
                                        ? 'bg-blue-50/80 shadow-lg shadow-blue-500/5 translate-x-1' 
                                        : 'hover:bg-gray-50 hover:translate-x-1'
                                    }
                                `}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="relative flex-shrink-0">
                                        <div className={`
                                            h-12 w-12 rounded-2xl overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105
                                            ${isActive ? 'border-blue-200 rotate-2' : 'border-white'}
                                            bg-gray-100 flex items-center justify-center font-bold text-gray-400
                                        `}>
                                            {conv.user.image ? (
                                                <img src={conv.user.image} className="w-full h-full object-cover" alt={conv.user.name} />
                                            ) : conv.user.name?.[0]}
                                        </div>
                                        {isUnread && (
                                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`text-sm truncate pr-2 ${isActive || isUnread ? 'text-gray-900' : 'text-gray-700'} ${isUnread ? 'font-bold' : 'font-semibold'}`}>
                                                {conv.user.name}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">
                                                {new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${isUnread ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                                            {conv.lastMessage.isOwn && <span className="text-gray-400 font-normal">You: </span>}
                                            {conv.lastMessage.content || "Sent an attachment"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
