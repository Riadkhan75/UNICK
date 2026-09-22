import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Tag,
  Zap,
  Phone,
  Lock,
  Wallet
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    placeOrder,
    setView,
    settings,
    showToast
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা (Dhaka)');
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          আপনার চেকআউট করার মতো কোনো পণ্য কার্টে নেই!
        </h2>
        <p className="text-xs text-slate-500">
          অনুগ্রহ করে প্রথমে পছন্দের পণ্যটি নির্বাচন করে কার্টে যোগ করুন।
        </p>
        <button
          onClick={() => setView('home')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          হোম পেজে পণ্য দেখুন
        </button>
      </div>
    );
  }

  const deliveryCharge =
    deliveryZone === 'inside'
      ? settings.deliveryChargeInside
      : settings.deliveryChargeOutside;

  const grandTotal = Math.max(0, cartTotal + deliveryCharge - appliedDiscount);

  // Handle Coupon Apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'SAVE100') {
      setAppliedDiscount(100);
      setAppliedCoupon('SAVE100');
      showToast('কুপন "SAVE100" সফলভাবে প্রযোজ্য হয়েছে! ১০০ টাকা ছাড়।');
    } else if (code === 'DISCOUNT50') {
      setAppliedDiscount(50);
      setAppliedCoupon('DISCOUNT50');
      showToast('কুপন "DISCOUNT50" প্রযোজ্য হয়েছে! ৫০ টাকা ছাড়।');
    } else {
      showToast('ভুল কুপন কোড! অনুগ্রহ করে সঠিক কোড দিন (যেমন: SAVE100)');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('অনুগ্রহ করে আপনার পুরো নাম লিখুন');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      showToast('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }
    if (!address.trim()) {
      showToast('অনুগ্রহ করে পূর্ণ ডেলিভারি ঠিকানা লিখুন');
      return;
    }
    if (paymentMethod !== 'cod' && !trxId.trim()) {
      showToast('অনুগ্রহ করে বিকাশ বা নগদের TrxID প্রদান করুন');
      return;
    }

    setIsSubmitting(true);

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    }));

    setTimeout(() => {
      placeOrder({
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: deliveryZone === 'inside' ? 'ঢাকা' : district,
          district: district,
          notes: notes.trim(),
        },
        items: orderItems,
        subtotal: cartTotal,
        deliveryCharge,
        deliveryZone,
        discount: appliedDiscount,
        couponCode: appliedCoupon || undefined,
        total: grandTotal,
        paymentMethod,
        paymentTrxId: trxId.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কেনাকাটা চালিয়ে যান</span>
        </button>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          চেকআউট ও অর্ডার কনফার্মেশন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          অর্ডারটি চূড়ান্ত করতে আপনার ডেলিভারি তথ্য নিচে সঠিকভাবে পূরণ করুন।
        </p>
      </div>

      {/* 2-Column Responsive Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            {/* Step 1: Customer Details */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  ১
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  কাস্টমার ও ডেলিভারি তথ্য
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদাঃ মোঃ তানভীর আহমেদ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  সচল মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="উদাঃ 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * ডেলিভারি ম্যান এই নম্বরে ফোন দিয়ে প্রোডাক্ট পৌঁছে দেবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/উপজেলা) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="উদাঃ বাড়ি নং ২৫, রোড ৩, সেক্টর ৯, উত্তরা, ঢাকা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                />
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ডেলিভারি এলাকা নির্বাচন করুন: <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryZone === 'inside'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === 'inside'}
                      onChange={() => setDeliveryZone('inside')}
                      className="accent-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold">ঢাকা সিটির ভেতরে</p>
                      <p className="text-[11px] text-slate-500">চার্জ: ৳{settings.deliveryChargeInside} (২৪-৪৮ ঘণ্টা)</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryZone === 'outside'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === 'outside'}
                      onChange={() => setDeliveryZone('outside')}
                      className="accent-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold">ঢাকা সিটির বাইরে</p>
                      <p className="text-[11px] text-slate-500">চার্জ: ৳{settings.deliveryChargeOutside} (২-৩ দিন)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  ২
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  পেমেন্ট পদ্ধতি নির্বাচন করুন
                </h3>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-emerald-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        ক্যাশ অন ডেলিভারি (Cash on Delivery)
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                        জনপ্রিয়
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      প্রোডাক্ট রিসিভ করে দেখে ডেলিভারি ম্যানের কাছে টাকা পরিশোধ করুন।
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="mt-1 accent-pink-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        বিকাশ পেমেন্ট (bKash)
                      </span>
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-800 text-[10px] font-bold rounded-full">
                        মার্চেন্ট / সেন্ড মানি
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      আমাদের বিকাশ নম্বর {settings.bkashNumber} এ টাকা পাঠিয়ে TrxID প্রদান করুন।
                    </p>
                  </div>
                </label>

                {/* Nagad */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-amber-600 bg-amber-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="mt-1 accent-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      নগদ পেমেন্ট (Nagad)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      আমাদের নগদ নম্বর {settings.nagadNumber} এ টাকা পাঠিয়ে TrxID প্রদান করুন।
                    </p>
                  </div>
                </label>
              </div>

              {/* TrxID Input if bKash or Nagad */}
              {paymentMethod !== 'cod' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    পেমেন্ট TrxID (Transaction ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="উদাঃ 9A82B71X"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-600 focus:bg-white outline-none font-mono uppercase"
                  />
                </div>
              )}
            </div>

            {/* Direct Submit Action on Mobile */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>{isSubmitting ? 'প্রসেস হচ্ছে...' : `অর্ডার কনফার্ম করুন (${settings.currencySymbol}${grandTotal.toLocaleString()})`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs sticky top-28">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>অর্ডার সারসংক্ষেপ (Summary)</span>
              <span className="text-xs font-semibold text-slate-500">
                {cart.reduce((s, i) => s + i.quantity, 0)} টি পণ্য
              </span>
            </h3>

            {/* Cart item list */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1 space-y-2">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 object-contain bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} x {settings.currencySymbol}{item.product.price}
                      {item.selectedColor && ` • ${item.selectedColor}`}
                      {item.selectedSize && ` • ${item.selectedSize}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {settings.currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() =>
                      removeFromCart(
                        item.product.id,
                        item.selectedColor,
                        item.selectedSize
                      )
                    }
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="কুপন কোড (যেমন: SAVE100)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none uppercase font-mono"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                প্রয়োগ
              </button>
            </form>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>সর্বমোট পণ্যের মূল্য (Subtotal):</span>
                <span className="font-bold text-slate-900">
                  {settings.currencySymbol}{cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  ডেলিভারি চার্জ ({deliveryZone === 'inside' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}):
                </span>
                <span className="font-bold text-slate-900">
                  {settings.currencySymbol}{deliveryCharge}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>কুপন ছাড় ({appliedCoupon}):</span>
                  <span>-{settings.currencySymbol}{appliedDiscount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-extrabold">মোট প্রদেয় বিল (Total):</span>
                <span className="text-2xl font-black text-emerald-700">
                  {settings.currencySymbol}{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Desktop Confirm Order Button */}
            <div className="hidden lg:block pt-2">
              <button
                id="checkout-confirm-btn"
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>{isSubmitting ? 'অর্ডার প্রস্তুত হচ্ছে...' : 'অর্ডার নিশ্চিত করুন (Confirm Order)'}</span>
              </button>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>১০০% নিরাপদ ও সুরক্ষিত চেকআউট</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
