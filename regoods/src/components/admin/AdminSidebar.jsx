"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, AlertTriangle } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/activity", label: "Market Activity", icon: ShoppingBag },
        { href: "/admin/reports", label: "Reports", icon: AlertTriangle },
    ];

    return (
        <aside className="w-64 bg-blue-950 text-white flex flex-col fixed h-full z-20">
            <div className="p-6 border-b border-blue-900">
                <h1 className="text-2xl font-serif font-bold italic">ReGoods<span className="text-blue-400">Admin</span></h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-xl transition text-sm font-medium ${isActive
                                    ? "bg-blue-800 text-white shadow-md shadow-blue-900/50"
                                    : "hover:bg-blue-900 text-blue-100 hover:text-white"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-300" : ""}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
