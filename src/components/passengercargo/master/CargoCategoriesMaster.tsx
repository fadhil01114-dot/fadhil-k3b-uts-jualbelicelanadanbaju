import React, { useState } from 'react';
import { Truck, Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { CargoCategory } from '../../../types/passengerCargo';
import { addCargoCategory, updateCargoCategory, deleteCargoCategory } from '../../../lib/passengerCargoDb';

interface CargoCategoriesMasterProps {
  cargoCategories: CargoCategory[];
}

export const CargoCategoriesMaster: React.FC<CargoCategoriesMasterProps> = ({ cargoCategories }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CargoCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [categoryName, setCategoryName] = useState<string>('');
  const [fareRate, setFareRate] = useState<number>(1500000);
  const [unit, setUnit] = useState<'Unit / Kendaraan' | 'Ton / Tonase' | 'Koli / Dus'>('Unit / Kendaraan');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryName('Gol IV Mobil Pribadi (Sedan/SUV/Minibus)');
    setFareRate(1450000);
    setUnit('Unit / Kendaraan');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (cc: CargoCategory) => {
    setEditingCategory(cc);
    setCategoryName(cc.categoryName);
    setFareRate(cc.fareRate);
    setUnit(cc.unit);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCargoCategory(editingCategory.id, { categoryName, fareRate, unit });
        alert(`✅ Golongan kargo "${categoryName}" diperbarui di Firestore!`);
      } else {
        await addCargoCategory({ categoryName, fareRate, unit });
        alert(`✅ Golongan kargo baru "${categoryName}" disimpan ke Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan golongan kargo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus golongan/kategori kargo "${name}"?`)) {
      try {
        await deleteCargoCategory(id);
        alert(`🗑️ Golongan kargo "${name}" dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus golongan kargo.');
      }
    }
  };

  const filtered = cargoCategories.filter(cc =>
    cc.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    cc.unit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-100 text-cyan-700 rounded-lg">
              <Truck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Golongan Kendaraan & Kargo</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola penggolongan muatan kendaraan (sepeda motor, mobil, truk) dan kargo barang tonase beserta tarif dasar pelayaran.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Golongan Kargo</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari golongan kendaraan atau kargo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600 font-medium"
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
                <th className="p-4">Golongan Kendaraan & Kargo</th>
                <th className="p-4">Satuan Penilaian Tarif</th>
                <th className="p-4">Tarif Dasar Pelayaran</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Belum ada data golongan kargo dan kendaraan.
                  </td>
                </tr>
              ) : (
                filtered.map(cc => (
                  <tr key={cc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-900 text-sm">{cc.categoryName}</td>
                    <td className="p-4 font-semibold text-slate-700">{cc.unit}</td>
                    <td className="p-4 font-extrabold text-cyan-800">
                      Rp {cc.fareRate.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cc)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Golongan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cc.id, cc.categoryName)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Golongan"
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
              {editingCategory ? 'Edit Golongan Kargo' : 'Tambah Golongan Kargo Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Golongan / Kendaraan *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gol IV Mobil Pribadi (Sedan/SUV)"
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Satuan Tarif *</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Unit / Kendaraan">Unit / Kendaraan</option>
                  <option value="Ton / Tonase">Ton / Tonase</option>
                  <option value="Koli / Dus">Koli / Dus</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tarif Dasar Pelayaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={fareRate}
                  onChange={e => setFareRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-cyan-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Golongan'}
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
