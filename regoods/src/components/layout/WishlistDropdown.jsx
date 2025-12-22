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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transition flex items-center relative ${isOpen ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
        aria-label="Wishlist"
      >
        <Heart className="w-6 h-6" />
        {wishlistItems.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {wishlistItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="font-bold text-gray-800">Your Wishlist ({wishlistItems.length})</span>
            <Link
              href="/dashboard?tab=buying" // Or wherever the full wishlist page is
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
              onClick={() => setIsOpen(false)}
            >
              View All
            </Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
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
                <div className="py-2">
                    {wishlistItems.map((item) => (
                      <Link 
                        key={item._id} 
                        href={`/items/${item._id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group border-b border-gray-50 last:border-0"
                        onClick={() => setIsOpen(false)}
                      >
                         {/* Image */}
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 relative">
                          {item.images && item.images[0] ? (
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300">
                               <Heart className="w-4 h-4" />
                             </div>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 font-semibold mt-0.5">
                            ${item.price?.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
