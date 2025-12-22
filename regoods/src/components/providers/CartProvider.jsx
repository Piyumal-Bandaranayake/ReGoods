"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getCartItems, toggleCart as toggleCartAction } from "@/app/actions/user";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { cart } = await getCartItems();
      setCartItems(cart || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = async (itemId) => {
    try {
        const result = await toggleCartAction(itemId);
        if (result.success) {
            await fetchCart(); 
        }
        return result;
    } catch (error) {
        console.error("Error toggling cart", error);
        return { error: "Failed to update" };
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, toggleCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
