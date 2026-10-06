import React, { useState } from 'react';
import { Ticket, Plus, Edit, Trash2, Search, CheckCircle2, User, Printer, QrCode, ShieldCheck } from 'lucide-react';
import { PassengerTicket, ShipVoyage, TicketClass, TicketStatus } from '../../../types/passengerCargo';
import { addPassengerTicket, updatePassengerTicket, deletePassengerTicket } from '../../../lib/passengerCargoDb';

interface PassengerTicketsTxProps {
  tickets: PassengerTicket[];
  voyages: ShipVoyage[];
  ticketClasses: TicketClass[];
}

export const PassengerTicketsTx: React.FC<PassengerTicketsTxProps> = ({ tickets, voyages, ticketClasses }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedTicketForPrint, setSelectedTicketForPrint] = useState<PassengerTicket | null>(null);
  const [editingTicket, setEditingTicket] = useState<PassengerTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [pnrCode, setPnrCode] = useState<string>('');
  const [voyageCode, setVoyageCode] = useState<string>('');
  const [passengerName, setPassengerName] = useState<string>('');
  const [nikNumber, setNikNumber] = useState<string>('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [age, setAge] = useState<number>(30);
  const [ticketClass, setTicketClass] = useState<string>('');
  const [cabinBedNo, setCabinBedNo] = useState<string>('');
  const [fareAmount, setFareAmount] = useState<number>(350000);
  const [status, setStatus] = useState<TicketStatus>('Booked');

  const handleOpenAdd = () => {
    setEditingTicket(null);
    const defaultVoyage = voyages[0]?.voyageCode || 'VOY-KELUD-08';
    const defaultClass = ticketClasses[0] || { className: 'Kelas I Executive', fareAdult: 850000 };

    setPnrCode(`PNR-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    setVoyageCode(defaultVoyage);
    setPassengerName('');
    setNikNumber(`3174${Math.floor(100000000000 + Math.random() * 900000000000)}`);
    setGender('Laki-laki');
    setAge(28);
    setTicketClass(defaultClass.className);
    setCabinBedNo(`Kabin 10${Math.floor(1 + Math.random() * 9)} - Bed A`);
    setFareAmount(defaultClass.fareAdult);
    setStatus('Booked');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (t: PassengerTicket) => {
    setEditingTicket(t);
    setPnrCode(t.pnrCode);
    setVoyageCode(t.voyageCode);
    setPassengerName(t.passengerName);
    setNikNumber(t.nikNumber);
    setGender(t.gender);
    setAge(t.age);
    setTicketClass(t.ticketClass);
    setCabinBedNo(t.cabinBedNo);
    setFareAmount(t.fareAmount);
    setStatus(t.status);
    setIsOpenModal(true);
  };

  const handleSelectClass = (clsName: string) => {
    setTicketClass(clsName);
    const found = ticketClasses.find(c => c.className === clsName);
    if (found) {
      setFareAmount(found.fareAdult);
    }
  };

  const handleQuickCheckIn = async (t: PassengerTicket) => {
    try {
      await updatePassengerTicket(t.id, { status: 'Boarded / Check-In' });
      alert(`✅ Penumpang "${t.passengerName}" [${t.pnrCode}] berhasil Check-In / Boarding!`);
    } catch (err) {
      alert('⚠️ Gagal memproses check-in penumpang.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrCode || !passengerName || !nikNumber) return;

    setIsSubmitting(true);
    try {
      if (editingTicket) {
        await updatePassengerTicket(editingTicket.id, {
          pnrCode, voyageCode, passengerName, nikNumber, gender, age, ticketClass, cabinBedNo, fareAmount, status
        });
        alert(`✅ Tiket PNR "${pnrCode}" diperbarui di Firestore!`);
      } else {
        await addPassengerTicket({
          pnrCode, voyageCode, passengerName, nikNumber, gender, age, ticketClass, cabinBedNo, fareAmount, status
        });
        alert(`✅ Tiket PNR baru "${pnrCode}" berhasil diterbitkan di Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menerbitkan tiket penumpang.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus tiket PNR "${code}"?`)) {
      try {
        await deletePassengerTicket(id);
        alert(`🗑️ Tiket PNR "${code}" dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus tiket.');
      }
    }
  };

  const filtered = tickets.filter(t =>
    t.pnrCode.toLowerCase().includes(search.toLowerCase()) ||
    t.passengerName.toLowerCase().includes(search.toLowerCase()) ||
    t.nikNumber.includes(search) ||
    t.voyageCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Ticket className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Tiket Penumpang & Booking PNR</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Terbitkan tiket kapal penumpang (PNR), catat nomor NIK KTP, alokasi kamar/kabin, status check-in boarding, dan cetak e-ticket.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Tiket PNR Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari PNR, nama penumpang, NIK, atau voyage..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode PNR & Voyage</th>
                <th className="p-4">Nama Penumpang & NIK</th>
                <th className="p-4">Gender & Usia</th>
                <th className="p-4">Kelas & No. Bed/Kabin</th>
                <th className="p-4">Tarif Tiket</th>
                <th className="p-4">Status Check-In</th>
                <th className="p-4 text-right">Aksi & Cetak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Belum ada transaksi tiket penumpang.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-black text-amber-700 text-sm">{t.pnrCode}</div>
                      <div className="text-[11px] font-semibold text-slate-500">{t.voyageCode}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      <div>{t.passengerName}</div>
                      <div className="font-mono text-[10px] text-slate-400 font-normal">NIK: {t.nikNumber}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div>{t.gender}</div>
                      <div className="text-[10px] text-slate-500">{t.age} Tahun</div>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-800">{t.ticketClass}</div>
                      <div className="text-[10px] font-semibold text-amber-700">{t.cabinBedNo}</div>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      Rp {t.fareAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        t.status === 'Boarded / Check-In' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        t.status === 'Booked' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'Booked' && (
                          <button
                            onClick={() => handleQuickCheckIn(t)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow"
                            title="Proses Check-In Penumpang"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedTicketForPrint(t)}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg font-bold"
                          title="Cetak Boarding Pass / Tiket"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Tiket"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.pnrCode)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Tiket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ticket Issuance */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingTicket ? 'Edit Tiket PNR Penumpang' : 'Terbitkan Tiket Penumpang Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode PNR *</label>
                  <input
                    type="text"
                    required
                    value={pnrCode}
                    onChange={e => setPnrCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-amber-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Voyage *</label>
                  <select
                    value={voyageCode}
                    onChange={e => setVoyageCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {voyages.map(v => (
                      <option key={v.id} value={v.voyageCode}>{v.voyageCode} ({v.shipName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Penumpang *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bpk. Ahmad Ridwan"
                  value={passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor NIK KTP *</label>
                  <input
                    type="text"
                    required
                    value={nikNumber}
                    onChange={e => setNikNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Kabin *</label>
                  <select
                    value={ticketClass}
                    onChange={e => handleSelectClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    {ticketClasses.map(c => (
                      <option key={c.id} value={c.className}>{c.className}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Kabin / Bed</label>
                  <input
                    type="text"
                    placeholder="e.g. Kabin 102 - Bed A"
                    value={cabinBedNo}
                    onChange={e => setCabinBedNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarif Tiket (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={fareAmount}
                    onChange={e => setFareAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-amber-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Tiket</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Booked">Booked (Telah Dipesan)</option>
                    <option value="Boarded / Check-In">Boarded / Check-In</option>
                    <option value="Cancelled">Cancelled (Dibatalkan)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menerbitkan...' : 'Terbitkan Tiket PNR'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Ticket Preview Modal */}
      {selectedTicketForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="border-b border-dashed border-slate-300 pb-4 text-center space-y-1">
              <div className="font-black text-slate-900 text-lg uppercase tracking-tight">
                SAMUDERA NUSANTARA
              </div>
              <div className="text-[11px] font-extrabold text-amber-700">
                BOARDING PASS & E-TICKET PENUMPANG KAPAL
              </div>
              <div className="font-mono text-xs font-black text-slate-900 pt-1">
                PNR: {selectedTicketForPrint.pnrCode}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-medium">Nama Penumpang:</span>
                <span className="font-black text-slate-900">{selectedTicketForPrint.passengerName}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-medium">NIK KTP:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTicketForPrint.nikNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-medium">Voyage Keberangkatan:</span>
                <span className="font-bold text-slate-900">{selectedTicketForPrint.voyageCode}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-medium">Kelas Kabin:</span>
                <span className="font-bold text-amber-700">{selectedTicketForPrint.ticketClass}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-medium">No. Bed / Kabin:</span>
                <span className="font-bold text-slate-900">{selectedTicketForPrint.cabinBedNo}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-medium">Tarif Tiket:</span>
                <span className="font-black text-slate-900">Rp {selectedTicketForPrint.fareAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
              <QrCode className="w-20 h-20 mx-auto text-slate-800" />
              <p className="text-[10px] text-slate-500 font-mono">
                Tunjukkan QR Code ini kepada petugas gate boarding pelabuhan.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                  setSelectedTicketForPrint(null);
                }}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-xl shadow flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Cetak PDF</span>
              </button>
              <button
                onClick={() => setSelectedTicketForPrint(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
