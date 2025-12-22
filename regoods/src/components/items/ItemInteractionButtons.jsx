"use client";

import { useState } from "react";
import { toggleWishlist, toggleCart } from "@/app/actions/user";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export function WishlistButton({ itemId, initialIsWishlisted }) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        if (loading) return;
        setLoading(true);
        const result = await toggleWishlist(itemId);
        if (result.success) {
            setIsWishlisted(result.isWishlisted);
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
            className={`w-14 h-14 rounded-full border flex items-center justify-center transition hover:shadow-md ${isWishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-200 text-gray-400 hover:text-black hover:border-black'
                }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
    );
}

export function AddToCartButton({ itemId, initialIsInCart }) {
    const [isInCart, setIsInCart] = useState(initialIsInCart);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        if (loading) return;
        setLoading(true);
        const result = await toggleCart(itemId);
        if (result.success) {
            setIsInCart(result.isInCart);
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
            className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition flex items-center justify-center ${isInCart
                ? 'bg-gray-200 text-gray-900 cursor-default'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
                }`}
        >
            {isInCart ? "Added to Cart" : "Add to Cart"}
            <ShoppingCart className={`w-4 h-4 ml-2 ${isInCart ? 'fill-current' : ''}`} />
        </button>
    );
}

export function BuyNowButton({ itemId }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(`/checkout/${itemId}`)}
            className="w-full py-4 rounded-full bg-black text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition shadow-lg flex justify-center items-center"
        >
            Buy Now
        </button>
    );
}

