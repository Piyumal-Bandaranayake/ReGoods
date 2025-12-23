"use client";

import { useState } from "react";
import { Search, ExternalLink, Clock, Tag, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MarketActivity({ initialOffers }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = initialOffers.filter((offer) => {
    const query = searchQuery.toLowerCase();
    const itemTitle = offer.itemId?.title?.toLowerCase() || "";
    const buyerName = offer.buyerId?.name?.toLowerCase() || "";
    const sellerName = offer.sellerId?.name?.toLowerCase() || "";
    
    return (
      itemTitle.includes(query) ||
      buyerName.includes(query) ||
      sellerName.includes(query)
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Market Activity</h3>
          <p className="text-sm text-gray-500">Recent offers and negotiations across the platform.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items, buyers or sellers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Item & Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Parties</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Offer Value</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <tr key={offer._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{offer.itemId?.title || "Deleted Item"}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> List Price: ${offer.itemId?.price || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <User className="w-3.5 h-3.5 text-purple-500" />
                        <span className="font-medium">{offer.buyerId?.name || "Anonymous"}</span>
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded uppercase font-bold">Buyer</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span>{offer.sellerId?.name || "Unknown"}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold">Seller</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-green-600">
                      ${offer.offerPrice}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      offer.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      offer.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      offer.status === 'Countered' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-500 flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  No activity found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
