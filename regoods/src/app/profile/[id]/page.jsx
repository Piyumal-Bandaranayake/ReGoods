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
import SoldItemCard from "@/components/profile/SoldItemCard";

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

    const isOwner = session?.user?.id === user._id;

    if (!user.isVerified) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-inter">
                <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Public</h1>
                    <p className="text-gray-600 mb-8 font-medium">
                        This seller profile is only available for verified members.
                    </p>
                    <Link href="/" className="inline-flex items-center justify-center w-full py-3.5 bg-blue-900 hover:bg-black text-white rounded-2xl font-bold transition-all">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const [reviews, ratingData] = await Promise.all([
        getSellerReviews(id),
        getSellerRating(id)
    ]);

    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const displayName = user.name;
    const username = user.username || user.name.toLowerCase().replace(/\s/g, '');

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 font-inter">
            {/* 1. TOP SPACING */}
            <div className="h-32 w-full bg-[#1DA1F2]/5 border-b border-[#1DA1F2]/10 mb-8"></div>


            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 relative">

                    {/* 2. LEFT SIDEBAR: PROFILE CARD */}
                    <div className="lg:col-span-3 -mt-20 z-20">
                        <div className="bg-white rounded-[2rem] p-5 shadow-xl shadow-sky-900/5 border border-white relative">
                            {/* Avatar */}
                            <div className="relative mb-4">
                                <div className="h-28 w-28 md:h-32 md:w-32 mx-auto rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-sky-50 flex items-center justify-center">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-sky-400">{displayName[0]}</span>
                                    )}
                                </div>
                                {user.isVerified && (
                                    <div className="absolute bottom-1 right-1/2 translate-x-10 md:translate-x-12 bg-white p-1 rounded-full shadow-md border border-gray-50">
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#1DA1F2] fill-current" />
                                    </div>
                                )}
                            </div>

                            {/* Name & Title */}
                            <div className="text-center mb-4">
                                <h1 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                                    {displayName}
                                    {user.isVerified && <CheckCircle className="w-4 h-4 text-[#1DA1F2] fill-current md:hidden" />}
                                </h1>
                                <p className="text-[#657786] text-xs font-medium mb-2">@{username}</p>
                                {user.isVerified && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified Seller
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="mb-5">
                                <p className="text-gray-600 text-sm leading-relaxed text-center lg:text-left font-medium">
                                    {user.bio || "Passionate about sustainable fashion and high-quality pre-owned items. Check out my collection below!"}
                                </p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-2.5 mb-6">
                                <ProfileDetailItem icon={<MapPin className="w-4 h-4" />} text={user.nationality || "International"} />
                                <ProfileDetailItem icon={<Link2 className="w-4 h-4" />} text={<span className="text-sky-500 hover:underline cursor-pointer truncate block">regoods.com/{username}</span>} />
                                <ProfileDetailItem icon={<Calendar className="w-4 h-4" />} text={`Joined ${joinedDate}`} />
                                <ProfileDetailItem icon={<Package className="w-4 h-4" />} text={`${activeItems.length} Active Listings`} />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                {session?.user?.id === user._id ? (
                                    <>
                                        <Link href="/account?tab=settings" className="flex items-center justify-center w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-sky-200/50">
                                            Edit Profile
                                        </Link>
                                        <VerifyAccountButton currentStatus={user.verificationStatus || "Unverified"} />
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={`/inbox/${user._id}`}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-sky-200/50"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Message
                                        </Link>
                                        <ReportUserButton userId={user._id} userName={user.name} />
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 3. CENTER COLUMN: TABS & CONTENT */}
                    <div className="lg:col-span-6 mt-8 lg:mt-6">
                        {isOwner && (
                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">My Public Profile</h1>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">This is how other users see your store</p>
                            </div>
                        )}
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-8 sticky top-0 bg-slate-50/50 backdrop-blur-md z-30 px-2 overflow-x-auto no-scrollbar">
                            <TabTrigger id="active" label="Storefront" active={currentTab === 'active'} count={activeItems.length} />
                            <TabTrigger id="sold" label="Sold Out" active={currentTab === 'sold'} count={soldItems.length} />
                            <TabTrigger id="reviews" label="Reviews" active={currentTab === 'reviews'} count={ratingData.count} />
                        </div>

                        {/* Content Area */}
                        <div className="space-y-8 min-h-[600px]">
                            {currentTab === 'active' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
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
                                        <SoldItemCard key={item._id} item={item} disableModal={true} />
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
                    {user.isVerified && (
                        <div className="hidden lg:block lg:col-span-3 mt-6">
                            <div className="sticky top-24 space-y-6">
                                {/* Stats Card */}
                                <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-white">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 font-inter tracking-tight uppercase">Seller Performance</h3>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                        <MiniStat value={ratingData.average} label="Avg Rating" icon={<Star className="w-4 h-4 text-yellow-500 fill-current" />} />
                                        <MiniStat value={`${activeItems.length + soldItems.length}`} label="Total Items" icon={<Package className="w-4 h-4 text-sky-500" />} />
                                        <MiniStat value="2h" label="Response" icon={<Clock className="w-4 h-4 text-green-500" />} />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${soldItems.length < 5 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                soldItems.length < 20 ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {soldItems.length < 5 ? "New Seller" : soldItems.length < 20 ? "Active Seller" : "Pro Seller"}
                                            </div>
                                            <div className="text-[11px] font-bold text-[#657786] uppercase tracking-wider pl-1">Level</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

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
            className={`relative flex-1 text-center py-4 text-sm font-bold transition-all px-4 whitespace-nowrap ${active ? 'text-sky-500' : 'text-[#657786] hover:bg-sky-50'
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
