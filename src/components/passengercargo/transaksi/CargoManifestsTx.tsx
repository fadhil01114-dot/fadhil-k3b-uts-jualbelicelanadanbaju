import React, { useState } from 'react';
import { PackageCheck, Plus, Edit, Trash2, Search, Truck, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { CargoManifest, ShipVoyage, CargoCategory, ManifestStatus } from '../../../types/passengerCargo';
import { addCargoManifest, updateCargoManifest, deleteCargoManifest } from '../../../lib/passengerCargoDb';

interface CargoManifestsTxProps {
  cargoManifests: CargoManifest[];
  voyages: ShipVoyage[];
  cargoCategories: CargoCategory[];
}

export const CargoManifestsTx: React.FC<CargoManifestsTxProps> = ({
  cargoManifests,
  voyages,
  cargoCategories,
}) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingManifest, setEditingManifest] = useState<CargoManifest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [manifestNo, setManifestNo] = useState<string>('');
  const [voyageCode, setVoyageCode] = useState<string>('');
  const [shipperName, setShipperName] = useState<string>('');
  const [cargoCategory, setCargoCategory] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [truckPlate, setTruckPlate] = useState<string>('');
  const [weightTon, setWeightTon] = useState<number>(2);
  const [fareAmount, setFareAmount] = useState<number>(1450000);
  const [status, setStatus] = useState<ManifestStatus>('Loaded');

  const handleOpenAdd = () => {
    setEditingManifest(null);
    const defaultVoyage = voyages[0]?.voyageCode || 'VOY-KELUD-08';
    const defaultCat = cargoCategories[0] || { categoryName: 'Gol IV Mobil Pribadi', fareRate: 1450000 };

    setManifestNo(`CGO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setVoyageCode(defaultVoyage);
    setShipperName('PT Indofood Sukses Makmur Tbk');
    setCargoCategory(defaultCat.categoryName);
    setItemDescription('Muatan Sembako Indomie 1200 Karton');
    setTruckPlate('B 9812 UI');
    setWeightTon(12);
    setFareAmount(3800000);
    setStatus('Loaded');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (cm: CargoManifest) => {
    setEditingManifest(cm);
    setManifestNo(cm.manifestNo);
    setVoyageCode(cm.voyageCode);
    setShipperName(cm.shipperName);
    setCargoCategory(cm.cargoCategory);
    setItemDescription(cm.itemDescription);
    setTruckPlate(cm.truckPlate || '');
    setWeightTon(cm.weightTon);
    setFareAmount(cm.fareAmount);
    setStatus(cm.status);
    setIsOpenModal(true);
  };

  const handleSelectCategory = (catName: string) => {
    setCargoCategory(catName);
    const found = cargoCategories.find(c => c.categoryName === catName);
    if (found) {
      setFareAmount(found.fareRate);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manifestNo || !shipperName || !cargoCategory) return;

    setIsSubmitting(true);
    try {
      if (editingManifest) {
        await updateCargoManifest(editingManifest.id, {
          manifestNo, voyageCode, shipperName, cargoCategory, itemDescription, truckPlate, weightTon, fareAmount, status
        });
        alert(`✅ Resi Manifest "${manifestNo}" diperbarui di Firestore!`);
      } else {
        await addCargoManifest({
          manifestNo, voyageCode, shipperName, cargoCategory, itemDescription, truckPlate, weightTon, fareAmount, status
        });
        alert(`✅ Resi Manifest Baru "${manifestNo}" berhasil disimpan di Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan manifest kargo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, no: string) => {
    if (confirm(`Hapus resi manifest "${no}"?`)) {
      try {
        await deleteCargoManifest(id);
        alert(`🗑️ Resi manifest "${no}" dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus resi manifest.');
      }
    }
  };

  const filtered = cargoManifests.filter(cm =>
    cm.manifestNo.toLowerCase().includes(search.toLowerCase()) ||
    cm.shipperName.toLowerCase().includes(search.toLowerCase()) ||
    cm.itemDescription.toLowerCase().includes(search.toLowerCase()) ||
    (cm.truckPlate && cm.truckPlate.toLowerCase().includes(search.toLowerCase())) ||
    cm.voyageCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <PackageCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Manifest Muatan Kargo & Kendaraan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Input manifest barang kargo, golongan kendaraan (motor, mobil, truk), plat nomor, tonase berat, dan biaya pelayaran.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Input Manifest Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari no resi, nama pengirim, deskripsi, plat nomor, atau voyage..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal-600 font-medium"
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
                <th className="p-4">No. Resi Manifest</th>
                <th className="p-4">Voyage Kode</th>
                <th className="p-4">Pengirim & Deskripsi Barang</th>
                <th className="p-4">Golongan & Plat Nomor</th>
                <th className="p-4">Berat (Ton)</th>
                <th className="p-4">Biaya Kargo</th>
                <th className="p-4">Status Muat</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Belum ada transaksi manifest kargo & kendaraan.
                  </td>
                </tr>
              ) : (
                filtered.map(cm => (
                  <tr key={cm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-black text-teal-800 text-sm">{cm.manifestNo}</td>
                    <td className="p-4 font-mono font-bold text-sky-700">{cm.voyageCode}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{cm.shipperName}</div>
                      <div className="text-[11px] text-slate-500">{cm.itemDescription}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{cm.cargoCategory}</div>
                      {cm.truckPlate && (
                        <div className="font-mono text-[10px] text-slate-500">Plat: {cm.truckPlate}</div>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      {cm.weightTon} Ton
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      Rp {cm.fareAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        cm.status === 'Shipped' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        cm.status === 'Loaded' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {cm.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cm)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Manifest"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cm.id, cm.manifestNo)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Manifest"
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingManifest ? 'Edit Resi Manifest Kargo' : 'Input Manifest Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Resi Manifest *</label>
                  <input
                    type="text"
                    required
                    value={manifestNo}
                    onChange={e => setManifestNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-teal-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Voyage Keberangkatan *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Nama Pengirim / PT *</label>
                <input
                  type="text"
                  required
                  placeholder="PT Indofood Sukses Makmur Tbk"
                  value={shipperName}
                  onChange={e => setShipperName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Golongan Kargo / Kendaraan *</label>
                  <select
                    value={cargoCategory}
                    onChange={e => handleSelectCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    {cargoCategories.map(cat => (
                      <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plat Nomor Truk / Kendaraan</label>
                  <input
                    type="text"
                    placeholder="B 9812 UI"
                    value={truckPlate}
                    onChange={e => setTruckPlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Detail Muatan Kargo</label>
                <input
                  type="text"
                  placeholder="Muatan Sembako Indomie 1200 Karton"
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Berat (Ton)</label>
                  <input
                    type="number"
                    value={weightTon}
                    onChange={e => setWeightTon(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Biaya Kargo (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={fareAmount}
                    onChange={e => setFareAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-teal-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Muat</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Loaded">Loaded (Telah Dimuat)</option>
                    <option value="Shipped">Shipped (Dalam Pelayaran)</option>
                    <option value="Delivered">Delivered (Telah Diterima)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Manifest Kargo'}
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
