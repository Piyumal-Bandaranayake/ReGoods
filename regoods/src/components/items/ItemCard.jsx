"use client";

import Link from "next/link";
import { ShoppingBag, Star, Heart } from "lucide-react";
import Image from "next/image";

export default function ItemCard({ item }) {
  return (
    <Link
      href={`/items/${item._id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-xl transition-all duration-500"
    >
      <div className="relative w-full pb-[110%] bg-zinc-50 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
            <ShoppingBag className="w-12 h-12 opacity-10" />
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-900 shadow-sm border border-zinc-100 font-inter">
             {item.category || "New"}
           </div>
        </div>

        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-zinc-100 text-zinc-500 hover:text-blue-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-zinc-900 truncate group-hover:text-blue-500 transition-colors mb-4 font-inter">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between">
           <span className="text-lg font-extrabold text-zinc-900 font-inter">${item.price}</span>
           
           <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 group-hover:bg-blue-500 group-hover:text-white transition-all">
             <ShoppingBag className="w-4 h-4" />
           </div>
        </div>
      </div>
    </Link>
  );
}
