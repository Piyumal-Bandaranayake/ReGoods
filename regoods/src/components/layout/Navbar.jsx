"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, MessageCircle, LogOut, User, PlusCircle, LayoutDashboard, HelpCircle, Phone, X, ShieldCheck } from "lucide-react";
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

  // Conditional Returns (Must stay after all Hook calls)
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin')) {
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

  // Determine if we should use dark mode for the navbar based on route or scroll
  const isDashboard = pathname !== '/';
  const useDarkNavbar = lastScrollY > 50 || isDashboard;

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-in-out ${isDashboard ? "top-0 w-full rounded-none px-12 py-3 bg-white/80 backdrop-blur-xl shadow-sm border-b border-sky-100" : `top-6 w-[95%] max-w-6xl rounded-full ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"} ${useDarkNavbar ? "py-2.5 px-10 bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl scale-[0.98]" : "py-4 px-10 bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl"}`}`}>
      <div className="flex justify-between items-center gap-8">
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <span className={`font-montserrat font-black text-xl tracking-tighter transition-colors ${isDashboard ? "text-sky-600" : "text-white group-hover:text-blue-300"}`}>RE</span>
          <span className={`font-montserrat font-light text-xl tracking-tighter transition-colors ${isDashboard ? "text-gray-400" : "text-blue-100/60 group-hover:text-white"}`}>GOODS</span>
          <span className="text-blue-400 text-3xl leading-none">.</span>
        </Link>

        {/* 2. CENTER: NAV & SEARCH */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {/* Navigation Links */}
          <div className={`flex items-center gap-1 border-r pr-8 ${isDashboard ? "border-sky-100" : "border-white/10"}`}>
            {[
              { name: 'Home', path: '/' },
              { name: 'Market', path: '/dashboard' }
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight transition-all duration-300 font-inter ${pathname === link.path ? (isDashboard ? 'text-sky-600 bg-sky-50' : 'text-white bg-blue-500/80 shadow-sm') : (isDashboard ? 'text-gray-500 hover:text-sky-600 hover:bg-sky-50/50' : 'text-white/60 hover:text-white hover:bg-white/5')}`}
              >
                {link.name}
              </Link>
            ))}

            {/* Help Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsHelpModalOpen(!isHelpModalOpen)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight transition-all font-inter ${isHelpModalOpen ? (isDashboard ? 'text-sky-600 bg-sky-50' : 'text-white bg-white/10') : (isDashboard ? 'text-gray-500 hover:text-sky-600 hover:bg-sky-50/50' : 'text-white/60 hover:text-white hover:bg-white/5')}`}
              >
                Help
              </button>

              {isHelpModalOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-[110] ${isDashboard ? 'bg-white border-sky-100' : 'bg-zinc-900/95 backdrop-blur-2xl border-white/10'}`}>
                  <div className={`p-6 text-center ${isDashboard ? 'text-gray-900' : 'text-white'}`}>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-montserrat font-bold mb-1">Need Assistance?</h3>
                    <p className={`text-[10px] mb-6 font-inter leading-relaxed ${isDashboard ? 'text-gray-500' : 'text-white/50'}`}>Our support team is available 24/7 to help you with any questions.</p>
                    <a href="tel:0705756790" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[11px] font-black transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                      <Phone className="w-3.5 h-3.5" />
                      <span>CALL: 070 575 6790</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search (COMPACT) */}
          <div className="hidden lg:block relative group flex-1 max-w-[300px]">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors ${isDashboard ? 'text-gray-400 group-focus-within:text-sky-500' : 'text-white/40 group-focus-within:text-blue-400'}`} />
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-2 border rounded-full text-[11px] transition-all placeholder:text-opacity-40 font-medium font-inter focus:outline-none ${isDashboard ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:bg-white focus:border-sky-300 placeholder:text-gray-400' : 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-blue-400/30 placeholder:text-white'}`}
              placeholder="Discover treasures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 3. ACTIONS */}
        <div className="flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-1">
              <Link
                href="/items/create"
                className="hidden lg:flex items-center bg-blue-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-all hover:bg-blue-600 active:scale-95 font-inter shadow-md"
              >
                SELL
              </Link>
              <div className={`flex items-center ${isDashboard ? "text-gray-500" : "text-white/80"}`}>
                <NotificationDropdown />
                <WishlistDropdown />
                <CartDropdown />
              </div>

              <div className="relative ml-1">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`relative h-8 w-8 rounded-full overflow-hidden border transition-all duration-300 ${isDropdownOpen ? 'border-blue-500' : 'border-white/20 hover:border-blue-400/50'}`}
                >
                  <div className="h-full w-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold text-[10px]">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-52 bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-3 bg-white/5 border-b border-white/5">
                      <h4 className="font-bold text-white text-[11px] truncate font-montserrat">{session.user.name}</h4>
                      <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider font-inter">{session.user.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      {[
                        { name: 'Dashboard', path: '/account', icon: LayoutDashboard },
                        ...(session.user.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin', icon: ShieldCheck }] : []),
                        { name: 'Inbox', path: '/inbox', icon: MessageCircle },
                        { name: session.user.isVerified ? 'My public profile' : 'My profile', path: `/profile/${session.user.id}`, icon: User }
                      ].map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className="flex items-center px-3 py-2 text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition-all font-inter"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <item.icon className="w-3.5 h-3.5 mr-2.5" />
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center px-3 py-2 text-[10px] font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-inter mt-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2.5" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {pathname !== '/auth/login' && (
                <Link href="/auth/login" className={`px-4 py-2 text-[11px] font-bold transition-colors font-inter ${isDashboard ? 'text-gray-500 hover:text-sky-600' : 'text-white/70 hover:text-white'}`}>
                  Log in
                </Link>
              )}
              {pathname !== '/auth/register' && (
                <Link
                  href="/auth/register"
                  className={`${isDashboard ? 'bg-sky-500 text-white' : 'bg-white text-blue-600'} px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all hover:opacity-90 active:scale-95 font-inter shadow-md`}
                >
                  JOIN
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
