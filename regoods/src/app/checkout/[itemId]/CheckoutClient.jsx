"use client";

import { useState } from "react";
import { purchaseItem } from "@/app/actions/item";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, MapPin, Truck, CreditCard, ArrowRight } from "lucide-react";
import { generateReceipt } from "@/lib/receiptGenerator";

export default function CheckoutClient({ item, session }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [deliveryDetails, setDeliveryDetails] = useState({
        firstName: session?.user?.name?.split(' ')[0] || "",
        lastName: session?.user?.name?.split(' ')[1] || "",
        email: session?.user?.email || "",
        address: "",
        city: "",
        postalCode: "",
        phone: ""
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleConfirm = async () => {
        if (!deliveryDetails.firstName || !deliveryDetails.phone || !deliveryDetails.address || !deliveryDetails.city) {
            alert("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        const fullName = `${deliveryDetails.firstName} ${deliveryDetails.lastName}`;
        const result = await purchaseItem({
            itemId: item._id,
            paymentMethod,
            deliveryDetails: { ...deliveryDetails, fullName }
        });

        if (result.success) {
            try {
                generateReceipt(item, { ...deliveryDetails, fullName }, paymentMethod, 40);
            } catch (err) { }
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

    const inputClasses = "w-full py-4 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all";

    return (
        <div className="space-y-6">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-sky-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                        <p className="text-gray-400 mb-8 text-sm">Your order was successful. The receipt has been downloaded.</p>
                        <button onClick={() => router.push("/dashboard")} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-sky-500 transition-all">
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Combined Shipping & Payment Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">

                {/* 1. Details Header */}
                <div className="mb-4">
                    <h2 className="text-base font-bold text-gray-900">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                        <input name="firstName" value={deliveryDetails.firstName} onChange={handleInputChange} className="w-full py-2 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all" placeholder="First Name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                        <input name="lastName" value={deliveryDetails.lastName} onChange={handleInputChange} className="w-full py-2 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all" placeholder="Last Name" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                        <input name="phone" value={deliveryDetails.phone} onChange={handleInputChange} className="w-full py-2 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all" placeholder="Phone Number" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zip Code</label>
                        <input name="postalCode" value={deliveryDetails.postalCode} onChange={handleInputChange} className="w-full py-2 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all" placeholder="Zip Code" />
                    </div>

                    <div className="col-span-2 grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</label>
                            <input name="address" value={deliveryDetails.address} onChange={handleInputChange} className="w-full py-2 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all" placeholder="Street Address" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">City</label>
                            <input name="city" value={deliveryDetails.city} onChange={handleInputChange} className="w-full py-2 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all" placeholder="City" />
                        </div>
                    </div>
                </div>

                {/* 2. Payment Header */}
                <div className="mb-4 border-t border-gray-100 pt-4">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Payment Method</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => setPaymentMethod("COD")}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${paymentMethod === 'COD' ? 'border-sky-500 bg-sky-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className={`p-1.5 rounded-lg ${paymentMethod === 'COD' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <Truck className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">Pay on Delivery</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("Online")}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${paymentMethod === 'Online' ? 'border-sky-500 bg-sky-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className={`p-1.5 rounded-lg ${paymentMethod === 'Online' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">Online Payment</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={paymentMethod === 'Online' ? () => router.push(`/checkout/payment?itemId=${item._id}`) : handleConfirm}
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                {paymentMethod === 'Online' ? "Continue to Payment" : "Complete Order"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
