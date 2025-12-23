"use client";

import { useState } from "react";
import { Search, Tag, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityManagement({ initialSoldItems, initialOffers }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filterData = (items, type) => {
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const title = type === 'sale' ? (item.title || "") : (item.itemId?.title || "");
      const seller = item.sellerId?.name || "";
      const buyer = item.buyerId?.name || "";
      
      return (
        title.toLowerCase().includes(query) ||
        seller.toLowerCase().includes(query) ||
        buyer.toLowerCase().includes(query)
      );
    });
  };

  const filteredSales = filterData(initialSoldItems, 'sale');
  const filteredOffers = filterData(initialOffers, 'offer');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Activity</h1>
          <p className="text-gray-500 mt-1">Monitor all transactions and negotiations across the platform.</p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items, sellers, or buyers..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Recent Sales Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <Tag className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSales.length > 0 ? (
                  filteredSales.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{item.title}</span>
                          <span className="text-lg font-bold text-green-600 mt-1">${item.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 w-12 text-[10px] uppercase font-bold">Seller</span>
                            <span className="text-gray-700 font-medium">{item.sellerId?.name || "Deleted User"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 w-12 text-[10px] uppercase font-bold">Buyer</span>
                            <span className="text-gray-700 font-medium">{item.buyerId?.name || "Guest"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-500 flex items-center justify-end gap-1.5">
                          <Clock className="w-4 h-4" />
                          {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                      No sales found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recent Offers Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Recent Offers</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item & Offer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Negotiation</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{offer.itemId?.title || "Unknown Item"}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400 line-through">${offer.itemId?.price || 0}</span>
                            <span className="text-sm font-bold text-blue-600">${offer.offerAmount || offer.offerPrice}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-700 font-medium">{offer.buyerId?.name}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Offered to {offer.sellerId?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          offer.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          offer.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {offer.status === 'Accepted' && <CheckCircle className="w-3 h-3" />}
                          {offer.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      No offers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
