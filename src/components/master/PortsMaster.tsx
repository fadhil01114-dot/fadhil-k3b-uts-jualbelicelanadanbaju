import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Port } from '../../types/shipping';
import { addPort, updatePort, deletePort } from '../../lib/shippingDb';

interface PortsMasterProps {
  ports: Port[];
}

export const PortsMaster: React.FC<PortsMasterProps> = ({ ports }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('Indonesia');
  const [maxDraft, setMaxDraft] = useState<number>(12.0);
  const [berthCapacity, setBerthCapacity] = useState<number>(16);

  const handleOpenAdd = () => {
    setEditingPort(null);
    setName('');
    setCode('ID');
    setCity('');
    setCountry('Indonesia');
    setMaxDraft(12.5);
    setBerthCapacity(18);
    setIsOpenModal(true);
  };

  const handleOpenEdit = (p: Port) => {
    setEditingPort(p);
    setName(p.name);
    setCode(p.code);
    setCity(p.city);
    setCountry(p.country);
    setMaxDraft(p.maxDraft);
    setBerthCapacity(p.berthCapacity);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !city) return;

    setIsSubmitting(true);
    try {
      if (editingPort) {
        await updatePort(editingPort.id, { name, code, city, country, maxDraft, berthCapacity });
        alert(`✅ Data pelabuhan "${name}" berhasil diperbarui!`);
      } else {
        await addPort({ name, code, city, country, maxDraft, berthCapacity });
        alert(`✅ Pelabuhan baru "${name}" berhasil ditambahkan ke database!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan pelabuhan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, pName: string) => {
    if (confirm(`Hapus pelabuhan "${pName}"?`)) {
      try {
        await deletePort(id);
        alert(`🗑️ Pelabuhan "${pName}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus pelabuhan.');
      }
    }
  };

  const filtered = ports.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Pelabuhan & Terminal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data pelabuhan asal/tujuan, kode UN/LOCODE, draught kedalaman laut, dan kapasitas dermaga.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelabuhan Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama pelabuhan, kode UN/LOCODE, kota..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Ports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode UN/LOCODE</th>
                <th className="p-4">Nama Pelabuhan</th>
                <th className="p-4">Kota & Negara</th>
                <th className="p-4">Kedalaman Laut (Draft)</th>
                <th className="p-4">Kapasitas Dermaga</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-sky-700">{p.code}</td>
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{p.name}</td>
                  <td className="p-4 text-slate-700 font-semibold">{p.city}, {p.country}</td>
                  <td className="p-4 font-extrabold text-slate-900">{p.maxDraft} Meter</td>
                  <td className="p-4 font-bold text-slate-800">{p.berthCapacity} Dermaga Sandar</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
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
              {editingPort ? 'Edit Data Pelabuhan' : 'Tambah Pelabuhan Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pelabuhan *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pelabuhan Tanjung Priok"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode UN/LOCODE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IDTPP"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota / Lokasi *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jakarta Utara"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kedalaman Laut (Meter)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={maxDraft}
                    onChange={e => setMaxDraft(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapasitas Dermaga</label>
                  <input
                    type="number"
                    value={berthCapacity}
                    onChange={e => setBerthCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pelabuhan'}
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
