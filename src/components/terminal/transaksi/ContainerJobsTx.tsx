import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Edit, Trash2, Search, Wrench } from 'lucide-react';
import { ContainerJob, Equipment } from '../../../types/terminal';
import { addContainerJob, updateContainerJob, deleteContainerJob } from '../../../lib/terminalDb';

interface ContainerJobsTxProps {
  containerJobs: ContainerJob[];
  equipments: Equipment[];
}

export const ContainerJobsTx: React.FC<ContainerJobsTxProps> = ({ containerJobs, equipments }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ContainerJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [jobCode, setJobCode] = useState<string>('');
  const [containerNumber, setContainerNumber] = useState<string>('');
  const [equipmentCode, setEquipmentCode] = useState<string>(equipments[0]?.code || 'QC-01');
  const [operatorName, setOperatorName] = useState<string>('Bpk. Ridwan Setiawan');
  const [fromLocation, setFromLocation] = useState<string>('Ship Deck (MV Maersk Seletar)');
  const [toLocation, setToLocation] = useState<string>('Yard Blok A1 (R04-T02)');
  const [status, setStatus] = useState<ContainerJob['status']>('Completed');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setJobCode(`JOB-2026-${Math.floor(100 + Math.random() * 900)}`);
    setContainerNumber('MSKU-901829-1');
    const eq = equipments[0];
    setEquipmentCode(eq?.code || 'QC-01');
    setOperatorName(eq?.operatorName || 'Bpk. Ridwan Setiawan');
    setFromLocation('Ship Deck');
    setToLocation('Yard Blok A1');
    setStatus('Completed');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (j: ContainerJob) => {
    setEditingItem(j);
    setJobCode(j.jobCode);
    setContainerNumber(j.containerNumber);
    setEquipmentCode(j.equipmentCode);
    setOperatorName(j.operatorName);
    setFromLocation(j.fromLocation);
    setToLocation(j.toLocation);
    setStatus(j.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobCode || !containerNumber) return;

    setIsSubmitting(true);
    try {
      const payload = {
        jobCode,
        containerNumber,
        equipmentCode,
        operatorName,
        fromLocation,
        toLocation,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status,
      };

      if (editingItem) {
        await updateContainerJob(editingItem.id, payload);
        alert(`✅ Job order movement "${jobCode}" berhasil diperbarui!`);
      } else {
        await addContainerJob(payload);
        alert(`✅ Job order movement baru "${jobCode}" berhasil dicatat di Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan job order movement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Hapus job order movement "${code}"?`)) {
      try {
        await deleteContainerJob(id);
        alert(`🗑️ "${code}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus job order.');
      }
    }
  };

  const filtered = containerJobs.filter(j => 
    j.jobCode.toLowerCase().includes(search.toLowerCase()) ||
    j.containerNumber.toLowerCase().includes(search.toLowerCase()) ||
    j.equipmentCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Job Order Equipment & Movement Container</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Log aktivitas pemindahan peti kemas oleh crane Quay Crane (QC), RTG, dan Reach Stacker antar kapal, yard, dan truk.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Job Movement Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari kode job, no. kontainer, crane..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Job Order</th>
                <th className="p-4">No. Container ISO</th>
                <th className="p-4">Alat Berat / Crane</th>
                <th className="p-4">Pergerakan (Dari ➔ Ke)</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Waktu Movement</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(j => (
                <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-cyan-800 text-sm">{j.jobCode}</td>
                  <td className="p-4 font-mono font-extrabold text-slate-900">{j.containerNumber}</td>
                  <td className="p-4 font-bold text-indigo-800">{j.equipmentCode}</td>
                  <td className="p-4 font-semibold text-slate-800">
                    <div>{j.fromLocation} ➔ {j.toLocation}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{j.operatorName}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{j.timestamp}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(j)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(j.id, j.jobCode)}
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
              {editingItem ? 'Edit Job Order Movement' : 'Buat Job Order Movement Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Job Order *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JOB-2026-901"
                    value={jobCode}
                    onChange={e => setJobCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Container ISO *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSKU-901829-1"
                    value={containerNumber}
                    onChange={e => setContainerNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alat Berat / Crane Bertugas *</label>
                <select
                  value={equipmentCode}
                  onChange={e => {
                    setEquipmentCode(e.target.value);
                    const foundEq = equipments.find(eq => eq.code === e.target.value);
                    if (foundEq) setOperatorName(foundEq.operatorName);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                >
                  {equipments.map(e => (
                    <option key={e.id} value={e.code}>{e.code} ({e.equipmentType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operator Crane</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={e => setOperatorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dari Lokasi</label>
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={e => setFromLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ke Lokasi</label>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={e => setToLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Job Order'}
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
