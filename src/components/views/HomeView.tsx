import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/initialData';
import { ProductCard } from '../ProductCard';
import { HomeBannerSlider } from '../home/HomeBannerSlider';
import { ShopByCategory } from '../home/ShopByCategory';
import {
  TrendingUp,
  Search,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    quickBuy,
    settings,
    setView
  } = useStore();

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-28 sm:pb-24 bg-slate-50/70">
      {/* 1. Home Page Promotional Banner Slider */}
      <HomeBannerSlider />

      {/* 2. Shop By Category (Reference Image Design) */}
      <ShopByCategory />

      {/* 3. Trust Highlights Bar */}
      <section className="px-3 sm:px-4 max-w-7xl mx-auto pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-2.5 shadow-2xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">সারা দেশে ডেলিভারি</h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500">হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-2.5 shadow-2xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500">পণ্য দেখে টাকা দিন</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-2.5 shadow-2xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">১০০% আসল প্রোডাক্ট</h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500">কোয়ালিটি নিশ্চয়তা</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Products Catalog Section */}
      <section id="products-section" className="px-3 sm:px-4 max-w-7xl mx-auto space-y-4 pt-2">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-wider mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>পপুলার প্রডাক্টস</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              সকল সেরা পণ্য কালেকশন
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Status Indicator */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-rose-50 border border-rose-100 text-rose-900 px-3.5 py-2 rounded-xl text-xs">
            <span>
              অনুসন্ধান ফলাফল: <strong>"{searchQuery}"</strong> ({filteredProducts.length} টি পণ্য পাওয়া গেছে)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="font-bold underline hover:text-rose-700"
            >
              রিসেট করুন
            </button>
          </div>
        )}

        {/* Product Grid (2 columns on mobile, 3 on tablet, 4 on desktop) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">
              কোনো পণ্য পাওয়া যায়নি!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              অন্য কোনো ক্যাটাগরি বা কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Special Discount Banner (Shown only when admin enables it) */}
      {settings.discountOfferActive && (
        <section className="px-3 sm:px-4 max-w-7xl mx-auto pt-2">
          <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-black rounded uppercase tracking-wider inline-block">
                {settings.discountOfferTitle || 'স্পেশাল ডিসকাউন্ট অফার'}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {settings.discountOfferSubtitle || 'যেকোনো অর্ডারে প্রোমো কোড ব্যবহার করুন!'}
              </h3>
              {settings.discountOfferCoupon && (
                <p className="text-rose-100 text-xs sm:text-sm max-w-xl">
                  চেকআউটে কুপন কোড{' '}
                  <strong className="text-amber-300 bg-black/20 px-2 py-0.5 rounded font-mono">
                    {settings.discountOfferCoupon}
                  </strong>{' '}
                  ব্যবহার করে তাৎক্ষণিক {settings.discountOfferAmount || 100} টাকা অতিরিক্ত ছাড় পান।
                </p>
              )}
            </div>
            <button
              onClick={() => {
                const target = products[0];
                if (target) quickBuy(target, 1);
              }}
              className="px-5 py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 active:scale-95"
            >
              অফার নিন এখনই
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
