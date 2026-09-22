import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  Package,
  User,
  ShoppingCart,
  LayoutGrid
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const {
    view,
    setView,
    cartItemCount,
    setIsCartOpen,
    customerUser,
    setIsCustomerModalOpen
  } = useStore();

  const handleNavHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavOrders = () => {
    setView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavAllProducts = () => {
    setView('all-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavCart = () => {
    setIsCartOpen(true);
  };

  const handleNavProfile = () => {
    setIsCustomerModalOpen(true);
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden select-none"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-end h-16 px-1 relative">
        {/* 1. Home */}
        <button
          onClick={handleNavHome}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            view === 'home'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${view === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* 2. Orders */}
        <button
          onClick={handleNavOrders}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            view === 'track-order'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Orders"
        >
          <Package className={`w-5 h-5 ${view === 'track-order' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Orders</span>
        </button>

        {/* 3. CENTER BIG ELEVATED ALL PRODUCTS BUTTON */}
        <div className="flex flex-col items-center justify-center relative -top-3">
          <button
            onClick={handleNavAllProducts}
            className={`relative w-14 h-14 rounded-full text-white flex items-center justify-center ring-4 ring-white active:scale-95 transition-all group ${
              view === 'all-products'
                ? 'bg-gradient-to-tr from-rose-700 to-red-600 shadow-xl shadow-rose-600/50 scale-105'
                : 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-lg shadow-rose-600/40'
            }`}
            aria-label="All Products"
          >
            {/* Subtle soft pulse glow */}
            <span className="absolute -inset-1 rounded-full bg-rose-500/25 blur-xs group-hover:bg-rose-500/40 transition-all pointer-events-none" />

            <LayoutGrid className="w-6 h-6 text-white stroke-[2.3] relative z-10" />
          </button>
          <span
            className={`text-[9.5px] mt-0.5 tracking-tight font-bold ${
              view === 'all-products' ? 'text-rose-600' : 'text-slate-800'
            }`}
          >
            All Products
          </span>
        </div>

        {/* 4. Cart */}
        <button
          onClick={handleNavCart}
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-800 transition-colors relative"
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-2" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Cart</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={handleNavProfile}
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Profile"
        >
          <div className="relative">
            <User className="w-5 h-5 stroke-2" />
            {customerUser && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
