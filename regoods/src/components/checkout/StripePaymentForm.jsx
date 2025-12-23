"use client";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function StripePaymentForm({ onSuccess, onError, amount }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the payment.
                // However, with redirect: 'if_required', we might handle it inline.
                return_url: `${window.location.origin}/dashboard`, // We'll handle success via callback if possible
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            onError(error.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent);
        } else {
            setMessage("Something went wrong.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement id="payment-element" />

            {message && <div className="text-red-500 text-sm mt-2">{message}</div>}

            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full py-4 mt-6 bg-blue-900 hover:bg-black text-white font-bold rounded-lg hover:scale-[1.02] transition disabled:opacity-50 flex justify-center items-center text-sm uppercase tracking-widest shadow-md hover:shadow-lg"
            >
                {isLoading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                        Processing...
                    </>
                ) : (
                    `Pay $${amount} Now`
                )}
            </button>
        </form>
    );
}
