import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Truck,
  Phone,
  Menu,
  X,
  User,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  onOpenAdminLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const {
    view,
    setView,
    settings,
    cartItemCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    customerUser,
    setIsCustomerModalOpen
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    if (view !== 'home') {
      setView('home');
    }
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateTo = (newView: 'home' | 'track-order' | 'all-products') => {
    setView(newView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100">
      {/* Top Announcement Bar */}
      {settings.noticeBarActive && (
        <div id="top-announcement-bar" className="bg-slate-900 text-slate-100 text-xs py-1.5 px-3 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden text-left">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <p className="truncate font-medium text-[11px] sm:text-xs text-slate-200">
                {settings.noticeBarText}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-300 shrink-0">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{settings.phone}</span>
              </a>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => navigateTo('track-order')}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>অর্ডার ট্র্যাক</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bar: Top Row with Hamburger, Big UNICK Shop Name, and Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Left: Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shrink-0 active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center / Brand: BORO KORE SHOP NAME UNICK RIGHT ABOVE SEARCH */}
          <button
            id="brand-logo-btn"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 sm:gap-2.5 focus:outline-none group active:scale-95 transition-all"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="text-left flex flex-col justify-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-wider uppercase leading-none font-sans">
                UNICK
              </span>
              <span className="text-[8px] sm:text-[9.5px] font-extrabold text-rose-600 tracking-widest block uppercase leading-tight mt-0.5">
                ONLINE SHOPPING
              </span>
            </div>
          </button>

          {/* Right Action Icons: Profile & Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Customer Profile / Login Button */}
            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative"
              aria-label="Account / Login"
              title={customerUser ? customerUser.name : 'কাস্টমার লগইন'}
            >
              <User className="w-5 h-5 stroke-[1.8]" />
              {customerUser && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="header-cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Search Bar directly under UNICK shop name */}
        <div className="pb-3 pt-0.5 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white rounded-2xl border border-slate-200/90 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100 transition-all overflow-hidden h-10 px-3.5 shadow-2xs">
              {/* Camera icon */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-400 hover:text-rose-600 mr-2 transition-colors shrink-0"
                title="ক্যামেরা / ইমেজ সার্চ"
              >
                <Camera className="w-4 h-4" />
              </button>

              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0 pointer-events-none" />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="UNICK-এ পণ্য খুঁজুন... (Search in UNICK)"
                className="w-full text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 outline-none pr-1 font-medium"
              />

              {searchInput && (
                <button
                  type="submit"
                  className="text-xs font-bold text-white bg-rose-600 px-3 py-1 rounded-xl hover:bg-rose-700 transition-colors shrink-0 shadow-xs"
                >
                  খুঁজুন
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2.5 animate-in slide-in-from-top-2 duration-150 select-none">
          <button
            onClick={() => navigateTo('home')}
            className="w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center justify-between"
          >
            <span>হোমপেজ (Home)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => navigateTo('all-products')}
            className="w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-rose-600" />
              <span>সকল পণ্যসমূহ (All Products)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => navigateTo('track-order')}
            className="w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-500" />
              <span>অর্ডার ট্র্যাকিং (Track Order)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => {
              setIsCustomerModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>{customerUser ? `প্রোফাইল (${customerUser.name})` : 'কাস্টমার লগইন / সাইন-আপ'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>হটলাইন: {settings.phone}</span>
            <span className="text-emerald-600 font-bold">ক্যাশ অন ডেলিভারি</span>
          </div>
        </div>
      )}
    </header>
  );
};
