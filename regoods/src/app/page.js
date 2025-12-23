import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import ItemCard from "@/components/items/ItemCard";

export default async function Home() {
  await dbConnect();
  
  // Fetch 4 featured items (Newest ones for now)
  const featuredItems = await Item.find({ status: "Active" })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean(); // Use lean() for plain objects, but we must stringify _id if needed or component handles it. 
    // Actually, in default server components, passing lean objects is fine if no methods are called. 
    // But IDs need to be strings.
    
  // Serialize IDs manually
  featuredItems.forEach(item => {
    item._id = item._id.toString();
    if(item.sellerId) item.sellerId = item.sellerId.toString();
  });
  return (
    <div className="bg-white min-h-screen pt-[100px] md:pt-[120px]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-gray-900 mx-4 md:mx-8 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl">
        
        {/* Full Width Background Image with Parallax-like effect */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1887&auto=format&fit=crop" 
            alt="Thrift Fashion Model" 
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10 opacity-5 mix-blend-overlay hidden lg:block">
          <span className="text-[25rem] font-black text-white leading-none whitespace-nowrap tracking-tighter">
            REGOODS
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 w-full relative z-20 text-center">
            {/* Text Content */}
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full backdrop-blur-md mb-8">
                  <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-blue-400">Curated Sustainability</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl lg:text-9xl text-white leading-[1.1] mb-8 drop-shadow-2xl">
                <span className="font-serif italic text-white/90">Re</span>
                <span className="font-sans font-black tracking-tighter">Goods</span>
                <span className="text-blue-500 animate-pulse">.</span>
              </h1>
              
              <p className="text-lg md:text-3xl font-medium text-gray-200 mb-10 font-serif italic max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                The Premium Thrift Collection
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto px-12 py-5 bg-blue-500 text-white text-[10px] font-black tracking-[0.2em] rounded-2xl hover:bg-gray-950 transition-all hover:scale-105 shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  SHOP COLLECTION
                </Link>
                <Link 
                  href="/dashboard?category=New" 
                  className="w-full sm:w-auto px-12 py-5 bg-white/10 backdrop-blur border border-white/20 text-white text-[10px] font-black tracking-[0.2em] rounded-2xl hover:bg-white hover:text-gray-900 transition-all hover:scale-105 active:scale-95"
                >
                  VIEW ARRIVALS
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* 2. CATEGORY CURATION */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">Curated <br/> Selections</h2>
              <p className="text-gray-400 mt-4 font-medium text-lg">Hand-picked categories defining modern thrift culture.</p>
            </div>
            <Link href="/dashboard" className="group flex items-center text-sm font-black uppercase tracking-widest text-blue-500">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Clothing", desc: "Vintage finds & fresh trends", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop", cat: "Clothing" },
              { title: "Electronics", desc: "Refurbished excellence", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop", cat: "Electronics" },
              { title: "Home & Life", desc: "Elevate your sanctuary", img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop", cat: "Home & Garden" }
            ].map((item, idx) => (
              <Link key={idx} href={`/dashboard?category=${item.cat}`} className="group block">
                <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden bg-gray-100 rounded-[2.5rem] mb-8 shadow-xl shadow-gray-200/50">
                  <Image 
                    src={item.img} 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                    <div className="text-white">
                      <h3 className="text-2xl font-serif font-bold mb-1">{item.title}</h3>
                      <p className="text-xs text-white/70 font-bold uppercase tracking-widest">{item.desc}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WIDE CINEMATIC BANNER */}
      <section className="mx-4 md:mx-8 mb-24 relative h-[500px] md:h-[700px] bg-gray-900 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl">
        <Image 
          src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2095&auto=format&fit=crop" 
          alt="Minimal Collection"
          fill
          className="object-cover opacity-50 contrast-125 saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-start px-10 md:px-24 max-w-4xl">
          <div className="px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-xl text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block">
            Sustainability First
          </div>
          <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 leading-none">
            Modern <br className="hidden md:block" /> Minimalism
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-medium mb-12 max-w-md leading-relaxed">
            Discover a curated archive of essential, timeless pieces designed to withstand the test of time.
          </p>
          <Link 
            href="/dashboard" 
            className="px-12 py-5 bg-white text-gray-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl shadow-black/20 active:scale-95"
          >
            Explore Archive
          </Link>
        </div>
      </section>

      {/* 4. FEATURED PRODUCT GALLERY */}
      <section className="py-24 md:py-32 bg-blue-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <div className="w-16 h-1 w-12 bg-blue-500 mx-auto mb-8 rounded-full"></div>
             <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Daily Spotlight</h2>
             <p className="text-gray-400 font-medium text-lg leading-relaxed">A meticulously curated selection of the finest pre-owned treasures currently available in our marketplace.</p>
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
             <div className="text-center py-20 bg-white rounded-[3rem] border border-blue-100/50 shadow-xl shadow-blue-500/5">
                <ShoppingBag className="w-16 h-16 text-blue-100 mx-auto mb-6" />
                <p className="text-gray-400 font-serif italic text-xl">The marketplace is currently replenished...</p>
             </div>
          )}

          <div className="mt-24 text-center">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-12 py-5 bg-gray-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 active:scale-95"
            >
              Enter Marketplace <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

