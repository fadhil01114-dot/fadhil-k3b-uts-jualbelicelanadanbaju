import React, { useState } from 'react';
import { Wrench, Plus, Edit, Trash2, Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MaintenanceLog, Vessel } from '../../types/shipping';
import { addMaintenance, updateMaintenance, deleteMaintenance } from '../../lib/shippingDb';

interface MaintenancesTxProps {
  maintenances: MaintenanceLog[];
  vessels: Vessel[];
}

export const MaintenancesTx: React.FC<MaintenancesTxProps> = ({ maintenances, vessels }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MaintenanceLog | null>(null);

  // Form Fields
  const [vesselId, setVesselId] = useState<string>(vessels[0]?.id || '');
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceLog['maintenanceType']>('Routine Overhaul');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-15');
  const [costAmount, setCostAmount] = useState<number>(45000000);
  const [vendorName, setVendorName] = useState<string>('PT Docking Perdana');
  const [status, setStatus] = useState<MaintenanceLog['status']>('In Progress');
  const [notes, setNotes] = useState<string>('Pengecekan rutin dan overhaul mesin utama.');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setVesselId(vessels[0]?.id || '');
    setMaintenanceType('Routine Overhaul');
    setStartDate('2026-10-01');
    setEndDate('2026-10-15');
    setCostAmount(45000000);
    setVendorName('PT Docking Perdana');
    setStatus('In Progress');
    setNotes('Perbaikan mesin & servis berkala');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (m: MaintenanceLog) => {
    setEditingItem(m);
    setVesselId(m.vesselId);
    setMaintenanceType(m.maintenanceType);
    setStartDate(m.startDate);
    setEndDate(m.endDate);
    setCostAmount(m.costAmount);
    setVendorName(m.vendorName);
    setStatus(m.status);
    setNotes(m.notes);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vesselId || costAmount < 0) return;

    const selVessel = vessels.find(v => v.id === vesselId);

    const payload = {
      vesselId,
      vesselName: selVessel ? selVessel.name : 'Kapal Fleet',
      maintenanceType,
      startDate,
      endDate,
      costAmount,
      vendorName,
      status,
      notes,
    };

    if (editingItem) {
      await updateMaintenance(editingItem.id, payload);
    } else {
      await addMaintenance(payload);
    }
    setIsOpenModal(false);
  };

  const handleDelete = async (id: string, vName: string) => {
    if (confirm(`Hapus log perbaikan untuk kapal "${vName}"?`)) {
      await deleteMaintenance(id);
    }
  };

  const filtered = maintenances.filter(m => 
    m.vesselName.toLowerCase().includes(search.toLowerCase()) ||
    m.maintenanceType.toLowerCase().includes(search.toLowerCase()) ||
    m.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Wrench className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Pemeliharaan Kapal (Maintenance Log)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan perbaikan berkala, dry docking, overhaul mesin, vendor galangan kapal, dan biaya operasional.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Log Perbaikan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kapal, tipe perbaikan, vendor galangan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Maintenances Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Kapal Armada</th>
                <th className="p-4">Jenis Perbaikan</th>
                <th className="p-4">Tgl Mulai & Selesai</th>
                <th className="p-4">Vendor Galangan / Docking</th>
                <th className="p-4">Biaya Perbaikan (Rp)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{m.vesselName}</td>
                  <td className="p-4 font-bold text-slate-800">{m.maintenanceType}</td>
                  <td className="p-4 text-slate-700">
                    <div>{m.startDate} s/d {m.endDate}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{m.vendorName}</td>
                  <td className="p-4 font-black text-rose-600 text-sm">
                    Rp {m.costAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.vesselName)}
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
              {editingItem ? 'Edit Log Perbaikan' : 'Tambah Log Perbaikan Kapal'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Kapal Armada *</label>
                <select
                  value={vesselId}
                  onChange={e => setVesselId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                >
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Maintenance *</label>
                  <select
                    value={maintenanceType}
                    onChange={e => setMaintenanceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Routine Overhaul">Routine Overhaul</option>
                    <option value="Dry Docking">Dry Docking</option>
                    <option value="Engine Repair">Engine Repair</option>
                    <option value="Hull Inspection">Hull Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Work Order</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tgl Mulai *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tgl Selesai *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Biaya Maintenance (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={costAmount}
                    onChange={e => setCostAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-sky-600 text-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendor Galangan</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Pekerjaan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow"
                >
                  Simpan Log Perbaikan
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
