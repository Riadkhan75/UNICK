import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/initialData';
import {
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Watch,
  Smartphone,
  Laptop,
  Shirt,
  Sparkles,
  ShoppingBag,
  Home as HomeIcon,
  Briefcase,
  Layers,
  Heart,
  Glasses
} from 'lucide-react';

interface DisplayCategory {
  id: string;
  name: string;
  nameBn: string;
  filterValue: string;
  icon: React.ElementType;
}

const getCategoryDetails = (catName: string): { nameBn: string; icon: React.ElementType } => {
  const lower = catName.toLowerCase();
  if (lower === 'all') return { nameBn: 'সব পণ্য', icon: LayoutGrid };
  if (lower.includes('electr')) return { nameBn: 'ইলেকট্রনিক্স', icon: Headphones };
  if (lower.includes('gadget')) return { nameBn: 'স্মার্ট গ্যাজেট', icon: Watch };
  if (lower.includes('fash') || lower.includes('cloth') || lower.includes('wear'))
    return { nameBn: 'ফ্যাশন ও ক্লদিং', icon: Shirt };
  if (lower.includes('bag') || lower.includes('luggage'))
    return { nameBn: 'ব্যাগ ও লাগেজ', icon: Briefcase };
  if (lower.includes('foot') || lower.includes('shoe'))
    return { nameBn: 'জুতো ও ফুটওয়্যার', icon: Sparkles };
  if (lower.includes('watch')) return { nameBn: 'ঘড়ি কালেকশন', icon: Watch };
  if (lower.includes('audio') || lower.includes('sound') || lower.includes('ear'))
    return { nameBn: 'অডিও ও সাউন্ড', icon: Headphones };
  if (lower.includes('comp') || lower.includes('lap'))
    return { nameBn: 'কম্পিউটার ও অফিস', icon: Laptop };
  if (lower.includes('phone') || lower.includes('mobile'))
    return { nameBn: 'মোবাইল এক্সেসরিজ', icon: Smartphone };
  if (lower.includes('home') || lower.includes('living'))
    return { nameBn: 'হোম ও লাইফস্টাইল', icon: HomeIcon };
  if (lower.includes('health') || lower.includes('beauty'))
    return { nameBn: 'হেলথ ও কেয়ার', icon: Heart };
  return { nameBn: catName, icon: ShoppingBag };
};

export const ShopByCategory: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, setSearchQuery, setView } = useStore();
  const [currentPage, setCurrentPage] = useState(0);

  // Dynamically assemble all categories present in the store and products
  const categoryList: DisplayCategory[] = useMemo(() => {
    const list: DisplayCategory[] = [];
    const addedNames = new Set<string>();

    const addCategory = (name: string, filterVal: string) => {
      if (addedNames.has(name.toLowerCase())) return;
      addedNames.add(name.toLowerCase());
      const meta = getCategoryDetails(name);
      list.push({
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name,
        nameBn: meta.nameBn,
        filterValue: filterVal,
        icon: meta.icon
      });
    };

    // Standard categories from initial setup
    CATEGORIES.forEach((c) => {
      if (c !== 'All') {
        addCategory(c, c);
      }
    });

    // Also include standard essential e-commerce categories if not present
    ['Electronics', 'Gadgets', 'Fashion', 'Bags', 'Footwear', 'Watches', 'Audio', 'Home & Living', 'Computer & Office'].forEach(
      (c) => addCategory(c, c)
    );

    // Merge any custom category present in products (e.g. added by admin)
    products.forEach((p) => {
      if (p.category && p.category.trim() !== '') {
        addCategory(p.category.trim(), p.category.trim());
      }
    });

    // Finally add 'All Products' category option
    addCategory('All Categories', 'All');

    return list;
  }, [products]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(categoryList.length / itemsPerPage));

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleCategoryClick = (cat: DisplayCategory) => {
    setSelectedCategory(cat.filterValue);
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAllProducts = () => {
    setView('all-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleItems = categoryList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="px-3 sm:px-4 max-w-7xl mx-auto pt-2">
      {/* White rounded card container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 relative select-none">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {/* Red rounded square with grid icon */}
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/60 shrink-0">
              <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                Shop by Category
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">পণ্য ব্রাউজ করতে ক্যাটাগরি বেছে নিন</p>
            </div>
          </div>

          <button
            onClick={handleOpenAllProducts}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 transition-colors group"
          >
            <span>সকল ক্যাটাগরি</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories Grid Container with Floating Nav Arrows */}
        <div className="relative pt-4 pb-2">
          {totalPages > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                onClick={prevPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-3 w-8 h-8 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all z-10 active:scale-95"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={nextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-3 w-8 h-8 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all z-10 active:scale-95"
                aria-label="Next categories"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* 4 items per row, 2 rows grid (8 items per page, exactly as reference) */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2 sm:gap-4 px-2">
            {visibleItems.map((cat) => {
              const Icon = cat.icon;
              const isSelected =
                (selectedCategory.toLowerCase() === cat.filterValue.toLowerCase() &&
                  selectedCategory !== 'All') ||
                (cat.filterValue === 'All' && selectedCategory === 'All');

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex flex-col items-center group focus:outline-none text-center"
                >
                  {/* Circular light background icon container */}
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400 scale-105'
                        : 'bg-slate-100/90 text-slate-700 group-hover:bg-slate-200/90 group-hover:text-slate-900 group-active:scale-95'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  {/* Category Name centered with 2 lines support */}
                  <span
                    className={`mt-2 text-[11px] leading-tight text-center line-clamp-2 max-w-[76px] transition-colors ${
                      isSelected
                        ? 'font-bold text-rose-600'
                        : 'text-slate-700 group-hover:text-slate-900 font-medium'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots (Only if multiple pages) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3 pb-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                aria-label={`Page ${idx + 1}`}
                className={`transition-all duration-200 ${
                  currentPage === idx
                    ? 'w-5 h-1.5 bg-slate-800 rounded-full'
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All Categories Link Button */}
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            onClick={handleOpenAllProducts}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 py-1 transition-colors"
          >
            <span>View All Categories & Products</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
