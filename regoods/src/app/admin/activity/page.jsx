import { getSoldItems, getRecentOffers } from "@/app/actions/admin";

export default async function ActivityPage() {
    const soldItems = await getSoldItems();
    const offers = await getRecentOffers();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Market Activity</h1>
                <p className="text-gray-500 mt-1">Track sales and offers occurring on the platform.</p>
            </div>

            {/* Sold Items Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sales</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-green-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-bold text-gray-500">Item</th>
                                <th className="px-6 py-3 font-bold text-gray-500">Price</th>
                                <th className="px-6 py-3 font-bold text-gray-500">Seller</th>
                                <th className="px-6 py-3 font-bold text-gray-500">Buyer</th>
                                <th className="px-6 py-3 font-bold text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {soldItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4 text-green-600 font-bold">${item.price}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.sellerId?.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.buyerId?.name || "Unknown"}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                        {new Date(item.updatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {soldItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">No sold items recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Offers Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Offers</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-blue-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-bold text-gray-500">Item</th>
                                <th className="px-6 py-3 font-bold text-gray-500">Offer Amount</th>
                                <th className="px-6 py-3 font-bold text-gray-500">From</th>
                                <th className="px-6 py-3 font-bold text-gray-500">To</th>
                                <th className="px-6 py-3 font-bold text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.map((offer) => (
                                <tr key={offer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{offer.itemId?.title}</td>
                                    <td className="px-6 py-4 text-gray-900 font-bold">${offer.offerAmount}</td>
                                    <td className="px-6 py-4 text-gray-500">{offer.buyerId?.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{offer.sellerId?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${offer.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                                offer.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {offers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">No offers recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
