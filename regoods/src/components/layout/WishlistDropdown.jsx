"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useWishlist } from "@/components/providers/WishlistProvider";

export default function WishlistDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { wishlistItems = [] } = useWishlist() || {};

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Link href="/wishlist" className="relative group p-2 text-gray-500 hover:text-blue-950 transition">
      <Heart className="w-6 h-6" />
      {wishlistItems.length > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
          {wishlistItems.length}
        </span>
      )}
    </Link>
  );
}
