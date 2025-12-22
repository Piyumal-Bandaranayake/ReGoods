"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function WishlistDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Placeholder for wishlist items (In a real implementation, fetch this from an API/Context)
  const wishlistItems = []; 

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transition flex items-center ${isOpen ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
        aria-label="Wishlist"
      >
        <Heart className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="font-bold text-gray-800">Your Wishlist</span>
            <Link
              href="/dashboard?tab=buying"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
              onClick={() => setIsOpen(false)}
            >
              View All
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {wishlistItems.length === 0 ? (
              <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                <Heart className="w-10 h-10 text-gray-200 mb-2" />
                <p className="text-gray-500 text-sm">Your wishlist is empty.</p>
                <Link
                  href="/dashboard"
                  className="mt-3 text-sm text-indigo-600 font-medium hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Explore Items
                </Link>
              </div>
            ) : (
                // Future implementation for list items
                <div className="p-2">
                    {/* Items would map here */}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
