import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PackageCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BannerSlide {
  id: number;
  tag: string;
  tagBg: string;
  title: string;
  highlightText: string;
  subtitle: string;
  badge1: string;
  badge2: string;
  badge3: string;
  ctaText: string;
  gradient: string;
  decorColor: string;
  imageAlt: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    tag: 'ফ্যাক্টরি ডিরেক্ট সোর্সিং',
    tagBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    title: 'চীন ও গ্লোবাল মার্কেট থেকে পণ্য আনুন',
    highlightText: 'এখন আরও সহজে!',
    subtitle: 'ফ্যাক্টরি রেট ও বিশ্বমানের কোয়ালিটিতে সরাসরি ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি।',
    badge1: 'সেরা দাম',
    badge2: 'দ্রুত ডেলিভারি',
    badge3: 'যাচাইকৃত সরবরাহকারী',
    ctaText: 'পণ্যসমূহ দেখুন',
    gradient: 'from-slate-900 via-[#102a45] to-slate-950',
    decorColor: 'bg-rose-500/10',
    imageAlt: 'Sourcing & Direct Import'
  },
  {
    id: 2,
    tag: 'মেগা গ্যাজেট অফার',
    tagBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    title: '১০০% অরিজিনাল টেক ও স্মার্ট গ্যাজেটস',
    highlightText: 'সেরা ডিসকাউন্টে!',
    subtitle: 'প্রিমিয়াম ব্র্যান্ডের ওয়াচ, এয়ারবাডস ও এক্সেসরিজে সেরা অফার ও ডিসকাউন্ট।',
    badge1: 'অরিজিনাল গ্যারান্টি',
    badge2: 'ফাস্ট ডেলিভারি',
    badge3: 'ফ্রি হোম ডেলিভারি',
    ctaText: 'গ্যাজেট কালেকশন',
    gradient: 'from-slate-900 via-blue-950 to-slate-900',
    decorColor: 'bg-blue-500/10',
    imageAlt: 'Original Smart Gadgets'
  },
  {
    id: 3,
    tag: 'ট্রেন্ডিং লাইফস্টাইল',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    title: 'ফ্যাশন, ব্যাগ ও লাইফস্টাইল কালেকশন',
    highlightText: 'স্টক সীমিত!',
    subtitle: 'হাতে পেয়ে দেখে মূল্য পরিশোধের সুবিধা—অগ্রিম কোনো হিডেন চার্জ নেই।',
    badge1: 'ক্যাশ অন ডেলিভারি',
    badge2: 'নিখুঁত কোয়ালিটি',
    badge3: 'গ্রাহক সন্তুষ্টি',
    ctaText: 'অর্ডার করুন',
    gradient: 'from-[#141b2b] via-[#1c2e4a] to-slate-900',
    decorColor: 'bg-emerald-500/10',
    imageAlt: 'Trending Fashion'
  }
];

export const HomeBannerSlider: React.FC = () => {
  const { setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide = BANNERS[currentSlide];

  return (
    <div className="space-y-3 px-3 sm:px-4 max-w-7xl mx-auto pt-3">
      {/* 1. Main Promotional Banner Carousel */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-slate-200/80 text-white select-none transition-all duration-300"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`bg-gradient-to-r ${slide.gradient} p-5 sm:p-8 lg:p-10 relative`}>
          {/* Subtle Ambient Glows */}
          <div
            className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full ${slide.decorColor} blur-2xl pointer-events-none`}
          />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

          {/* Banner Content Layout */}
          <div className="relative z-10 flex flex-col justify-between min-h-[190px] sm:min-h-[220px]">
            {/* Tag Badge */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${slide.tagBg}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{slide.tag}</span>
              </span>

              {/* Slider Navigation Arrows (Desktop / Tablet) */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Title & Subtitle */}
            <div className="my-3 space-y-1.5 max-w-xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {slide.title} <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">
                  {slide.highlightText}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            {/* Badges & CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[10px] sm:text-xs font-semibold">
                  {slide.badge1}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[10px] sm:text-xs font-semibold">
                  {slide.badge2}
                </span>
                <span className="hidden xs:inline-block px-2 sm:px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[10px] sm:text-xs font-semibold">
                  {slide.badge3}
                </span>
              </div>

              <button
                onClick={scrollToProducts}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {BANNERS.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-6 h-1.5 bg-rose-500 rounded-full'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70 rounded-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
