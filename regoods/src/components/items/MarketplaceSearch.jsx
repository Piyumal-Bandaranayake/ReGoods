"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function MarketplaceSearch({ initialSearch }) {
    const [searchQuery, setSearchQuery] = useState(initialSearch || "");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        // Always push logic, if empty string, it clears search
        if (searchQuery.trim()) {
            router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push(`/dashboard`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-xl mt-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full leading-5 bg-gray-50/50 shadow-inner placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 ease-in-out text-base"
                placeholder="Search for items, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </form>
    );
}
