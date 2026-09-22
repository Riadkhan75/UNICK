import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/initialData';
import { ProductCard } from '../ProductCard';
import {
  Search,
  Filter,
  Layers,
  ChevronLeft,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  Check,
  Headphones,
  Watch,
  Shirt,
  Briefcase,
  Laptop,
  Smartphone,
  Home as HomeIcon,
  Heart,
  LayoutGrid
} from 'lucide-react';

export const getCategoryIcon = (categoryName: string) => {
  const lower = categoryName.toLowerCase();
  if (lower === 'all') return LayoutGrid;
  if (lower.includes('electr')) return Headphones;
  if (lower.includes('gadget')) return Watch;
  if (lower.includes('fash') || lower.includes('cloth') || lower.includes('wear')) return Shirt;
  if (lower.includes('bag') || lower.includes('luggage')) return Briefcase;
  if (lower.includes('foot') || lower.includes('shoe')) return Sparkles;
  if (lower.includes('watch')) return Watch;
  if (lower.includes('audio') || lower.includes('sound') || lower.includes('ear')) return Headphones;
  if (lower.includes('comp') || lower.includes('lap')) return Laptop;
  if (lower.includes('phone') || lower.includes('mobile')) return Smartphone;
  if (lower.includes('home') || lower.includes('living')) return HomeIcon;
  if (lower.includes('health') || lower.includes('beauty')) return Heart;
  return ShoppingBag;
};

export const AllProductsView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setView
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');

  // Compute all unique categories from CATEGORIES and products dynamically
  const categoryList = useMemo(() => {
    const catMap = new Map<string, number>();

    // Count all items in 'All'
    catMap.set('All', products.length);

    // Initial defined categories
    CATEGORIES.forEach((c) => {
      if (c !== 'All') {
        const count = products.filter(
          (p) => p.category.toLowerCase() === c.toLowerCase()
        ).length;
        catMap.set(c, count);
      }
    });

    // Merge any additional categories present in products
    products.forEach((p) => {
      if (p.category && !catMap.has(p.category)) {
        const count = products.filter(
          (item) => item.category.toLowerCase() === p.category.toLowerCase()
        ).length;
        catMap.set(p.category, count);
      }
    });

    return Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
      icon: getCategoryIcon(name)
    }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();

        const query = localSearch.trim().toLowerCase();
        const matchesSearch =
          query === '' ||
          p.name.toLowerCase().includes(query) ||
          (p.nameBn && p.nameBn.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
      });
  }, [products, selectedCategory, localSearch, sortBy]);

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setIsCategoryMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28 sm:pb-24">
      {/* Top Header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/90 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back button & Page Title */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setView('home')}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1 active:scale-95"
              aria-label="Back to Home"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs font-bold hidden xs:inline">হোম</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>সকল পণ্যসমূহ</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  {filteredProducts.length}
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                নির্বাচিত ক্যাটাগরি: <strong className="text-slate-800">{selectedCategory === 'All' ? 'সকল ক্যাটাগরি' : selectedCategory}</strong>
              </p>
            </div>
          </div>

          {/* Right: Category Menu Button + Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            {/* CATEGORY MENU BUTTON (Directly fulfills user request) */}
            <button
              id="category-menu-toggle-btn"
              onClick={() => setIsCategoryMenuOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-rose-600/30 active:scale-95 transition-all"
              aria-label="Open Category Menu"
            >
              <Layers className="w-4 h-4 stroke-[2.2]" />
              <span>ক্যাটাগরি মেনু</span>
              {selectedCategory !== 'All' && (
                <span className="w-2 h-2 rounded-full bg-amber-300 ring-2 ring-rose-700" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="পণ্য সাজান"
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 sm:py-2 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <option value="featured">জনপ্রিয়তা (Hot)</option>
                <option value="newest">নতুন পণ্য (Newest)</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
                <option value="rating">রেটিং (Rating)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="পণ্য বা ব্র্যান্ডের নাম দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-9 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Quick Category Chips (Mobile / Tablet quick access) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-2.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs select-none">
          {categoryList.slice(0, 10).map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleSelectCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name === 'All' ? 'সবগুলো' : cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setIsCategoryMenuOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-full whitespace-nowrap text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 shrink-0"
          >
            <span>আরও ক্যাটাগরি...</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Desktop: Left Category Sidebar + Right Product Grid) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        <div className="flex items-start gap-6">
          {/* Desktop Category Menu Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-36 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  সকল ক্যাটাগরি
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {categoryList.length} টি
              </span>
            </div>

            <div className="space-y-1 mt-3 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
              {categoryList.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{cat.name === 'All' ? 'সব পণ্য (All)' : cat.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1 ${
                        isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedCategory !== 'All' && (
              <button
                onClick={() => handleSelectCategory('All')}
                className="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>ফিল্টার মুছুন (Clear)</span>
              </button>
            )}
          </aside>

          {/* Right Area: Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Indicators */}
            {(selectedCategory !== 'All' || localSearch) && (
              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">ফিল্টার:</span>
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200">
                      <span>ক্যাটাগরি: {selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="hover:text-rose-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {localSearch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
                      <span>খোঁজা হচ্ছে: "{localSearch}"</span>
                      <button
                        onClick={() => {
                          setLocalSearch('');
                          setSearchQuery('');
                        }}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="text-rose-600 hover:text-rose-700 font-bold text-[11px] underline underline-offset-2 ml-auto"
                >
                  সব রিসেট করুন
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  কোনো পণ্য খুঁজে পাওয়া যায়নি!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  অন্য কোনো ক্যাটাগরি বা কি-ওয়ার্ড দিয়ে খুঁজে দেখুন অথবা সব পণ্য ব্রাউজ করুন।
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  সব পণ্যসমূহ প্রদর্শন করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE-OUT CATEGORY MENU DRAWER (User requested: "site a akta menu thakbe click korleall catagory show hobe") */}
      {/* ========================================================================= */}
      {isCategoryMenuOpen && (
        <div className="fixed inset-0 z-50 flex select-none">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsCategoryMenuOpen(false)}
          />

          {/* Drawer Panel from Left */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm">
                  <Layers className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">সকল ক্যাটাগরি মেনু</h3>
                  <p className="text-[10px] text-slate-300">
                    মোট {categoryList.length} টি ক্যাটাগরি রয়েছে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Items List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100">
              {categoryList.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectCategory(cat.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                      isSelected
                        ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200/80 shadow-2xs'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">
                          {cat.name === 'All' ? 'সব পণ্য (All Products)' : cat.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {cat.count} টি পণ্য এভেইলেবল
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => handleSelectCategory('All')}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors text-center"
              >
                সব পণ্য দেখুন ({products.length})
              </button>
              <button
                onClick={() => setIsCategoryMenuOpen(false)}
                className="py-2.5 px-4 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
