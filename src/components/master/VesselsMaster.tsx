import React, { useState } from 'react';
import { Ship, Plus, Edit, Trash2, Search, Anchor, ShieldCheck } from 'lucide-react';
import { Vessel, VesselType, VesselStatus } from '../../types/shipping';
import { addVessel, updateVessel, deleteVessel } from '../../lib/shippingDb';

interface VesselsMasterProps {
  vessels: Vessel[];
}

export const VesselsMaster: React.FC<VesselsMasterProps> = ({ vessels }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [imoNumber, setImoNumber] = useState<string>('');
  const [vesselType, setVesselType] = useState<VesselType>('Container Ship');
  const [dwtCapacity, setDwtCapacity] = useState<number>(35000);
  const [flag, setFlag] = useState<string>('Indonesia 🇮🇩');
  const [buildYear, setBuildYear] = useState<number>(2021);
  const [status, setStatus] = useState<VesselStatus>('Active');
  const [captainName, setCaptainName] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const handleOpenAdd = () => {
    setEditingVessel(null);
    setName('');
    setImoNumber(`IMO ${Math.floor(9000000 + Math.random() * 900000)}`);
    setVesselType('Container Ship');
    setDwtCapacity(35000);
    setFlag('Indonesia 🇮🇩');
    setBuildYear(2022);
    setStatus('Active');
    setCaptainName('Capt. Bambang Suryono');
    setPhotoUrl('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (v: Vessel) => {
    setEditingVessel(v);
    setName(v.name);
    setImoNumber(v.imoNumber);
    setVesselType(v.vesselType);
    setDwtCapacity(v.dwtCapacity);
    setFlag(v.flag);
    setBuildYear(v.buildYear);
    setStatus(v.status);
    setCaptainName(v.captainName || '');
    setPhotoUrl(v.photoUrl || '');
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imoNumber) return;

    setIsSubmitting(true);
    try {
      if (editingVessel) {
        await updateVessel(editingVessel.id, {
          name,
          imoNumber,
          vesselType,
          dwtCapacity,
          flag,
          buildYear,
          status,
          captainName,
          photoUrl,
        });
        alert(`✅ Kapal "${name}" berhasil diperbarui di database Firestore!`);
      } else {
        await addVessel({
          name,
          imoNumber,
          vesselType,
          dwtCapacity,
          flag,
          buildYear,
          status,
          captainName,
          photoUrl,
        });
        alert(`✅ Kapal baru "${name}" berhasil ditambahkan ke database Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan data kapal. Silakan periksa kembali isian form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, vName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kapal "${vName}" dari database?`)) {
      try {
        await deleteVessel(id);
        alert(`🗑️ Kapal "${vName}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus kapal.');
      }
    }
  };

  const filtered = vessels.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.imoNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.vesselType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Ship className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Kapal / Armada</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data spesifikasi teknis, tipe, kapasitas DWT, dan status operasional kapal di database Firestore.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kapal Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama kapal, nomor IMO, atau tipe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Vessels Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kapal & Foto</th>
                <th className="p-4">Tipe & IMO</th>
                <th className="p-4">Kapasitas DWT</th>
                <th className="p-4">Tahun & Bendera</th>
                <th className="p-4">Status</th>
                <th className="p-4">Nakhoda</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    Belum ada data kapal. Klik tombol "Tambah Kapal Baru" untuk menambahkan data.
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={v.photoUrl || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'} alt={v.name} className="w-12 h-12 object-cover rounded-xl bg-slate-100 border shrink-0" />
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{v.id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{v.vesselType}</div>
                      <div className="font-mono text-[10px] text-sky-700 font-semibold">{v.imoNumber}</div>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      {v.dwtCapacity.toLocaleString('id-ID')} DWT
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{v.buildYear}</div>
                      <div className="text-[11px] text-slate-500">{v.flag}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        v.status === 'In Voyage' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        v.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        v.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{v.captainName || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Data Kapal"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.name)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Kapal"
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

      {/* Add / Edit Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingVessel ? 'Edit Data Kapal' : 'Tambah Kapal Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kapal *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MV Samudera Express II"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor IMO *</label>
                  <input
                    type="text"
                    required
                    value={imoNumber}
                    onChange={e => setImoNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Kapal *</label>
                  <select
                    value={vesselType}
                    onChange={e => setVesselType(e.target.value as VesselType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-semibold"
                  >
                    <option value="Container Ship">Container Ship</option>
                    <option value="Bulk Carrier">Bulk Carrier</option>
                    <option value="Oil Tanker">Oil Tanker</option>
                    <option value="Tugboat / Barge">Tugboat / Barge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapasitas (DWT) *</label>
                  <input
                    type="number"
                    required
                    value={dwtCapacity}
                    onChange={e => setDwtCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Buatan</label>
                  <input
                    type="number"
                    value={buildYear}
                    onChange={e => setBuildYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kapal</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as VesselStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Active">Active</option>
                    <option value="In Voyage">In Voyage</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Anchored">Anchored</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Nakhoda / Captain</label>
                <input
                  type="text"
                  placeholder="e.g. Capt. Bambang Suryono"
                  value={captainName}
                  onChange={e => setCaptainName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Foto Kapal</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data Kapal'}
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
