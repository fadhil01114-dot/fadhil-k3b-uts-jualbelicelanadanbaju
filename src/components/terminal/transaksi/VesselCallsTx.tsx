import React, { useState } from 'react';
import { Ship, Plus, Edit, Trash2, Search, Anchor, Calendar } from 'lucide-react';
import { VesselCall, VesselCallStatus, Berth, ShippingLine } from '../../../types/terminal';
import { addVesselCall, updateVesselCall, deleteVesselCall } from '../../../lib/terminalDb';

interface VesselCallsTxProps {
  vesselCalls: VesselCall[];
  berths: Berth[];
  shippingLines: ShippingLine[];
}

export const VesselCallsTx: React.FC<VesselCallsTxProps> = ({
  vesselCalls,
  berths,
  shippingLines,
}) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<VesselCall | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [callSign, setCallSign] = useState<string>('');
  const [vesselName, setVesselName] = useState<string>('');
  const [shippingLineName, setShippingLineName] = useState<string>(shippingLines[0]?.lineName || '');
  const [berthName, setBerthName] = useState<string>(berths[0]?.name || '');
  const [eta, setEta] = useState<string>('2026-10-06 08:00');
  const [etd, setEtd] = useState<string>('2026-10-08 18:00');
  const [inboundTeu, setInboundTeu] = useState<number>(800);
  const [outboundTeu, setOutboundTeu] = useState<number>(650);
  const [status, setStatus] = useState<VesselCallStatus>('Loading/Unloading');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCallSign(`CALL-2026-${Math.floor(100 + Math.random() * 900)}`);
    setVesselName('MV Maersk Jakarta');
    setShippingLineName(shippingLines[0]?.lineName || 'Maersk Line A/S');
    setBerthName(berths[0]?.name || 'Dermaga Internasional 01');
    setEta('2026-10-06 08:00');
    setEtd('2026-10-08 18:00');
    setInboundTeu(850);
    setOutboundTeu(720);
    setStatus('Loading/Unloading');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (v: VesselCall) => {
    setEditingItem(v);
    setCallSign(v.callSign);
    setVesselName(v.vesselName);
    setShippingLineName(v.shippingLineName);
    setBerthName(v.berthName);
    setEta(v.eta);
    setEtd(v.etd);
    setInboundTeu(v.inboundTeu);
    setOutboundTeu(v.outboundTeu);
    setStatus(v.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callSign || !vesselName) return;

    setIsSubmitting(true);
    try {
      const payload = {
        callSign, vesselName, shippingLineName, berthName, eta, etd, inboundTeu, outboundTeu, status
      };

      if (editingItem) {
        await updateVesselCall(editingItem.id, payload);
        alert(`✅ Data Vessel Call "${callSign}" berhasil diperbarui!`);
      } else {
        await addVesselCall(payload);
        alert(`✅ Vessel Call baru "${callSign}" berhasil ditambahkan ke database!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan transaksi vessel call.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus data vessel call "${code}"?`)) {
      try {
        await deleteVesselCall(id);
        alert(`🗑️ "${code}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus vessel call.');
      }
    }
  };

  const filtered = vesselCalls.filter(v => 
    v.callSign.toLowerCase().includes(search.toLowerCase()) ||
    v.vesselName.toLowerCase().includes(search.toLowerCase()) ||
    v.shippingLineName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg">
              <Ship className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Sandar & Bongkar Muat Vessel (Vessel Calls)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan estimasi kedatangan/keberangkatan kapal container, alokasi dermaga sandar, dan manifes bongkar-muat TEU.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Vessel Sandar Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode call sign, nama kapal, shipping line..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Vessel Calls Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Call Sign</th>
                <th className="p-4">Nama Kapal & Shipping Line</th>
                <th className="p-4">Dermaga Quay Sandar</th>
                <th className="p-4">Jadwal ETA & ETD</th>
                <th className="p-4">Target TEU (Bongkar / Muat)</th>
                <th className="p-4">Status Operational</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-cyan-800 text-sm">{v.callSign}</td>
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 text-sm">{v.vesselName}</div>
                    <div className="text-[10px] text-slate-500">{v.shippingLineName}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{v.berthName}</td>
                  <td className="p-4 text-slate-700">
                    <div>ETA: <strong>{v.eta}</strong></div>
                    <div>ETD: <strong>{v.etd}</strong></div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    <span className="text-cyan-800 font-black">Bongkar: {v.inboundTeu} TEU</span> • <span className="text-emerald-700 font-black">Muat: {v.outboundTeu} TEU</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      v.status === 'Loading/Unloading' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                      v.status === 'Berthing' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      v.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {v.status}
                    </span>
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
                        onClick={() => handleDelete(v.id, v.callSign)}
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
              {editingItem ? 'Edit Transaksi Vessel Call' : 'Jadwalkan Vessel Sandar Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Call Sign *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CALL-2026-081"
                    value={callSign}
                    onChange={e => setCallSign(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Kapal Vessel *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MV Maersk Seletar"
                    value={vesselName}
                    onChange={e => setVesselName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shipping Line Agen *</label>
                  <select
                    value={shippingLineName}
                    onChange={e => setShippingLineName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  >
                    {shippingLines.map(s => (
                      <option key={s.id} value={s.lineName}>{s.lineName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dermaga Sandar *</label>
                  <select
                    value={berthName}
                    onChange={e => setBerthName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  >
                    {berths.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu ETA *</label>
                  <input
                    type="text"
                    required
                    value={eta}
                    onChange={e => setEta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu ETD *</label>
                  <input
                    type="text"
                    required
                    value={etd}
                    onChange={e => setEtd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inbound TEU (Bongkar)</label>
                  <input
                    type="number"
                    value={inboundTeu}
                    onChange={e => setInboundTeu(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outbound TEU (Muat)</label>
                  <input
                    type="number"
                    value={outboundTeu}
                    onChange={e => setOutboundTeu(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Sandar / Stevedoring</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as VesselCallStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-semibold"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Berthing">Berthing</option>
                  <option value="Loading/Unloading">Loading/Unloading</option>
                  <option value="Completed">Completed</option>
                  <option value="Departed">Departed</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Vessel Call'}
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
