import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  Phone,
  ArrowLeft,
  MapPin,
  Calendar
} from 'lucide-react';

export const TrackOrderView: React.FC = () => {
  const {
    orders,
    trackingSearchParam,
    setTrackingSearchParam,
    setView,
    settings
  } = useStore();

  const [inputVal, setInputVal] = useState(trackingSearchParam || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const searchOrder = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setMatchedOrder(null);
      setSearched(false);
      return;
    }

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.customer.phone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '')
    );

    setMatchedOrder(found || null);
    setSearched(true);
  };

  useEffect(() => {
    if (trackingSearchParam) {
      setInputVal(trackingSearchParam);
      searchOrder(trackingSearchParam);
    }
  }, [trackingSearchParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(inputVal);
  };

  const getStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const activeStep = matchedOrder ? getStatusStep(matchedOrder.status) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </button>

        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            অর্ডার ট্র্যাকিং (Track Your Order)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            আপনার অর্ডার ট্র্যাকিং আইডি অথবা ফোন নম্বর দিয়ে অর্ডারের বর্তমান অবস্থা জানুন।
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="অর্ডার আইডি (যেমন: ORD-1234) বা মোবাইল নম্বর..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:border-rose-600 focus:ring-2 focus:ring-rose-100 outline-none shadow-2xs font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors shrink-0"
          >
            ট্র্যাক করুন
          </button>
        </form>
      </div>

      {/* Search Result Display */}
      {searched && !matchedOrder && (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            এই আইডি বা নম্বরে কোনো অর্ডার পাওয়া যায়নি!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            অনুগ্রহ করে অর্ডার আইডির বানান যাচাই করুন অথবা হেল্পলাইনে সরাসরি ফোন দিন।
          </p>
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>সরাসরি কল করুন: {settings.phone}</span>
          </a>
        </div>
      )}

      {matchedOrder && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">অর্ডার নম্বর:</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {matchedOrder.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                    matchedOrder.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : matchedOrder.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : matchedOrder.status === 'processing'
                      ? 'bg-amber-100 text-amber-800'
                      : matchedOrder.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {matchedOrder.status === 'delivered' && 'ডেলিভারি সম্পন্ন'}
                  {matchedOrder.status === 'shipped' && 'কুরিয়ারে হস্তান্তর (ইন-ট্রানজিট)'}
                  {matchedOrder.status === 'processing' && 'প্রসেসিং চলছে'}
                  {matchedOrder.status === 'pending' && 'অর্ডার গৃহীত হয়েছে'}
                  {matchedOrder.status === 'cancelled' && 'বাতিল করা হয়েছে'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                অর্ডার তারিখ: {matchedOrder.createdAt}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">মোট মূল্য:</span>
              <p className="text-xl font-black text-emerald-700">
                {settings.currencySymbol}{matchedOrder.total.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">
                {matchedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : matchedOrder.paymentMethod}
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {matchedOrder.status !== 'cancelled' ? (
            <div className="py-4">
              <div className="relative">
                {/* Connecting bar */}
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                <div
                  className="hidden sm:block absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${((Math.max(1, activeStep) - 1) / 3) * 100}%`,
                  }}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                  {/* Step 1: Placed */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        activeStep >= 1
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">অর্ডার সাবমিট</h4>
                      <p className="text-[10px] text-slate-400">তথ্য গ্রহণ করা হয়েছে</p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        activeStep >= 2
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">প্যাকিং ও প্রসেসিং</h4>
                      <p className="text-[10px] text-slate-400">কোয়ালিটি চেক ও প্যাকিং</p>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        activeStep >= 3
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">কুরিয়ারে হস্তান্তর</h4>
                      <p className="text-[10px] text-slate-400">ডেলিভারির পথে আছে</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        activeStep >= 4
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">ডেলিভারি সম্পন্ন</h4>
                      <p className="text-[10px] text-slate-400">গ্রাহক পণ্য পেয়েছেন</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-800 text-xs font-bold">
              এই অর্ডারটি বাতিল করা হয়েছে। কোনো জিজ্ঞাসা থাকলে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।
            </div>
          )}

          {/* Courier & Shipping Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>কুরিয়ার ও ট্র্যাকিং তথ্য</span>
              </h4>
              <p className="text-slate-700">
                কুরিয়ার পার্টনার: <strong>{matchedOrder.courierName || 'Steadfast Courier'}</strong>
              </p>
              {matchedOrder.courierTrackingCode && (
                <p className="text-slate-700 font-mono mt-0.5">
                  কনসাইনমেন্ট নম্বর: <strong>{matchedOrder.courierTrackingCode}</strong>
                </p>
              )}
              <p className="text-slate-500 mt-1">
                ডেলিভারি এলাকা: {matchedOrder.deliveryZone === 'inside' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>গ্রাহক ও ডেলিভারি ঠিকানা</span>
              </h4>
              <p className="font-semibold text-slate-800">{matchedOrder.customer.fullName}</p>
              <p className="text-slate-600">ফোন: {matchedOrder.customer.phone}</p>
              <p className="text-slate-600 leading-snug mt-0.5">{matchedOrder.customer.address}</p>
            </div>
          </div>

          {/* Items in this order */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              অর্ডারের অন্তর্ভুক্ত পণ্যসমূহ
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {matchedOrder.items.map((item, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between text-xs gap-3">
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
                  <span className="font-bold text-slate-900 shrink-0">
                    {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Need help footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-200">
            <span>অর্ডার নিয়ে কোনো প্রশ্ন বা জরুরি সাহায্য প্রয়োজন?</span>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>কল করুন: {settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
