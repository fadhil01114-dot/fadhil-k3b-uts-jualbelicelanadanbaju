import React, { useState } from 'react';
import { CalendarDays, Plus, Edit, Trash2, Search, Ship, MapPin, CheckCircle2 } from 'lucide-react';
import { ShipVoyage, PassengerShip, ShipRoute, ShipVoyageStatus } from '../../../types/passengerCargo';
import { addShipVoyage, updateShipVoyage, deleteShipVoyage } from '../../../lib/passengerCargoDb';

interface ShipVoyagesTxProps {
  voyages: ShipVoyage[];
  ships: PassengerShip[];
  routes: ShipRoute[];
}

export const ShipVoyagesTx: React.FC<ShipVoyagesTxProps> = ({ voyages, ships, routes }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingVoyage, setEditingVoyage] = useState<ShipVoyage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [voyageCode, setVoyageCode] = useState<string>('');
  const [shipName, setShipName] = useState<string>('');
  const [routeCode, setRouteCode] = useState<string>('');
  const [originPort, setOriginPort] = useState<string>('');
  const [destinationPort, setDestinationPort] = useState<string>('');
  const [etd, setEtd] = useState<string>('');
  const [eta, setEta] = useState<string>('');
  const [status, setStatus] = useState<ShipVoyageStatus>('Scheduled');

  const handleOpenAdd = () => {
    setEditingVoyage(null);
    const defaultShip = ships[0]?.name || 'KM Kelud';
    const defaultRoute = routes[0] || {
      routeCode: 'RUT-01',
      originPort: 'Pelabuhan Tanjung Priok (Jakarta)',
      destinationPort: 'Pelabuhan Soekarno-Hatta (Makassar)'
    };

    setVoyageCode(`VOY-${defaultShip.replace(/\s+/g, '').toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`);
    setShipName(defaultShip);
    setRouteCode(defaultRoute.routeCode);
    setOriginPort(defaultRoute.originPort);
    setDestinationPort(defaultRoute.destinationPort);
    setEtd('2026-10-07 14:00');
    setEta('2026-10-09 08:00');
    setStatus('Scheduled');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (v: ShipVoyage) => {
    setEditingVoyage(v);
    setVoyageCode(v.voyageCode);
    setShipName(v.shipName);
    setRouteCode(v.routeCode);
    setOriginPort(v.originPort);
    setDestinationPort(v.destinationPort);
    setEtd(v.etd);
    setEta(v.eta);
    setStatus(v.status);
    setIsOpenModal(true);
  };

  const handleSelectRoute = (rtCode: string) => {
    setRouteCode(rtCode);
    const found = routes.find(r => r.routeCode === rtCode);
    if (found) {
      setOriginPort(found.originPort);
      setDestinationPort(found.destinationPort);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voyageCode || !shipName) return;

    setIsSubmitting(true);
    try {
      if (editingVoyage) {
        await updateShipVoyage(editingVoyage.id, {
          voyageCode, shipName, routeCode, originPort, destinationPort, etd, eta, status
        });
        alert(`✅ Voyage "${voyageCode}" diperbarui di Firestore!`);
      } else {
        await addShipVoyage({
          voyageCode, shipName, routeCode, originPort, destinationPort, etd, eta,
          bookedPassengers: 0, bookedVehicles: 0, status
        });
        alert(`✅ Voyage baru "${voyageCode}" berhasil dijadwalkan di Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan jadwal voyage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus jadwal voyage "${code}" dari database?`)) {
      try {
        await deleteShipVoyage(id);
        alert(`🗑️ Voyage "${code}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus voyage.');
      }
    }
  };

  const filtered = voyages.filter(v =>
    v.voyageCode.toLowerCase().includes(search.toLowerCase()) ||
    v.shipName.toLowerCase().includes(search.toLowerCase()) ||
    v.originPort.toLowerCase().includes(search.toLowerCase()) ||
    v.destinationPort.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Jadwal Voyage & Keberangkatan Pelayaran</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Jadwalkan keberangkatan kapal, ubah status voyage (Scheduled, Boarding Open, Sailing, Completed), dan update jam ETD/ETA.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Voyage Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode voyage, nama kapal, atau pelabuhan..."
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
                <th className="p-4">Kode Voyage</th>
                <th className="p-4">Nama Kapal & Trayek Rute</th>
                <th className="p-4">Pelabuhan Asal & Tujuan</th>
                <th className="p-4">Jam ETD & ETA</th>
                <th className="p-4">Kuota Penumpang & Kendaraan</th>
                <th className="p-4">Status Voyage</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Belum ada data jadwal voyage.
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-black text-sky-700 text-sm">{v.voyageCode}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{v.shipName}</div>
                      <div className="text-[11px] text-slate-500">{v.routeCode}</div>
                    </td>
                    <td className="p-4 text-slate-800">
                      <div><span className="font-bold text-slate-500">Dari:</span> {v.originPort}</div>
                      <div><span className="font-bold text-slate-500">Ke:</span> {v.destinationPort}</div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-700">
                      <div><span className="font-bold text-slate-900">ETD:</span> {v.etd}</div>
                      <div><span className="font-bold text-slate-900">ETA:</span> {v.eta}</div>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      {v.bookedPassengers} Orang • {v.bookedVehicles} Kendaraan
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        v.status === 'Sailing' ? 'bg-sky-100 text-sky-800 border border-sky-300 animate-pulse' :
                        v.status === 'Boarding Open' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        v.status === 'Completed' ? 'bg-slate-200 text-slate-800' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Voyage"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.voyageCode)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Voyage"
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
              {editingVoyage ? 'Edit Voyage Keberangkatan' : 'Jadwalkan Voyage Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Voyage *</label>
                  <input
                    type="text"
                    required
                    value={voyageCode}
                    onChange={e => setVoyageCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Kapal Pelayaran *</label>
                  <select
                    value={shipName}
                    onChange={e => setShipName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {ships.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.vesselType})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Rute Trayek *</label>
                <select
                  value={routeCode}
                  onChange={e => handleSelectRoute(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.routeCode}>{r.routeCode}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pelabuhan Asal</label>
                  <input
                    type="text"
                    value={originPort}
                    onChange={e => setOriginPort(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pelabuhan Tujuan</label>
                  <input
                    type="text"
                    value={destinationPort}
                    onChange={e => setDestinationPort(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jadwal ETD (Keberangkatan)</label>
                  <input
                    type="text"
                    placeholder="2026-10-07 14:00"
                    value={etd}
                    onChange={e => setEtd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jadwal ETA (Kedatangan)</label>
                  <input
                    type="text"
                    placeholder="2026-10-09 08:00"
                    value={eta}
                    onChange={e => setEta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Voyage Operasional</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Scheduled">Scheduled (Terjadwal)</option>
                  <option value="Boarding Open">Boarding Open (Mulai Check-In Penumpang)</option>
                  <option value="Sailing">Sailing (Sedang Pelayaran)</option>
                  <option value="Arrived">Arrived (Tiba di Pelabuhan)</option>
                  <option value="Completed">Completed (Voyage Selesai)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Schedule Voyage'}
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
