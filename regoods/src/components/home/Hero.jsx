"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "GIVE EVERY ITEM A SECOND LIFE",
      desc: "The unified platform to buy and sell pre-owned treasures. From electronics to furniture, discover everything you need.",
      img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2000&auto=format&fit=crop",
      badge: "Sustainable Marketplace",
      accent: "text-blue-500",
      overlay: "bg-blue-900/40"
    },
    {
      title: "UPGRADE YOUR TECH SUSTAINABLY",
      desc: "Verified pre-owned electronics at unbeatable prices. Join the circular economy and save more.",
      img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop",
      badge: "Quality Electronics",
      accent: "text-blue-400",
      overlay: "bg-blue-950/40"
    },
    {
      title: "BETTER HOMES, BETTER PLANET",
      desc: "Find unique home decor and furniture that fits your style and your values.",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
      badge: "Home & Interior",
      accent: "text-blue-300",
      overlay: "bg-blue-900/30"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[95vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-white">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Theme Focused Overlays (Light Blue/White vibe) */}
            <div className={`absolute inset-0 ${slide.overlay} backdrop-blur-[2px]`}></div>
            {/* Added a light blue gradient from bottom for the "Light Blue + White" theme focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-100/40 via-transparent to-black/30"></div>
          </div>

          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center justify-center pt-24 text-center">
            <div className={`transition-all duration-700 delay-300 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <p className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold tracking-[0.3em] uppercase text-white mb-8 font-inter">
                {slide.badge}
              </p>
              
              <h1 className="text-5xl md:text-8xl font-montserrat font-black text-white leading-[1.1] mb-8 tracking-tighter drop-shadow-2xl">
                {slide.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? "text-blue-100" : ""}>{word} </span>
                ))}
              </h1>
              
              <p className="text-lg md:text-xl text-blue-50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium font-inter drop-shadow-lg">
                {slide.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/dashboard"
                  className="group w-full sm:w-auto px-12 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-2xl shadow-blue-900/20 font-inter flex items-center justify-center gap-2"
                >
                  START BROWSING
                </Link>
                <Link
                  href="/items/create"
                  className="group w-full sm:w-auto px-12 py-5 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all active:scale-95 font-inter"
                >
                  START SELLING
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 z-30 p-4 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm transition-all border border-white/20 active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 z-30 p-4 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm transition-all border border-white/20 active:scale-90"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === currentSlide ? "w-12 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
