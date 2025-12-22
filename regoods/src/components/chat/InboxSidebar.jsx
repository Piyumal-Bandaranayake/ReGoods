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
        <div className="flex flex-col h-full bg-white">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100">
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4 px-2">Messages</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-1 focus:ring-black transition text-gray-900 placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No conversations found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredConversations.map((conv) => {
                            const isActive = pathname === `/inbox/${conv.user.id}`;
                            const isUnread = !conv.lastMessage.read && !conv.lastMessage.isOwn;

                            return (
                                <Link
                                    key={conv.user.id}
                                    href={`/inbox/${conv.user.id}`}
                                    className={`block p-4 hover:bg-gray-50 transition ${isActive ? 'bg-gray-50' : ''}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden border border-gray-100 flex items-center justify-center font-bold text-gray-500">
                                                {conv.user.image ? (
                                                    <img src={conv.user.image} className="w-full h-full object-cover" />
                                                ) : conv.user.name?.[0]}
                                            </div>
                                            {/* Online indicator could go here if we had status */}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                                    {conv.user.name}
                                                </h3>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                    {new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className={`text-xs truncate ${isUnread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                                {conv.lastMessage.isOwn && <span className="text-gray-400 font-normal">You: </span>}
                                                {conv.lastMessage.content || "Sent an attachment"}
                                            </p>
                                        </div>

                                        {isUnread && (
                                            <div className="flex-shrink-0 self-center ml-2">
                                                <Circle className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
