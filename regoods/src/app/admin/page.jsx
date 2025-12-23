import { getAdminStats, getEngagementStats, getItemStats, getRecentOffers } from "@/app/actions/admin";
import { Users, Package, AlertCircle, ShieldCheck, TrendingUp, Activity } from "lucide-react";
import EngagementChart from "@/components/admin/EngagementChart";
import ItemSellingChart from "@/components/admin/ItemSellingChart";
import MarketActivity from "@/components/admin/MarketActivity";
import ExportReportButton from "@/components/admin/ExportReportButton";

async function StatCard({ title, value, icon: Icon, color, trend }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 group hover:border-blue-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/10`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                             <TrendingUp className="w-3 h-3 text-green-600" />
                             <span className="text-[10px] font-black text-green-600">{trend}</span>
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <h3 className="text-4xl font-black text-gray-950 tracking-tighter">{value}</h3>
                        <span className="text-xs font-bold text-gray-400">total</span>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const [stats, engagementData, itemData, recentOffers] = await Promise.all([
        getAdminStats(),
        getEngagementStats(),
        getItemStats(),
        getRecentOffers()
    ]);

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 mb-4 transition-transform hover:scale-105 cursor-default">
                        <Activity className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
                    </div>
                    <h1 className="text-5xl font-serif font-black text-gray-950 tracking-tight italic">
                        Platform <span className="text-blue-500">Pulse.</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2 max-w-md">
                        Comprehensive real-time analytics and global marketplace health governance.
                    </p>
                </div>
                
                <div className="flex space-x-3">
                    <ExportReportButton 
                        stats={stats} 
                        engagementData={engagementData} 
                        itemData={itemData} 
                        recentOffers={recentOffers} 
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <StatCard
                    title="Active Ecosystem"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-indigo-500"
                    trend="+12%"
                />
                <StatCard
                    title="Volume Circulated"
                    value={stats.soldItems}
                    icon={Package}
                    color="bg-blue-500"
                    trend="+8.4%"
                />
                <StatCard
                    title="Critical Alerts"
                    value={stats.activeReports}
                    icon={AlertCircle}
                    color="bg-rose-500"
                />
                <StatCard
                    title="Trust Verifications"
                    value={stats.verificationRequestsCount}
                    icon={ShieldCheck}
                    color="bg-emerald-500"
                    trend="Priority"
                />
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 group transition-all hover:shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h4 className="text-xl font-serif font-bold text-gray-900 mb-1">User Engagement</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Interaction Velocity</p>
                        </div>
                    </div>
                    <div className="h-[350px] flex items-center justify-center">
                        <EngagementChart data={engagementData} />
                    </div>
                </div>
                
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 group transition-all hover:shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h4 className="text-xl font-serif font-bold text-gray-900 mb-1">Market Dynamics</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Growth Projection</p>
                        </div>
                    </div>
                    <div className="h-[350px] flex items-center justify-center">
                        <ItemSellingChart data={itemData} />
                    </div>
                </div>
            </div>

            {/* Activity Stream */}
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/5 rounded-[3rem] blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="relative bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 p-1 shadow-2xl overflow-hidden">
                    <MarketActivity initialOffers={recentOffers} />
                </div>
            </div>
        </div>
    );
}
