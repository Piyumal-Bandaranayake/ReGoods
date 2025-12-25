"use client";

import { useState } from "react";
import { toggleWishlist, toggleCart } from "@/app/actions/user";
import { createOffer } from "@/app/actions/offer";
import { Heart, ShoppingCart, DollarSign, X, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";

export function WishlistButton({ itemId, initialIsWishlisted }) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toggleWishlist: toggleWishlistContext } = useWishlist() || {};

    const handleToggle = async () => {
        if (loading) return;
        setLoading(true);

        // Use context function if available, fall back to direct action
        const action = toggleWishlistContext || toggleWishlist;

        const result = await action(itemId);

        if (result.success) {
            // Result.isWishlisted might be available from the action return
            // But if context, it returns what the action returns.
            // The action in user.js return { success: true, isWishlisted: !isWishlisted }
            if (result.isWishlisted !== undefined) {
                setIsWishlisted(result.isWishlisted);
            } else {
                // Fallback if return is different
                setIsWishlisted(!isWishlisted);
            }
            router.refresh();
        } else if (result.error === "Not logged in") {
            router.push("/auth/login");
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition hover:shadow-md ${isWishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-200 text-gray-400 hover:text-black hover:border-black'
                }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
    );
}

export function AddToCartButton({ itemId, initialIsInCart }) {
    const [isInCart, setIsInCart] = useState(initialIsInCart);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toggleCart: toggleCartContext } = useCart() || {};

    const handleToggle = async () => {
        if (loading) return;
        setLoading(true);

        const action = toggleCartContext || toggleCart;
        const result = await action(itemId);

        if (result.success) {
            if (result.isInCart !== undefined) {
                setIsInCart(result.isInCart);
            } else {
                setIsInCart(!isInCart);
            }
            router.refresh();
        } else if (result.error === "Not logged in") {
            router.push("/auth/login");
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition flex items-center justify-center ${isInCart
                ? 'bg-gray-200 text-gray-900 cursor-default'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
                }`}
        >
            {isInCart ? "Added" : "Add to Cart"}
            <ShoppingCart className={`w-3.5 h-3.5 ml-2 ${isInCart ? 'fill-current' : ''}`} />
        </button>
    );
}

export function BuyNowButton({ itemId }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(`/checkout/${itemId}`)}
            className="w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition flex items-center justify-center bg-blue-900 text-white hover:bg-black"
        >
            Buy Now
            <CreditCard className="w-3.5 h-3.5 ml-2" />
        </button>
    );
}

export function NegotiateButton({ itemId, currentPrice }) {
    const [isOpen, setIsOpen] = useState(false);
    const [offerPrice, setOfferPrice] = useState(currentPrice);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await createOffer(itemId, offerPrice);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setSuccess(false);
                router.refresh();
            }, 2000);
        } else {
            setError(result.error);
            if (result.error === "You must be logged in to make an offer.") {
                router.push("/auth/login");
            }
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-2.5 rounded-full bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition shadow-sm text-center flex items-center justify-center border border-transparent"
            >
                Make Offer
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="absolute inset-0" onClick={() => !loading && setIsOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold font-serif">Make an Offer</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition"
                                disabled={loading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="mb-8 text-center">
                                <p className="text-gray-500 text-sm mb-2 uppercase tracking-widest font-bold">Current Price</p>
                                <p className="text-4xl font-bold text-gray-900 font-serif">${currentPrice}</p>
                            </div>

                            {success ? (
                                <div className="py-8 text-center animate-bounce">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Offer Sent!</h4>
                                    <p className="text-gray-500">The seller will review your offer.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Offer Price ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={offerPrice}
                                                onChange={(e) => setOfferPrice(e.target.value)}
                                                className="w-full pl-8 pr-4 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-xl outline-none transition text-xl font-bold"
                                                placeholder="Enter amount"
                                                required
                                                min="1"
                                                disabled={loading}
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs mt-3 font-bold">{error}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-blue-900 text-white rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center disabled:opacity-50"
                                    >
                                        {loading ? "Sending..." : "Send Offer"}
                                    </button>

                                    <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                        By sending an offer, you agree to purchase the item at this price if the seller accepts.
                                    </p>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

