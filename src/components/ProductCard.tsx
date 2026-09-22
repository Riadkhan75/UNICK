import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct, quickBuy, addToCart, settings } = useStore();

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div
        className="relative bg-slate-50/70 p-2.5 sm:p-4 aspect-square flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => openProduct(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isHot && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide bg-rose-600 text-white rounded-md shadow-xs">
              হট ডিল
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide bg-amber-400 text-slate-950 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status indicator if low */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-1.5 right-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            বাকি {product.stock} টি
          </div>
        )}
      </div>

      {/* Product Details Area */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col">
        {/* Category & Star Rating */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-semibold text-rose-600 uppercase tracking-wider text-[10px] truncate max-w-[80px]">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span className="font-bold text-slate-700 text-[11px]">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => openProduct(product.id)}
          className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-rose-600 cursor-pointer transition-colors leading-snug mb-1.5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="pt-1 border-t border-slate-100 flex items-baseline gap-1.5 mb-2.5">
          <span className="text-base sm:text-lg font-black text-rose-600">
            {settings.currencySymbol}{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] font-semibold text-slate-400 line-through">
              {settings.currencySymbol}{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          <button
            onClick={() => addToCart(product, 1)}
            className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 active:scale-95"
            title="কার্ট"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden xs:inline">কার্ট</span>
          </button>

          <button
            onClick={() => quickBuy(product, 1)}
            className="py-2 px-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-[11px] sm:text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95"
          >
            <Zap className="w-3 h-3 fill-white" />
            <span>অর্ডার</span>
          </button>
        </div>
      </div>
    </div>
  );
};
