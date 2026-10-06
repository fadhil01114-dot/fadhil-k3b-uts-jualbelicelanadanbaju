import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Box } from 'lucide-react';
import { YardBlock } from '../../../types/terminal';
import { addYardBlock, updateYardBlock, deleteYardBlock } from '../../../lib/terminalDb';

interface YardBlocksMasterProps {
  yardBlocks: YardBlock[];
}

export const YardBlocksMaster: React.FC<YardBlocksMasterProps> = ({ yardBlocks }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<YardBlock | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [blockCode, setBlockCode] = useState<string>('');
  const [capacityTeu, setCapacityTeu] = useState<number>(1000);
  const [currentTeuCount, setCurrentTeuCount] = useState<number>(500);
  const [totalRows, setTotalRows] = useState<number>(10);
  const [totalTiers, setTotalTiers] = useState<number>(5);
  const [categoryAllowed, setCategoryAllowed] = useState<string>('Dry Standard 20ft/40ft');
  const [status, setStatus] = useState<YardBlock['status']>('Active');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setBlockCode('');
    setCapacityTeu(1000);
    setCurrentTeuCount(0);
    setTotalRows(10);
    setTotalTiers(5);
    setCategoryAllowed('Dry Standard 20ft/40ft');
    setStatus('Active');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (b: YardBlock) => {
    setEditingItem(b);
    setBlockCode(b.blockCode);
    setCapacityTeu(b.capacityTeu);
    setCurrentTeuCount(b.currentTeuCount);
    setTotalRows(b.totalRows);
    setTotalTiers(b.totalTiers);
    setCategoryAllowed(b.categoryAllowed);
    setStatus(b.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockCode || capacityTeu <= 0) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateYardBlock(editingItem.id, {
          blockCode, capacityTeu, currentTeuCount, totalRows, totalTiers, categoryAllowed, status
        });
        alert(`✅ Blok yard "${blockCode}" berhasil diperbarui!`);
      } else {
        await addYardBlock({
          blockCode, capacityTeu, currentTeuCount, totalRows, totalTiers, categoryAllowed, status
        });
        alert(`✅ Blok yard baru "${blockCode}" berhasil ditambahkan ke database Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan data blok yard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus blok yard "${code}" dari database?`)) {
      try {
        await deleteYardBlock(id);
        alert(`🗑️ Blok yard "${code}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus blok yard.');
      }
    }
  };

  const filtered = yardBlocks.filter(b => 
    b.blockCode.toLowerCase().includes(search.toLowerCase()) ||
    b.categoryAllowed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Blok Stack & Yard Lapangan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan blok lokasi penumpukan peti kemas, kapasitas TEU, jumlah row/tier, dan jenis kargo yang diizinkan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Blok Yard Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode blok, jenis kargo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Yard Blocks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Blok Yard</th>
                <th className="p-4">Kapasitas TEU</th>
                <th className="p-4">Terisi Saat Ini</th>
                <th className="p-4">Row & Tier</th>
                <th className="p-4">Kategori Kargo Diizinkan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => {
                const pct = Math.round((b.currentTeuCount / b.capacityTeu) * 100);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 text-sm">{b.blockCode}</td>
                    <td className="p-4 font-black text-slate-900">{b.capacityTeu.toLocaleString('id-ID')} TEU</td>
                    <td className="p-4">
                      <span className="font-extrabold text-cyan-800">{b.currentTeuCount.toLocaleString('id-ID')} TEU</span>
                      <span className="text-slate-400 ml-1">({pct}%)</span>
                    </td>
                    <td className="p-4 text-slate-700 font-bold">{b.totalRows} Row x {b.totalTiers} Tier</td>
                    <td className="p-4 font-semibold text-slate-800">{b.categoryAllowed}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        b.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Full' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-800'
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
                          onClick={() => handleDelete(b.id, b.blockCode)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingItem ? 'Edit Blok Yard' : 'Tambah Blok Yard Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Blok Yard *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blok A1 (Dry Import)"
                  value={blockCode}
                  onChange={e => setBlockCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapasitas Maksimal (TEU) *</label>
                  <input
                    type="number"
                    required
                    value={capacityTeu}
                    onChange={e => setCapacityTeu(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Terisi Saat Ini (TEU)</label>
                  <input
                    type="number"
                    value={currentTeuCount}
                    onChange={e => setCurrentTeuCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Row</label>
                  <input
                    type="number"
                    value={totalRows}
                    onChange={e => setTotalRows(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Tier (Tumpukan)</label>
                  <input
                    type="number"
                    value={totalTiers}
                    onChange={e => setTotalTiers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Kargo Diizinkan</label>
                <input
                  type="text"
                  placeholder="e.g. Dry Standard 20ft/40ft"
                  value={categoryAllowed}
                  onChange={e => setCategoryAllowed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Blok</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Full">Full</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Blok Yard'}
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
