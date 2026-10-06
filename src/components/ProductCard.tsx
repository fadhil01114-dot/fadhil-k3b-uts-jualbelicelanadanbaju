import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [added, setAdded] = useState<boolean>(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
              product.badge === 'BEST SELLER' ? 'bg-amber-600' :
              product.badge === 'HOT' ? 'bg-red-600' :
              product.badge === 'NEW' ? 'bg-emerald-600' : 'bg-purple-600'
            }`}>
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {product.stock <= 0 ? (
            <span className="bg-slate-900/90 backdrop-blur-sm text-red-400 text-[10px] font-bold px-2 py-1 rounded-md border border-red-500/30">
              Stok Habis
            </span>
          ) : product.stock < 10 ? (
            <span className="bg-amber-500/90 backdrop-blur-sm text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md">
              Sisa {product.stock} pcs!
            </span>
          ) : null}
        </div>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white/95 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-red-600 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Lihat Detail
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-1">
            {product.category}
          </div>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Rating & Sold count */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>Terjual {product.soldCount}</span>
        </div>

        {/* Pricing */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-slate-900">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Pills */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="text-[10px] font-semibold text-slate-500">Pilih Ukuran:</div>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                  selectedSize === sz
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            product.stock <= 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white active:scale-98'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Masuk Keranjang!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Beli Ukuran {selectedSize}</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
