import React, { useState } from 'react';
import { 
  X, CreditCard, QrCode, Building2, Upload, CheckCircle2, 
  Copy, ShieldCheck, ArrowRight, Sparkles, Send, FileCheck2, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, PaymentMethodType, Order } from '../types';
import { createOrder, uploadPaymentProof } from '../lib/db';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  shippingMethod: string;
  shippingCost: number;
  promoCode: string;
  promoDiscount: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  shippingMethod,
  shippingCost,
  promoCode,
  promoDiscount,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalAmount = Math.max(0, subtotal - promoDiscount + shippingCost);

  // Form states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState<string>('12190');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  
  // Workflow step
  const [step, setStep] = useState<'form' | 'payment_instructions' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  const handleCopyVA = (vaNumber: string) => {
    navigator.clipboard.writeText(vaNumber);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  // Generate Sample Transfer Proof Image for 1-Click Fast Testing
  const handleUseSampleProof = () => {
    const sampleProof = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80';
    setPaymentProofUrl(sampleProof);
    setPaymentNotes('Transfer Lunas via m-Banking - Ref: TRX-' + Math.floor(Math.random() * 900000 + 100000));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPaymentProofUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !address) {
      alert('Mohon lengkapi semua data pembeli dan alamat pengiriman!');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        category: i.product.category,
        selectedSize: i.selectedSize,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      }));

      // Initial payment status
      const initialStatus = paymentProofUrl ? 'proof_uploaded' : 'pending_payment';

      const newOrder = await createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: `${address}, ${city}, ${postalCode}`,
        shippingMethod,
        shippingCost,
        items: orderItems,
        subtotal,
        totalAmount,
        promoCode: promoCode || undefined,
        promoDiscount: promoDiscount || 0,
        paymentMethod,
        paymentStatus: initialStatus,
        paymentProofUrl: paymentProofUrl || undefined,
        paymentNotes: paymentNotes || undefined,
      });

      setCreatedOrder(newOrder);
      setStep('success');

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onOrderSuccess(newOrder);
    } catch (err) {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                NEVADA CHECKOUT
              </span>
              <h3 className="font-extrabold text-base">
                {step === 'form' && '1. Data Pembeli & Pembayaran'}
                {step === 'payment_instructions' && '2. Instruksi & Upload Bukti Pembayaran'}
                {step === 'success' && '3. Pesanan Berhasil Dibuat!'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {step === 'form' && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b pb-1">
                  A. Data Diri & Alamat Pengiriman
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Andi Pratama"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Aktif *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. andi@gmail.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 081234567890"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                    <input
                      type="text"
                      placeholder="e.g. Jakarta Selatan"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Pengiriman *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Jl. Sudirman No. 45, RT 02/RW 03, Kel. Senayan..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Payment Gateway Method Choice */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b pb-1">
                  B. Metode Pembayaran
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'qris', label: 'QRIS Instan', desc: 'Scan Semua e-Wallet', icon: QrCode },
                    { id: 'bca_va', label: 'BCA Virtual Account', desc: 'Transfer Bank BCA', icon: Building2 },
                    { id: 'mandiri_va', label: 'Mandiri VA', desc: 'Transfer Bank Mandiri', icon: Building2 },
                    { id: 'bri_va', label: 'BRI VA', desc: 'Transfer Bank BRI', icon: Building2 },
                    { id: 'credit_card', label: 'Kartu Kredit / Debit', desc: 'Visa & Mastercard', icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-red-500/50'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-red-400' : 'text-slate-600'}`} />
                        <div className="font-extrabold text-xs">{m.label}</div>
                        <div className="text-[10px] opacity-75">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Payment Details & Receipt Upload */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  
                  {paymentMethod === 'qris' && (
                    <div className="text-center space-y-2">
                      <p className="text-xs font-bold text-slate-800">Scan Kode QRIS Nevada Official dibawah ini:</p>
                      <div className="w-40 h-40 mx-auto bg-white p-2 rounded-2xl shadow border border-slate-200">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=NEVADA_STORE_OFFICIAL_PAYMENT_129000" 
                          alt="QRIS Payment" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Mendukung GoPay, OVO, ShopeePay, Dana, LinkAja & m-Banking.</p>
                    </div>
                  )}

                  {(paymentMethod === 'bca_va' || paymentMethod === 'mandiri_va' || paymentMethod === 'bri_va') && (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-800">Nomor Virtual Account Nevada Store:</p>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900">
                        <span>
                          {paymentMethod === 'bca_va' && '8801 0812 9832 1102'}
                          {paymentMethod === 'mandiri_va' && '8920 1102 3912 9011'}
                          {paymentMethod === 'bri_va' && '0192 8812 9920 1029'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyVA(
                            paymentMethod === 'bca_va' ? '8801081298321102' :
                            paymentMethod === 'mandiri_va' ? '8920110239129011' : '0192881299201029'
                          )}
                          className="flex items-center gap-1 text-[11px] text-red-600 font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedVA ? 'Tersalin!' : 'Salin VA'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Bukti Pembayaran Section */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900">
                        Upload Bukti Pembayaran (Opsional / Langsung Lampirkan):
                      </label>
                      <button
                        type="button"
                        onClick={handleUseSampleProof}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Contoh Bukti Valid</span>
                      </button>
                    </div>

                    {paymentProofUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-800 text-xs">
                        <FileCheck2 className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <div className="font-extrabold text-emerald-900">Bukti Transfer Berhasil Dilampirkan!</div>
                          <div className="text-[10px] text-emerald-700 truncate">{paymentNotes || 'File gambar tersimpan'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaymentProofUrl('')}
                          className="text-[10px] font-bold text-red-600 underline"
                        >
                          Ubah
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-red-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="proof-upload"
                        />
                        <label htmlFor="proof-upload" className="cursor-pointer space-y-1 block">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                          <div className="text-xs font-bold text-slate-700">Klik untuk Pilih Foto / Tangkapan Layar Resi</div>
                          <div className="text-[10px] text-slate-400">Format JPG, PNG, WEBP (Maks 5MB)</div>
                        </label>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Order Summary Line */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400">Total Pembayaran ({cart.length} barang):</div>
                  <div className="text-lg font-black text-red-400">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 font-extrabold text-white rounded-xl shadow-lg shadow-red-900/50 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Buat Pesanan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Success Screen */}
          {step === 'success' && createdOrder && (
            <div className="py-6 text-center space-y-6">
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  Pesanan Berhasil Dibuat!
                </h3>
                <p className="text-xs text-slate-600">
                  Terima kasih, <strong className="text-slate-900">{createdOrder.customerName}</strong>! Pesanan Anda telah tersimpan di sistem database Nevada Store.
                </p>
              </div>

              {/* Order Ticket details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Kode Pesanan:</span>
                  <strong className="text-red-600 font-mono font-black text-sm">{createdOrder.orderCode}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Pembayaran:</span>
                  <strong className="text-slate-800 uppercase">{createdOrder.paymentMethod}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Status Pembayaran:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    createdOrder.paymentStatus === 'proof_uploaded'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {createdOrder.paymentStatus === 'proof_uploaded' ? 'Bukti Terunggah - Menunggu Verifikasi Admin' : 'Menunggu Pembayaran'}
                  </span>
                </div>

                <div className="flex justify-between pt-1 border-t">
                  <span className="text-slate-500">Total Tagihan:</span>
                  <strong className="text-slate-900 font-extrabold text-sm">
                    Rp {createdOrder.totalAmount.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                
                {/* WhatsApp Share Invoice */}
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Admin%20Nevada%20Store%2C%20saya%20sudah%20membuat%20pesanan%20dengan%20Kode%20Pesanan%3A%20${createdOrder.orderCode}%20sebesar%20Rp%20${createdOrder.totalAmount.toLocaleString('id-ID')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Nota ke WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Selesai & Kembali
                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
