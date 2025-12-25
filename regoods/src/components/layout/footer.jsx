"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on Admin Routes or Verification page
  if (pathname?.startsWith('/admin') || pathname === '/account/verify') {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* 1. BRAND & TAGLINE */}
          <div className="space-y-6">
            <Link href="/" className="flex items-baseline group">
              <span className="font-montserrat font-black text-2xl tracking-tighter text-zinc-900 group-hover:text-blue-500 transition-colors">RE</span>
              <span className="font-montserrat font-light text-2xl tracking-tighter text-zinc-400 group-hover:text-zinc-600 transition-colors">GOODS</span>
              <span className="text-blue-500 text-3xl leading-none">.</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-medium font-inter">
              Join the future of sustainable commerce. Buy, sell, and discover unique pre-owned treasures.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-zinc-500 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-blue-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. MARKETPLACE LINKS */}
          <div>
            <h4 className="font-bold text-zinc-900 mb-6 uppercase text-xs tracking-widest font-montserrat">Marketplace</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-medium font-inter">
              <li>
                <Link href="/" className="hover:text-blue-500 transition-colors">Browse Items</Link>
              </li>
              <li>
                <Link href="/items/create" className="hover:text-blue-500 transition-colors">Start Selling</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-500 transition-colors">My Account</Link>
              </li>
            </ul>
          </div>

          {/* 3. SUPPORT & SAFETY */}
          <div>
            <h4 className="font-bold text-zinc-900 mb-6 uppercase text-xs tracking-widest font-montserrat">Support</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-medium font-inter">
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Safety Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* 4. LEGAL */}
          <div>
            <h4 className="font-bold text-zinc-900 mb-6 uppercase text-xs tracking-widest font-montserrat">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-medium font-inter">
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">Cookie Settings</Link>
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