"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import { purchaseItem } from "@/app/actions/item";

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
                    <button onClick={() => router.push("/account?tab=purchases")} className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold">View Purchases</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Complete Payment
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    secure checkout for <span className="font-bold text-gray-900">{item.title}</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center text-blue-900">
                        <span className="font-medium">Total Amount</span>
                        <span className="font-bold text-xl">${item.price}</span>
                    </div>

                    <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                        <p className="font-bold mb-1">Test Mode Enabled</p>
                        <p>Use this dummy card to test:</p>
                        <div className="mt-2 bg-white p-2 rounded border border-yellow-200 font-mono text-xs select-all cursor-copy" title="Click to select">
                            Card: 4242 4242 4242 4242<br />
                            Date: Any future (e.g. 12/30)<br />
                            CVC: Any (e.g. 123)
                        </div>
                    </div>

                    <Elements options={options} stripe={stripePromise}>
                        <StripePaymentForm
                            amount={item.price}
                            onSuccess={handleStripeSuccess}
                            onError={(msg) => alert(msg)}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
}
