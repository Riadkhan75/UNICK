import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CheckCircle,
  Printer,
  Truck,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Phone,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const {
    orders,
    activeOrderId,
    setView,
    setTrackingSearchParam,
    settings
  } = useStore();

  const order = orders.find((o) => o.id === activeOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">কোনো অর্ডার পাওয়া যায়নি!</h2>
        <button
          onClick={() => setView('home')}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleTrackThisOrder = () => {
    setTrackingSearchParam(order.id);
    setView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = encodeURIComponent(
    `হ্যালো ${settings.storeName}! আমি এইমাত্র একটি অর্ডার করেছি।\nঅর্ডার আইডি: ${order.id}\nনাম: ${order.customer.fullName}\nফোন: ${order.customer.phone}\nমোট বিল: ${settings.currencySymbol}${order.total}\nঅনুগ্রহ করে অর্ডারটি দ্রুত পাঠিয়ে দিন।`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Success Top Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
          অর্ডার গৃহীত হয়েছে
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          ধন্যবাদ! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।
        </p>
        <div className="pt-2">
          <span className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono text-sm sm:text-base font-extrabold text-emerald-900 shadow-2xs">
            অর্ডার ট্র্যাকিং আইডি: {order.id}
          </span>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div id="invoice-print-area" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{settings.storeName}</h2>
            <p className="text-xs text-slate-500">{settings.storeTagline}</p>
            <p className="text-xs text-slate-500 mt-0.5">হটলাইন: {settings.phone}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ইনভয়েস</span>
            <p className="text-sm font-bold text-slate-900">#{order.id}</p>
            <p className="text-xs text-slate-500">{order.createdAt}</p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl text-xs">
          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>গ্রাহকের তথ্য (Customer Details)</span>
            </h4>
            <p className="font-semibold text-slate-800">{order.customer.fullName}</p>
            <p className="text-slate-600">ফোন: {order.customer.phone}</p>
            {order.customer.notes && (
              <p className="text-slate-500 italic mt-1">নোট: {order.customer.notes}</p>
            )}
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>ডেলিভারি ঠিকানা (Shipping Address)</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">{order.customer.address}</p>
            <p className="text-slate-500 mt-1">
              এলাকা: {order.deliveryZone === 'inside' ? 'ঢাকা সিটির ভেতরে' : 'ঢাকা সিটির বাইরে'}
            </p>
            <p className="text-slate-500">
              পেমেন্ট মাধ্যম: <strong className="uppercase text-slate-800">{order.paymentMethod}</strong>
              {order.paymentTrxId && ` (TrxID: ${order.paymentTrxId})`}
            </p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            অর্ডারকৃত পণ্যসমূহ
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500 text-[11px]">
                      পরিমাণ: {item.quantity} x {settings.currencySymbol}{item.price}
                      {item.selectedColor && ` | ${item.selectedColor}`}
                      {item.selectedSize && ` | ${item.selectedSize}`}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">
                  {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Price Calculations */}
        <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>পণ্য সাবটোটাল:</span>
            <span className="font-bold text-slate-900">{settings.currencySymbol}{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>ডেলিভারি চার্জ:</span>
            <span className="font-bold text-slate-900">{settings.currencySymbol}{order.deliveryCharge}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>ছাড়:</span>
              <span>-{settings.currencySymbol}{order.discount}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-black text-slate-900">
            <span>মোট প্রদেয় বিল:</span>
            <span className="text-emerald-700">{settings.currencySymbol}{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>রশিদ প্রিন্ট করুন</span>
        </button>

        <button
          onClick={handleTrackThisOrder}
          className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Truck className="w-4 h-4" />
          <span>অর্ডার ট্র্যাক করুন</span>
        </button>

        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs text-center"
        >
          <MessageCircle className="w-4 h-4" />
          <span>হোয়াটসঅ্যাপ মেসেজ</span>
        </a>

        <button
          onClick={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>আরও কেনাকাটা</span>
        </button>
      </div>
    </div>
  );
};
