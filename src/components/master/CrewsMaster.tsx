import React, { useState } from 'react';
import { UserCheck, Plus, Edit, Trash2, Search, Award } from 'lucide-react';
import { CrewMember, CrewRank, Vessel } from '../../types/shipping';
import { addCrew, updateCrew, deleteCrew } from '../../lib/shippingDb';

interface CrewsMasterProps {
  crews: CrewMember[];
  vessels: Vessel[];
}

export const CrewsMaster: React.FC<CrewsMasterProps> = ({ crews, vessels }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CrewMember | null>(null);

  const [fullName, setFullName] = useState<string>('');
  const [rank, setRank] = useState<CrewRank>('Nakhoda (Captain)');
  const [certificateNo, setCertificateNo] = useState<string>('');
  const [assignedVesselId, setAssignedVesselId] = useState<string>(vessels[0]?.id || '');
  const [status, setStatus] = useState<CrewMember['status']>('On Duty');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFullName('');
    setRank('Nakhoda (Captain)');
    setCertificateNo(`ANT-I / ${Math.floor(8000000 + Math.random() * 900000)}`);
    setAssignedVesselId(vessels[0]?.id || '');
    setStatus('On Duty');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (c: CrewMember) => {
    setEditingItem(c);
    setFullName(c.fullName);
    setRank(c.rank);
    setCertificateNo(c.certificateNo);
    setAssignedVesselId(c.assignedVesselId);
    setStatus(c.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !certificateNo) return;

    if (editingItem) {
      await updateCrew(editingItem.id, { fullName, rank, certificateNo, assignedVesselId, status });
    } else {
      await addCrew({ fullName, rank, certificateNo, assignedVesselId, status });
    }
    setIsOpenModal(false);
  };

  const handleDelete = async (id: string, cName: string) => {
    if (confirm(`Hapus ABK/Nakhoda "${cName}"?`)) {
      await deleteCrew(id);
    }
  };

  const filtered = crews.filter(c => 
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.rank.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data ABK & Nakhoda Kapal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data Perwira & Anak ABK, jabatan (Nakhoda, KKM, Mualim), nomor sertifikat pelaut, dan penugasan kapal.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah ABK / Perwira Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama ABK, jabatan, nomor sertifikat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Crews Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Lengkap Perwira/ABK</th>
                <th className="p-4">Jabatan (Rank)</th>
                <th className="p-4">No. Sertifikat Pelaut</th>
                <th className="p-4">Kapal Penugasan</th>
                <th className="p-4">Status Tugas</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => {
                const assignedVessel = vessels.find(v => v.id === c.assignedVesselId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 text-sm">{c.fullName}</td>
                    <td className="p-4 font-bold text-sky-700">{c.rank}</td>
                    <td className="p-4 font-mono text-slate-600 font-semibold">{c.certificateNo}</td>
                    <td className="p-4 font-bold text-slate-800">
                      {assignedVessel ? assignedVessel.name : 'Belum Ditugaskan'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        c.status === 'On Duty' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'Available' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.fullName)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-base">
              {editingItem ? 'Edit Data ABK' : 'Tambah ABK Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Capt. Bambang Suryono"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan (Rank) *</label>
                  <select
                    value={rank}
                    onChange={e => setRank(e.target.value as CrewRank)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="Nakhoda (Captain)">Nakhoda (Captain)</option>
                    <option value="KKM (Chief Engineer)">KKM (Chief Engineer)</option>
                    <option value="Mualim I (Chief Officer)">Mualim I (Chief Officer)</option>
                    <option value="Mualim II (Second Officer)">Mualim II (Second Officer)</option>
                    <option value="Masinis I (First Engineer)">Masinis I (First Engineer)</option>
                    <option value="AB Sailor (Juru Mudi)">AB Sailor (Juru Mudi)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Sertifikat Pelaut *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ANT-I / 9021882"
                    value={certificateNo}
                    onChange={e => setCertificateNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penugasan Kapal</label>
                  <select
                    value={assignedVesselId}
                    onChange={e => setAssignedVesselId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="">-- Belum Ada --</option>
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Tugas</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Available">Available</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow"
                >
                  Simpan Data ABK
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
