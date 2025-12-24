"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import AdminPasswordResetModal from "./AdminPasswordResetModal";

export default function AdminProfileDropdown({ adminName, adminImage, requiresPasswordReset }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (requiresPasswordReset) {
            setIsModalOpen(true);
        }
    }, [requiresPasswordReset]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name) => {
        if (!name) return "A";
        return name.charAt(0).toUpperCase();
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center space-x-2 p-1.5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 ${isOpen ? 'ring-2 ring-blue-500/10' : ''}`}
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                        {adminImage ? (
                            <img src={adminImage} alt={adminName} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(adminName)
                        )}
                    </div>
                    <div className="hidden xl:block text-left px-2 pr-4">
                        <p className="text-xs font-bold text-gray-900 leading-none mb-1">{adminName || "Admin"}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider leading-none">Administrator</p>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[200] animate-in slide-in-from-top-2 duration-200">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <div className="flex items-center space-x-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {getInitials(adminName)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{adminName}</h3>
                                    <p className="text-[10px] text-gray-500 font-medium tracking-tight">System Administrator</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center space-x-3 p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                    <SettingsIcon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold">Security Settings</span>
                            </button>

                            <div className="h-px bg-gray-50 my-2 mx-4" />

                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full flex items-center space-x-3 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold">Sign Out System</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AdminPasswordResetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                isForced={requiresPasswordReset}
            />
        </>
    );
}
