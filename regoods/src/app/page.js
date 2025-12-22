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
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-gray-900">
        
        {/* Full Width Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1887&auto=format&fit=crop" 
            alt="Thrift Fashion Model" 
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Background Text (now cleaner) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10 opacity-10 mix-blend-overlay">
          <span className="text-[12rem] md:text-[20rem] font-black text-white leading-none whitespace-nowrap">
            REGOODS
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 text-center">
          
            {/* Text Content */}
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              <div className="inline-block px-6 py-2 border border-white/30 rounded-full backdrop-blur-md bg-white/10 shadow-lg mb-6">
                  <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/90">Sustainable Marketplace</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl text-white leading-tight mb-6 drop-shadow-lg">
                <span className="font-serif italic text-white">Re</span>
                <span className="font-sans font-extrabold tracking-tighter">Goods</span>
                <span className="text-indigo-400">.</span>
              </h1>
              
              <p className="text-xl md:text-3xl font-light text-gray-200 mb-8 font-serif italic max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                The Premium Thrift Collection
              </p>
              
              <p className="text-gray-300 max-w-lg mx-auto text-base md:text-lg leading-relaxed mb-10 font-medium">
                 Where style meets sustainability. Discover unique pre-loved fashion and join the circular economy revolution.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="px-10 py-4 bg-white text-blue-950 text-sm font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] min-w-[200px]"
                >
                  SHOP COLLECTION
                </Link>
                <Link 
                  href="/dashboard?category=New" 
                  className="px-10 py-4 bg-transparent border border-white text-white text-sm font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105 min-w-[200px]"
                >
                  VIEW ARRIVALS
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* 2. HOT DEALS / COLLECTIONS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Hot Deals</h2>
            <p className="text-gray-500 mt-2">Curated categories just for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group text-center cursor-pointer">
              <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 rounded-lg mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Clothing Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clothing</h3>
              <p className="text-sm text-gray-500 mb-4">Fresh arrivals & vintage finds</p>
              <Link href="/dashboard?category=Clothing" className="inline-block px-6 py-2 border border-blue-950 rounded-full text-xs font-bold font-sans uppercase tracking-widest text-blue-950 hover:bg-blue-950 hover:text-white transition-colors">
                Shop Now
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group text-center cursor-pointer">
              <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 rounded-lg mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop"
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt="Electronics"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Electronics</h3>
              <p className="text-sm text-gray-500 mb-4">Refurbished tech & gadgets</p>
              <Link href="/dashboard?category=Electronics" className="inline-block px-6 py-2 bg-blue-950 text-white rounded-full text-xs font-bold font-sans uppercase tracking-widest hover:bg-black transition-colors">
                Shop Now
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group text-center cursor-pointer">
              <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 rounded-lg mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop" 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Home & Garden"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Home & Garden</h3>
              <p className="text-sm text-gray-500 mb-4">Decor, furniture & more</p>
              <Link href="/dashboard?category=Home & Garden" className="inline-block px-6 py-2 border border-blue-950 rounded-full text-xs font-bold font-sans uppercase tracking-widest text-blue-950 hover:bg-blue-950 hover:text-white transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WIDE BANNER SECTION */}
      <section className="relative h-[400px] md:h-[500px] bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2095&auto=format&fit=crop" 
          alt="Minimal Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <p className="text-gray-300 uppercase tracking-widest mb-4 font-semibold text-sm">
            Sustainable Choice
          </p>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
            Best Minimal <br/> Collection
          </h2>
          <Link 
            href="/dashboard" 
            className="px-10 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors rounded-sm"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* 4. NEWSLETTER / FOOTER TEASER */}
      {/* 4. FEATURED PRODUCT */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Featured Product</h2>
             <p className="text-gray-600">Hand-picked daily favorites.</p>
          </div>

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
               <p className="text-gray-500 italic">No featured items yet.</p>
             </div>
          )}

          <div className="mt-16 text-center">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-8 py-3 bg-blue-950 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-black hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-900/20"
            >
              View All Marketplace Items <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

