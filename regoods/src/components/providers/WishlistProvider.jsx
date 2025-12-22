"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getWishlistItems, toggleWishlist as toggleWishlistAction } from "@/app/actions/user";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [session]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { wishlist } = await getWishlistItems();
      setWishlistItems(wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (itemId) => {
    try {
        const result = await toggleWishlistAction(itemId);
        if (result.success) {
            // Re-fetch to ensure we have the correct items (with details)
            await fetchWishlist(); 
        }
        return result;
    } catch (error) {
        console.error("Error toggling wishlist", error);
        return { error: "Failed to update" };
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, toggleWishlist, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
