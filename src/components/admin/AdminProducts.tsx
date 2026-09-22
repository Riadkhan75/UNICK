import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/initialData';
import { compressImageFile } from '../../utils/imageHelper';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  X,
  Package,
  Star,
  Flame,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

const SAMPLE_IMAGE_OPTIONS = [
  { label: 'Smart Watch', value: '/assets/images/sample-watch.svg' },
  { label: 'Wireless Earbuds', value: '/assets/images/sample-earbuds.svg' },
  { label: 'Travel Backpack', value: '/assets/images/sample-backpack.svg' },
  { label: 'Running Shoes', value: '/assets/images/sample-shoes.svg' },
  { label: 'Casual Shirt', value: '/assets/images/sample-shirt.svg' },
  { label: 'Flagship Smartphone', value: '/assets/images/sample-iphone.svg' },
];

export const AdminProducts: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    settings,
    showToast
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Custom Delete Modal State
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState('Gadgets');
  const [price, setPrice] = useState<number>(1000);
  const [originalPrice, setOriginalPrice] = useState<number>(1500);
  const [stock, setStock] = useState<number>(20);
  
  // Image handling state
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_IMAGE_OPTIONS[0].value);
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [isHot, setIsHot] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setNameBn('');
    setCategory('Gadgets');
    setPrice(1200);
    setOriginalPrice(1600);
    setStock(25);
    setImagePreview(SAMPLE_IMAGE_OPTIONS[0].value);
    setCustomImageUrl('');
    setImageTab('upload');
    setShortDescription('উচ্চমানের টেকসই প্রডাক্ট, আধুনিক ডিজাইন এবং দীর্ঘস্থায়ী পারফরম্যান্স।');
    setDescription('এই প্রোডাক্টটি প্রিমিয়াম ম্যাটেরিয়ালে তৈরি। প্রতিদিনের ব্যবহারের জন্য অত্যন্ত উপযোগী।');
    setIsHot(false);
    setIsNew(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNameBn(p.nameBn || '');
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setStock(p.stock);
    setImagePreview(p.image);
    setCustomImageUrl(p.image.startsWith('http') ? p.image : '');
    setImageTab('upload');
    setShortDescription(p.shortDescription);
    setDescription(p.description);
    setIsHot(!!p.isHot);
    setIsNew(!!p.isNew);
    setIsModalOpen(true);
  };

  // Handle file upload & compression
  const processUploadedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন (JPG, PNG, WEBP)');
      return;
    }

    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.85);
      setImagePreview(compressedDataUrl);
      setCustomImageUrl('');
      showToast('ছবি সফলভাবে যুক্ত করা হয়েছে');
    } catch (err) {
      console.error('Image compression failed:', err);
      showToast('ছবি প্রসেসিং করতে সমস্যা হয়েছে');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('অনুগ্রহ করে পণ্যের নাম দিন');
      return;
    }

    const finalImage = imagePreview || SAMPLE_IMAGE_OPTIONS[0].value;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        nameBn: nameBn.trim() || undefined,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        stock: Number(stock),
        image: finalImage,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        isHot,
        isNew,
      });
      showToast(`"${name.trim()}" পণ্য সফলভাবে আপডেট করা হয়েছে`);
    } else {
      addProduct({
        name: name.trim(),
        nameBn: nameBn.trim() || undefined,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        stock: Number(stock),
        image: finalImage,
        rating: 4.8,
        reviewCount: 12,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        specifications: {
          'Warranty': '7 Days Replacement',
          'Origin': 'Authentic Standard'
        },
        isHot,
        isNew,
        isFeatured: true,
      });
      showToast(`"${name.trim()}" পণ্য সফলভাবে যোগ করা হয়েছে`);
    }

    setIsModalOpen(false);
  };

  // Custom Delete Confirmation Execution
  const triggerDelete = (id: string, prodName: string) => {
    setProductToDelete({ id, name: prodName });
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      showToast(`"${productToDelete.name}" সফলভাবে মুছে ফেলা হয়েছে`);
    } catch (err) {
      console.error('Delete product error:', err);
      showToast('পণ্য মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            পণ্য ব্যবস্থাপনা (Product Management)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            স্টোরের পণ্যসমূহ যোগ, ফটো আপলোড, ইনভেন্টরি স্টক নিয়ন্ত্রণ ও ডিলিট করুন।
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="নাম বা ক্যাটাগরি অনুসন্ধান করুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:border-blue-600 outline-none shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl outline-none font-semibold text-slate-700 shadow-2xs"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'সব ক্যাটাগরি' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">পণ্য ও ছবি</th>
                <th className="p-4">ক্যাটাগরি</th>
                <th className="p-4">মূল্য</th>
                <th className="p-4">স্টক</th>
                <th className="p-4">ট্যাগস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    কোনো পণ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // fallback if external image fails
                              (e.target as HTMLImageElement).src = SAMPLE_IMAGE_OPTIONS[0].value;
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{prod.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-blue-700">
                        {settings.currencySymbol}{prod.price.toLocaleString()}
                      </div>
                      {prod.originalPrice > prod.price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {settings.currencySymbol}{prod.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateProduct(prod.id, {
                              stock: Math.max(0, prod.stock - 1),
                            })
                          }
                          className="w-5 h-5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs ${
                            prod.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'text-slate-800'
                          }`}
                        >
                          {prod.stock}
                        </span>
                        <button
                          onClick={() =>
                            updateProduct(prod.id, {
                              stock: prod.stock + 1,
                            })
                          }
                          className="w-5 h-5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.isHot && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                            HOT
                          </span>
                        )}
                        {prod.isNew && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => triggerDelete(prod.id, prod.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Reliable Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">
                পণ্য মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি এই পণ্যটি স্থায়ীভাবে মুছে ফেলতে চান?
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs truncate">
                {productToDelete.name}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>হ্যাঁ, মুছে ফেলুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal with Enhanced Photo Add Option */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span>{editingProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  পণ্যের নাম (Product Title) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ Smart Fitness Tracker Pro Watch"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  বাংলা নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="উদাঃ স্মার্ট ফিটনেস ট্র্যাকার ওয়াচ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    বিক্রয় মূল্য (Price ৳) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    পূর্বের মূল্য (Compare Price ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-500"
                  />
                </div>
              </div>

              {/* PHOTO ADD OPTION (Upload from Device / Enter URL / Sample Icons) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>পণ্যের ছবি যুক্ত করুন (Product Photo) *</span>
                  </label>

                  {/* Tabs: Upload / URL / Gallery */}
                  <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        imageTab === 'upload' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      আপলোড
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        imageTab === 'url' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      লিংক (URL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        imageTab === 'presets' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      নমুনা
                    </button>
                  </div>
                </div>

                {/* Tab 1: File Upload (Drag and Drop / File Browser) */}
                {imageTab === 'upload' && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-300 hover:border-blue-400 bg-white'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {isProcessingImage ? (
                      <div className="py-2 flex flex-col items-center justify-center gap-2 text-blue-600">
                        <RotateCw className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-semibold">ছবি প্রসেস করা হচ্ছে...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">
                          ফটো নির্বাচন করতে ক্লিক করুন বা ড্র্যাগ করে ছাড়ুন
                        </p>
                        <p className="text-[10px] text-slate-400">
                          JPG, PNG, WEBP ফরম্যাট (স্বয়ংক্রিয়ভাবে অপ্টিমাইজড হবে)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Direct Image URL */}
                {imageTab === 'url' && (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://example.com/product-photo.jpg"
                        value={customImageUrl}
                        onChange={(e) => {
                          setCustomImageUrl(e.target.value);
                          if (e.target.value.trim()) {
                            setImagePreview(e.target.value.trim());
                          }
                        }}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      অনলাইন ইমেজের যেকোনো সরাসরি লিংক এখানে পেস্ট করুন।
                    </p>
                  </div>
                )}

                {/* Tab 3: Presets */}
                {imageTab === 'presets' && (
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_IMAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setImagePreview(opt.value);
                          setCustomImageUrl('');
                        }}
                        className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          imagePreview === opt.value
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <img src={opt.value} alt={opt.label} className="w-7 h-7 object-contain" />
                        <span className="text-[10px] text-slate-700 truncate w-full text-center">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Current Image Preview Banner */}
                {imagePreview && (
                  <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-xl">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_IMAGE_OPTIONS[0].value;
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-[11px]">বর্তমান ছবি নির্বাচিত আছে</p>
                      <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>প্রোডাক্টে প্রদর্শিত হবে</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setImageTab('upload');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      পরিবর্তন
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isHot}
                    onChange={(e) => setIsHot(e.target.checked)}
                    className="accent-rose-600"
                  />
                  <span>হট ডিল ব্যাজ (Hot Deal)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-blue-600"
                  />
                  <span>নতুন প্রডাক্ট ব্যাজ (New)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'আপডেট করুন' : 'পণ্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
