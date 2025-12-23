import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Search, Globe, RefreshCw, ShieldCheck, ChevronRight, Star } from "lucide-react";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import ItemCard from "@/components/items/ItemCard";

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
    <div className="bg-[#fcfcfc] min-h-screen">
      
      {/* 1. HERO SECTION - ULTRA MODERN */}
      <section className="relative pt-24 pb-12 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">The Future of Thrifting is Here</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter">
                Premium <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Sustainable</span> <br />
                Goods.
              </h1>
              
              <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience the next generation marketplace for high-end pre-owned fashion, electronics, and home essentials.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  Start Shopping <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="relative w-full sm:w-72">
                  <input 
                    type="text" 
                    placeholder="Search treasures..." 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-900"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-8 justify-center lg:justify-start">
                <div>
                  <div className="text-3xl font-black text-gray-900">12K+</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">Active Users</div>
                </div>
                <div className="h-10 w-px bg-gray-100"></div>
                <div>
                  <div className="text-3xl font-black text-gray-900">50K+</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">Items Sold</div>
                </div>
                <div className="h-10 w-px bg-gray-100"></div>
                <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-black text-gray-900">4.9</span>
                </div>
              </div>
            </div>

            <div className="relative group animate-fade-in-up transition-delay-200">
               <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
               <div className="relative h-[650px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <Image 
                   src="/images/hero.png" 
                   alt="Modern Thrift Aesthetic"
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-1000"
                   priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-white text-lg font-bold">"Circular fashion is the only way forward."</p>
                    <p className="text-white/60 text-sm font-medium mt-1">— Elena V., Sustainable Designer</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / FEATURES SECTION */}
      <section className="py-24 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: "Eco-Conscious", desc: "Reducing waste by giving high-quality items a second life." },
              { icon: ShieldCheck, title: "Verified Sellers", desc: "Every seller is vetted to ensure a safe and premium experience." },
              { icon: RefreshCw, title: "Hassle-Free", desc: "Simple listing, easy shipping, and secure payments." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors text-indigo-600 group-hover:text-white">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MODERN BENTO CATEGORIES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter">Explore <br/> Neighborhoods</h2>
              <p className="text-gray-400 mt-4 font-medium text-lg">Curated categories for every part of your life.</p>
            </div>
            <Link href="/dashboard" className="group flex items-center px-6 py-3 bg-gray-50 rounded-xl text-sm font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">
            {/* Clothing - Large Item */}
            <Link href="/dashboard?category=Clothing" className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image src="/images/clothing.png" alt="Clothing" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 p-2">
                <h3 className="text-4xl font-black text-white mb-2">Curated Style</h3>
                <p className="text-white/70 font-bold uppercase tracking-widest text-xs">Clothing & Accessories</p>
              </div>
              <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform">
                <div className="text-indigo-600 font-black">2.4k+ Items</div>
              </div>
            </Link>

            {/* Electronics */}
            <Link href="/dashboard?category=Electronics" className="group relative overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image src="/images/electronics.png" alt="Electronics" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-black text-white mb-2">Tech Hub</h3>
                <p className="text-white/70 font-bold uppercase tracking-widest text-xs">Electronics & Gadgets</p>
              </div>
            </Link>

            {/* Home & Life */}
            <Link href="/dashboard?category=Home%20%26%20Garden" className="group relative overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image src="/images/home_life.png" alt="Home" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-black text-white mb-2">Sanctuary</h3>
                <p className="text-white/70 font-bold uppercase tracking-widest text-xs">Home & Living</p>
              </div>
            </Link>

            {/* Others - Link back to marketplace */}
            <Link href="/dashboard" className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-12 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-20 opacity-10">
                <RefreshCw className="w-64 h-64 text-white rotate-12" />
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Didn't find what <br /> you were looking for?</h3>
                <p className="text-indigo-100 text-xl font-medium max-w-md">Our marketplace is updated daily with hundreds of unique treasures. Explore the full catalog now.</p>
              </div>
              <div className="flex items-center gap-4 text-white">
                <span className="text-sm font-black uppercase tracking-widest">Browse Marketplace</span>
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:translate-x-4 transition-transform">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DAILY SPOTLIGHT - FEATURED ITEMS */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Daily Spotlight</h2>
            <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">Hand-picked arrivals from our community of verified sellers.</p>
          </div>

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredItems.map((item) => (
                <div key={item._id} className="animate-fade-in-up">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <p className="text-gray-400 font-bold italic text-xl uppercase tracking-widest">Replenishing the vaults...</p>
             </div>
          )}

          <div className="mt-16 text-center">
            <Link 
              href="/dashboard" 
              className="px-12 py-5 bg-white border-2 border-gray-900 text-gray-900 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Enter Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-12 tracking-tighter leading-[0.9]">Simple.<br />Circular.<br />Smart.</h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Discover", desc: "Browse our curated collection of verified pre-owned goods." },
                  { step: "02", title: "Trade", desc: "Easily list your own items or make offers on ones you love." },
                  { step: "03", title: "Repeat", desc: "Extend the lifecycle of goods and join the circular economy." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="text-5xl font-black text-gray-100 group-hover:text-indigo-100 transition-colors">{item.step}</div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                   <div className="h-64 bg-gray-100 rounded-[2rem] overflow-hidden relative">
                     <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" alt="Fashion" fill className="object-cover" />
                   </div>
                   <div className="h-80 bg-gray-100 rounded-[2rem] overflow-hidden relative">
                      <Image src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=2069&auto=format&fit=crop" alt="Fashion 2" fill className="object-cover" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="h-80 bg-gray-100 rounded-[2rem] overflow-hidden relative">
                      <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Store" fill className="object-cover" />
                   </div>
                   <div className="h-64 bg-gray-100 rounded-[2rem] overflow-hidden relative">
                      <Image src="https://images.unsplash.com/photo-1534452286304-a15f3395d9da?q=80&w=2070&auto=format&fit=crop" alt="Jewelry" fill className="object-cover" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER / CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Join the Movement.</h2>
            <p className="text-gray-400 text-xl mb-12 font-medium">Get early access to exclusive drops and sustainable living tips.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="flex-grow px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <button className="px-10 py-5 bg-white text-gray-900 font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
                Join
              </button>
            </form>
            <p className="mt-8 text-gray-500 text-sm font-medium">Trusted by 12,000+ sustainability enthusiasts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
