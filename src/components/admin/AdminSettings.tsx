import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Save,
  RotateCcw,
  CheckCircle,
  Store,
  Truck,
  Phone,
  Lock,
  Megaphone,
  CreditCard,
  Database,
  Tag
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToDefaults, showToast, isFirebaseConnected } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeTagline, setStoreTagline] = useState(settings.storeTagline);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [currencyCode, setCurrencyCode] = useState(settings.currencyCode);
  const [deliveryChargeInside, setDeliveryChargeInside] = useState(settings.deliveryChargeInside);
  const [deliveryChargeOutside, setDeliveryChargeOutside] = useState(settings.deliveryChargeOutside);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(settings.freeDeliveryThreshold);
  const [noticeBarText, setNoticeBarText] = useState(settings.noticeBarText);
  const [noticeBarActive, setNoticeBarActive] = useState(settings.noticeBarActive);
  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber);
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber);

  // Discount offer settings
  const [discountOfferActive, setDiscountOfferActive] = useState(settings.discountOfferActive || false);
  const [discountOfferTitle, setDiscountOfferTitle] = useState(settings.discountOfferTitle || 'স্পেশাল ডিসকাউন্ট অফার');
  const [discountOfferSubtitle, setDiscountOfferSubtitle] = useState(
    settings.discountOfferSubtitle || 'চেকআউটে কুপন কোড ব্যবহার করে তাৎক্ষণিক ১০০ টাকা অতিরিক্ত ছাড় পান।'
  );
  const [discountOfferCoupon, setDiscountOfferCoupon] = useState(settings.discountOfferCoupon || 'SAVE100');
  const [discountOfferAmount, setDiscountOfferAmount] = useState(settings.discountOfferAmount || 100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeName.trim(),
      storeTagline: storeTagline.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      currencySymbol: currencySymbol.trim(),
      currencyCode: currencyCode.trim(),
      deliveryChargeInside: Number(deliveryChargeInside),
      deliveryChargeOutside: Number(deliveryChargeOutside),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      noticeBarText: noticeBarText.trim(),
      noticeBarActive,
      bkashNumber: bkashNumber.trim(),
      nagadNumber: nagadNumber.trim(),
      discountOfferActive,
      discountOfferTitle: discountOfferTitle.trim(),
      discountOfferSubtitle: discountOfferSubtitle.trim(),
      discountOfferCoupon: discountOfferCoupon.trim(),
      discountOfferAmount: Number(discountOfferAmount)
    });
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'আপনি কি নিশ্চিত যে সব ডেটা রিসেট করে ডিফল্ট ডেমো পণ্য ও অর্ডারে ফিরিয়ে নিতে চান?'
      )
    ) {
      resetToDefaults();
      setStoreName(settings.storeName);
      setPhone(settings.phone);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            স্টোর সেটিংস (Store Settings)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            দোকানের নাম, যোগাযোগের তথ্য, ডেলিভারি চার্জ এবং পেমেন্ট সেটিংস পরিবর্তন করুন।
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              সাধারণ তথ্য (General Information)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">দোকানের নাম</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">ট্যাগলাইন / স্লোগান</label>
              <input
                type="text"
                value={storeTagline}
                onChange={(e) => setStoreTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">হটলাইন ফোন নম্বর</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">হোয়াটসঅ্যাপ নম্বর</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">সাপোর্ট ইমেইল</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">ঠিকানা / লোকেশন</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Shipping Rates */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              ডেলিভারি চার্জ ও কারেন্সি (Shipping & Currency)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">কারেন্সি চিহ্ন</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-bold text-base text-blue-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                ঢাকা সিটি ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryChargeInside}
                onChange={(e) => setDeliveryChargeInside(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryChargeOutside}
                onChange={(e) => setDeliveryChargeOutside(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-bold"
              />
            </div>
          </div>

          <div className="text-xs pt-2">
            <label className="block font-bold text-slate-800 mb-1">
              ফ্রি ডেলিভারি পাওয়ার সর্বনিম্ন ক্রয়ের পরিমাণ (৳)
            </label>
            <input
              type="number"
              min="0"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
              className="max-w-xs w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-bold text-emerald-700"
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                শীর্ষ ব্যানার নোটিশ (Top Notice Bar)
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={noticeBarActive}
                onChange={(e) => setNoticeBarActive(e.target.checked)}
                className="accent-blue-600"
              />
              <span>ব্যানার চালু রাখুন</span>
            </label>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-800 mb-1">নোটিশ বার্তা</label>
            <textarea
              rows={2}
              value={noticeBarText}
              onChange={(e) => setNoticeBarText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Special Discount Offer Banner Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  ডিসকাউন্ট অফার ব্যানার সেটিংস (Special Discount Offer Banner)
                </h3>
                <p className="text-[11px] text-slate-500">
                  চালু করলে হোম পেজে বিশেষ ডিসকাউন্ট/কুপন অফার ব্যানার প্রদর্শিত হবে
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              <input
                type="checkbox"
                checked={discountOfferActive}
                onChange={(e) => setDiscountOfferActive(e.target.checked)}
                className="accent-rose-600 w-4 h-4"
              />
              <span className="text-rose-700">অফার ব্যানার চালু রাখুন</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">অফারের শিরোনাম (Title)</label>
              <input
                type="text"
                value={discountOfferTitle}
                onChange={(e) => setDiscountOfferTitle(e.target.value)}
                placeholder="যেমন: যেকোনো অর্ডারে প্রোমো কোড ব্যবহার করুন!"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">কুপন কোড (Coupon Code)</label>
              <input
                type="text"
                value={discountOfferCoupon}
                onChange={(e) => setDiscountOfferCoupon(e.target.value.toUpperCase())}
                placeholder="যেমন: SAVE100"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-mono font-bold uppercase text-rose-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">অফারের বিবরণ (Subtitle / Description)</label>
              <input
                type="text"
                value={discountOfferSubtitle}
                onChange={(e) => setDiscountOfferSubtitle(e.target.value)}
                placeholder="যেমন: চেকআউটে কুপন কোড ব্যবহার করে অতিরিক্ত ছাড় উপভোগ করুন।"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">ছাড়ের পরিমাণ (৳ Discount Amount)</label>
              <input
                type="number"
                min="0"
                value={discountOfferAmount}
                onChange={(e) => setDiscountOfferAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Payment Account Numbers */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              মোবাইল ব্যাংকিং মার্চেন্ট অ্যাকাউন্ট
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">বিকাশ (bKash) নম্বর</label>
              <input
                type="text"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">নগদ (Nagad) নম্বর</label>
              <input
                type="text"
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Admin Portal Security Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              অ্যাডমিন পোর্টাল সিকিউরিটি (Portal Security)
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>হিডেন রাউট:</span>
                <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  /adminriad
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                অ্যাডমিন প্যানেলটি সাধারণ ভিজিটরদের কাছ থেকে সম্পূর্ণ লুকানো। শুধুমাত্র /adminriad দিয়ে অ্যাক্সেসযোগ্য।
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">সেশন-ভিত্তিক ক্রিপ্টোগ্রাফিক সুরক্ষা সক্রিয়</p>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">
                  লগইন তথ্য সোর্স কোডে উন্মুক্ত নয়। লগইন ছাড়া যেকোনো ব্যক্তি অ্যাক্সেস করলে স্বয়ংক্রিয়ভাবে “অ্যাক্সেস ডিনাইড” দেখানো হয়।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Firebase Cloud Database Status */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                ফায়ারবেস ক্লাউড ডাটাবেজ (Firebase Firestore)
              </h3>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isFirebaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isFirebaseConnected ? 'সক্রিয় ও সংযুক্ত (Connected)' : 'কানেক্ট হচ্ছে...'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs uppercase font-bold tracking-wider mb-1">
                প্রজেক্ট আইডি (Project ID)
              </span>
              <span className="font-mono font-bold text-slate-800">integrated-nova-mj4jh</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs uppercase font-bold tracking-wider mb-1">
                ডাটাবেজ ইঞ্জিন
              </span>
              <span className="font-semibold text-slate-800">Cloud Firestore (Real-time)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs uppercase font-bold tracking-wider mb-1">
                কালেকশনসমূহ (Collections)
              </span>
              <span className="font-mono text-blue-600 font-semibold">products, orders, settings</span>
            </div>
          </div>
          <p className="text-2xs text-slate-500">
            * সব পণ্য, কাস্টমারদের নতুন অর্ডার এবং স্টোর সেটিংস সরাসরি গুগল ক্লাউড ফায়ারবেস ডাটাবেজে রিয়েল-টাইমে সংরক্ষিত হচ্ছে।
          </p>
        </div>

        {/* Save button and Reset button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>সব সেটিংস সেভ করুন</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="w-full sm:w-auto px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ডিফল্ট ডেমো ডেটা রিস্টোর করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
