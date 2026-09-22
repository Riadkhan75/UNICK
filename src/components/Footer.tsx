import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setView } = useStore();

  const handleNav = (targetView: 'home' | 'track-order') => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">দ্রুত ডেলিভারি</h4>
              <p className="text-xs text-slate-400 mt-0.5">ঢাকা ২৪-৪৮ ঘণ্টা, সারা দেশে ৩ দিন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-slate-400 mt-0.5">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">১০০% আসল প্রোডাক্ট</h4>
              <p className="text-xs text-slate-400 mt-0.5">জেনুইন ও নিখুঁত কোয়ালিটি নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-slate-400 mt-0.5">যেকোনো সাহায্যে প্রস্তুত আমাদের টিম</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-800">
          {/* Store Info */}
          <div className="space-y-4">
            <img
              src="/assets/images/logo.svg"
              alt={settings.storeName}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.storeTagline}. আমাদের প্রধান লক্ষ্য গ্রাহককে সর্বোত্তম মানের পণ্য এবং দ্রুততম ডেলিভারি নিশ্চিত করা।
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              দ্রুত লিঙ্ক (Quick Links)
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  হোম পেজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('track-order')}
                  className="hover:text-blue-400 transition-colors"
                >
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">
                  রিটার্ন ও রিফান্ড নীতিমালা
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">
                  ডেলিভারি চার্জ সংক্রান্ত তথ্য
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">
                  প্রাইভেসি পলিসি
                </span>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              যোগাযোগ (Customer Care)
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>হটলাইন: {settings.phone} (সকাল ৯টা - রাত ১০টা)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>ইমেইল: {settings.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>ঠিকানা: {settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              পেমেন্ট মাধ্যমসমূহ
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              আমরা ক্যাশ অন ডেলিভারি, বিকাশ এবং নগদ গ্রহণ করি:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-semibold text-emerald-400 border border-slate-700">
                ক্যাশ অন ডেলিভারি (COD)
              </span>
              <span className="px-2.5 py-1 rounded bg-pink-900/30 text-xs font-semibold text-pink-400 border border-pink-700/50">
                বিকাশ (bKash)
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-900/30 text-xs font-semibold text-amber-400 border border-amber-700/50">
                নগদ (Nagad)
              </span>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              ডেলিভারি পার্টনার: <span className="text-slate-300">Steadfast, Pathao & RedX</span>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1 text-slate-400">
            নিরাপদ ই-কমার্স শপিং প্ল্যাটফর্ম
          </p>
        </div>
      </div>
    </footer>
  );
};
