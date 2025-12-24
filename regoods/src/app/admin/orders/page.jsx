import { getAdminItems, getOrderStats } from "@/app/actions/admin";
import { Search, Filter, Download, Plus, MoreHorizontal, User as UserIcon } from "lucide-react";

async function StatusCard({ label, value, trend, color }) {
// ... existing StatusCard implementation is fine ...
}

export default async function OrdersPage() {
    const [items, orderStats] = await Promise.all([
        getAdminItems(),
        getOrderStats()
    ]);

    const stats = [
        { label: "Active Listings", value: orderStats.activeItems || items.filter(i => i.status === 'Active').length, trend: "+ 1.2%", color: "bg-blue-400" },
        { label: "Items Sold", value: orderStats.deliveredOrders || items.filter(i => i.status === 'Sold').length, trend: "+ 2.8%", color: "bg-cyan-400" },
        { label: "Total Inventory", value: items.length, trend: "+ 0.5%", color: "bg-blue-300" },
        { label: "New Today", value: orderStats.newOrders, trend: "+ 2.4%", color: "bg-blue-200" }
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-900">Inventory & Sales</h1>
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

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header/Search */}
                <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center flex-1 max-w-md relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by title, seller or status..."
                            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Actual Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Item Details</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Seller</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Buyer / Info</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Listed</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map((item) => (
                                <tr key={item._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                                                {item.images?.[0] ? (
                                                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                        <Plus className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{item.title}</p>
                                                <p className="text-[10px] text-gray-400">#{item._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-500 uppercase">
                                                {item.sellerId?.name?.charAt(0) || "U"}
                                            </div>
                                            <span className="text-xs font-bold text-gray-900">{item.sellerId?.name || "Unknown"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {item.status === 'Sold' ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-500 uppercase">
                                                    {item.buyerId?.name?.charAt(0) || "B"}
                                                </div>
                                                <span className="text-xs font-bold text-gray-900">{item.buyerId?.name || "Purchased"}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Available</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-900">${item.price}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            item.status === 'Sold' 
                                                ? 'bg-green-50 text-green-600' 
                                                : 'bg-blue-50 text-blue-500'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
