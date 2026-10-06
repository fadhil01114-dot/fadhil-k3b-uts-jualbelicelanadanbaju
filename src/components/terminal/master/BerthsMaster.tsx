import React, { useState } from 'react';
import { Anchor, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Berth } from '../../../types/terminal';
import { addBerth, updateBerth, deleteBerth } from '../../../lib/terminalDb';

interface BerthsMasterProps {
  berths: Berth[];
}

export const BerthsMaster: React.FC<BerthsMasterProps> = ({ berths }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Berth | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [lengthMeters, setLengthMeters] = useState<number>(300);
  const [maxDraft, setMaxDraft] = useState<number>(13.5);
  const [craneCount, setCraneCount] = useState<number>(3);
  const [status, setStatus] = useState<Berth['status']>('Available');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setLengthMeters(300);
    setMaxDraft(13.5);
    setCraneCount(3);
    setStatus('Available');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (b: Berth) => {
    setEditingItem(b);
    setName(b.name);
    setLengthMeters(b.lengthMeters);
    setMaxDraft(b.maxDraft);
    setCraneCount(b.craneCount);
    setStatus(b.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || lengthMeters <= 0) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateBerth(editingItem.id, { name, lengthMeters, maxDraft, craneCount, status });
        alert(`✅ Data dermaga "${name}" berhasil diperbarui!`);
      } else {
        await addBerth({ name, lengthMeters, maxDraft, craneCount, status });
        alert(`✅ Dermaga baru "${name}" berhasil ditambahkan ke database!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan dermaga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, bName: string) => {
    if (confirm(`Hapus dermaga "${bName}" dari database?`)) {
      try {
        await deleteBerth(id);
        alert(`🗑️ Dermaga "${bName}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus dermaga.');
      }
    }
  };

  const filtered = berths.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Anchor className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Dermaga & Quay Sandar</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data fasilitas dermaga sandar kapal peti kemas, panjang kade (meter), draught, dan jumlah crane terpasang.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dermaga Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama dermaga quay..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Berths Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Dermaga Quay</th>
                <th className="p-4">Panjang Kade Sandar</th>
                <th className="p-4">Kedalaman Laut (Draft)</th>
                <th className="p-4">Jumlah Quay Crane</th>
                <th className="p-4">Status Operational</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{b.name}</td>
                  <td className="p-4 font-black text-slate-900">{b.lengthMeters} Meter</td>
                  <td className="p-4 font-bold text-slate-800">{b.maxDraft} Meter Draft</td>
                  <td className="p-4 font-bold text-cyan-800">{b.craneCount} Unit QC Crane</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      b.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'Occupied' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {b.status}
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
                        onClick={() => handleDelete(b.id, b.name)}
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingItem ? 'Edit Data Dermaga' : 'Tambah Dermaga Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Dermaga Quay *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dermaga Internasional 01"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Panjang Kade (Meter) *</label>
                  <input
                    type="number"
                    required
                    value={lengthMeters}
                    onChange={e => setLengthMeters(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kedalaman Laut (Draft M)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={maxDraft}
                    onChange={e => setMaxDraft(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Quay Crane</label>
                  <input
                    type="number"
                    value={craneCount}
                    onChange={e => setCraneCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Sandar</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Dermaga'}
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
