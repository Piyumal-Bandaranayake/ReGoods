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
    PlusCircle, ArrowRight, Wallet, Clock, ShieldCheck, Share2
} from "lucide-react";
import ProfileSettings from "@/components/account/ProfileSettings";
import ItemActions from "@/components/account/ItemActions";
import OfferList from "@/components/account/OfferList";
import { getConversations } from "@/app/actions/message";

async function getAccountData(userId) {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return null;

    // Fetch User's Items
    const myListings = await Item.find({ sellerId: userId, status: "Active" }).sort({ createdAt: -1 });
    const mySales = await Item.find({ sellerId: userId, status: "Sold" }).sort({ updatedAt: -1 });

    // Fetch Offers Received
    const offersReceived = await Offer.find({ sellerId: userId })
        .populate("itemId", "title price images")
        .populate("buyerId", "name email image")
        .sort({ createdAt: -1 });

    // Fetch My Purchases
    const myPurchases = await Item.find({ buyerId: userId })
        .populate("sellerId", "name email image")
        .sort({ updatedAt: -1 });

    return {
        user: JSON.parse(JSON.stringify(user)),
        myListings: JSON.parse(JSON.stringify(myListings)),
        mySales: JSON.parse(JSON.stringify(mySales)),
        myPurchases: JSON.parse(JSON.stringify(myPurchases)),
        offersReceived: JSON.parse(JSON.stringify(offersReceived))
    };
}

