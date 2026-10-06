import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { CargoType } from '../../types/shipping';
import { addCargoType, updateCargoType, deleteCargoType } from '../../lib/shippingDb';

interface CargoTypesMasterProps {
  cargoTypes: CargoType[];
}

export const CargoTypesMaster: React.FC<CargoTypesMasterProps> = ({ cargoTypes }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CargoType | null>(null);

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<CargoType['category']>('Container 20ft');
  const [standardRatePerUnit, setStandardRatePerUnit] = useState<number>(8500000);
  const [unitName, setUnitName] = useState<CargoType['unitName']>('TEU');
  const [description, setDescription] = useState<string>('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setCategory('Container 20ft');
    setStandardRatePerUnit(8500000);
    setUnitName('TEU');
    setDescription('Muatan kontainer standar pelayaran inter-insular');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (c: CargoType) => {
    setEditingItem(c);
    setName(c.name);
    setCategory(c.category);
    setStandardRatePerUnit(c.standardRatePerUnit);
    setUnitName(c.unitName);
    setDescription(c.description);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || standardRatePerUnit <= 0) return;

    if (editingItem) {
      await updateCargoType(editingItem.id, { name, category, standardRatePerUnit, unitName, description });
    } else {
      await addCargoType({ name, category, standardRatePerUnit, unitName, description });
    }
    setIsOpenModal(false);
  };

  const handleDelete = async (id: string, cName: string) => {
    if (confirm(`Hapus tipe muatan "${cName}"?`)) {
      await deleteCargoType(id);
    }
  };

  const filtered = cargoTypes.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Tipe Muatan & Tarif Freight</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kategori muatan kargo (Kontainer 20ft/40ft, Curah Cair, Curah Kering) dan tarif acuan per TEU/Ton.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tipe Muatan Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari jenis kargo, kategori..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Cargo Types Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Jenis Kargo</th>
                <th className="p-4">Kategori Muatan</th>
                <th className="p-4">Tarif Acuan per Satuan</th>
                <th className="p-4">Satuan Ukur</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{c.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 border">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-600 text-sm">
                    Rp {c.standardRatePerUnit.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 font-bold text-slate-800">per {c.unitName}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">{c.description}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
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
              {editingItem ? 'Edit Tipe Muatan' : 'Tambah Tipe Muatan Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Jenis Kargo *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kontainer 20ft Dry"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Container 20ft">Container 20ft</option>
                    <option value="Container 40ft">Container 40ft</option>
                    <option value="Dry Bulk">Dry Bulk</option>
                    <option value="Liquid Bulk">Liquid Bulk</option>
                    <option value="General Cargo">General Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Satuan Ukur *</label>
                  <select
                    value={unitName}
                    onChange={e => setUnitName(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="TEU">TEU</option>
                    <option value="FEU">FEU</option>
                    <option value="Metric Ton">Metric Ton</option>
                    <option value="Kilo Liter">Kilo Liter</option>
                    <option value="Unit">Unit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tarif Freight Acuan (Rp per Satuan) *</label>
                <input
                  type="number"
                  required
                  value={standardRatePerUnit}
                  onChange={e => setStandardRatePerUnit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Muatan</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow"
                >
                  Simpan Tipe Muatan
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
