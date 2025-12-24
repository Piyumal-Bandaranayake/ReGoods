import { getAdminStats, getEngagementStats, getItemStats, getRecentOffers, getMarketActivityStats } from "@/app/actions/admin";
import { Users, ShoppingBag, ArrowUpRight, TrendingUp, DollarSign, UserCheck } from "lucide-react";
import EngagementChart from "@/components/admin/EngagementChart";
import ItemSellingChart from "@/components/admin/ItemSellingChart";
import MarketActivityChart from "@/components/admin/MarketActivityChart";
import ExportReportButton from "@/components/admin/ExportReportButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function StatCard({ title, value, icon: Icon, color, trend, trendType, isLarge }) {
    if (isLarge) {
        return (
            <div className={`${color} rounded-[2.5rem] p-8 text-white relative overflow-hidden h-full shadow-xl`}>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                        <p className="text-sm font-medium opacity-80 mb-2">{title}</p>
                        <h3 className="text-4xl font-bold mb-4">{value}</h3>
                        {trend && (
                            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/10">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-xs font-bold">{trend}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-xs opacity-60">This month vs last</p>
                    </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 relative z-10">
                {trend && (
                    <div className={`flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${trendType === 'up' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend}
                    </div>
                )}
                <p className="text-xs text-gray-400">This month vs last</p>
            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const [stats, engagementData, itemData, recentOffers, marketData] = await Promise.all([
        getAdminStats(),
        getEngagementStats(),
        getItemStats(),
        getRecentOffers(),
        getMarketActivityStats()
    ]);

    const firstName = session?.user?.name?.split(' ')[0] || 'Admin';

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Simple Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello, {firstName}!👋</h1>
                    <p className="text-gray-500 font-medium">This is what's happening in your store this month.</p>
                </div>
                <ExportReportButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Stats Cards Column */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <StatCard
                            title="System performance"
                            value="99.9%"
                            trend="+ 1.2%"
                            trendType="up"
                            color="bg-blue-500"
                            isLarge={true}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <StatCard
                            title="Total orders"
                            value={stats.soldItems?.toLocaleString() || "0"}
                            trend="- 2.4%"
                            trendType="down"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <StatCard
                            title="Total visitors"
                            value={stats.totalUsers?.toLocaleString() || "0"}
                            trend="- 3.1%"
                            trendType="down"
                        />
                    </div>
                </div>

                {/* User Activity Chart - Large Card */}
                <div className="lg:col-span-4 h-full">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-bold text-gray-900">User Activity</h4>
                        </div>
                        <div className="h-[200px]">
                            <EngagementChart data={engagementData} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sales by Category Donut */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-bold text-gray-900">Sales by Category</h4>
                        </div>
                        <div className="h-[300px]">
                            <ItemSellingChart data={itemData} />
                        </div>
                    </div>
                </div>

                {/* Market Activity Area Chart */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-lg font-bold text-gray-900">Market activity</h1>
                        </div>
                        <div className="h-[300px]">
                            <MarketActivityChart data={marketData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
