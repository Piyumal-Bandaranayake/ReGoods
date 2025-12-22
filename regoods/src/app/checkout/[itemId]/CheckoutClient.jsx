"use client";

import { useState } from "react";
import { purchaseItem } from "@/app/actions/item";
import { useRouter } from "next/navigation";

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

    const handleConfirm = async () => {
        // Validation
        if (!deliveryDetails.fullName || !deliveryDetails.email || !deliveryDetails.address || !deliveryDetails.city || !deliveryDetails.phone) {
            alert("Please fill in all delivery details.");
            return;
        }

        setLoading(true);

        if (paymentMethod === "Online") {
            // Simulator for online payment
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const result = await purchaseItem({
            itemId: item._id,
            paymentMethod,
            deliveryDetails
        });

        if (result.success) {
            const message = paymentMethod === 'COD'
                ? "Success! Your order has been placed via Cash on Delivery."
                : "Payment Successful! Your order has been confirmed.";
            alert(message);
            router.push("/account?tab=purchases");
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails(prev => ({ ...prev, [name]: value }));
    };

    const inputClasses = "w-full p-2.5 border border-gray-200 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-black transition placeholder-gray-400";

    return (
        <div className="flex flex-col">
            <div className="space-y-3">
                {/* Delivery Details Section */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Delivery Details</span>

                    <div className="grid grid-cols-6 gap-3">
                        <div className="col-span-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={deliveryDetails.fullName}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="col-span-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={deliveryDetails.email}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={deliveryDetails.phone}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={deliveryDetails.city}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="New York"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={deliveryDetails.postalCode}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="10001"
                            />
                        </div>

                        <div className="col-span-6">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={deliveryDetails.address}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="123 Street Name"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Payment Method</span>

                    <div className="grid grid-cols-2 gap-3">
                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${paymentMethod === 'COD' ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                            />
                            <div className="ml-3">
                                <span className="block font-bold text-gray-900 text-sm">COD</span>
                                <span className="block text-xs text-gray-500">Pay on delivery</span>
                            </div>
                        </label>

                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${paymentMethod === 'Online' ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="Online"
                                checked={paymentMethod === 'Online'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                            />
                            <div className="ml-3">
                                <span className="block font-bold text-gray-900 text-sm">Online</span>
                                <span className="block text-xs text-gray-500">Card / Digital</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-4 mt-3 bg-blue-950 hover:bg-black text-white font-bold rounded-lg hover:scale-[1.02] transition disabled:opacity-50 flex justify-center items-center text-sm uppercase tracking-widest shadow-md hover:shadow-lg hover:shadow-blue-900/20"
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                        {paymentMethod === 'Online' ? 'Processing...' : 'Wait...'}
                    </>
                ) : (
                    `Confirm • $${item.price}`
                )}
            </button>
        </div>
    );
}
