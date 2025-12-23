"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on Admin Routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* 1. BRAND & TAGLINE */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-baseline">
              <span className="font-serif italic text-black">Re</span>
              <span className="font-sans font-extrabold tracking-tighter text-black">Goods</span>
              <span className="text-indigo-600 ml-0.5">.</span>
            </h3>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              The unified marketplace where everyone is a buyer and a seller.
              Safe, simple, and open for negotiation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-black transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. MARKETPLACE LINKS */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">Browse Items</Link>
              </li>
              <li>
                <Link href="/items/create" className="hover:text-indigo-600 transition">Start Selling</Link>
              </li>
              <li>
                <Link href="/dashboard?tab=buying" className="hover:text-indigo-600 transition">My Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* 3. SUPPORT & SAFETY */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-indigo-600 transition">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition">Report a User</Link>
              </li>
            </ul>
          </div>

          {/* 4. LEGAL */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-indigo-600 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ReGoods Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <span>Made with ❤️ for the Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}