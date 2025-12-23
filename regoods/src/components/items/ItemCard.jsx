"use client";

import Link from "next/link";
import { ShoppingBag, Star, Heart } from "lucide-react";
import Image from "next/image";

export default function ItemCard({ item }) {
  return (
    <Link
      href={`/items/${item._id}`}
      className="group block bg-white rounded-[2rem] overflow-hidden border border-gray-100/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative w-full pb-[110%] bg-gray-50 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-12 h-12 opacity-10" />
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-white/50">
             {item.category || "New Arrival"}
           </div>
        </div>

        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-white/50 text-gray-400 hover:text-pink-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="px-6 py-3 bg-white text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
              View Treasure
            </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black text-gray-900 truncate flex-grow group-hover:text-indigo-600 transition-colors leading-tight">
              {item.title}
            </h3>
        </div>
        
        <div className="flex items-center justify-between mt-4">
           <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Starting from</span>
             <span className="text-xl font-black text-gray-900">${item.price}</span>
           </div>
           
           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
             <ShoppingBag className="w-5 h-5" />
           </div>
        </div>
      </div>
    </Link>
  );
}
