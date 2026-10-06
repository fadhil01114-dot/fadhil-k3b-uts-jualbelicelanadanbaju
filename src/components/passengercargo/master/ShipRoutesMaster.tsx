import React, { useState } from 'react';
import { Compass, Plus, Edit, Trash2, Search, MapPin, Navigation } from 'lucide-react';
import { ShipRoute } from '../../../types/passengerCargo';
import { addShipRoute, updateShipRoute, deleteShipRoute } from '../../../lib/passengerCargoDb';

interface ShipRoutesMasterProps {
  routes: ShipRoute[];
}

export const ShipRoutesMaster: React.FC<ShipRoutesMasterProps> = ({ routes }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingRoute, setEditingRoute] = useState<ShipRoute | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [routeCode, setRouteCode] = useState<string>('');
  const [originPort, setOriginPort] = useState<string>('');
  const [transitPort, setTransitPort] = useState<string>('');
  const [destinationPort, setDestinationPort] = useState<string>('');
  const [distanceMiles, setDistanceMiles] = useState<number>(500);
  const [durationHours, setDurationHours] = useState<number>(24);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setRouteCode(`RUT-0${routes.length + 1} (Priok - Makassar)`);
    setOriginPort('Pelabuhan Tanjung Priok (Jakarta)');
    setTransitPort('Pelabuhan Tanjung Perak (Surabaya)');
    setDestinationPort('Pelabuhan Soekarno-Hatta (Makassar)');
    setDistanceMiles(820);
    setDurationHours(42);
    setIsOpenModal(true);
  };

  const handleOpenEdit = (r: ShipRoute) => {
    setEditingRoute(r);
    setRouteCode(r.routeCode);
    setOriginPort(r.originPort);
    setTransitPort(r.transitPort || '');
    setDestinationPort(r.destinationPort);
    setDistanceMiles(r.distanceMiles);
    setDurationHours(r.durationHours);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeCode || !originPort || !destinationPort) return;

    setIsSubmitting(true);
    try {
      if (editingRoute) {
        await updateShipRoute(editingRoute.id, {
          routeCode, originPort, transitPort, destinationPort, distanceMiles, durationHours
        });
        alert(`✅ Rute "${routeCode}" diperbarui di Firestore!`);
      } else {
        await addShipRoute({
          routeCode, originPort, transitPort, destinationPort, distanceMiles, durationHours
        });
        alert(`✅ Rute baru "${routeCode}" disimpan ke Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan rute pelayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus rute "${code}" dari database?`)) {
      try {
        await deleteShipRoute(id);
        alert(`🗑️ Rute "${code}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus rute.');
      }
    }
  };

  const filtered = routes.filter(r =>
    r.routeCode.toLowerCase().includes(search.toLowerCase()) ||
    r.originPort.toLowerCase().includes(search.toLowerCase()) ||
    r.destinationPort.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Rute Pelayaran & Pelabuhan Singgah</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola rute trayek pelayaran, pelabuhan asal, pelabuhan transit, tujuan, jarak nautical miles, dan estimasi waktu tempuh.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rute Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode rute, pelabuhan asal, atau tujuan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-600 font-medium"
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
                <th className="p-4">Kode Rute</th>
                <th className="p-4">Pelabuhan Asal</th>
                <th className="p-4">Pelabuhan Transit (Opsional)</th>
                <th className="p-4">Pelabuhan Tujuan</th>
                <th className="p-4">Jarak & Durasi</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada data rute pelayaran.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-emerald-800">{r.routeCode}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{r.originPort}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{r.transitPort || '-'}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-sky-600" />
                        <span>{r.destinationPort}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      <div>{r.distanceMiles} Nautical Miles</div>
                      <div className="text-[10px] text-slate-500">{r.durationHours} Jam Pelayaran</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Rute"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.routeCode)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Rute"
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
              {editingRoute ? 'Edit Data Rute' : 'Tambah Rute Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode & Nama Trayek Rute *</label>
                <input
                  type="text"
                  required
                  placeholder="RUT-01 (Priok - Perak - Makassar)"
                  value={routeCode}
                  onChange={e => setRouteCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pelabuhan Asal *</label>
                <input
                  type="text"
                  required
                  placeholder="Pelabuhan Tanjung Priok (Jakarta)"
                  value={originPort}
                  onChange={e => setOriginPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pelabuhan Transit (Opsional)</label>
                <input
                  type="text"
                  placeholder="Pelabuhan Tanjung Perak (Surabaya)"
                  value={transitPort}
                  onChange={e => setTransitPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pelabuhan Tujuan *</label>
                <input
                  type="text"
                  required
                  placeholder="Pelabuhan Soekarno-Hatta (Makassar)"
                  value={destinationPort}
                  onChange={e => setDestinationPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jarak (Nautical Miles)</label>
                  <input
                    type="number"
                    value={distanceMiles}
                    onChange={e => setDistanceMiles(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durasi (Jam)</label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={e => setDurationHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Rute'}
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
