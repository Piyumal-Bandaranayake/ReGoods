"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function CartDropdown() {
  const { cartItems = [] } = useCart() || {};

  return (
    <Link href="/cart" className="relative group p-2 text-gray-500 hover:text-blue-900 transition">
      <ShoppingCart className="w-6 h-6" />
      {cartItems.length > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white border border-white">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
}
