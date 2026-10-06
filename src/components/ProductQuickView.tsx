import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Check, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase">
                <Tag className="w-3.5 h-3.5" />
                <span>{product.category}</span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>Terjual {product.soldCount} pcs</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-slate-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-100 text-red-600 font-bold text-xs px-2 py-0.5 rounded">
                    Hemat {discountPercent}%
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Pilih Ukuran:</span>
                <span className="text-slate-500">Stok: {product.stock} pcs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      selectedSize === sz
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800">Jumlah:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-extrabold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Guarantee Pills */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Produk Original</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Pengiriman Seluruh Indo</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                product.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Berhasil Ditambahkan!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Tambah ke Keranjang • Rp {(product.price * quantity).toLocaleString('id-ID')}</span>
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
