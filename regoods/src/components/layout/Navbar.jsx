"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, MessageCircle, LogOut, User, PlusCircle, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import WishlistDropdown from "./WishlistDropdown";
import CartDropdown from "./CartDropdown";
import NotificationDropdown from "./NotificationDropdown";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* 1. LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl flex items-baseline">
              <span className="font-serif italic text-black font-semibold">Re</span>
              <span className="font-sans font-extrabold tracking-tighter text-black">Goods</span>
              <span className="text-indigo-600 text-3xl leading-none">.</span>
            </Link>
          </div>

          {/* 2. SEARCH BAR (Hidden on small mobile) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* 3. RIGHT SIDE ACTIONS */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-500 hover:text-indigo-600 font-medium transition">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600 font-medium transition">
              Marketplace
            </Link>

            {session ? (
              // 🟢 LOGGED IN VIEW
              <>
                {/* Sell Button */}
                <Link
                  href="/items/create"
                  className="hidden sm:flex items-center space-x-1 bg-blue-950 hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide transition shadow-md hover:shadow-lg hover:shadow-blue-900/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>SELL ITEM</span>
                </Link>

                {/* Icons */}
                <NotificationDropdown />
                <WishlistDropdown />
                <CartDropdown />

                <Link href="/inbox" className="text-gray-500 hover:text-indigo-600 transition">
                  <MessageCircle className="w-6 h-6" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-indigo-300 transition"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        Signed in as <br /> <span className="font-bold text-gray-900">{session.user.name}</span>
                      </div>

                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" /> My Account
                      </Link>

                      <Link
                        href={`/profile/${session.user.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" /> My Public Profile
                      </Link>

                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2" /> Dashboard
                      </Link>

                      {session.user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center font-semibold"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 🔴 GUEST VIEW
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-500 hover:text-gray-900 font-medium">
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide transition"
                >
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}