import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { TicketClass } from '../../../types/passengerCargo';
import { addTicketClass, updateTicketClass, deleteTicketClass } from '../../../lib/passengerCargoDb';

interface TicketClassesMasterProps {
  ticketClasses: TicketClass[];
}

export const TicketClassesMaster: React.FC<TicketClassesMasterProps> = ({ ticketClasses }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<TicketClass | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [className, setClassName] = useState<string>('');
  const [fareAdult, setFareAdult] = useState<number>(350000);
  const [fareChild, setFareChild] = useState<number>(250000);
  const [facilities, setFacilities] = useState<string>('');

  const handleOpenAdd = () => {
    setEditingClass(null);
    setClassName('Kelas I Executive (Kabin 2 Bed)');
    setFareAdult(850000);
    setFareChild(650000);
    setFacilities('Kabin AC Privat 2 Tempat Tidur, TV, Kamar Mandi Dalam, Makan 3x');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (tc: TicketClass) => {
    setEditingClass(tc);
    setClassName(tc.className);
    setFareAdult(tc.fareAdult);
    setFareChild(tc.fareChild);
    setFacilities(tc.facilities);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) return;

    setIsSubmitting(true);
    try {
      if (editingClass) {
        await updateTicketClass(editingClass.id, { className, fareAdult, fareChild, facilities });
        alert(`✅ Kelas "${className}" diperbarui di Firestore!`);
      } else {
        await addTicketClass({ className, fareAdult, fareChild, facilities });
        alert(`✅ Kelas baru "${className}" disimpan ke Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan kelas tiket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus kelas tiket "${name}"?`)) {
      try {
        await deleteTicketClass(id);
        alert(`🗑️ Kelas tiket "${name}" dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus kelas tiket.');
      }
    }
  };

  const filtered = ticketClasses.filter(tc =>
    tc.className.toLowerCase().includes(search.toLowerCase()) ||
    tc.facilities.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Kelas Kabin & Tarif Tiket Penumpang</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola kategori kelas (Executive, Business, Ekonomi Deck), tarif tiket dewasa/anak, dan fasilitas kabin.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kelas kabin atau fasilitas..."
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
                <th className="p-4">Nama Kelas Kabin</th>
                <th className="p-4">Tarif Dewasa</th>
                <th className="p-4">Tarif Anak</th>
                <th className="p-4">Fasilitas Kabin</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada data kelas tiket penumpang.
                  </td>
                </tr>
              ) : (
                filtered.map(tc => (
                  <tr key={tc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-900 text-sm">{tc.className}</td>
                    <td className="p-4 font-extrabold text-amber-700">
                      Rp {tc.fareAdult.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      Rp {tc.fareChild.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-slate-600 max-w-md">{tc.facilities}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tc)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Kelas"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tc.id, tc.className)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Kelas"
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

      {/* Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingClass ? 'Edit Kelas Kabin' : 'Tambah Kelas Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelas Kabin *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kelas I Executive (Kabin 2 Bed)"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarif Dewasa (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={fareAdult}
                    onChange={e => setFareAdult(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarif Anak (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={fareChild}
                    onChange={e => setFareChild(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fasilitas Kabin</label>
                <textarea
                  rows={2}
                  placeholder="Kabin AC, TV, Makan 3x, Kamar Mandi Dalam"
                  value={facilities}
                  onChange={e => setFacilities(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kelas Tiket'}
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

    </div>
  );
};
