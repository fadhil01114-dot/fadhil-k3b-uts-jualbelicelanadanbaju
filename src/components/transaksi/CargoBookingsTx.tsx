import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Search, DollarSign, Package, CheckCircle2 } from 'lucide-react';
import { CargoBooking, Voyage, Shipper, CargoType, PaymentStatus, CargoStatus } from '../../types/shipping';
import { addBooking, updateBooking, deleteBooking } from '../../lib/shippingDb';

interface CargoBookingsTxProps {
  bookings: CargoBooking[];
  voyages: Voyage[];
  shippers: Shipper[];
  cargoTypes: CargoType[];
}

export const CargoBookingsTx: React.FC<CargoBookingsTxProps> = ({
  bookings,
  voyages,
  shippers,
  cargoTypes,
}) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CargoBooking | null>(null);

  // Form Fields
  const [bookingNumber, setBookingNumber] = useState<string>('');
  const [voyageId, setVoyageId] = useState<string>(voyages[0]?.id || '');
  const [shipperId, setShipperId] = useState<string>(shippers[0]?.id || '');
  const [cargoTypeId, setCargoTypeId] = useState<string>(cargoTypes[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [totalFreightFee, setTotalFreightFee] = useState<number>(85000000);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid In Full');
  const [cargoStatus, setCargoStatus] = useState<CargoStatus>('In Transit');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setBookingNumber(`BL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setVoyageId(voyages[0]?.id || '');
    setShipperId(shippers[0]?.id || '');
    const defaultCargo = cargoTypes[0];
    setCargoTypeId(defaultCargo?.id || '');
    setQuantity(10);
    setTotalFreightFee((defaultCargo?.standardRatePerUnit || 8500000) * 10);
    setPaymentStatus('Paid In Full');
    setCargoStatus('Booked');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (b: CargoBooking) => {
    setEditingItem(b);
    setBookingNumber(b.bookingNumber);
    setVoyageId(b.voyageId);
    setShipperId(b.shipperId);
    setCargoTypeId(b.cargoTypeId);
    setQuantity(b.quantity);
    setTotalFreightFee(b.totalFreightFee);
    setPaymentStatus(b.paymentStatus);
    setCargoStatus(b.cargoStatus);
    setIsOpenModal(true);
  };

  const handleRecalculateFee = (cTypeId: string, qty: number) => {
    const foundType = cargoTypes.find(c => c.id === cTypeId);
    if (foundType) {
      setTotalFreightFee(foundType.standardRatePerUnit * qty);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingNumber || !voyageId || !shipperId || !cargoTypeId) return;

    const selVoy = voyages.find(v => v.id === voyageId);
    const selShip = shippers.find(s => s.id === shipperId);
    const selCargo = cargoTypes.find(c => c.id === cargoTypeId);

    const payload = {
      bookingNumber,
      voyageId,
      voyageNumber: selVoy ? selVoy.voyageNumber : 'VOY-2026',
      shipperId,
      shipperName: selShip ? selShip.companyName : 'Klien Shipper',
      cargoTypeId,
      cargoTypeName: selCargo ? selCargo.name : 'Tipe Kargo',
      quantity,
      totalFreightFee,
      paymentStatus,
      cargoStatus,
    };

    if (editingItem) {
      await updateBooking(editingItem.id, payload);
    } else {
      await addBooking(payload);
    }
    setIsOpenModal(false);
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus transaksi booking Bill of Lading "${code}"?`)) {
      await deleteBooking(id);
    }
  };

  const filtered = bookings.filter(b => 
    b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.shipperName.toLowerCase().includes(search.toLowerCase()) ||
    b.voyageNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Booking Kargo (Bill of Lading / BL)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Input manifes kargo pengiriman, tagihan biaya freight, status pembayaran, dan status posisi muatan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Input Booking BL Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nomor BL, nama shipper, kode voyage..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">No. Bill of Lading (BL)</th>
                <th className="p-4">Kode Voyage</th>
                <th className="p-4">Klien Shipper</th>
                <th className="p-4">Tipe & Jumlah Muatan</th>
                <th className="p-4">Total Freight Fee</th>
                <th className="p-4">Status Pembayaran</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-sky-700 text-sm">{b.bookingNumber}</td>
                  <td className="p-4 font-mono font-bold text-slate-800">{b.voyageNumber}</td>
                  <td className="p-4 font-extrabold text-slate-900">{b.shipperName}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{b.cargoTypeName}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{b.quantity} Satuan</div>
                  </td>
                  <td className="p-4 font-black text-emerald-600 text-sm">
                    Rp {b.totalFreightFee.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      b.paymentStatus === 'Paid In Full' ? 'bg-emerald-100 text-emerald-800' :
                      b.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.bookingNumber)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingItem ? 'Edit Booking Bill of Lading' : 'Input Booking Bill of Lading Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor BL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BL-2026-9011"
                  value={bookingNumber}
                  onChange={e => setBookingNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jadwal Voyage *</label>
                  <select
                    value={voyageId}
                    onChange={e => setVoyageId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    {voyages.map(v => (
                      <option key={v.id} value={v.id}>{v.voyageNumber} ({v.vesselName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Klien Shipper *</label>
                  <select
                    value={shipperId}
                    onChange={e => setShipperId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    {shippers.map(s => (
                      <option key={s.id} value={s.id}>{s.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Muatan Kargo *</label>
                  <select
                    value={cargoTypeId}
                    onChange={e => {
                      setCargoTypeId(e.target.value);
                      handleRecalculateFee(e.target.value, quantity);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    {cargoTypes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Rp {c.standardRatePerUnit.toLocaleString('id-ID')})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Unit / Tonase *</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={e => {
                      const q = Number(e.target.value);
                      setQuantity(q);
                      handleRecalculateFee(cargoTypeId, q);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Biaya Freight (Rp) *</label>
                <input
                  type="number"
                  required
                  value={totalFreightFee}
                  onChange={e => setTotalFreightFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-600 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Pembayaran</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Paid In Full">Paid In Full</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Muatan</label>
                  <select
                    value={cargoStatus}
                    onChange={e => setCargoStatus(e.target.value as CargoStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Booked">Booked</option>
                    <option value="Loaded">Loaded</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Discharged">Discharged</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow"
                >
                  Simpan Booking BL
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
