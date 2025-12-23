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
    MessageCircle, Award, TrendingUp, Clock, Package, Flag, Share2, ExternalLink
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

    // --- CALCULATED STATS ---
    const totalSold = soldItems.length;
    let sellerLevel = "New Seller";
    let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
    let badgeIcon = <Star className="w-3 h-3 mr-1" />;

    if (user.isVerified) {
        sellerLevel = "Verified Seller";
        badgeColor = "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100";
        badgeIcon = <CheckCircle className="w-3 h-3 mr-1" />;
    } else if (totalSold >= 50) {
        sellerLevel = "Pro Seller";
        badgeColor = "bg-black text-white border-black";
        badgeIcon = <Award className="w-3 h-3 mr-1" />;
    } else if (totalSold >= 10) {
        sellerLevel = "Trusted Seller";
        badgeColor = "bg-gray-800 text-white border-gray-800";
        badgeIcon = <Shield className="w-3 h-3 mr-1" />;
    }

    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20">
            {/* 1. HERO BANNER SECTION */}
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
                    alt="Store Banner" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
                <div className="absolute top-6 right-6 flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 2. PROFILE CARD OVERLAP */}
                <div className="relative -mt-32 md:-mt-48 z-10 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                    <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Column */}
                        <div className="relative shrink-0 mx-auto md:mx-0">
                            <div className="h-32 w-32 md:h-48 md:w-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-serif italic text-gray-300">{user.name[0].toUpperCase()}</span>
                                )}
                            </div>
                            {user.isVerified && (
                                <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6 bg-blue-600 p-2 rounded-full border-4 border-white shadow-lg" title="Verified Seller">
                                    <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info Column */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">{user.name}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${badgeColor} uppercase tracking-wider`}>
                                        {badgeIcon} {sellerLevel}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold border border-gray-200 uppercase tracking-wider">
                                        Joined {joinedDate}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm md:text-base max-w-2xl mb-6 font-medium leading-relaxed">
                                {user.bio || "No bio added yet. This seller is dedicated to providing quality goods and sustainable fashion to the community."}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                    {user.nationality || "Global Citizen"}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                    Usually responds within 2 hours
                                </div>
                            </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                            {session?.user?.id === user._id ? (
                                <>
                                    <Link href="/account" className="w-full px-8 py-4 bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-600 transition shadow-xl shadow-blue-500/20 text-center">
                                        Edit Profile Settings
                                    </Link>
                                    <VerifyAccountButton currentStatus={user.verificationStatus || "Unverified"} />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={`/inbox/${user._id}`}
                                        className="w-full px-8 py-4 bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-600 transition shadow-xl shadow-blue-500/20 text-center flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" /> Message Seller
                                    </Link>
                                    <ReportUserButton userId={user._id} userName={user.name} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Footer of Profile Card */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 bg-gray-50/50">
                        <ProfileStat label="Items Sold" value={totalSold} icon={<TrendingUp className="w-4 h-4" />} />
                        <ProfileStat label="Active Items" value={activeItems.length} icon={<Package className="w-4 h-4" />} />
                        <ProfileStat label="Rating" value={`${ratingData.average}/5`} icon={<Star className="w-4 h-4" />} />
                        <ProfileStat label="Member Type" value={user.role === 'admin' ? 'Admin' : 'Premium'} icon={<Award className="w-4 h-4" />} />
                    </div>
                </div>

                <div className="mt-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* 3. MAIN CONTENT AREA */}
                        <div className="flex-1 min-w-0">
                            {/* Tab Navigation */}
                            <div className="flex justify-center mb-10 overflow-x-auto">
                                <nav className="inline-flex bg-gray-100 p-1.5 rounded-2xl">
                                    <Link
                                        href={`?tab=active`}
                                        className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${currentTab === 'active' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        Active ({activeItems.length})
                                    </Link>
                                    <Link
                                        href={`?tab=sold`}
                                        className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${currentTab === 'sold' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        Sold ({soldItems.length})
                                    </Link>
                                    <Link
                                        href={`?tab=reviews`}
                                        className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${currentTab === 'reviews' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        Reviews ({ratingData.count})
                                    </Link>
                                </nav>
                            </div>

                            {/* TAB CONTENT */}
                            {currentTab === 'active' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {activeItems.length > 0 ? activeItems.map(item => (
                                        <ItemCard key={item._id} item={item} />
                                    )) : (
                                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm uppercase tracking-wide">
                                            No active listings found.
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentTab === 'sold' && (
                                <div className="space-y-4">
                                    {soldItems.length > 0 ? soldItems.map(item => (
                                        <div key={item._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:justify-between hover:shadow-lg transition-all group animate-fade-in-up">
                                            <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                                                <div className="h-20 w-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                                    {item.images?.[0] ? (
                                                        <img src={item.images[0]} className="w-full h-full object-cover grayscale opacity-75" />
                                                    ) : <Package className="w-8 h-8 text-gray-300 m-auto mt-6" />}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">SOLD</span>
                                                    </div>
                                                </div>
                                                <div className="ml-6 flex-1">
                                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-500 transition-colors">{item.title}</h3>
                                                    <p className="text-xs text-gray-500 uppercase font-bold mt-1 tracking-wider">Transaction completed on {new Date(item.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-12 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <div className="text-xl font-serif font-bold text-gray-900">${item.price}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sale Price</div>
                                                </div>
                                                <div className="hidden sm:flex flex-col items-center gap-1">
                                                    <div className="flex items-center text-yellow-500">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Sale</div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                            No transaction history found.
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentTab === 'reviews' && (
                                <ReviewSection 
                                    sellerId={id} 
                                    reviews={reviews} 
                                    currentUserId={session?.user?.id} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileStat({ label, value, icon }) {
    return (
        <div className="px-6 py-4 md:py-8 flex flex-col items-center justify-center text-center group hover:bg-white transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition duration-300">
                <span className="text-blue-500">{icon}</span>
            </div>
            <div className="text-lg md:text-2xl font-serif font-bold text-gray-900">{value}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{label}</div>
        </div>
    );
}
