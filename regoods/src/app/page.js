import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Search, Globe, RefreshCw, ShieldCheck, ChevronRight, Star } from "lucide-react";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import ItemCard from "@/components/items/ItemCard";
import Hero from "@/components/home/Hero";

export default async function Home() {
  await dbConnect();
  
  // Fetch 4 featured items
  const featuredItems = await Item.find({ status: "Active" })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
    
  // Serialize IDs manually
  featuredItems.forEach(item => {
    item._id = item._id.toString();
    if(item.sellerId) item.sellerId = item.sellerId.toString();
  });

  return (
    <div className="bg-white min-h-screen font-sans">
      
      <Hero />

      {/* 2. SHOP BY CATEGORY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-extrabold text-zinc-900 mb-4 tracking-tight">Shop by Category</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Electronics", img: "/images/hero/electronics_cat.png", link: "/dashboard?category=Electronics" },
              { title: "Home Interior", img: "/images/hero/home_cat.png", link: "/dashboard?category=Home" },
              { title: "Everyday Gear", img: "/images/hero/everyday_cat.png", link: "/dashboard?category=Other" }
            ].map((col, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-[450px] w-full rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <Image src={col.img} alt={col.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-zinc-900 mb-4 font-montserrat">{col.title}</h3>
                  <Link href={col.link} className="inline-block px-8 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-blue-600 transition-colors font-inter">
                    EXPLORE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MINIMAL BANNER */}
      <section className="py-24 bg-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-lg">
                <Image src="/images/hero/minimal_banner.png" alt="Minimal" fill className="object-cover" />
             </div>
             <div className="text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-montserrat font-black text-zinc-900 mb-6 leading-tight">Everything Has a Story</h2>
                <p className="text-zinc-500 text-lg mb-8 max-w-md mx-auto lg:mx-0 font-inter">Join thousands of users giving items a second life. Quality checked, sustainable, and reliable.</p>
                <Link href="/dashboard" className="inline-block px-10 py-4 bg-zinc-900 text-white font-bold rounded-full hover:bg-black transition-colors font-inter">
                  BROWSE ALL
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-2 font-inter">The best of the week</p>
            <h2 className="text-3xl md:text-4xl font-montserrat font-extrabold text-zinc-900 mb-4 tracking-tight">Featured Products</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredItems.map((item) => (
                <div key={item._id} className="transition-transform hover:-translate-y-2 duration-300">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
                <p className="text-zinc-400 font-bold italic text-lg tracking-widest uppercase font-inter">Coming Soon...</p>
             </div>
          )}

          <div className="mt-16 text-center">
            <Link 
              href="/dashboard" 
              className="px-10 py-4 border-2 border-zinc-900 text-zinc-900 font-bold rounded-full hover:bg-zinc-900 hover:text-white transition-all active:scale-95 font-inter"
            >
              BROWSE ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS - SIMPLE */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {[
              { icon: Globe, title: "Discover", desc: "Eco-friendly pieces curated for you." },
              { icon: ShieldCheck, title: "Secure", desc: "Verified sellers and safe transactions." },
              { icon: RefreshCw, title: "Circular", desc: "Join the movement and give items a second life." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                  <item.icon className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-zinc-900 mb-4">{item.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed font-inter">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER - BOLD & CLEAN */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-montserrat font-black mb-6 tracking-tight">Stay in the Loop</h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto font-inter">Subscribe for early access to new collections and exclusive discounts.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-grow px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-inter"
              />
              <button className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full hover:bg-white hover:text-zinc-900 transition-all active:scale-95 font-inter">
                JOIN
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
