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
    const [error, setError] = useState("");

    const [deliveryDetails, setDeliveryDetails] = useState({
        firstName: session?.user?.name?.split(' ')[0] || "",
        lastName: session?.user?.name?.split(' ')[1] || "",
        email: session?.user?.email || "",
        address: "",
        city: "",
        postalCode: "",
        phone: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "firstName":
                if (!value.trim()) error = "First name is required";
                break;
            case "phone":
                const phoneRegex = /^[0-9+() -]{7,15}$/;
                if (!value.trim()) error = "Phone number is required";
                else if (!phoneRegex.test(value)) error = "Invalid phone number format";
                break;
            case "address":
                if (!value.trim()) error = "Address is required";
                else if (value.trim().length < 5) error = "Please provide a more specific address";
                break;
            case "city":
                if (!value.trim()) error = "City is required";
                break;
            case "postalCode":
                if (!value.trim()) error = "Zip code is required";
                break;
            default:
                break;
        }
        setFormErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleConfirm = async () => {
        const errors = {};
        errors.firstName = validateField("firstName", deliveryDetails.firstName);
        errors.phone = validateField("phone", deliveryDetails.phone);
        errors.address = validateField("address", deliveryDetails.address);
        errors.city = validateField("city", deliveryDetails.city);
        errors.postalCode = validateField("postalCode", deliveryDetails.postalCode);

        setTouched({
            firstName: true,
            phone: true,
            address: true,
            city: true,
            postalCode: true
        });

        const hasErrors = Object.values(errors).some(err => err);
        if (hasErrors) {
            setError("Please fill in all required fields correctly.");
            return;
        }

        setLoading(true);
        setError("");
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
            setError(result.error);
        }
        setLoading(false);
    };

    const inputClasses = (name) => `w-full py-2 px-3 bg-gray-50 border rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all ${touched[name] && formErrors[name] ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-100'}`;

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
                        <button onClick={() => router.push("/dashboard")} className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-sky-500 transition-all">
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Combined Shipping & Payment Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-base font-bold text-gray-900">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                        <input
                            name="firstName"
                            value={deliveryDetails.firstName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={inputClasses("firstName")}
                            placeholder="First Name"
                        />
                        {touched.firstName && formErrors.firstName && <p className="text-[9px] text-red-500 font-bold px-1">{formErrors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                        <input
                            name="lastName"
                            value={deliveryDetails.lastName}
                            onChange={handleInputChange}
                            className={inputClasses("lastName")}
                            placeholder="Last Name"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                        <input
                            name="phone"
                            value={deliveryDetails.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={inputClasses("phone")}
                            placeholder="Phone Number"
                        />
                        {touched.phone && formErrors.phone && <p className="text-[9px] text-red-500 font-bold px-1">{formErrors.phone}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zip Code</label>
                        <input
                            name="postalCode"
                            value={deliveryDetails.postalCode}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={inputClasses("postalCode")}
                            placeholder="Zip Code"
                        />
                        {touched.postalCode && formErrors.postalCode && <p className="text-[9px] text-red-500 font-bold px-1">{formErrors.postalCode}</p>}
                    </div>

                    <div className="col-span-2 grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                            <input
                                name="address"
                                value={deliveryDetails.address}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={inputClasses("address")}
                                placeholder="Street Address"
                            />
                            {touched.address && formErrors.address && <p className="text-[9px] text-red-500 font-bold px-1">{formErrors.address}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">City</label>
                            <input
                                name="city"
                                value={deliveryDetails.city}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={inputClasses("city")}
                                placeholder="City"
                            />
                            {touched.city && formErrors.city && <p className="text-[9px] text-red-500 font-bold px-1">{formErrors.city}</p>}
                        </div>
                    </div>
                </div>

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
                    {error && <p className="text-[10px] text-red-500 font-bold text-center mb-4 uppercase tracking-widest">{error}</p>}
                    <button
                        onClick={paymentMethod === 'Online' ? () => router.push(`/checkout/payment?itemId=${item._id}`) : handleConfirm}
                        disabled={loading}
                        className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
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
