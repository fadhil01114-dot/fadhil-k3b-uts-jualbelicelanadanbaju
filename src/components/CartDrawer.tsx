import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (shippingMethod: string, shippingCost: number, promoCode: string, promoDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');
  
  const [shippingMethod, setShippingMethod] = useState<string>('JNE Reguler');
  const [shippingCost, setShippingCost] = useState<number>(15000);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate Promo Discount
  let promoDiscount = 0;
  if (appliedPromo === 'NEVADA20') {
    promoDiscount = Math.round(subtotal * 0.20);
  } else if (appliedPromo === 'NV50K') {
    promoDiscount = Math.min(50000, subtotal);
  }

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'NEVADA20' || code === 'NV50K') {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Kode voucher tidak valid. Coba: NEVADA20');
    }
  };

  const handleShippingChange = (method: string, cost: number) => {
    setShippingMethod(method);
    setShippingCost(cost);
  };

  const totalAmount = Math.max(0, subtotal - promoDiscount + (cart.length > 0 ? shippingCost : 0));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <h2 className="font-extrabold text-base">Keranjang Belanja</h2>
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} item
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-slate-800 font-bold text-sm">Keranjang Anda Masih Kosong</p>
              <p className="text-slate-500 text-xs max-w-xs mx-auto">
                Pilih produk pakaian & celana Nevada favorit Anda dan tambahkan ke keranjang.
              </p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className="pt-3 first:pt-0 flex gap-3 items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                />

                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Ukuran: <strong className="text-slate-900">{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span className="text-red-600 font-semibold">Rp {item.product.price.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-extrabold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Promo Voucher & Shipping Options */}
          {cart.length > 0 && (
            <div className="pt-4 space-y-4">
              
              {/* Promo Code Section */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Voucher Diskon</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode (e.g. NEVADA20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-red-500 uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Gunakan
                  </button>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Voucher {appliedPromo} Aktif
                    </span>
                    <button
                      onClick={() => { setAppliedPromo(''); setPromoInput(''); }}
                      className="text-[10px] text-red-600 font-bold underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
                )}
              </div>

              {/* Shipping Method Selector */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>PILIH EKSPEDISI PENGIRIMAN</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'JNE Reguler', cost: 15000, est: '2-3 Hari' },
                    { name: 'J&T Express', cost: 18000, est: '1-2 Hari' },
                    { name: 'SiCepat BEST', cost: 22000, est: 'Besok Sampai' },
                    { name: 'GoSend Instant', cost: 35000, est: '3-6 Jam' },
                  ].map((s) => (
                    <button
                      key={s.name}
                      onClick={() => handleShippingChange(s.name, s.cost)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        shippingMethod === s.name
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-bold text-[11px]">{s.name}</div>
                      <div className="text-[10px] opacity-80">Rp {s.cost.toLocaleString('id-ID')} • {s.est}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Voucher ({appliedPromo})</span>
                  <span>-Rp {promoDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Ongkos Kirim ({shippingMethod})</span>
                <span className="font-semibold text-slate-900">Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Pembayaran</span>
                <span className="text-red-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(shippingMethod, shippingCost, appliedPromo, promoDiscount)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all active:scale-98"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
