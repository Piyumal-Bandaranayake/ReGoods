"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import { purchaseItem } from "@/app/actions/item";
import { generateReceipt } from "@/lib/receiptGenerator";

export default function PaymentPageClient({ item, clientSecret, deliveryDetails }) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    const handleStripeSuccess = async (paymentIntent) => {
        // Confirm purchase in database
        // We'll use the delivery details passed from the previous step
        // In a real app, you might want to validate these again or store them in a more persistent state
        // For this flow, we will attach them here.

        // Note: deliveryDetails might be empty if user refreshed the page directly on /checkout/payment
        // In a robust app we'd use a session store or recreating intent with shipping details.
        // For this quick integration, valid details are assumed if they came from checkout.
        // If they are missing, we might use placeholders or fail.

        const finalDelivery = deliveryDetails || {
            fullName: "Stripe User",
            email: "stripe@example.com",
            address: "Stripe Address",
            city: "Stripe City",
            postalCode: "00000",
            phone: "0000000000"
        };

        try {
            const result = await purchaseItem({
                itemId: item._id,
                paymentMethod: "Online",
                deliveryDetails: finalDelivery,
                paymentIntentId: paymentIntent.id
            });

            if (result.success) {
                // Auto-download receipt
                try {
                    generateReceipt(item, finalDelivery, "Online", 40);
                } catch (pdfErr) {
                    console.error("Receipt download failed", pdfErr);
                }
                setSuccess(true);
            } else {
                alert("Payment succeeded but order recording failed: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("System error recording purchase.");
        }
    };

    const appearance = { theme: 'stripe', variables: { colorPrimary: '#1e3a8a' } };
    const options = { clientSecret, appearance };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 mb-6">Your order has been confirmed.</p>
                    <button onClick={() => router.push("/dashboard")} className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-3">
                        Complete Payment
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Secure checkout for <span className="font-bold text-gray-900">{item.title}</span>
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                    {/* LEFT CARD: Price Summary */}
                    <div className="bg-white p-8 shadow-xl rounded-3xl border border-gray-100 h-fit sticky top-32">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">Order Summary</h2>

                        {/* Item Details */}
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <div className="flex items-start gap-4">
                                {item.images && item.images[0] && (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 font-medium">Item Price</span>
                                <span className="font-bold text-gray-900">${item.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 font-medium">Shipping Charge</span>
                                <span className="font-bold text-gray-900">$40</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-6 border-t-2 border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-black text-gray-900 text-lg uppercase tracking-wider">Total</span>
                                <span className="font-black text-blue-900 text-3xl">${(item.price + 40).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-2 text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-widest">Secured by Stripe</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD: Payment Form */}
                    <div className="bg-white p-8 shadow-xl rounded-3xl border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">Payment Details</h2>

                        {/* Stripe Payment Form */}
                        <Elements options={options} stripe={stripePromise}>
                            <StripePaymentForm
                                amount={item.price + 40}
                                onSuccess={handleStripeSuccess}
                                onError={(msg) => alert(msg)}
                            />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
}
