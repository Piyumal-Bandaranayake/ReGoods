"use client";

import { useState } from "react";
import { purchaseItem } from "@/app/actions/item";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Package, ArrowRight, User, Mail, Phone, MapPin, CreditCard, Truck } from "lucide-react";
import { generateReceipt } from "@/lib/receiptGenerator";

export default function CheckoutClient({ item }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("COD");

    // Delivery State
    const [deliveryDetails, setDeliveryDetails] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        phone: ""
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleConfirm = async () => {
        // Validation
        if (!deliveryDetails.fullName || !deliveryDetails.phone || !deliveryDetails.address || !deliveryDetails.city) {
            alert("Please provide the essential delivery information.");
            return;
        }

        setLoading(true);

        const result = await purchaseItem({
            itemId: item._id,
            paymentMethod,
            deliveryDetails
        });

        if (result.success) {
            // Auto-download receipt
            try {
                generateReceipt(item, deliveryDetails, paymentMethod, 40);
            } catch (pdfErr) {
                console.error("Receipt download failed", pdfErr);
            }
            
            setSuccessMessage("Your order has been authorized and placed for delivery. Your receipt has been downloaded.");
            setShowSuccessModal(true);
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        router.push("/account?tab=purchases");
    };

    const inputClasses = "w-full py-4 px-5 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all duration-300";

    return (
        <div className="flex flex-col relative animate-fade-in-up">
            {/* 1. SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl transform transition-all animate-scale-in text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>

                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                            <CheckCircle className="w-12 h-12 text-blue-500" />
                        </div>

                        <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">Transaction <br/> Complete</h3>
                        <p className="text-gray-500 mb-10 leading-relaxed text-sm italic">
                            {successMessage}
                        </p>

                        <button
                            onClick={() => router.push("/dashboard")}
                            className="group w-full py-5 bg-gray-900 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3"
                        >
                            Return to Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-10">
                {/* 2. DELIVERY INFORMATION SECTION */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Logistics Identity</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                             <div className="relative">
                                <User className="absolute top-1/2 -translate-y-1/2 left-5 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={deliveryDetails.fullName}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} pl-12`}
                                    placeholder="Recipient Name"
                                />
                             </div>
                        </div>

                        <div className="relative">
                            <Mail className="absolute top-1/2 -translate-y-1/2 left-5 w-4 h-4 text-gray-300" />
                            <input
                                type="email"
                                name="email"
                                value={deliveryDetails.email}
                                onChange={handleInputChange}
                                className={`${inputClasses} pl-12`}
                                placeholder="Contact Email"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute top-1/2 -translate-y-1/2 left-5 w-4 h-4 text-gray-300" />
                            <input
                                type="tel"
                                name="phone"
                                value={deliveryDetails.phone}
                                onChange={handleInputChange}
                                className={`${inputClasses} pl-12`}
                                placeholder="Phone Number"
                            />
                        </div>

                        <div className="md:col-span-2 relative">
                            <MapPin className="absolute top-1/2 -translate-y-1/2 left-5 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                name="address"
                                value={deliveryDetails.address}
                                onChange={handleInputChange}
                                className={`${inputClasses} pl-12`}
                                placeholder="Residential Address"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="city"
                                value={deliveryDetails.city}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="City"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="postalCode"
                                value={deliveryDetails.postalCode}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="Postcode"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. PAYMENT ARCHITECTURE SECTION */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Settlement Method</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PaymentOption 
                            id="COD" 
                            label="Pay on Arrival" 
                            sub="Cash / Local Payment" 
                            icon={<Truck />} 
                            active={paymentMethod === 'COD'} 
                            onChange={() => setPaymentMethod('COD')} 
                        />
                        <PaymentOption 
                            id="Online" 
                            label="Digital Gateway" 
                            sub="Card / Secure Credit" 
                            icon={<CreditCard />} 
                            active={paymentMethod === 'Online'} 
                            onChange={() => setPaymentMethod('Online')} 
                        />
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center sm:text-left">
                        {paymentMethod === 'Online' ? (
                            <div className="animate-fade-in">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-6">
                                    You will be redirected to our encrypted digital vault to finalize the transaction.
                                </p>
                                <button
                                    onClick={() => {
                                        if (!deliveryDetails.fullName || !deliveryDetails.phone || !deliveryDetails.address || !deliveryDetails.city) {
                                            alert("Please finalize your delivery coordinates first.");
                                            return;
                                        }
                                        router.push(`/checkout/payment?itemId=${item._id}`);
                                    }}
                                    className="group w-full py-5 bg-blue-500 hover:bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                                >
                                    Initalize Secure Payment
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-6">
                                    No immediate deduction. Total payable upon physical exchange of the item.
                                </p>
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="group w-full py-5 bg-gray-900 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Authorize Order • ${(item.price + 40).toLocaleString()}
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function PaymentOption({ id, label, sub, icon, active, onChange }) {
    return (
        <label onClick={onChange} className={`relative flex items-center p-6 rounded-3xl cursor-pointer transition-all duration-500 group overflow-hidden ${active ? 'bg-blue-50 border-2 border-blue-500 shadow-xl shadow-blue-500/5' : 'bg-gray-50/50 border-2 border-transparent hover:bg-white hover:border-gray-100'}`}>
            <div className={`p-4 rounded-2xl transition-colors ${active ? 'bg-blue-500 text-white' : 'bg-white text-gray-300 group-hover:text-blue-500 shadow-sm'}`}>
                {icon && typeof icon === 'object' ? React.cloneElement(icon, { className: "w-6 h-6" }) : icon}
            </div>
            <div className="ml-5">
                <span className={`block font-serif font-bold text-lg leading-none mb-1 ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                <span className={`block text-[10px] font-bold uppercase tracking-widest ${active ? 'text-blue-400' : 'text-gray-300'}`}>{sub}</span>
            </div>
            {active && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            )}
        </label>
    );
}

import React from "react";
