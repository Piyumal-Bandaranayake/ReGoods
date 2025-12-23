import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Calendar, Star, CheckCircle, Shield,
    MessageCircle, Award, TrendingUp, Clock, Package, Flag
} from "lucide-react";
import ReportUserButton from "@/components/account/ReportUserButton";

async function getProfileData(userId) {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return null;

    // Fetch Items
    const activeItems = await Item.find({ sellerId: userId, status: "Active" }).sort({ createdAt: -1 });
    const soldItems = await Item.find({ sellerId: userId, status: "Sold" }).sort({ updatedAt: -1 });

    return {
        user: JSON.parse(JSON.stringify(user)),
        activeItems: JSON.parse(JSON.stringify(activeItems)),
        soldItems: JSON.parse(JSON.stringify(soldItems))
    };
}

export default async function ProfilePage({ params, searchParams }) {
    const { id } = await params;
    const { tab } = await searchParams || { tab: 'active' };
    // Default tab is 'active' listings
    const currentTab = tab || 'active';

    const data = await getProfileData(id);
    if (!data) return notFound();

    const { user, activeItems, soldItems } = data;
    const session = await getServerSession(authOptions);

    // --- CALCULATED STATS ---
    const totalSold = soldItems.length;
    let sellerLevel = "New Seller";
    let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
    let badgeIcon = <Star className="w-3 h-3 mr-1" />;

    if (totalSold >= 50) {
        sellerLevel = "Pro Seller";
        badgeColor = "bg-black text-white border-black";
        badgeIcon = <Award className="w-3 h-3 mr-1" />;
    } else if (totalSold >= 10) {
        sellerLevel = "Trusted Seller";
        badgeColor = "bg-gray-800 text-white border-gray-800";
        badgeIcon = <Shield className="w-3 h-3 mr-1" />;
    }

    // Actual Data Only
    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Achievements Calculation
    const achievements = [];
    if (totalSold >= 1) achievements.push({ label: "First Sale", icon: <TrendingUp className="w-5 h-5 mr-2" /> });
    if (totalSold >= 10) achievements.push({ label: "10+ Sales", icon: <Award className="w-5 h-5 mr-2" /> });
    if (totalSold >= 50) achievements.push({ label: "Pro Seller", icon: <Star className="w-5 h-5 mr-2" /> });

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. HEADER PROFILE CARD */}
                <div className="bg-white border-b border-gray-200 mb-6">
                    {/* Cover Photo Area */}
                    <div className="h-48 bg-gradient-to-r from-gray-900 via-black to-gray-800"></div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center bg-gray-100 text-4xl font-serif italic text-black">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Online now"></div>
                            </div>

                            {/* Name & Badge */}
                            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <h1 className="text-3xl font-serif font-bold text-gray-900 mr-3">{user.name}</h1>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeColor} mt-2 md:mt-0 uppercase tracking-wider`}>
                                        {badgeIcon} {sellerLevel}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 space-x-6 uppercase tracking-wide font-medium">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>Joined {joinedDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>New York, NY</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 md:mt-0 flex space-x-3">
                                {session?.user?.id === user._id ? (
                                    <Link href="/account" className="px-6 py-3 border border-gray-300 text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition">
                                        Edit Profile
                                    </Link>
                                ) : (
                                    <div className="flex space-x-3">
                                        <Link
                                            href={`/inbox/${user._id}`}
                                            className="px-6 py-3 border border-gray-300 text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition"
                                        >
                                            Message
                                        </Link>
                                        <ReportUserButton userId={user._id} userName={user.name} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seller Reputation Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-gray-100">
                            <div className="p-4 bg-gray-50 text-center border border-gray-100">
                                <div className="text-3xl font-serif font-bold text-gray-900">{totalSold}</div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Total Sold</div>
                            </div>
                            <div className="p-4 bg-gray-50 text-center border border-gray-100">
                                <div className="text-3xl font-serif font-bold text-gray-900">{activeItems.length}</div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Active Listings</div>
                            </div>
                            <div className="p-4 bg-gray-50 text-center border border-gray-100">
                                <div className="text-3xl font-serif font-bold text-gray-900">4.9</div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Rating</div>
                            </div>
                            <div className="p-4 bg-gray-50 text-center border border-gray-100 flex flex-col justify-center items-center">
                                <div className="font-bold text-gray-900 text-sm uppercase">Verified Member</div>
                                <div className="text-xs text-gray-400 mt-1">Since {new Date(user.createdAt).getFullYear()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN CONTENT TABS */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    <div className="lg:col-span-4">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 mb-8 overflow-x-auto">
                            <nav className="-mb-px flex space-x-12">
                                <Link
                                    href={`?tab=active`}
                                    className={`whitespace-nowrap pb-4 border-b-2 font-bold text-xs uppercase tracking-widest flex items-center ${currentTab === 'active' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200'}`}
                                >
                                    Active Listings ({activeItems.length})
                                </Link>
                                <Link
                                    href={`?tab=sold`}
                                    className={`whitespace-nowrap pb-4 border-b-2 font-bold text-xs uppercase tracking-widest flex items-center ${currentTab === 'sold' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200'}`}
                                >
                                    History ({soldItems.length})
                                </Link>
                                <Link
                                    href={`?tab=reviews`}
                                    className={`whitespace-nowrap pb-4 border-b-2 font-bold text-xs uppercase tracking-widest flex items-center ${currentTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200'}`}
                                >
                                    Reviews
                                </Link>
                                <Link
                                    href={`?tab=about`}
                                    className={`whitespace-nowrap pb-4 border-b-2 font-bold text-xs uppercase tracking-widest flex items-center ${currentTab === 'about' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200'}`}
                                >
                                    About Seller
                                </Link>
                            </nav>
                        </div>

                        {/* TAB CONTENT */}

                        {/* 1. ACTIVE LISTINGS */}
                        {currentTab === 'active' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {activeItems.length > 0 ? activeItems.map(item => (
                                    <ItemCard key={item._id} item={item} />
                                )) : (
                                    <div className="col-span-full text-center py-20 bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-sm uppercase tracking-wide">
                                        No active listings found.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. SOLD ITEMS / HISTORY (Novelty Feature) */}
                        {currentTab === 'sold' && (
                            <div className="space-y-4">
                                {soldItems.length > 0 ? soldItems.map(item => (
                                    <div key={item._id} className="bg-white p-4 border border-gray-200 flex flex-col md:flex-row items-center md:justify-between hover:border-black transition group">
                                        <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                                            <div className="h-16 w-16 bg-gray-100 flex-shrink-0 relative">
                                                {item.images?.[0] ? (
                                                    <img src={item.images[0]} className="w-full h-full object-cover grayscale opacity-75" />
                                                ) : <Package className="w-8 h-8 text-gray-300 m-auto mt-4" />}
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-white bg-black px-1 uppercase">SOLD</span>
                                                </div>
                                            </div>
                                            <div className="ml-6">
                                                <h3 className="font-bold text-gray-900 text-base md:text-lg group-hover:underline">{item.title}</h3>
                                                <p className="text-xs text-gray-500 uppercase mt-1">Sold on {new Date(item.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-12 w-full md:w-auto justify-between md:justify-end text-sm">
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900 border-b border-black inline-block">${item.price}</div>
                                                <div className="text-[10px] text-gray-400 uppercase mt-1">Final Price</div>
                                            </div>
                                            <div className="text-center px-4">
                                                <div className="flex items-center justify-center text-black">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <Star className="w-3 h-3 fill-current" />
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-1 uppercase">Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-20 bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-sm uppercase tracking-wide">
                                        No items sold yet.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. REVIEWS */}
                        {currentTab === 'reviews' && (
                            <div className="bg-white border border-gray-200 p-12 text-center text-gray-400 uppercase tracking-wide text-xs">
                                No reviews yet.
                            </div>
                        )}

                        {/* 4. ABOUT SELLER */}
                        {currentTab === 'about' && (
                            <div className="bg-white border border-gray-200 p-8">
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">About {user.name}</h3>
                                <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
                                    {user.bio || "This seller hasn't written a biography yet."}
                                </p>

                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Achievements</h4>
                                <div className="flex flex-wrap gap-4">
                                    {achievements.length > 0 ? achievements.map((ach, i) => (
                                        <div key={i} className="flex items-center px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 text-xs font-bold uppercase tracking-wider">
                                            {ach.icon} {ach.label}
                                        </div>
                                    )) : (
                                        <p className="text-gray-400 italic text-sm">No achievements yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon Helper
function UserIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

function ItemCard({ item }) {
    return (
        <Link href={`/items/${item._id}`} className="group block bg-white border border-gray-200 hover:border-black transition">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                {item.images?.[0] ? (
                    <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <Package className="w-8 h-8 opacity-50" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-serif font-bold text-gray-900 truncate text-lg">{item.title}</h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-gray-900">${item.price}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">View</span>
                </div>
            </div>
        </Link>
    )
}
