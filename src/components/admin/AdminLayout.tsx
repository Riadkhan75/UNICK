import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Store,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { clearAdminSession } from '../../utils/adminAuth';

export const AdminLayout: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setView,
    setIsAdminLoggedIn,
    settings,
    orders,
    showToast
  } = useStore();

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const handleLogout = () => {
    clearAdminSession();
    setIsAdminLoggedIn(false);
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // fallback
    }
    setView('home');
    showToast('অ্যাডমিন সেশন সফলভাবে লগআউট হয়েছে');
  };

  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'dashboard',
      label: 'ড্যাশবোর্ড (Overview)',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      tab: 'orders',
      label: 'অর্ডারসমূহ (Orders)',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      tab: 'products',
      label: 'পণ্যসমূহ (Products)',
      icon: <Package className="w-4 h-4" />,
    },
    {
      tab: 'settings',
      label: 'স্টোর সেটিংস (Settings)',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
            NS
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">
              {settings.storeName} — অ্যাডমিন প্যানেল
            </h1>
            <p className="text-[11px] text-slate-400">ম্যানেজমেন্ট ও কন্ট্রোল ড্যাশবোর্ড</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setView('home')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Store className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">স্টোরফ্রন্টে যান</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border border-rose-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Pills for Mobile */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => setAdminTab(item.tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === item.tab
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {item.icon}
            <span>{item.label.split(' ')[0]}</span>
            {item.badge && (
              <span className="w-4 h-4 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:col-span-3 bg-white rounded-3xl border border-slate-200 p-4 space-y-2 shadow-2xs sticky top-24">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2">
            প্রধান মেন্যু
          </p>
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setAdminTab(item.tab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                adminTab === item.tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    adminTab === item.tab
                      ? 'bg-white text-blue-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-100 px-3 space-y-2">
            <button
              onClick={() => setView('home')}
              className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center justify-between"
            >
              <span>ওয়েবসাইটে ফিরুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="md:col-span-9">
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
