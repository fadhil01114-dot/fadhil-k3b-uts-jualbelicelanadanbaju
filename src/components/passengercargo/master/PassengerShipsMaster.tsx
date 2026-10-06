import React, { useState } from 'react';
import { Ship, Plus, Edit, Trash2, Search, Anchor, Users, Truck, Package } from 'lucide-react';
import { PassengerShip } from '../../../types/passengerCargo';
import { addPassengerShip, updatePassengerShip, deletePassengerShip } from '../../../lib/passengerCargoDb';

interface PassengerShipsMasterProps {
  ships: PassengerShip[];
}

export const PassengerShipsMaster: React.FC<PassengerShipsMasterProps> = ({ ships }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingShip, setEditingShip] = useState<PassengerShip | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [vesselType, setVesselType] = useState<'Kapal Penumpang PELNI' | 'Kapal Ro-Ro Ferry' | 'Kapal Express Bahari'>('Kapal Penumpang PELNI');
  const [passengerCapacity, setPassengerCapacity] = useState<number>(1500);
  const [vehicleCapacity, setVehicleCapacity] = useState<number>(50);
  const [cargoCapacityTons, setCargoCapacityTons] = useState<number>(300);
  const [captainName, setCaptainName] = useState<string>('');
  const [status, setStatus] = useState<'Active' | 'In Voyage' | 'Maintenance' | 'Docked'>('Active');

  const handleOpenAdd = () => {
    setEditingShip(null);
    setName('');
    setVesselType('Kapal Penumpang PELNI');
    setPassengerCapacity(1800);
    setVehicleCapacity(60);
    setCargoCapacityTons(400);
    setCaptainName('Capt. Bambang Suryono');
    setStatus('Active');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (s: PassengerShip) => {
    setEditingShip(s);
    setName(s.name);
    setVesselType(s.vesselType);
    setPassengerCapacity(s.passengerCapacity);
    setVehicleCapacity(s.vehicleCapacity);
    setCargoCapacityTons(s.cargoCapacityTons);
    setCaptainName(s.captainName);
    setStatus(s.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      if (editingShip) {
        await updatePassengerShip(editingShip.id, {
          name, vesselType, passengerCapacity, vehicleCapacity,
          cargoCapacityTons, captainName, status
        });
        alert(`✅ Kapal "${name}" berhasil diperbarui di Firestore!`);
      } else {
        await addPassengerShip({
          name, vesselType, passengerCapacity, vehicleCapacity,
          cargoCapacityTons, captainName, status
        });
        alert(`✅ Kapal baru "${name}" berhasil disimpan ke Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan data kapal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, sName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kapal "${sName}"?`)) {
      try {
        await deletePassengerShip(id);
        alert(`🗑️ Kapal "${sName}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus kapal.');
      }
    }
  };

  const filtered = ships.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.captainName.toLowerCase().includes(search.toLowerCase()) ||
    s.vesselType.toLowerCase().includes(search.toLowerCase())
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
            <h2 className="text-lg font-black text-slate-900">Master Data Kapal Penumpang & Ro-Ro</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola armada kapal pelayaran, kapasitas penumpang, kuota kendaraan, tonase kargo, dan status kapal di Firestore.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kapal Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama kapal, tipe, atau nakhoda..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600 font-medium"
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
                <th className="p-4">Nama Kapal & Tipe</th>
                <th className="p-4">Kapasitas Penumpang</th>
                <th className="p-4">Kapasitas Kendaraan</th>
                <th className="p-4">Kapasitas Kargo</th>
                <th className="p-4">Nakhoda / Captain</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Belum ada data kapal penumpang.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 text-sm">{s.name}</div>
                      <div className="text-[11px] font-semibold text-sky-700">{s.vesselType}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>{s.passengerCapacity.toLocaleString('id-ID')} Orang</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-teal-600" />
                        <span>{s.vehicleCapacity} Unit</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-blue-600" />
                        <span>{s.cargoCapacityTons} Ton</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{s.captainName}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        s.status === 'In Voyage' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        s.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        s.status === 'Maintenance' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Kapal"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
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

      {/* Modal CRUD */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingShip ? 'Edit Data Kapal Penumpang' : 'Tambah Kapal Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kapal *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KM Kelud"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Kapal Pelayaran *</label>
                <select
                  value={vesselType}
                  onChange={e => setVesselType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-semibold"
                >
                  <option value="Kapal Penumpang PELNI">Kapal Penumpang PELNI</option>
                  <option value="Kapal Ro-Ro Ferry">Kapal Ro-Ro Ferry</option>
                  <option value="Kapal Express Bahari">Kapal Express Bahari</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penumpang</label>
                  <input
                    type="number"
                    required
                    value={passengerCapacity}
                    onChange={e => setPassengerCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kendaraan</label>
                  <input
                    type="number"
                    required
                    value={vehicleCapacity}
                    onChange={e => setVehicleCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kargo (Ton)</label>
                  <input
                    type="number"
                    required
                    value={cargoCapacityTons}
                    onChange={e => setCargoCapacityTons(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Nakhoda / Captain *</label>
                <input
                  type="text"
                  required
                  placeholder="Capt. Bambang Suryono"
                  value={captainName}
                  onChange={e => setCaptainName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Operasional</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Active">Active (Siap Layap)</option>
                  <option value="In Voyage">In Voyage (Dalam Pelayaran)</option>
                  <option value="Docked">Docked (Bersandar)</option>
                  <option value="Maintenance">Maintenance (Perbaikan)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kapal'}
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
