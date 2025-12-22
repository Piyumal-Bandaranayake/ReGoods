"use client";

import { usePathname } from "next/navigation";
import InboxSidebar from "@/components/chat/InboxSidebar";

export default function InboxLayoutClient({ conversations, children }) {
    const pathname = usePathname();
    const isRootInbox = pathname === "/inbox";

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white max-w-7xl mx-auto border-x border-gray-100 shadow-sm my-0 lg:my-8 rounded-none lg:rounded-xl overflow-hidden">
            {/* Sidebar: Visible on desktop, visible on mobile ONLY if on root inbox */}
            <div className={`
                w-full md:w-80 lg:w-96 border-r border-gray-100 flex-shrink-0 bg-white
                ${isRootInbox ? 'block' : 'hidden md:block'}
            `}>
                <InboxSidebar conversations={conversations} />
            </div>

            {/* Content Area: Visible on desktop, visible on mobile ONLY if NOT on root inbox */}
            <div className={`
                flex-1 bg-white flex flex-col md:bg-gray-50
                ${isRootInbox ? 'hidden md:flex' : 'flex w-full'}
            `}>
                {children}
            </div>
        </div>
    );
}
