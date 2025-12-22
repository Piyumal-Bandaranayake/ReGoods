"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function ItemCard({ item }) {
  return (
    <Link 
      href={`/items/${item._id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Ratio */}
      <div className="relative w-full pb-[125%] bg-gray-100">
         {item.images && item.images.length > 0 ? (
           <img 
             src={item.images[0]} 
             alt={item.title}
             className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
           />
         ) : (
           <div className="absolute inset-0 flex items-center justify-center text-gray-400">
             <ShoppingBag className="w-10 h-10 opacity-30"/>
           </div>
         )}
         {/* Overlay Button */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90%]">
           <button className="w-full bg-white text-blue-950 py-3 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-blue-950 hover:text-white transition-colors">
             View details
           </button>
         </div>
      </div>
      
      <div className="p-4 text-center">
        <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
        <p className="text-gray-500 text-sm mt-1">${item.price}</p>
      </div>
    </Link>
  );
}
