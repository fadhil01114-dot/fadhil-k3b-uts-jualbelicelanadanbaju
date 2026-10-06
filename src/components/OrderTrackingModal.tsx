import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, Upload, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { Order } from '../types';
import { uploadPaymentProof } from '../lib/db';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Upload proof state inside tracking modal
  const [proofUrl, setProofUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryStr = searchQuery.trim().toLowerCase();
    if (!queryStr) return;

    const found = orders.find(
      o => o.orderCode.toLowerCase().includes(queryStr) || 
           o.customerEmail.toLowerCase().includes(queryStr) ||
           o.id.toLowerCase().includes(queryStr)
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`Pesanan dengan kode "${searchQuery}" tidak ditemukan. Coba periksa kembali email atau kode pesanan Anda.`);
    }
  };

  const handleUploadProof = async () => {
    if (!selectedOrder || !proofUrl) return;
    setIsUploading(true);
    try {
      await uploadPaymentProof(selectedOrder.id, proofUrl, 'Diunggah via Portal Lacak Pesanan');
      alert('Bukti pembayaran berhasil diunggah! Admin akan segera memverifikasi pesanan Anda.');
      setProofUrl('');
      onClose();
    } catch (err) {
      alert('Gagal mengunggah bukti pembayaran.');
    } finally {
      setIsUploading(false);
    }
  };

  const statusSteps = [
    { key: 'pending_payment', label: 'Pesanan Dibuat', desc: 'Menunggu Pembayaran' },
    { key: 'proof_uploaded', label: 'Bukti Terunggah', desc: 'Verifikasi oleh Admin' },
    { key: 'approved', label: 'Disetujui / Diproses', desc: 'Penyiapan Stok & Packing' },
    { key: 'shipped', label: 'Pesanan Dikirim', desc: 'Dalam Perjalanan Kurir' },
    { key: 'completed', label: 'Selesai', desc: 'Pesanan Diterima Pelanggan' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const orderIndex = statusSteps.findIndex(s => s.key === currentStatus);
    const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
    
    if (currentStatus === 'rejected') {
      return stepKey === 'pending_payment' ? 'completed' : 'rejected';
    }
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base">Lacak Pesanan Nevada</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Masukkan Kode Pesanan (e.g. NV-123456) atau Email Pembeli:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Kode Pesanan atau Email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-red-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Result Order Details */}
          {selectedOrder ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Kode Pesanan</div>
                    <div className="text-base font-black text-red-600 font-mono">{selectedOrder.orderCode}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Total Pembayaran</div>
                    <div className="text-sm font-black text-slate-900">
                      Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>Pembeli: <strong className="text-slate-900">{selectedOrder.customerName}</strong></div>
                  <div>Metode: <strong className="text-slate-900 uppercase">{selectedOrder.paymentMethod}</strong></div>
                  <div>Ekspedisi: <strong className="text-slate-900">{selectedOrder.shippingMethod}</strong></div>
                  <div>
                    Resi: <strong className="text-red-600">{selectedOrder.trackingNumber || 'Belum Terbit'}</strong>
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Status Perjalanan Pesanan
                </h4>

                <div className="space-y-2 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {statusSteps.map((s, idx) => {
                    const statusState = getStepStatus(s.key, selectedOrder.paymentStatus);
                    return (
                      <div key={s.key} className="flex items-start gap-3 relative z-10 text-xs">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                          statusState === 'completed' ? 'bg-emerald-600 shadow' :
                          statusState === 'current' ? 'bg-red-600 ring-4 ring-red-100 shadow' :
                          statusState === 'rejected' ? 'bg-rose-600' : 'bg-slate-300'
                        }`}>
                          {statusState === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="pt-0.5">
                          <div className={`font-bold ${statusState === 'current' ? 'text-red-600 text-sm' : 'text-slate-900'}`}>
                            {s.label}
                          </div>
                          <div className="text-[11px] text-slate-500">{s.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Re-upload Proof option if pending */}
              {selectedOrder.paymentStatus === 'pending_payment' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Upload Bukti Transfer Sekarang</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    Belum sempat melampirkan foto bukti pembayaran saat checkout? Tempel tautan atau unggah foto disini:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... URL gambar bukti transfer"
                      value={proofUrl}
                      onChange={e => setProofUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleUploadProof}
                      disabled={isUploading || !proofUrl}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs disabled:opacity-50"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Silakan masukkan Kode Pesanan Anda pada kolom pencarian di atas.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
