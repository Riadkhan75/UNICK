import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Eye,
  Trash2,
  Printer,
  X,
  Phone,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    settings,
    showToast
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState('');
  const [courierTracking, setCourierTracking] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      search === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetails = (ord: Order) => {
    setSelectedOrder(ord);
    setCourierName(ord.courierName || '');
    setCourierTracking(ord.courierTrackingCode || '');
  };

  const handleSaveCourierInfo = () => {
    if (selectedOrder) {
      updateOrderStatus(
        selectedOrder.id,
        selectedOrder.status,
        courierName.trim(),
        courierTracking.trim()
      );
      setSelectedOrder({
        ...selectedOrder,
        courierName: courierName.trim(),
        courierTrackingCode: courierTracking.trim(),
      });
      showToast('কুরিয়ার ও ট্র্যাকিং তথ্য সেভ করা হয়েছে');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`আপনি কি সত্যিই অর্ডার #${id} ডিলিট করতে চান?`)) {
      deleteOrder(id);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            অর্ডার ব্যবস্থাপনা (Order Management)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সব অর্ডারের বিবরণ দেখুন, স্ট্যাটাস পরিবর্তন করুন এবং কুরিয়ার ট্র্যাকিং কোড যুক্ত করুন।
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          মোট অর্ডার: <strong className="text-slate-900">{orders.length} টি</strong>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st === 'all' ? 'সব অর্ডার' : st}
              </button>
            )
          )}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="আইডি, নাম বা মোবাইল নম্বর..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            কোনো অর্ডার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">অর্ডার আইডি</th>
                  <th className="p-3.5">তারিখ</th>
                  <th className="p-3.5">কাস্টমার তথ্য</th>
                  <th className="p-3.5">মোট মূল্য</th>
                  <th className="p-3.5">পেমেন্ট</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {ord.id}
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {ord.createdAt}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{ord.customer.fullName}</p>
                      <p className="text-[11px] text-slate-500">{ord.customer.phone}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{ord.customer.address}</p>
                    </td>
                    <td className="p-3.5 font-black text-slate-900 whitespace-nowrap">
                      {settings.currencySymbol}{ord.total.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="uppercase font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                        {ord.paymentMethod}
                      </span>
                      {ord.paymentTrxId && (
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Trx: {ord.paymentTrxId}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none capitalize ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.status === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : ord.status === 'processing'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(ord)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিস্তারিত</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ord.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">অর্ডার বিস্তারিত</span>
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>
                <p className="font-bold text-slate-900 mb-1">কাস্টমার তথ্য:</p>
                <p className="font-semibold text-slate-800">{selectedOrder.customer.fullName}</p>
                <p className="text-slate-600">মোবাইল: {selectedOrder.customer.phone}</p>
                {selectedOrder.customer.notes && (
                  <p className="text-slate-500 italic mt-1">নোট: {selectedOrder.customer.notes}</p>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">ডেলিভারি ঠিকানা:</p>
                <p className="text-slate-700 leading-snug">{selectedOrder.customer.address}</p>
                <p className="text-slate-500 mt-1">
                  এলাকা: {selectedOrder.deliveryZone === 'inside' ? 'ঢাকা সিটির ভেতরে' : 'ঢাকা সিটির বাইরে'}
                </p>
                <p className="text-slate-500">
                  পেমেন্ট মাধ্যম: <strong className="uppercase">{selectedOrder.paymentMethod}</strong>
                  {selectedOrder.paymentTrxId && ` (TrxID: ${selectedOrder.paymentTrxId})`}
                </p>
              </div>
            </div>

            {/* Courier Update Box */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>কুরিয়ার ও ট্র্যাকিং তথ্য আপডেট</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    কুরিয়ার পার্টনার
                  </label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="উদাঃ Steadfast Courier, Pathao"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    কুরিয়ার কনসাইনমেন্ট ট্র্যাকিং কোড
                  </label>
                  <input
                    type="text"
                    value={courierTracking}
                    onChange={(e) => setCourierTracking(e.target.value)}
                    placeholder="উদাঃ ST-928371"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveCourierInfo}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                কুরিয়ার তথ্য সেভ করুন
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                অর্ডারের পণ্যসমূহ
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain bg-slate-50 rounded-lg p-1 border"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} x {settings.currencySymbol}{item.price}
                          {item.selectedColor && ` • ${item.selectedColor}`}
                          {item.selectedSize && ` • ${item.selectedSize}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>সাবটোটাল:</span>
                <span className="font-bold text-slate-900">{settings.currencySymbol}{selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-slate-900">{settings.currencySymbol}{selectedOrder.deliveryCharge}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>ছাড়:</span>
                  <span>-{settings.currencySymbol}{selectedOrder.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>সর্বমোট:</span>
                <span className="text-emerald-700">{settings.currencySymbol}{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
