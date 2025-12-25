import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import Offer from "@/lib/models/Offer";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, Package, ShoppingBag, MessageCircle,
    Settings, DollarSign, Eye, TrendingUp, MapPin,
    PlusCircle, ArrowRight, Wallet, Clock, ShieldCheck, Share2, Search, Bell, User as UserIcon, Download, Upload, MoreVertical, CreditCard
} from "lucide-react";
import ProfileSettings from "@/components/account/ProfileSettings";
import ItemActions from "@/components/account/ItemActions";
import OfferList from "@/components/account/OfferList";
import SoldItemCard from "@/components/profile/SoldItemCard";
import PurchaseItemCard from "@/components/account/PurchaseItemCard";
import { getConversations } from "@/app/actions/message";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import React from "react";

async function getAccountData(userId) {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return null;

    // Fetch User's Items
    const myListings = await Item.find({ sellerId: userId, status: "Active" }).sort({ createdAt: -1 });
    const mySales = await Item.find({ sellerId: userId, status: "Sold" })
        .populate("buyerId", "name email image")
        .sort({ updatedAt: -1 });

    // Fetch Offers Received
    const offersReceived = await Offer.find({ sellerId: userId })
        .populate("itemId", "title price images")
        .populate("buyerId", "name email image")
        .sort({ createdAt: -1 });

    // Fetch My Purchases
    const myPurchases = await Item.find({ buyerId: userId })
        .populate("sellerId", "name email image")
        .sort({ updatedAt: -1 });

    // Combine for Contributions History
    const contributions = [
        ...mySales.map(item => ({ ...item.toObject(), type: 'sale' })),
        ...myPurchases.map(item => ({ ...item.toObject(), type: 'purchase' }))
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return {
        user: JSON.parse(JSON.stringify(user)),
        myListings: JSON.parse(JSON.stringify(myListings)),
        mySales: JSON.parse(JSON.stringify(mySales)),
        myPurchases: JSON.parse(JSON.stringify(myPurchases)),
        offersReceived: JSON.parse(JSON.stringify(offersReceived)),
        contributions: JSON.parse(JSON.stringify(contributions))
    };
}

export default async function AccountPage({ searchParams }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    const data = await getAccountData(session.user.id);
    if (!data) return redirect("/auth/login");

    const { user, myListings, mySales, myPurchases, offersReceived, contributions } = data;

    // Default tab
    const { tab } = await searchParams || { tab: 'overview' };
    const currentTab = tab || 'overview';

    // Security check: Redirect unverified users trying to access seller tabs
    const sellerTabs = ['sales', 'offers', 'listings'];
    if (!user.isVerified && sellerTabs.includes(currentTab)) {
        redirect("/account?tab=overview");
    }

    let conversations = [];
    if (currentTab === 'messages') {
        conversations = await getConversations();
    }

    // Calculated Stats
    const itemsSold = mySales.length;
    const itemsListed = myListings.length;
    const pendingOffers = offersReceived.filter(o => o.status === "Pending").length;
    const totalEarnings = mySales.reduce((acc, item) => acc + (item.price || 0), 0);

    const displayName = user.name;
    const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <div className="min-h-screen bg-sky-50/50 flex flex-col lg:flex-row font-inter">
            {/* 1. SIDEBAR */}
            <aside className="w-full lg:w-64 bg-white border-r border-sky-100 flex flex-col sticky top-[72px] lg:h-[calc(100vh-72px)] z-40 overflow-y-auto no-scrollbar pt-8">

                <nav className="flex-1 px-4 py-4 space-y-8">
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</h3>
                        <div className="space-y-1">
                            <SidebarLink href="?tab=overview" active={currentTab === 'overview'} icon={<LayoutDashboard />} label="Dashboard" />
                            <SidebarLink href="?tab=settings" active={currentTab === 'settings'} icon={<Settings />} label="My Account" />
                            {user.isVerified && (
                                <SidebarLink href={`/profile/${user._id}`} icon={<UserIcon />} label="My public profile" />
                            )}
                            {user.isVerified && (
                                <>
                                    <SidebarLink href="?tab=sales" active={currentTab === 'sales'} icon={<TrendingUp />} label="Sales History" />
                                    <SidebarLink href="?tab=offers" active={currentTab === 'offers'} icon={<DollarSign />} label="Offers Received" count={pendingOffers} />
                                </>
                            )}
                            <SidebarLink href="?tab=purchases" active={currentTab === 'purchases'} icon={<ShoppingBag />} label="Purchases" />
                            <SidebarLink href="?tab=messages" active={currentTab === 'messages'} icon={<MessageCircle />} label="Messages" />
                        </div>
                    </div>

                    {user.isVerified && (
                        <div>
                            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Inventory</h3>
                            <div className="space-y-1">
                                <SidebarLink href="?tab=listings" active={currentTab === 'listings'} icon={<Package />} label="My Items" count={itemsListed} />
                                <Link href="/items/create" className="flex items-center px-4 py-3 text-sm font-bold text-sky-500 hover:bg-sky-50 rounded-2xl transition-all">
                                    <PlusCircle className="mr-3 w-5 h-5" /> Add New Item
                                </Link>
                            </div>
                        </div>
                    )}

                </nav>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar pt-[72px]">

                <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
                    {currentTab === 'overview' && (
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                        </div>
                    )}

                    {/* Content Router */}
                    {currentTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Welcome Banner */}
                            <div className="bg-[#1e2235] rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-sky-900/10">
                                <div className="relative z-10 max-w-lg text-center md:text-left">
                                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome to <span className="text-sky-400">ReGoods</span></h2>
                                    <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">Manage your sustainable storefront and track your community impact all in one place.</p>
                                    <Link href="/dashboard" className="inline-block px-10 py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-sky-900/40 active:scale-95">
                                        Marketplace
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Side: Charts & Tables */}
                                <div className="lg:col-span-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* User Summary */}
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-sky-50 shadow-sm relative group overflow-hidden">
                                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">{user.isVerified ? "My Public Profile" : "Identity Overview"}</h3>
                                            <div className="flex flex-col gap-6 relative z-10">
                                                <div className="flex items-center gap-5 px-1">
                                                    <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-2xl font-bold text-sky-500 border border-sky-100 overflow-hidden shadow-inner">
                                                        {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : displayName[0]}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Member Name</span>
                                                            <span className="text-sm font-bold text-gray-900">{displayName}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Since</span>
                                                            <span className="text-sm font-bold text-gray-900 uppercase">{joinDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-6 border-t border-sky-50 px-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">Shipping Address</span>
                                                    <span className="text-xs font-medium text-gray-600 leading-relaxed italic">7529 E Pecan St, Portland, IL, USA</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                        </div>

                                        {/* Stats Card - Only for Verified */}
                                        {user.isVerified ? (
                                            <div className="bg-white p-8 rounded-[2.5rem] border border-sky-50 shadow-sm">
                                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Store Stats</h3>
                                                <div className="space-y-4">
                                                    <PerformanceItem label="Trust Score" value="98%" trend="+2%" />
                                                    <PerformanceItem label="Response Time" value="< 2 Hours" trend="Optimal" />
                                                    <PerformanceItem label="Items Sold" value={itemsSold} trend="+5 this week" />

                                                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-sky-50 transition-colors group">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Current Level</span>
                                                            {itemsSold < 5 && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 w-fit mt-1">New Seller</span>}
                                                            {itemsSold >= 5 && itemsSold < 20 && <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 w-fit mt-1">Active Seller</span>}
                                                            {itemsSold >= 20 && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 w-fit mt-1">Pro Seller</span>}
                                                        </div>
                                                        <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-gray-100 text-gray-500">
                                                            STATUS
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white p-8 rounded-[2.5rem] border border-sky-50 shadow-sm flex flex-col items-center justify-center text-center">
                                                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-400 mb-4">
                                                    <ShieldCheck className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-2">Verified Status</h3>
                                                <p className="text-[11px] text-gray-400 font-medium px-4">Verify your account to unlock selling features and track your store performance.</p>
                                                <Link href="/account/verify" className="mt-6 text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] hover:underline">Verify Now</Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* History Table - Contribution (Sales Only) */}
                                    <div className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
                                        <div className="px-8 py-6 flex items-center justify-between border-b border-sky-50">
                                            <div className="flex flex-col">
                                                <h3 className="text-sm font-bold text-gray-900">Contribution History</h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Your complete sales and purchase record</p>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-sky-50/30">
                                                    <tr>
                                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Type</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Date</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Item Name</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Transaction</th>
                                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-sky-50">
                                                    {contributions.length > 0 ? contributions.slice(0, 10).map((item, idx) => (
                                                        <tr key={item._id} className="hover:bg-sky-50/20 transition-colors">
                                                            <td className="px-8 py-5">
                                                                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${item.type === 'sale' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                                    {item.type}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-5 text-xs font-medium text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                                                            <td className="px-4 py-5">
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-bold text-gray-800 truncate max-w-[200px]">{item.title}</span>
                                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">
                                                                        ID: {item._id.slice(-8).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-5">
                                                                <span className="text-xs font-medium text-gray-600">
                                                                    {item.type === 'sale' ? (
                                                                        <>Sold to <span className="font-bold">{item.buyerId?.name || 'User'}</span></>
                                                                    ) : (
                                                                        <>Bought from <span className="font-bold">{item.sellerId?.name || 'Seller'}</span></>
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5 text-right font-black">
                                                                <span className={`text-xs ${item.type === 'sale' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                                                    {item.type === 'sale' ? '+' : '-'}${item.price}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="5" className="py-16 text-center">
                                                                <div className="flex flex-col items-center gap-2 opacity-30">
                                                                    <Package className="w-8 h-8 mb-2" />
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero Activities Recorded</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Stats & Notifications */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-sky-50 shadow-sm relative group overflow-hidden">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Community Pulse</h3>
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Market is Active</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Trending: Electronics</p>
                                                </div>
                                            </div>
                                            {user.isVerified && (
                                                <p className="text-xs text-gray-500 leading-relaxed">Your store visibility has increased by <span className="text-green-500 font-bold">12%</span> in the last 24 hours.</p>
                                            )}
                                        </div>
                                    </div>

                                    {user.isVerified ? (
                                        <div className="bg-[#1e2235] p-8 rounded-[2.5rem] text-white shadow-xl shadow-sky-900/10">
                                            <h3 className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mb-4">Quick Tip</h3>
                                            <p className="text-sm font-medium leading-relaxed italic opacity-80">"Items with clear, well-lit photos sell 3x faster than average listings. Update your covers today!"</p>
                                        </div>
                                    ) : (
                                        <div className="bg-[#1e2235] p-8 rounded-[2.5rem] text-white shadow-xl shadow-sky-900/10">
                                            <h3 className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mb-4">How it works</h3>
                                            <p className="text-sm font-medium leading-relaxed italic opacity-80 mb-6">"Verified sellers can reach thousands of buyers instantly. Start your journey today."</p>
                                            <Link href="/account/verify" className="text-[10px] font-black text-sky-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                                                Verify My Account <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Management Tabs */}
                    {currentTab === 'listings' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Active Listings</h2>
                                <span className="text-[10px] font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">{itemsListed} Items Live</span>
                            </div>
                            {myListings.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {myListings.map(item => (
                                        <div key={item._id} className="bg-white rounded-[2.5rem] border border-sky-50 overflow-hidden hover:shadow-xl transition-all group p-4">
                                            <div className="relative aspect-[16/11] bg-sky-50 overflow-hidden rounded-[2rem]">
                                                {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />}
                                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm text-sky-600">
                                                    ${item.price}
                                                </div>
                                            </div>
                                            <div className="p-4 pt-6">
                                                <h3 className="font-bold text-gray-900 mb-4 group-hover:text-sky-500 transition-colors uppercase tracking-tight truncate">{item.title}</h3>
                                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                                    <span className="flex items-center italic">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    <span className="flex items-center bg-sky-50 text-sky-500 px-2 py-1 rounded-lg">12 Views</span>
                                                </div>
                                                <div className="pt-4 border-t border-sky-50">
                                                    <ItemActions item={item} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <EmptyDashboard label="Your storefront is empty" sublabel="List your unused quality goods and start your sustainability journey." action="/items/create" actionLabel="Create Listing" />}
                        </div>
                    )}

                    {currentTab === 'messages' && (
                        <div className="bg-white rounded-[2.5rem] border border-sky-50 shadow-sm overflow-hidden min-h-[600px] animate-in fade-in duration-500">
                            <div className="p-10 border-b border-sky-50 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
                                <span className="text-[10px] font-bold text-sky-500 bg-sky-50 px-4 py-1.5 rounded-full uppercase tracking-widest">Active Chats</span>
                            </div>
                            {conversations.length > 0 ? (
                                <div className="divide-y divide-sky-50 px-4">
                                    {conversations.map((conv) => (
                                        <Link key={conv.user.id} href={`/inbox/${conv.user.id}`} className="flex items-center p-8 hover:bg-sky-50/40 rounded-3xl transition-all group my-2">
                                            <div className="h-14 w-14 rounded-2xl bg-sky-100 mr-5 overflow-hidden border border-white flex-shrink-0 flex items-center justify-center text-sky-500 font-bold shadow-sm group-hover:shadow-md transition-all">
                                                {conv.user.image ? <img src={conv.user.image} className="w-full h-full object-cover" /> : conv.user.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-gray-900 text-lg tracking-tight truncate">{conv.user.name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(conv.lastMessage.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className={`text-sm truncate pr-12 ${!conv.lastMessage.read && !conv.lastMessage.isOwn ? 'font-bold text-sky-500' : 'text-gray-500'}`}>
                                                    {conv.lastMessage.content || "Media attached"}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            ) : <EmptyDashboard label="Inboxes are empty" sublabel="Connect with sellers and buyers to start negotiations." />}
                        </div>
                    )}

                    {currentTab === 'settings' && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-sky-50 shadow-sm animate-in fade-in duration-500">
                            <ProfileSettings user={user} />
                        </div>
                    )}

                    {currentTab === 'offers' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <h2 className="text-xl font-bold text-gray-900">Offer Center</h2>
                            <div className="bg-white rounded-[2.5rem] border border-sky-50 shadow-sm p-10">
                                <OfferList offers={offersReceived} />
                            </div>
                        </div>
                    )}

                    {currentTab === 'purchases' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <h2 className="text-xl font-bold text-gray-900">Purchase History</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {myPurchases.length > 0 ? myPurchases.map(item => (
                                    <PurchaseItemCard key={item._id} item={item} />
                                )) : <EmptyDashboard label="No purchases yet" sublabel="Everything you buy will show up in this collection." action="/dashboard" actionLabel="Start Shopping" />}
                            </div>
                        </div>
                    )}

                    {currentTab === 'sales' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <h2 className="text-xl font-bold text-gray-900">Completed Sales</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {mySales.length > 0 ? mySales.map(item => (
                                    <SoldItemCard key={item._id} item={item} />
                                )) : <EmptyDashboard label="No sales recorded" sublabel="Once you complete a transaction, it will appear here." action="/items/create" actionLabel="List Item" />}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Side Helper Components
function SidebarLink({ href, active, icon, label, count }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3.5 rounded-2xl transition-all group ${active
                ? 'bg-sky-500 text-white shadow-xl shadow-sky-200 translate-x-1'
                : 'text-gray-500 hover:bg-sky-50 hover:text-sky-600'
                }`}
        >
            <span className={`mr-4 ${active ? 'text-white' : 'text-gray-300 group-hover:text-sky-400 transition-colors'}`}>
                {React.cloneElement(icon, { className: "w-5 h-5 transition-transform group-hover:scale-110" })}
            </span>
            <span className="text-sm font-bold flex-1">{label}</span>
            {count > 0 && (
                <span className={`ml-2 text-[9px] font-black px-2 py-0.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                    {count}
                </span>
            )}
        </Link>
    );
}

function PerformanceItem({ label, value, trend, negative }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-sky-50 transition-colors group">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
                <span className="text-sm font-bold text-gray-900 tracking-tight">{value}</span>
            </div>
            <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${negative ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
                {trend}
            </span>
        </div>
    );
}


function EmptyDashboard({ label, sublabel, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-28 px-8 text-center bg-white rounded-[3rem] border border-sky-100 border-dashed">
            <div className="w-24 h-24 bg-sky-50 rounded-[2rem] flex items-center justify-center mb-8 text-sky-200 shadow-inner">
                <Package className="w-12 h-12" />
            </div>
            <h3 className="text-gray-900 font-bold text-2xl mb-3 tracking-tight">{label}</h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm mb-10 leading-relaxed">{sublabel}</p>
            {action && (
                <Link href={action} className="px-12 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-2xl shadow-sky-900/20 active:scale-95">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}

import { X } from "lucide-react";
