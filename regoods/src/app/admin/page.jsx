import { getAdminStats } from "@/app/actions/admin";
import { Users, DollarSign, Package, AlertCircle } from "lucide-react";

async function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className={`p-4 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Revenue (Est)"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Sold Items"
                    value={stats.soldItems}
                    icon={Package}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Reports"
                    value={stats.activeReports}
                    icon={AlertCircle}
                    color="bg-red-500"
                />
            </div>

            {/* Additional simple charts or lists could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
                    Chart Placeholder
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
                    Activity Feed Placeholder
                </div>
            </div>
        </div>
    );
}
