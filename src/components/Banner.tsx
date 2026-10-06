import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

interface BannerProps {
  onShopNow: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onShopNow }) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      {/* Background Graphic Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>KOLEKSI NEVADA CLOTHING 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Tampil Trendi & Percaya Diri dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-400">Nevada Original</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Jelajahi 12 pilihan produk busana Nevada terbaik: T-Shirt grafis, Kemeja Flannel & Oxford, hingga Celana Stretch Denim & Chino berkualitas distro resmi Matahari.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-900/50 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Belanja Sekarang</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs text-slate-300">
                <span className="font-bold text-amber-400">VOUCHER:</span>
                <code className="bg-slate-900 px-2 py-1 rounded text-red-400 font-mono font-bold border border-slate-700">NEVADA20</code>
                <span className="text-slate-400">(Diskon 20%)</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 backdrop-blur-sm space-y-1 hover:border-red-500/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="font-bold text-slate-100">100% Produk Original</div>
              <div className="text-slate-400 text-[11px]">Garansi Nevada Matahari Department Store resmi.</div>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 backdrop-blur-sm space-y-1 hover:border-red-500/50 transition-colors">
              <Truck className="w-5 h-5 text-amber-400" />
              <div className="font-bold text-slate-100">Pengiriman Cepat</div>
              <div className="text-slate-400 text-[11px]">Dukungan JNE, J&T, SiCepat & GoSend Instant.</div>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 backdrop-blur-sm space-y-1 hover:border-red-500/50 transition-colors">
              <RefreshCw className="w-5 h-5 text-sky-400" />
              <div className="font-bold text-slate-100">Approval Cepat</div>
              <div className="text-slate-400 text-[11px]">Verifikasi bukti transfer otomatis oleh Admin.</div>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 backdrop-blur-sm space-y-1 hover:border-red-500/50 transition-colors">
              <Zap className="w-5 h-5 text-purple-400" />
              <div className="font-bold text-slate-100">Real-time DB</div>
              <div className="text-slate-400 text-[11px]">Stok & riwayat pesanan tersimpan aman di Firestore.</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
