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
    MessageCircle, Award, TrendingUp, Clock, Package, Flag, Share2, ExternalLink, Link2, MoreHorizontal
} from "lucide-react";
import ReportUserButton from "@/components/account/ReportUserButton";
import VerifyAccountButton from "@/components/account/VerifyAccountButton";
import { getSellerReviews, getSellerRating } from "@/app/actions/review";
import ReviewSection from "@/components/account/ReviewSection";
import ItemCard from "@/components/items/ItemCard";

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
    const currentTab = tab || 'active';

    const data = await getProfileData(id);
    if (!data) return notFound();

    const { user, activeItems, soldItems } = data;
    const session = await getServerSession(authOptions);

    const [reviews, ratingData] = await Promise.all([
        getSellerReviews(id),
        getSellerRating(id)
    ]);

    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const displayName = user.name;
    const username = user.username || user.name.toLowerCase().replace(/\s/g, '');

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 font-inter">
            {/* 1. HERO BANNER */}
            <div className="relative h-48 md:h-80 w-full overflow-hidden bg-sky-100">
                <img 
                    src={user.bannerImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"} 
                    alt="Store Banner" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 relative">
                    
                    {/* 2. LEFT SIDEBAR: PROFILE CARD */}
                    <div className="lg:col-span-3 -mt-16 md:-mt-24 z-20">
                        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-sky-900/5 border border-white relative">
                            {/* Avatar */}
                            <div className="relative mb-6">
                                <div className="h-32 w-32 md:h-40 md:w-40 mx-auto rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-sky-50 flex items-center justify-center">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold text-sky-400">{displayName[0]}</span>
                                    )}
                                </div>
                                {user.isVerified && (
                                    <div className="absolute bottom-2 right-1/2 translate-x-14 md:translate-x-16 bg-white p-1 rounded-full shadow-md border border-gray-50">
                                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-[#1DA1F2] fill-current" />
                                    </div>
                                )}
                            </div>

                            {/* Name & Title */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                                    {displayName}
                                    {user.isVerified && <CheckCircle className="w-5 h-5 text-[#1DA1F2] fill-current md:hidden" />}
                                </h1>
                                <p className="text-[#657786] text-sm font-medium">@{username}</p>
                            </div>

                            {/* Bio */}
                            <div className="mb-8">
                                <p className="text-gray-600 text-[15px] leading-relaxed text-center lg:text-left font-medium">
                                    {user.bio || "Passionate about sustainable fashion and high-quality pre-owned items. Check out my collection below!"}
                                </p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 mb-8">
                                <ProfileDetailItem icon={<MapPin className="w-5 h-5" />} text={user.nationality || "International"} />
                                <ProfileDetailItem icon={<Link2 className="w-5 h-5" />} text={<span className="text-sky-500 hover:underline cursor-pointer truncate block">regoods.com/{username}</span>} />
                                <ProfileDetailItem icon={<Calendar className="w-5 h-5" />} text={`Joined ${joinedDate}`} />
                                <ProfileDetailItem icon={<Package className="w-5 h-5" />} text={`${activeItems.length} Active Listings`} />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {session?.user?.id === user._id ? (
                                    <>
                                        <Link href="/account" className="flex items-center justify-center w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-sky-200/50">
                                            Edit Profile
                                        </Link>
                                        <VerifyAccountButton currentStatus={user.verificationStatus || "Unverified"} />
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={`/inbox/${user._id}`}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-sky-200/50"
                                        >
                                            <MessageCircle className="w-5 h-5" /> Message
                                        </Link>
                                        <ReportUserButton userId={user._id} userName={user.name} />
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 3. CENTER COLUMN: TABS & CONTENT */}
                    <div className="lg:col-span-6 mt-8 lg:mt-6">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-8 sticky top-0 bg-slate-50/50 backdrop-blur-md z-30 px-2 overflow-x-auto no-scrollbar">
                            <TabTrigger id="active" label="Storefront" active={currentTab === 'active'} count={activeItems.length} />
                            <TabTrigger id="sold" label="Sold Out" active={currentTab === 'sold'} count={soldItems.length} />
                            <TabTrigger id="reviews" label="Reviews" active={currentTab === 'reviews'} count={ratingData.count} />
                        </div>

                        {/* Content Area */}
                        <div className="space-y-8 min-h-[600px]">
                            {currentTab === 'active' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                                    {activeItems.length > 0 ? activeItems.map(item => (
                                        <ItemCard key={item._id} item={item} />
                                    )) : (
                                        <EmptyState icon={<Package className="w-16 h-16" />} message="No active items available right now." />
                                    )}
                                </div>
                            )}

                            {currentTab === 'sold' && (
                                <div className="space-y-4 pb-20">
                                    {soldItems.length > 0 ? soldItems.map(item => (
                                        <SoldItemCard key={item._id} item={item} />
                                    )) : (
                                        <EmptyState icon={<TrendingUp className="w-16 h-16" />} message="No items sold yet." />
                                    )}
                                </div>
                            )}

                            {currentTab === 'reviews' && (
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-white mb-20">
                                    <ReviewSection 
                                        sellerId={id} 
                                        reviews={reviews} 
                                        currentUserId={session?.user?.id} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. RIGHT SIDEBAR: STATS & PROMO */}
                    <div className="hidden lg:block lg:col-span-3 mt-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Stats Card */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-white">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter tracking-tight">Seller Performance</h3>
                                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                    <MiniStat value={ratingData.average} label="Avg Rating" icon={<Star className="w-4 h-4 text-yellow-500 fill-current" />} />
                                    <MiniStat value={`${activeItems.length + soldItems.length}`} label="Total Items" icon={<Package className="w-4 h-4 text-sky-500" />} />
                                    <MiniStat value="2h" label="Response" icon={<Clock className="w-4 h-4 text-green-500" />} />
                                    <MiniStat value="PRO" label="Level" icon={<Award className="w-4 h-4 text-purple-500" />} />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Helper Components
function ProfileDetailItem({ icon, text }) {
    return (
        <div className="flex items-center text-[#657786] text-[15px] font-medium">
            <div className="w-8 shrink-0 text-[#AAB8C2]">{icon}</div>
            <div className="truncate flex-1">{text}</div>
        </div>
    );
}

function TabTrigger({ id, label, active, count }) {
    return (
        <Link
            href={`?tab=${id}`}
            className={`relative flex-1 text-center py-4 text-sm font-bold transition-all px-4 whitespace-nowrap ${
                active ? 'text-sky-500' : 'text-[#657786] hover:bg-sky-50'
            }`}
        >
            {label} 
            {count > 0 && <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-[10px] text-gray-500">{count}</span>}
            {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-full mx-auto w-1/2"></div>}
        </Link>
    );
}

function MiniStat({ value, label, icon }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-lg">
                <span className="shrink-0">{icon}</span>
                {value}
            </div>
            <div className="text-[11px] font-bold text-[#657786] uppercase tracking-wider">{label}</div>
        </div>
    );
}

function SoldItemCard({ item }) {
    return (
        <div className="bg-white rounded-3xl p-5 border border-white shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {item.images?.[0] ? (
                        <img src={item.images[0]} className="w-full h-full object-cover grayscale opacity-60" />
                    ) : (
                        <Package className="w-8 h-8 text-gray-300 m-auto mt-6" />
                    )}
                    <div className="absolute inset-0 bg-sky-900/10"></div>
                    <div className="absolute top-1 right-1">
                        <span className="text-[8px] font-black text-white bg-gray-800 px-1.5 py-0.5 rounded-full uppercase">SOLD</span>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-sky-500 transition-colors">{item.title}</h4>
                    <p className="text-xs text-[#657786] font-medium mt-1">Completed on {new Date(item.updatedAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-bold text-gray-900">${item.price}</div>
                <div className="text-[10px] font-bold text-[#657786] uppercase tracking-widest mt-1">Sold Price</div>
            </div>
        </div>
    );
}

function EmptyState({ icon, message }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-200 mb-6">
                {icon}
            </div>
            <p className="text-gray-400 font-medium">{message}</p>
        </div>
    );
}
