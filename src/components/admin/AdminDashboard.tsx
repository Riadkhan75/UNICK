import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
  Eye,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    setAdminTab,
    updateOrderStatus,
    settings,
    isFirebaseConnected,
  } = useStore();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const processingOrders = orders.filter((o) => o.status === 'processing');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const recentOrders = orders.slice(0, 5);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-slate-900">
              অ্যাডমিন ড্যাশবোর্ড ওভারভিউ
            </h2>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold border ${
                isFirebaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isFirebaseConnected ? 'Firebase Live' : 'Connecting Cloud...'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            স্টোরের সামগ্রিক বিক্রি, নতুন অর্ডার এবং ইনভেন্টরি পরিস্থিতি একনজরে দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('products')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              মোট বিক্রয় (Revenue)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            সক্রিয় অর্ডারের সর্বমোট মূল্য
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              সর্বমোট অর্ডার
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {orders.length} টি
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">
            সর্বমোট অর্ডারের সংখ্যা
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              পেন্ডিং অর্ডার (Pending)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">
            {pendingOrders.length} টি
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            কনফার্মেশন অপেক্ষায় রয়েছে
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              কম স্টকের পণ্য
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">
            {lowStockProducts.length} টি
          </p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            ৫ টির কম স্টক রয়েছে
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
            </h3>
            <p className="text-xs text-slate-500">
              সর্বশেষ ৫টি অর্ডার ও দ্রুত স্ট্যাটাস পরিবর্তন
            </p>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>সব অর্ডার দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            বর্তমানে কোনো অর্ডার নেই।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">অর্ডার আইডি</th>
                  <th className="p-3">তারিখ</th>
                  <th className="p-3">গ্রাহকের নাম ও ফোন</th>
                  <th className="p-3">মোট টাকা</th>
                  <th className="p-3">পেমেন্ট</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 rounded-r-xl text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {ord.id}
                    </td>
                    <td className="p-3 text-slate-500">
                      {ord.createdAt}
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{ord.customer.fullName}</p>
                      <p className="text-[11px] text-slate-500">{ord.customer.phone}</p>
                    </td>
                    <td className="p-3 font-extrabold text-slate-900">
                      {settings.currencySymbol}{ord.total.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="uppercase font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as OrderStatus)
                        }
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inventory & Low Stock Highlight */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ইনভেন্টরি স্ট্যাটাস (Inventory Overview)
            </h3>
            <p className="text-xs text-slate-500">
              মোট পণ্য: {products.length} টি
            </p>
          </div>
          <button
            onClick={() => setAdminTab('products')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>পণ্য ব্যবস্থাপনা</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-12 h-12 object-contain bg-white rounded-xl border border-slate-200 p-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                <p className="text-[11px] text-slate-500">{settings.currencySymbol}{p.price}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      p.stock > 5 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-slate-700">
                    স্টক: {p.stock} টি {p.stock <= 5 && <strong className="text-rose-600">(কম স্টক)</strong>}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
