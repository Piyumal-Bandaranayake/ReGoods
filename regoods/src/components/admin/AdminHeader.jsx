"use client";

import { signOut } from "next-auth/react";
import { LogOut, User, Bell, Search, Command, X, ChevronRight, LayoutDashboard, ShoppingBag, ShieldCheck, AlertTriangle, Users as UsersIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader({ adminName, adminImage }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();

    const navigationItems = [
        // Pages
        { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard, category: "Navigation" },
        { label: "User Management", href: "/admin/users", icon: UsersIcon, category: "Navigation" },
        { label: "Market Activity", href: "/admin/activity", icon: ShoppingBag, category: "Navigation" },
        { label: "Verify Requests", href: "/admin/verification", icon: ShieldCheck, category: "Navigation" },
        { label: "Security Reports", href: "/admin/reports", icon: AlertTriangle, category: "Navigation" },
        
        // Mocked Common Resources (Global Search feel)
        { label: "System Audit Logs", href: "/admin/reports", icon: Command, category: "System" },
        { label: "John Wick (Verified Seller)", href: "/admin/users", icon: User, category: "Users" },
        { label: "Sarah Connor (Review Needed)", href: "/admin/users", icon: User, category: "Users" },
        { label: "Vintage Rolex Oyster", href: "/admin/activity", icon: ShoppingBag, category: "Inventory" },
        { label: "Tesla Model S Plaid", href: "/admin/activity", icon: ShoppingBag, category: "Inventory" },
    ];

    const filteredItems = searchQuery.trim() === "" 
        ? [] 
        : navigationItems.filter(item => 
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
          );

    // Command + K listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="flex items-center space-x-8">
                <h2 className="text-xl font-serif font-black text-gray-900 tracking-tight italic">Control <span className="text-blue-500">Center</span></h2>
                
                {/* Search Bar & Logic */}
                <div className="hidden md:flex items-center relative group">
                    <div className="absolute left-4 z-10 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input 
                        ref={searchRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        placeholder="Search commands, users or items..." 
                        className="bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-10 py-2.5 text-sm w-96 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all text-gray-900 font-medium"
                    />
                    <div className="absolute right-4 z-10 flex items-center space-x-1 px-1.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-sm pointer-events-none">
                        <Command className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400">K</span>
                    </div>

                    {/* Search Results Dropdown */}
                    {isSearchFocused && searchQuery.length > 0 && (
                        <div className="absolute top-14 left-0 w-full bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-[110]">
                            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Global Findings</p>
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase">{filteredItems.length} Results</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto p-2">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                router.push(item.href);
                                                setSearchQuery("");
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 group transition-all text-left mb-1"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gray-50 rounded-lg shadow-sm group-hover:bg-blue-500 transition-colors">
                                                    <item.icon className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 leading-none mb-1">{item.label}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-400">{item.category}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                            <Search className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">No matching records found in ecosystem.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">


                    <div className="text-right">
                        <p className="text-sm font-black text-gray-950 tracking-tight leading-none mb-1">{adminName}</p>
                        <div className="inline-flex items-center px-2 py-0.5 bg-green-50 text-[10px] font-black text-green-600 uppercase tracking-widest rounded-md border border-green-100">
                            Super Admin
                        </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {adminImage ? (
                            <img src={adminImage} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-blue-500" />
                        )}
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-100 hover:border-red-500 group shadow-lg shadow-red-500/5"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </header>
    );
}
