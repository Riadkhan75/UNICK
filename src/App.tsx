import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BottomNavigation } from './components/BottomNavigation';
import { CustomerModal } from './components/CustomerModal';
import { HomeView } from './components/views/HomeView';
import { ProductView } from './components/views/ProductView';
import { CheckoutView } from './components/views/CheckoutView';
import { OrderSuccessView } from './components/views/OrderSuccessView';
import { TrackOrderView } from './components/views/TrackOrderView';
import { AllProductsView } from './components/views/AllProductsView';
import { AdminRiadPortal } from './components/admin/AdminRiadPortal';
import { isAdminRiadRoute } from './utils/adminAuth';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

const StoreContent: React.FC = () => {
  const { view, setView, toast, settings } = useStore();

  // Listen to hidden /adminriad route
  useEffect(() => {
    const checkRoute = () => {
      if (isAdminRiadRoute()) {
        setView('admin');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [setView]);

  // If on admin route or admin view, render AdminRiadPortal
  if (view === 'admin' || isAdminRiadRoute()) {
    return (
      <>
        <AdminRiadPortal />
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 selection:bg-rose-600 selection:text-white">
      {/* Customer Header without Admin Link */}
      <Header />

      {/* Main View Display with safe bottom padding */}
      <main className="flex-1">
        {view === 'home' && <HomeView />}
        {view === 'all-products' && <AllProductsView />}
        {view === 'product' && <ProductView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'order-success' && <OrderSuccessView />}
        {view === 'track-order' && <TrackOrderView />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Customer Login / Profile Modal */}
      <CustomerModal />

      {/* Customer Footer */}
      <Footer />

      {/* Fixed Mobile Bottom Navigation (Visible on mobile, elevated LOGIN center button) */}
      <BottomNavigation />

      {/* Floating WhatsApp Quick Contact Button (Floats safely above bottom nav on mobile) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30 print:hidden">
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            `হ্যালো ${settings.storeName}! আমি কিছু পণ্য সম্পর্কে জানতে চাচ্ছি।`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
          title="হোয়াটসঅ্যাপে চ্যাট করুন"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold">
            হোয়াটসঅ্যাপ সাপোর্ট
          </span>
        </a>
      </div>

      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
