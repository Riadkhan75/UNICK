import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Phone,
  MessageCircle,
  Plus,
  Minus
} from 'lucide-react';

export const ProductView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setView,
    addToCart,
    placeOrder,
    settings,
    showToast
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Component state
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');

  // Direct checkout form state on product page (1-Click COD Order)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
        <button
          onClick={() => setView('home')}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  const deliveryCost =
    deliveryZone === 'inside'
      ? settings.deliveryChargeInside
      : settings.deliveryChargeOutside;
  const directSubtotal = product.price * quantity;
  const directTotal = directSubtotal + deliveryCost;

  const handleDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('অনুগ্রহ করে আপনার নাম লিখুন');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      showToast('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    if (!customerAddress.trim()) {
      showToast('অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা দিন');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customer: {
          fullName: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          city: deliveryZone === 'inside' ? 'ঢাকা' : 'ঢাকার বাইরে',
        },
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            selectedColor,
            selectedSize,
          },
        ],
        subtotal: directSubtotal,
        deliveryCharge: deliveryCost,
        deliveryZone: deliveryZone,
        discount: 0,
        total: directTotal,
        paymentMethod: 'cod',
      });
      setIsSubmitting(false);
    }, 400);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back to Home Button */}
      <div>
        <button
          onClick={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </button>
      </div>

      {/* Main Product Showcase & 1-Click COD Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-96 w-auto object-contain transition-transform hover:scale-105 duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                -{discountPercent}% ছাড়
              </span>
            )}
            <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-lg">
              স্টকে আছে ({product.stock} টি)
            </span>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">ক্যাশ অন ডেলিভারি</p>
              <p className="text-[10px] text-slate-500">পণ্য দেখে টাকা দিন</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">সারা দেশে ডেলিভারি</p>
              <p className="text-[10px] text-slate-500">২৪-৭২ ঘণ্টায়</p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & 1-Click Order Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="font-bold text-slate-800">{product.rating}</span>
                <span className="text-slate-500">({product.reviewCount} টি রিভিউ)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="text-sm font-medium text-slate-500 mt-1">
                {product.nameBn}
              </p>
            )}
          </div>

          {/* Pricing Highlight */}
          <div className="flex items-baseline gap-3 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">অফার মূল্য:</span>
            <span className="text-3xl font-black text-blue-700">
              {settings.currencySymbol}{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-sm text-slate-400 line-through font-semibold">
                  {settings.currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                  সাশ্রয় {settings.currencySymbol}{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Short feature points */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color Selection if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                রং পছন্দ করুন (Color): <span className="text-blue-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedColor === c
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection if available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                সাইজ পছন্দ করুন (Size): <span className="text-blue-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedSize === s
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Standard Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 text-slate-600 hover:bg-slate-100"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-extrabold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2.5 text-slate-600 hover:bg-slate-100"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>কার্টে যোগ করুন</span>
            </button>
          </div>

          {/* PRODUCT DESCRIPTION - PLACED DIRECTLY ABOVE ORDER FORM */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                পণ্যের বিস্তারিত বিবরণ (Product Description)
              </h3>
            </div>
            <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3">
              <p className="whitespace-pre-line">{product.description}</p>
              <div className="bg-white rounded-xl p-3 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5">
                  পণ্যটি কেন আপনার পছন্দ হবে?
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  <li>১০০% জেনুইন ও আসল প্রডাক্টের নিশ্চয়তা।</li>
                  <li>ক্যাশ অন ডেলিভারিতে চেক করে রিসিভ করার সুযোগ।</li>
                  <li>নিরাপদ ও নির্ভরযোগ্য হোম ডেলিভারি সেবা।</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 1-CLICK CASH ON DELIVERY FORM BOX */}
          <div
            id="direct-cod-order-box"
            className="mt-6 bg-gradient-to-b from-amber-50/70 to-orange-50/40 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-md space-y-4"
          >
            <div className="border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4 fill-rose-600" />
                <span>দ্রুত ১-ক্লিকে অর্ডার</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                ক্যাশ অন ডেলিভারিতে অর্ডার করতে তথ্য দিন
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                কোনো অগ্রিম পেমেন্ট লাগবে না। পণ্য হাতে পেয়ে টাকা পরিশোধ করবেন।
              </p>
            </div>

            <form onSubmit={handleDirectOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদাঃ মোঃ তানভীর আহমেদ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-xs text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  সচল মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="উদাঃ 01712345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-xs text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা/উপজেলা) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="উদাঃ বাসা নং ১২, রোড ৫, সেক্টর ৭, উত্তরা, ঢাকা"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                />
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ডেলিভারি এরিয়া নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      deliveryZone === 'inside'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === 'inside'}
                      onChange={() => setDeliveryZone('inside')}
                      className="accent-blue-600"
                    />
                    <span>ঢাকা সিটি (৳{settings.deliveryChargeInside})</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      deliveryZone === 'outside'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === 'outside'}
                      onChange={() => setDeliveryZone('outside')}
                      className="accent-blue-600"
                    />
                    <span>ঢাকার বাইরে (৳{settings.deliveryChargeOutside})</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>পণ্য মূল্য ({quantity} টি):</span>
                  <span className="font-semibold">{settings.currencySymbol}{directSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold">{settings.currencySymbol}{deliveryCost}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-100">
                  <span>সর্বমোট বিল (ক্যাশ অন ডেলিভারি):</span>
                  <span className="text-emerald-700">{settings.currencySymbol}{directTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="direct-confirm-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার নিশ্চিত করুন (Confirm Order)'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Delivery Policy */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            পণ্যের বিবরণ (Description)
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            স্পেসিফিকেশন (Specifications)
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ডেলিভারি ও রিটার্ন নীতি
          </button>
        </div>

        {activeTab === 'desc' && (
          <div className="text-slate-700 text-sm leading-relaxed space-y-4 max-w-4xl">
            <p>{product.description}</p>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <h4 className="font-bold text-slate-900 mb-2">পণ্যটি কেন আপনার পছন্দ হবে?</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                <li>১০০% জেনুইন ও আসল প্রডাক্টের নিশ্চয়তা।</li>
                <li>ক্যাশ অন ডেলিভারিতে চেক করে রিসিভ করার সুযোগ।</li>
                <li>নিরাপদ ও নির্ভরযোগ্য হোম ডেলিভারি সেবা।</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl">
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden text-xs sm:text-sm">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-2 p-3 ${
                    idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <span className="font-bold text-slate-800">{key}</span>
                  <span className="text-slate-600">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 max-w-3xl">
            <p>
              <strong>ডেলিভারি সময়সীমা:</strong> ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন করা হয়। ঢাকা সিটির বাইরে ২ থেকে ৩ কার্যদিবস সময় লাগতে পারে।
            </p>
            <p>
              <strong>রিটার্ন পলিসি:</strong> ডেলিভারির সময় ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করে নিবেন। পণ্য ভাঙা বা ভুল থাকলে তাৎক্ষণিক রিটার্ন করতে পারবেন। কোনো হিডেন চার্জ নেই।
            </p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-extrabold text-slate-900">
            আরও সম্পর্কিত পণ্য (Related Products)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
