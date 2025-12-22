"use client";

import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cartItems = [], toggleCart } = useCart() || {};

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

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transition flex items-center relative ${isOpen ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
        aria-label="Cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
            {cartItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="font-bold text-gray-800">Your Cart ({cartItems.length})</span>
            <Link
              href="/cart"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
              onClick={() => setIsOpen(false)}
            >
              View Cart
            </Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-200 mb-2" />
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
                <Link
                  href="/dashboard"
                  className="mt-3 text-sm text-indigo-600 font-medium hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <div key={item._id} className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition">
                         {/* Image */}
                         <Link href={`/items/${item._id}`} onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 relative block">
                            {item.images && item.images[0] ? (
                              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300">
                                 <ShoppingCart className="w-4 h-4" />
                               </div>
                            )}
                         </Link>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/items/${item._id}`} onClick={() => setIsOpen(false)} className="block">
                              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                ${item.price?.toLocaleString()}
                              </p>
                          </Link>
                        </div>

                         {/* Remove Button */}
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCart(item._id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove"
                         >
                             <X className="w-4 h-4" />
                         </button>
                      </div>
                    ))}
                </div>
            )}
          </div>

          {cartItems.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-500">Subtotal</span>
                      <span className="text-lg font-bold text-gray-900">${subtotal.toLocaleString()}</span>
                  </div>
                  <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-3 bg-black text-white text-center font-bold text-sm uppercase tracking-widest rounded-full hover:bg-gray-800 transition"
                  >
                      Checkout
                  </Link>
              </div>
          )}
        </div>
      )}
    </div>
  );
}
