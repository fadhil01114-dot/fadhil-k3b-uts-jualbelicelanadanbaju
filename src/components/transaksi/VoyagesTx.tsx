import React, { useState } from 'react';
import { Compass, Plus, Edit, Trash2, Search, MapPin, Calendar, Ship } from 'lucide-react';
import { Voyage, VoyageStatus, Vessel, Port } from '../../types/shipping';
import { addVoyage, updateVoyage, deleteVoyage } from '../../lib/shippingDb';

interface VoyagesTxProps {
  voyages: Voyage[];
  vessels: Vessel[];
  ports: Port[];
}

export const VoyagesTx: React.FC<VoyagesTxProps> = ({ voyages, vessels, ports }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Voyage | null>(null);

  // Form Fields
  const [voyageNumber, setVoyageNumber] = useState<string>('');
  const [vesselId, setVesselId] = useState<string>(vessels[0]?.id || '');
  const [originPortId, setOriginPortId] = useState<string>(ports[0]?.id || '');
  const [destinationPortId, setDestinationPortId] = useState<string>(ports[1]?.id || '');
  const [etd, setEtd] = useState<string>('2026-10-06');
  const [eta, setEta] = useState<string>('2026-10-09');
  const [status, setStatus] = useState<VoyageStatus>('Scheduled');
  const [captainName, setCaptainName] = useState<string>('');
  const [totalFreightValue, setTotalFreightValue] = useState<number>(250000000);

  const handleOpenAdd = () => {
    setEditingItem(null);
    const code = `VOY-2026-${Math.floor(100 + Math.random() * 900)}`;
    setVoyageNumber(code);
    const ves = vessels[0];
    setVesselId(ves?.id || '');
    setCaptainName(ves?.captainName || 'Capt. Bambang Suryono');
    setOriginPortId(ports[0]?.id || '');
    setDestinationPortId(ports[1]?.id || '');
    setEtd('2026-10-06');
    setEta('2026-10-09');
    setStatus('Scheduled');
    setTotalFreightValue(250000000);
    setIsOpenModal(true);
  };

  const handleOpenEdit = (v: Voyage) => {
    setEditingItem(v);
    setVoyageNumber(v.voyageNumber);
    setVesselId(v.vesselId);
    setOriginPortId(v.originPortId);
    setDestinationPortId(v.destinationPortId);
    setEtd(v.etd);
    setEta(v.eta);
    setStatus(v.status);
    setCaptainName(v.captainName);
    setTotalFreightValue(v.totalFreightValue);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voyageNumber || !vesselId || !originPortId || !destinationPortId) return;

    const selVessel = vessels.find(v => v.id === vesselId);
    const selOrigin = ports.find(p => p.id === originPortId);
    const selDest = ports.find(p => p.id === destinationPortId);

    const payload = {
      voyageNumber,
      vesselId,
      vesselName: selVessel ? selVessel.name : 'Kapal Pelayaran',
      originPortId,
      originPortName: selOrigin ? `${selOrigin.name} (${selOrigin.city})` : 'Pelabuhan Asal',
      destinationPortId,
      destinationPortName: selDest ? `${selDest.name} (${selDest.city})` : 'Pelabuhan Tujuan',
      etd,
      eta,
      status,
      captainName: captainName || (selVessel ? selVessel.captainName : 'Capt. Officer'),
      totalFreightValue,
    };

    if (editingItem) {
      await updateVoyage(editingItem.id, payload);
    } else {
      await addVoyage(payload);
    }
    setIsOpenModal(false);
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus transaksi jadwal voyage "${code}"?`)) {
      await deleteVoyage(id);
    }
  };

  const filtered = voyages.filter(v => 
    v.voyageNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.vesselName.toLowerCase().includes(search.toLowerCase()) ||
    v.originPortName.toLowerCase().includes(search.toLowerCase()) ||
    v.destinationPortName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Jadwal Pelayaran (Voyage Schedule)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan rute pelayaran antar pelabuhan, jadwal ETD/ETA, Nakhoda yang bertugas, dan status pelayaran.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal Voyage Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode voyage, nama kapal, pelabuhan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Voyage List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Voyage</th>
                <th className="p-4">Kapal Armada</th>
                <th className="p-4">Rute (Pelabuhan Asal ➔ Tujuan)</th>
                <th className="p-4">Jadwal ETD & ETA</th>
                <th className="p-4">Status Voyage</th>
                <th className="p-4">Estimasi Freight</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-sky-700 text-sm">{v.voyageNumber}</td>
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900">{v.vesselName}</div>
                    <div className="text-[10px] text-slate-500">Nakhoda: {v.captainName}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{v.originPortName}</span>
                    </div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{v.destinationPortName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700">ETD: <strong className="text-slate-900">{v.etd}</strong></div>
                    <div className="text-slate-700">ETA: <strong className="text-slate-900">{v.eta}</strong></div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      v.status === 'Sailing' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                      v.status === 'Loading' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      v.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-600 text-sm">
                    Rp {v.totalFreightValue.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(v)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id, v.voyageNumber)}
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingItem ? 'Edit Transaksi Voyage' : 'Buat Jadwal Voyage Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Voyage *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VOY-2026-088"
                  value={voyageNumber}
                  onChange={e => setVoyageNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapal Armada *</label>
                  <select
                    value={vesselId}
                    onChange={e => {
                      setVesselId(e.target.value);
                      const sel = vessels.find(v => v.id === e.target.value);
                      if (sel) setCaptainName(sel.captainName);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.vesselType})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Voyage</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as VoyageStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Loading">Loading</option>
                    <option value="Sailing">Sailing</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Unloading">Unloading</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pelabuhan Asal *</label>
                  <select
                    value={originPortId}
                    onChange={e => setOriginPortId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    {ports.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pelabuhan Tujuan *</label>
                  <select
                    value={destinationPortId}
                    onChange={e => setDestinationPortId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    {ports.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimasi Berangkat (ETD) *</label>
                  <input
                    type="date"
                    required
                    value={etd}
                    onChange={e => setEtd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimasi Tiba (ETA) *</label>
                  <input
                    type="date"
                    required
                    value={eta}
                    onChange={e => setEta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nakhoda Bertugas</label>
                  <input
                    type="text"
                    value={captainName}
                    onChange={e => setCaptainName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Pendapatan Freight (Rp)</label>
                  <input
                    type="number"
                    value={totalFreightValue}
                    onChange={e => setTotalFreightValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow"
                >
                  Simpan Jadwal Voyage
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
