"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, AlertTriangle, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/activity", label: "Market Activity", icon: ShoppingBag },
        { href: "/admin/verification", label: "Verifications", icon: ShieldCheck },
        { href: "/admin/reports", label: "Reports", icon: AlertTriangle },
    ];

    return (
        <aside className="w-72 bg-[#0A0C10] text-gray-400 flex flex-col fixed h-full z-20 border-r border-gray-900">
            {/* Branding Section */}
            <div className="p-8 mb-4">
                <Link href="/" className="inline-flex items-baseline group">
                    <span className="font-serif italic text-2xl text-white font-black tracking-tight group-hover:text-blue-500 transition-colors">Re</span>
                    <span className="font-sans font-black text-2xl tracking-tighter text-white underline decoration-blue-500 decoration-4 underline-offset-4">Goods</span>
                    <span className="text-blue-500 text-3xl leading-none">.</span>
                </Link>
                <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Admin Panel</span>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="px-6 space-y-8 flex-1">
                <nav className="space-y-1.5">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4">Main Console</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95"
                                        : "hover:bg-gray-900 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <item.icon className={`w-5 h-5 mr-3 px-0.5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-400"}`} />
                                    <span className={`text-sm tracking-tight ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                            </Link>
                        );
                    })}
                </nav>

                <nav className="space-y-1.5">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4">System</p>
                    <div className="px-4 py-3 text-xs font-semibold text-gray-500 bg-gray-900/50 rounded-2xl border border-gray-800/50">
                        v2.4.0 (Stable) Deployment
                    </div>
                </nav>
            </div>

            {/* Decorative Element */}
            <div className="p-8">
                <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-lg shadow-blue-900/40 transition-transform active:scale-95">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-white text-xs font-black uppercase tracking-widest mb-1">Global Support</p>
                    <p className="text-blue-100 text-[10px]">Cloud monitoring active</p>
                </div>
            </div>
        </aside>
    );
}
