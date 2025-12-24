"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Clock, 
    LayoutGrid, 
    ShoppingBag, 
    Users, 
    FileText, 
    UserCheck, 
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: Clock },
        { href: "/admin/activity", label: "Sales Analytics", icon: LayoutGrid },
        { href: "/admin/orders", label: "Order List", icon: ShoppingBag },
        { href: "/admin/users", label: "Customers", icon: Users },
        { href: "/admin/reports", label: "Reports", icon: FileText },
    ];

    return (
        <aside className="w-24 lg:w-28 bg-white flex flex-col fixed h-[calc(100vh-2rem)] m-4 rounded-3xl z-20 border border-gray-100 shadow-sm">
            {/* Branding Section */}
            <div className="p-6 flex flex-col items-center">
                <Link href="/" className="mb-8">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                        <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin-slow"></div>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 flex flex-col items-center space-y-4 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={`p-4 rounded-2xl transition-all group relative ${isActive
                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                                    : "text-gray-400 hover:bg-blue-50 hover:text-blue-500"
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 flex flex-col items-center space-y-4">
                <Link
                    href="/admin/settings"
                    className={`p-4 rounded-2xl transition-all group relative ${pathname === "/admin/settings"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                        : "text-gray-400 hover:bg-blue-50 hover:text-blue-500"
                    }`}
                    title="Account Verification"
                >
                    <UserCheck className="w-6 h-6" />
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-4 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all"
                    title="Logout"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </aside>
    );
}
