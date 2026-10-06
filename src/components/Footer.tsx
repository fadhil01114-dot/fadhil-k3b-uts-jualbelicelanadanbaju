import React from 'react';
import { ShieldCheck, Truck, Headphones, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Value props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-900 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 text-red-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white">100% Produk Original</div>
              <div className="text-slate-400">Garansi resmi Nevada Dept Store</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 text-amber-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white">Pengiriman Cepat</div>
              <div className="text-slate-400">JNE, J&T, SiCepat & GoSend</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 text-emerald-500 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white">Approval Instant</div>
              <div className="text-slate-400">Verifikasi resi real-time DB</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 text-purple-500 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white">Layanan Pelanggan</div>
              <div className="text-slate-400">Siap bantu via WhatsApp</div>
            </div>
          </div>
        </div>

        {/* Footer brand info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-sm">
              NEVADA
            </div>
            <span>© 2026 Nevada Store Official Marketplace. Hak Cipta Dilindungi.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Pusat Bantuan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