export default async function AccountPage({ searchParams }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    const data = await getAccountData(session.user.id);
    if (!data) return redirect("/auth/login");

    const { user, myListings, mySales, myPurchases, offersReceived } = data;

    // Default tab
    const { tab } = await searchParams || { tab: 'listings' };
    const currentTab = tab || 'listings';

    let conversations = [];
    if (currentTab === 'messages') {
        conversations = await getConversations();
    }

    // Calculated Stats
    const itemsSold = mySales.length;
    const itemsListed = myListings.length;
    const pendingOffers = offersReceived.filter(o => o.status === "Pending").length;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20">
            {/* 1. CINEMATIC HERO BANNER */}
            <div className="relative h-[250px] md:h-[350px] overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
                    alt="Workspace Banner" 
                    className="w-full h-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FAFAFA]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 2. OVERLAPPING HEADER CARD */}
                <div className="relative -mt-20 z-10 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8">
                        {/* Profile Section */}
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="relative">
                                <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-blue-50 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    {user.image ? (
                                        <img src={user.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-serif italic text-blue-300">{user.name[0].toUpperCase()}</span>
                                    )}
                                </div>
                                {user.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 p-1.5 rounded-xl border-4 border-white shadow-lg">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 font-medium mb-3">{user.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100 italic">
                                        Personal Dashboard
                                    </span>
                                    <Link href={`/profile/${user._id}`} className="px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center hover:bg-blue-500 transition-colors">
                                        View Public Profile <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action / Total Balance Style Stats */}
                        <div className="flex items-center justify-center md:justify-end gap-3 sm:gap-6 w-full md:w-auto">
                            <QuickStat label="Sales" value={itemsSold} icon={<TrendingUp className="w-4 h-4" />} />
                            <QuickStat label="Active" value={itemsListed} icon={<Package className="w-4 h-4" />} />
                            <QuickStat label="Bought" value={myPurchases.length} icon={<ShoppingBag className="w-4 h-4" />} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* 3. SIDEBAR NAVIGATION - Responsive (Horizontal on Mobile, Vertical on Desktop) */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="lg:sticky lg:top-28">
                            <h3 className="hidden lg:block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Management</h3>
                            
                            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2 no-scrollbar scroll-smooth">
                                <DashboardLink href="?tab=listings" active={currentTab === 'listings'} icon={<LayoutDashboard />} label="Inventory" count={itemsListed} />
                                <DashboardLink href="?tab=sales" active={currentTab === 'sales'} icon={<TrendingUp />} label="Sales" count={itemsSold} />
                                <DashboardLink href="?tab=purchases" active={currentTab === 'purchases'} icon={<ShoppingBag />} label="Orders" count={myPurchases.length} />
                                <DashboardLink href="?tab=offers" active={currentTab === 'offers'} icon={<DollarSign />} label="Offers" count={pendingOffers} />
                                <DashboardLink href="?tab=messages" active={currentTab === 'messages'} icon={<MessageCircle />} label="Messages" />
                                <DashboardLink href="?tab=settings" active={currentTab === 'settings'} icon={<Settings />} label="Settings" />
                            </div>
                            
                            {/* Create Listing Shortcut */}
                            <Link href="/items/create" className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-500/20 group">
                                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Add New Item
                            </Link>
                        </div>
                    </aside>

                    {/* 4. MAIN CONTENT AREA */}
                    <main className="flex-1 min-w-0">
                        {currentTab === 'listings' && (
                            <div className="space-y-8 animate-fade-in-up">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">My Inventory</h2>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{itemsListed} Items Live</span>
                                </div>

                                {myListings.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {myListings.map(item => (
                                            <div key={item._id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                                                <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                                                    {item.images?.[0] && (
                                                        <img 
                                                            src={item.images[0]} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                                        />
                                                    )}
                                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg text-blue-500">
                                                        ${item.price}
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="font-bold text-gray-900 text-lg truncate mb-3 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{item.title}</h3>
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center"><Eye className="w-3 h-3 mr-2" /> Views: 12</span>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-50">
                                                        <ItemActions item={item} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyDashboard label="Your inventory is empty" sublabel="Turn your unused goods into cash today." action="/items/create" actionLabel="Start Selling" />
                                )}
                            </div>
                        )}

                        {currentTab === 'messages' && (
                            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px] animate-fade-in-up">
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <h2 className="text-xl font-bold font-serif text-gray-900">Connections</h2>
                                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Active Chats</span>
                                </div>
                                {conversations.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {conversations.map((conv) => (
                                            <Link
                                                key={conv.user.id}
                                                href={`/inbox/${conv.user.id}`}
                                                className="flex items-center p-6 hover:bg-blue-50/30 transition-all group"
                                            >
                                                <div className="h-14 w-14 rounded-2xl bg-blue-50 mr-5 overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                                    {conv.user.image ? <img src={conv.user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-serif italic text-blue-300">{conv.user.name[0]}</div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-gray-950 text-lg truncate">{conv.user.name}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(conv.lastMessage.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className={`text-sm truncate pr-10 ${!conv.lastMessage.read && !conv.lastMessage.isOwn ? 'font-bold text-blue-500' : 'text-gray-500'}`}>
                                                        {conv.lastMessage.isOwn && <span className="text-gray-300 mr-1 italic">Sent: </span>}
                                                        {conv.lastMessage.content || "Image attachment"}
                                                    </p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                                                    <ArrowRight className="w-5 h-5 text-blue-500" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyDashboard label="No conversations yet" sublabel="Message sellers or buyers to start negotiating." />
                                )}
                            </div>
                        )}

                        {currentTab === 'settings' && (
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl animate-fade-in-up">
                                <ProfileSettings user={user} />
                            </div>
                        )}

                        {currentTab === 'offers' && (
                            <div className="space-y-8 animate-fade-in-up">
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Offer Inbox</h2>
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8">
                                    <OfferList offers={offersReceived} />
                                </div>
                            </div>
                        )}

                        {currentTab === 'purchases' && (
                            <div className="space-y-8 animate-fade-in-up">
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Order History</h2>
                                {myPurchases.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {myPurchases.map((item) => (
                                            <Link key={item._id} href={`/items/${item._id}`} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-2xl transition-all duration-300 group">
                                                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                                    {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                                        <span className="text-[10px] font-black bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">Verified Buy</span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(item.updatedAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-xl group-hover:text-blue-500 transition-colors uppercase tracking-tight">{item.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">Acquired from <span className="font-bold text-gray-900">{item.sellerId?.name || "Premium Seller"}</span></p>
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <div className="text-2xl font-serif font-bold text-gray-900 mb-2">${item.price}</div>
                                                    <div className="flex items-center justify-center md:justify-end gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Complete</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyDashboard label="No purchases yet" sublabel="Everything you buy will appear here." action="/dashboard" actionLabel="Explore Market" />
                                )}
                            </div>
                        )}

                        {currentTab === 'sales' && (
                            <div className="space-y-8 animate-fade-in-up">
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Successful Sales</h2>
                                {mySales.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {mySales.map((item) => (
                                            <div key={item._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-2xl transition-all duration-300 group">
                                                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-sm">
                                                    {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover grayscale opacity-50" />}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                                                        <span className="text-[8px] bg-black text-white px-2 py-1 rounded-lg font-black uppercase tracking-[0.2em] shadow-lg">SOLD</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center md:text-left min-w-0">
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                                        <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-green-100">Payout Sent</span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Closed {new Date(item.updatedAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-xl truncate uppercase tracking-tight">{item.title}</h3>
                                                    {item.deliveryDetails && (
                                                        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                            <MapPin className="w-3 h-3 text-blue-500" />
                                                            Shipped to {item.deliveryDetails.city}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <div className="text-2xl font-serif font-bold text-gray-900 mb-2">${item.price}</div>
                                                    <div className="flex items-center justify-center md:justify-end gap-2 text-green-600">
                                                        <Wallet className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Earnt</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyDashboard label="No sales yet" sublabel="Your store history will appear here once items sell." action="/items/create" actionLabel="Post First Item" />
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

function QuickStat({ label, value, icon }) {
    return (
        <div className="flex flex-col items-center justify-center p-2.5 sm:px-4 sm:py-3 bg-white/50 backdrop-blur rounded-2xl border border-white/50 shadow-sm min-w-[70px] sm:min-w-[80px]">
            <div className="text-base sm:text-xl font-bold text-gray-900 font-serif leading-none mb-1">
                {value}
            </div>
            <div className="flex items-center text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                <span className="mr-1 text-blue-500">{icon}</span>
                {label}
            </div>
        </div>
    );
}

function DashboardLink({ href, active, icon, label, count }) {
    return (
        <Link href={href} className={`flex items-center shrink-0 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-[1.25rem] transition-all duration-300 group ${active ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20 translate-x-0 lg:translate-x-1' : 'text-gray-500 hover:bg-white hover:text-blue-500 hover:shadow-lg bg-gray-50 lg:bg-transparent'}`}>
            <span className={`mr-3 md:mr-4 ${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-500 transition-colors'}`}>
                {icon && typeof icon === 'object' ? React.cloneElement(icon, { className: "w-4 h-4 md:w-5 md:h-5" }) : icon}
            </span>
            <span className="font-bold text-[11px] md:text-[13px] tracking-wide flex-1 whitespace-nowrap">{label}</span>
            {count !== undefined && (
                <span className={`ml-2 text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>{count}</span>
            )}
        </Link>
    );
}

function EmptyDashboard({ label, sublabel, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm border-dashed">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 rotate-6 group-hover:rotate-0 transition-transform">
                <Package className="w-10 h-10 text-blue-200" />
            </div>
            <h3 className="text-gray-900 font-bold font-serif text-2xl mb-2">{label}</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm mb-8 leading-relaxed">{sublabel}</p>
            {action && (
                <Link href={action} className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition shadow-2xl shadow-blue-500/10">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}

import React from "react";
