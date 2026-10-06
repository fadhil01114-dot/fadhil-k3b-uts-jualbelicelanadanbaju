import React from 'react';
import { ShoppingBag, Search, Bell, Package, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onOpenNotifications: () => void;
  unreadNotifCount: number;
  selectedCategory: ProductCategory | 'Semua';
  onSelectCategory: (cat: ProductCategory | 'Semua') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenTracking,
  onOpenNotifications,
  unreadNotifCount,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories: (ProductCategory | 'Semua')[] = [
    'Semua',
    'Kaos & Polo',
    'Kemeja & Jacket',
    'Celana & Shorts',
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-white flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>NEVADA OFFICIAL STORE - DISKON S/D 50% + VOUCHER POTONGAN 20% DENGAN KODE: <span className="bg-amber-300 text-slate-900 px-1.5 py-0.5 rounded font-bold">NEVADA20</span></span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Nevada Official Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectCategory('Semua')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="bg-red-600 group-hover:bg-red-500 text-white font-black text-xl tracking-tighter px-2.5 py-1 rounded shadow-md border border-red-400 transition-transform group-hover:scale-105">
                NEVADA
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Official Store</div>
                <div className="text-[10px] text-red-400 font-medium">Jual Beli Busana Original</div>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari baju, kemeja, celana Nevada..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-800 text-white text-sm pl-9 pr-4 py-2 rounded-full border border-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Order Tracking Button */}
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Cek Status Pesanan Saya"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Lacak Pesanan</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Notifikasi Pesanan Masuk"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-transform active:scale-95 shadow-md shadow-red-900/40"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-full font-extrabold text-[11px] min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold border border-emerald-500 shadow transition-colors"
              title="Kelola Admin & Database Real-time"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span className="hidden lg:inline">Kelola Admin</span>
            </button>

          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 pr-2 border-r border-slate-700 shrink-0">
            <Tag className="w-3.5 h-3.5 text-red-400" /> Kategori:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
