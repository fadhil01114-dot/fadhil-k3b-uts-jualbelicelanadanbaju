import React, { useState } from 'react';
import { Box, Plus, Edit, Trash2, Search } from 'lucide-react';
import { ContainerCategory } from '../../../types/terminal';
import { addCategory, updateCategory, deleteCategory } from '../../../lib/terminalDb';

interface CategoriesMasterProps {
  categories: ContainerCategory[];
}

export const CategoriesMaster: React.FC<CategoriesMasterProps> = ({ categories }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ContainerCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<ContainerCategory['size']>('20ft');
  const [type, setType] = useState<ContainerCategory['type']>('Dry Standard');
  const [handlingFeePerShift, setHandlingFeePerShift] = useState<number>(1250000);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCode('20GP');
    setName('20ft Standard Dry Container');
    setSize('20ft');
    setType('Dry Standard');
    setHandlingFeePerShift(1250000);
    setIsOpenModal(true);
  };

  const handleOpenEdit = (c: ContainerCategory) => {
    setEditingItem(c);
    setCode(c.code);
    setName(c.name);
    setSize(c.size);
    setType(c.type);
    setHandlingFeePerShift(c.handlingFeePerShift);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || handlingFeePerShift <= 0) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateCategory(editingItem.id, { code, name, size, type, handlingFeePerShift });
        alert(`✅ Kategori container "${code}" berhasil diperbarui!`);
      } else {
        await addCategory({ code, name, size, type, handlingFeePerShift });
        alert(`✅ Kategori container baru "${code}" berhasil ditambahkan!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan kategori container.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, cCode: string) => {
    if (confirm(`Hapus kategori container "${cCode}" dari database?`)) {
      try {
        await deleteCategory(id);
        alert(`🗑️ Kategori "${cCode}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus kategori.');
      }
    }
  };

  const filtered = categories.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg">
              <Box className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Kategori & Tarif Handling Container</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kode ISO kontainer (20GP, 40HC, 20RF), tipe (Dry, Reefer, Dangerous Goods), dan tarif stevedoring per shift.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori ISO Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode ISO, deskripsi container..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode ISO</th>
                <th className="p-4">Deskripsi Container</th>
                <th className="p-4">Ukuran Feet</th>
                <th className="p-4">Tipe Kargo</th>
                <th className="p-4">Tarif Handling Shift (Rp)</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-cyan-800 text-sm">{c.code}</td>
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{c.name}</td>
                  <td className="p-4 font-bold text-slate-800">{c.size}</td>
                  <td className="p-4 font-semibold text-slate-700">{c.type}</td>
                  <td className="p-4 font-black text-emerald-600 text-sm">
                    Rp {c.handlingFeePerShift.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
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
              {editingItem ? 'Edit Kategori ISO Container' : 'Tambah Kategori ISO Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode ISO Container *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20GP"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ukuran Feet *</label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-semibold"
                  >
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Deskripsi *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20ft Standard Dry Container"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Peti Kemas</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-semibold"
                >
                  <option value="Dry Standard">Dry Standard</option>
                  <option value="High Cube">High Cube</option>
                  <option value="Reefer / Pendingin">Reefer / Pendingin</option>
                  <option value="Hazardous / DG">Hazardous / DG</option>
                  <option value="Flat Rack">Flat Rack</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tarif Handling Shift (Rp) *</label>
                <input
                  type="number"
                  required
                  value={handlingFeePerShift}
                  onChange={e => setHandlingFeePerShift(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-600 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori ISO'}
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
