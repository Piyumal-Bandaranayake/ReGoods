"use client";

import { useState } from "react";
import { adminCreateUser } from "@/app/actions/admin";
import { X, User, Mail, Lock, Shield, Loader2, CheckCircle } from "lucide-react";

export default function CreateUserModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [emailStatus, setEmailStatus] = useState({ sent: true, error: null });
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await adminCreateUser(formData);
        
        if (result.success) {
            setSuccess(true);
            setEmailStatus({ sent: result.emailSent, error: result.emailError });
            
            // Only close automatically if email was sent successfully
            if (result.emailSent) {
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                    setFormData({ name: "", email: "", password: "", role: "user" });
                }, 3000);
            }
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl animate-fade-in-up">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-gray-400 hover:text-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Account</h2>
                    <p className="text-sm text-gray-500 font-medium">Add a new user or administrator to the platform.</p>
                </div>

                {success ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${emailStatus.sent ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                            {emailStatus.sent ? <CheckCircle className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {emailStatus.sent ? "User Created & Notified!" : "User Created (Email Failed)"}
                        </h3>
                        {emailStatus.sent ? (
                            <p className="text-sm text-gray-500 font-medium">The account is ready and credentials have been sent.</p>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <p className="text-xs text-amber-700 font-bold mb-1 italic">Email Error:</p>
                                    <p className="text-[10px] text-amber-600 font-medium break-words max-w-[300px]">{emailStatus.error || "Connection timeout"}</p>
                                </div>
                                <p className="text-xs text-gray-400">Please provide the password to the user manually.</p>
                                <button 
                                    onClick={onClose}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100 italic">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Name */}
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    required
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            {/* Role Select */}
                            <div className="relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <select
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="user">Regular Buyer / Seller</option>
                                    <option value="admin">System Administrator</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-500 text-white rounded-2xl text-sm font-bold hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Create User"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
