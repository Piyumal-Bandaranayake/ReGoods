"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, MessageCircle, LogOut, User, PlusCircle, LayoutDashboard, HelpCircle, Phone, X } from "lucide-react";
import { useState, useEffect } from "react";
import WishlistDropdown from "./WishlistDropdown";
import CartDropdown from "./CartDropdown";
import NotificationDropdown from "./NotificationDropdown";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Always show at the very top
        if (currentScrollY < 10) {
          setIsVisible(true);
        } else {
          // Hide when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Hide Navbar on Admin Routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
      ${lastScrollY > 20 
        ? "py-3 px-4 md:px-8 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-blue-500/5 mx-4 mt-4 rounded-3xl" 
        : "py-5 px-6 md:px-12 bg-white border-b border-gray-100"}
    `}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">

          {/* 1. LOGO */}
          <div className="flex-shrink-0 flex items-center group">
            <Link href="/" className="text-2xl flex items-baseline relative">
              <span className="font-serif italic text-gray-950 font-black tracking-tight group-hover:text-blue-500 transition-colors">Re</span>
              <span className="font-sans font-black tracking-tighter text-gray-900">Goods</span>
              <span className="text-blue-500 text-3xl leading-none animate-pulse">.</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></div>
            </Link>
          </div>

          {/* 2. SEARCH BAR */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-12">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-gray-400 font-medium"
                placeholder="Search curated collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 inset-y-2">
                <div className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden group-focus-within:block animate-in fade-in zoom-in">
                  Enter
                </div>
              </div>
            </form>
          </div>

          {/* 3. NAVIGATION & ACTIONS */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Desktop Links */}
            <div className="hidden xl:flex items-center space-x-1 mr-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Marketplace', path: '/dashboard' }
              ].map((link) => (
                <Link 
                  key={link.path}
                  href={link.path} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    pathname === link.path 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-y-[-1px]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => setIsHelpModalOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-wide text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all translate-y-0 hover:translate-y-[-1px]"
              >
                Help
              </button>
            </div>

            {session ? (
              // 🟢 LOGGED IN VIEW
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Sell Button */}
                <Link
                  href="/items/create"
                  className="hidden md:flex items-center space-x-2 bg-gray-950 text-white px-6 py-2.5 rounded-[1.25rem] text-[10px] font-black tracking-[0.2em] transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>SELL ITEM</span>
                </Link>

                {/* Glass Icons */}
                <div className="flex items-center space-x-1 bg-gray-50/50 p-1 rounded-2xl border border-gray-100/50">
                  <NotificationDropdown />
                  <WishlistDropdown />
                  <CartDropdown />
                  <Link href="/inbox" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-blue-500/5">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>

                {/* Profile Avatar */}
                <div className="relative pl-2">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                      relative group h-10 w-10 rounded-xl overflow-hidden border-2 transition-all duration-500
                      ${isDropdownOpen ? 'border-blue-500 rotate-3' : 'border-gray-100 hover:border-blue-200'}
                    `}
                  >
                    <div className="h-full w-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm group-hover:scale-110 transition-transform">
                      {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="px-6 py-5 bg-blue-50/50 border-b border-gray-100">
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-1">Authenticated User</p>
                        <h4 className="font-bold text-gray-900 truncate">{session.user.name}</h4>
                      </div>

                      <div className="p-3 space-y-1">
                        {[
                          { name: 'My Account', path: '/account', icon: LayoutDashboard },
                          { name: 'Public Profile', path: `/profile/${session.user.id}`, icon: User },
                          { name: 'Order History', path: '/dashboard', icon: Heart }
                        ].map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all group"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <item.icon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                            {item.name}
                          </Link>
                        ))}

                        {session.user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Admin Terminal
                          </Link>
                        )}
                        
                        <div className="h-px bg-gray-100 my-2 mx-4"></div>

                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center px-4 py-3 text-sm font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <LogOut className="w-4 h-4 mr-3" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // 🔴 GUEST VIEW
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-500 text-white px-8 py-3 rounded-[1.25rem] text-[10px] font-black tracking-[0.2em] transition-all hover:bg-gray-950 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95"
                >
                  JOIN REGOODS
                </Link>
              </div>
            )}
          </div>
        </div >
      </div >

      {/* Help Center Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsHelpModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-10 text-center">
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-xl shadow-blue-500/10">
                <HelpCircle className="w-10 h-10 text-blue-500" />
              </div>
              
              <h3 className="text-3xl font-serif font-bold text-gray-950 mb-4 tracking-tight">Support</h3>
              <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                Our concierge service is available to assist you. Call us directly:
              </p>
              
              <a 
                href="tel:0705756790"
                className="flex items-center justify-center gap-3 w-full py-5 bg-gray-950 hover:bg-blue-500 text-white rounded-2xl font-black tracking-[0.1em] transition-all group shadow-xl hover:shadow-blue-500/20 active:scale-95"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-xl">070 575 6790</span>
              </a>
              
              <div className="mt-8 px-4 py-2 bg-blue-50 rounded-full inline-block">
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                  Active Response 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav >
  );
}
