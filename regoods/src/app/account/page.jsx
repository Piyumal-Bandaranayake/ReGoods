import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, Package, ShoppingBag, MessageCircle,
    FileText, Star, Settings, DollarSign, Eye, Heart,
    Inbox, PlusCircle, TrendingUp, MapPin
} from "lucide-react";
import ProfileSettings from "@/components/account/ProfileSettings";
import ItemActions from "@/components/account/ItemActions";
import { getConversations } from "@/app/actions/message";

async function getAccountData(userId) {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return null;

    // Fetch User's Items
    const myListings = await Item.find({ sellerId: userId, status: "Active" }).sort({ createdAt: -1 });
    const mySales = await Item.find({ sellerId: userId, status: "Sold" }).sort({ updatedAt: -1 });

    return {
        user: JSON.parse(JSON.stringify(user)),
        myListings: JSON.parse(JSON.stringify(myListings)),
        mySales: JSON.parse(JSON.stringify(mySales))
    };
}

export default async function AccountPage({ searchParams }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    const data = await getAccountData(session.user.id);
    const { user, myListings, mySales } = data;

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
    // Offers/Reviews models do not exist yet
    const offersReceived = 0;
    const offersAccepted = 0;
    const reviewScore = 0; // Or null to hide

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20">
            {/* Header / Cover */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-full mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6">
                        {/* Profile Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-5">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                    {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300 font-serif font-bold">{user.name[0]}</div>}
                                </div>
                                <span className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${itemsSold >= 10 ? 'bg-blue-950' : 'bg-green-500'}`} title="Verified Seller"></span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-serif font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 font-medium mb-2 text-sm">{user.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{itemsSold >= 10 ? 'Trusted Seller' : 'Member'}</span>
                                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center"><MapPin className="w-3 h-3 mr-1" /> {user.nationality || "Global"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-2 sm:gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            <StatBox label="Sold" value={itemsSold} />
                            <div className="w-px h-6 bg-gray-200"></div>
                            <StatBox label="Active" value={itemsListed} />
                            <div className="w-px h-6 bg-gray-200"></div>
                            <StatBox label="Rating" value={reviewScore || "N/A"} icon={<Star className="w-3 h-3 text-yellow-500 fill-current ml-1" />} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-full mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Nav */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-1">
                            <TabLink href="?tab=listings" active={currentTab === 'listings'} icon={<LayoutDashboard className="w-4 h-4" />} label="My Listings" count={itemsListed} />
                            <TabLink href="?tab=sales" active={currentTab === 'sales'} icon={<TrendingUp className="w-4 h-4" />} label="My Sales" count={itemsSold} />
                            <TabLink href="?tab=purchases" active={currentTab === 'purchases'} icon={<ShoppingBag className="w-4 h-4" />} label="Purchases" />
                            <TabLink href="?tab=offers" active={currentTab === 'offers'} icon={<DollarSign className="w-4 h-4" />} label="Offers" />
                            <TabLink href="?tab=messages" active={currentTab === 'messages'} icon={<MessageCircle className="w-4 h-4" />} label="Messages" />
                            <div className="h-px bg-gray-200 my-4 mx-4"></div>
                            <TabLink href="?tab=settings" active={currentTab === 'settings'} icon={<Settings className="w-4 h-4" />} label="Settings" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {currentTab === 'listings' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-gray-900">Active Listings</h2>
                                        <p className="text-gray-500 text-sm mt-1">Manage your items currently for sale</p>
                                    </div>

                                </div>
                                {myListings.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {myListings.map(item => (
                                            <div key={item._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                                                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                                    {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
                                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                                        ${item.price}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 truncate mb-1">{item.title}</h3>
                                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> 0</span>
                                                    </div>
                                                    <div className="pt-3 border-t border-gray-50">
                                                        <ItemActions item={item} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState label="You haven't listed anything yet." action="/items/create" actionLabel="Start Selling" />
                                )}
                            </div>
                        )}

                        {/* Messages (Styled) */}
                        {currentTab === 'messages' && (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm min-h-[500px]">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold font-serif">Messages</h2>
                                </div>
                                {conversations.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {conversations.map((conv) => (
                                            <Link
                                                key={conv.user.id}
                                                href={`/inbox/${conv.user.id}`}
                                                className="flex items-center p-4 hover:bg-gray-50 transition group"
                                            >
                                                <div className="h-12 w-12 rounded-full bg-gray-100 mr-4 overflow-hidden border border-gray-100">
                                                    {conv.user.image ? <img src={conv.user.image} className="w-full h-full object-cover" /> : null}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <span className="font-bold text-gray-900 group-hover:text-black">{conv.user.name}</span>
                                                        <span className="text-xs text-gray-400">{new Date(conv.lastMessage.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className={`text-sm mt-1 truncate ${!conv.lastMessage.read && !conv.lastMessage.isOwn ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                                        {conv.lastMessage.isOwn && <span className="text-gray-400">You: </span>}
                                                        {conv.lastMessage.content || "Sent an attachment"}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState label="No messages found." />
                                )}
                            </div>
                        )}

                        {currentTab === 'settings' && <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"><ProfileSettings user={user} /></div>}

                        {/* Placeholders for Sales/Purchases/Offers (Styled Basic) */}
                        {['sales', 'purchases', 'offers'].includes(currentTab) && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                                <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                                    {currentTab === 'sales' && <TrendingUp className="w-6 h-6 text-gray-400" />}
                                    {currentTab === 'purchases' && <ShoppingBag className="w-6 h-6 text-gray-400" />}
                                    {currentTab === 'offers' && <DollarSign className="w-6 h-6 text-gray-400" />}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 capitalize mb-2">{currentTab}</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">This section is being updated with the new design system. Check back soon for your {currentTab} history.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon }) {
    return (
        <div className="px-4 py-2 text-center min-w-[80px]">
            <div className="text-xl font-bold text-gray-900 flex items-center justify-center font-serif leading-none mb-1">
                {value} {icon}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function TabLink({ href, active, icon, label, count }) {
    return (
        <Link href={href} className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-950 text-white shadow-md shadow-blue-200' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}>
            <span className={`mr-3 ${active ? 'text-white' : 'text-gray-400 group-hover:text-black transition'}`}>{icon}</span>
            <span className="font-bold text-sm tracking-wide flex-1">{label}</span>
            {count !== undefined && (
                <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-black'}`}>{count}</span>
            )}
        </Link>
    );
}

function EmptyState({ label, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold font-serif text-lg mb-2">{label}</h3>
            {action && (
                <Link href={action} className="mt-4 px-6 py-3 bg-blue-950 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:scale-105 transition shadow-lg shadow-blue-900/20">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
