import { getAdminItems, getOrderStats } from "@/app/actions/admin";
import { MoreHorizontal } from "lucide-react";
import InventoryTable from "@/components/admin/InventoryTable";

async function StatusCard({ label, value, trend, color }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`${color} p-2 rounded-xl text-white`}>
                    <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">
                        +
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2 relative z-10">
                <div className="flex items-center px-2 py-1 bg-blue-50 rounded-full text-[9px] font-black text-blue-500 uppercase">
                    {trend}
                </div>
                <p className="text-[10px] text-gray-400 font-medium">vs last month</p>
            </div>
        </div>
    );
}

export default async function OrdersPage() {
    const [items, orderStats] = await Promise.all([
        getAdminItems(),
        getOrderStats()
    ]);

    const stats = [
        { label: "Active Listings", value: items.filter(i => i.status === 'Active').length, trend: "+ 1.2%", color: "bg-blue-500" },
        { label: "Items Sold", value: items.filter(i => i.status === 'Sold').length, trend: "+ 2.8%", color: "bg-blue-600" },
        { label: "Total Inventory", value: items.length, trend: "+ 0.5%", color: "bg-blue-400" },
        { label: "New Today", value: orderStats.newOrders, trend: "+ 2.4%", color: "bg-blue-300" }
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Inventory & Sales</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Monitor marketplace health and inventory movement.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-3 bg-white text-gray-400 hover:text-gray-900 rounded-2xl shadow-sm border border-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatusCard key={idx} {...stat} />
                ))}
            </div>

            <InventoryTable initialItems={items} />
        </div>
    );
}
