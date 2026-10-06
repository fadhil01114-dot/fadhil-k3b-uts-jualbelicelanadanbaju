import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Phone, Mail } from 'lucide-react';
import { TicketAgent } from '../../../types/passengerCargo';
import { addTicketAgent, updateTicketAgent, deleteTicketAgent } from '../../../lib/passengerCargoDb';

interface TicketAgentsMasterProps {
  agents: TicketAgent[];
}

export const TicketAgentsMaster: React.FC<TicketAgentsMasterProps> = ({ agents }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<TicketAgent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form
  const [agentCode, setAgentCode] = useState<string>('');
  const [agentName, setAgentName] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [commissionPercent, setCommissionPercent] = useState<number>(5);

  const handleOpenAdd = () => {
    setEditingAgent(null);
    setAgentCode(`AG-LOKET-0${agents.length + 1}`);
    setAgentName('PT Loket Bahari Utama Travel');
    setContactPerson('Bpk. Budi Santoso');
    setPhone('031-3291029');
    setEmail('booking@loketbahari.co.id');
    setCommissionPercent(7);
    setIsOpenModal(true);
  };

  const handleOpenEdit = (a: TicketAgent) => {
    setEditingAgent(a);
    setAgentCode(a.agentCode);
    setAgentName(a.agentName);
    setContactPerson(a.contactPerson);
    setPhone(a.phone);
    setEmail(a.email);
    setCommissionPercent(a.commissionPercent);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentCode || !agentName) return;

    setIsSubmitting(true);
    try {
      if (editingAgent) {
        await updateTicketAgent(editingAgent.id, {
          agentCode, agentName, contactPerson, phone, email, commissionPercent
        });
        alert(`✅ Agen "${agentName}" diperbarui di Firestore!`);
      } else {
        await addTicketAgent({
          agentCode, agentName, contactPerson, phone, email, commissionPercent
        });
        alert(`✅ Agen baru "${agentName}" disimpan ke Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan data agen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus agen partner "${name}"?`)) {
      try {
        await deleteTicketAgent(id);
        alert(`🗑️ Agen "${name}" dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus agen.');
      }
    }
  };

  const filtered = agents.filter(a =>
    a.agentName.toLowerCase().includes(search.toLowerCase()) ||
    a.agentCode.toLowerCase().includes(search.toLowerCase()) ||
    a.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Agen & Mitra Penjualan Tiket</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola agen travel partner, agen resmi pelayaran, komisi penjualan tiket, dan kontak penanggung jawab.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agen Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama agen, kode agen, atau kontak..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-purple-600 font-medium"
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
                <th className="p-4">Kode & Nama Agen</th>
                <th className="p-4">Penanggung Jawab (PIC)</th>
                <th className="p-4">Kontak Telepon & Email</th>
                <th className="p-4">Komisi Penjualan</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada data agen tiket.
                  </td>
                </tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-purple-700">{a.agentCode}</div>
                      <div className="font-extrabold text-slate-900 text-sm">{a.agentName}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{a.contactPerson}</td>
                    <td className="p-4 text-slate-700 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{a.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{a.email}</span>
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-purple-800">
                      {a.commissionPercent}% / Tiket
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          title="Edit Agen"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.agentName)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold"
                          title="Hapus Agen"
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
              {editingAgent ? 'Edit Data Agen Tiket' : 'Tambah Agen Baru (Create)'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Agen *</label>
                  <input
                    type="text"
                    required
                    value={agentCode}
                    onChange={e => setAgentCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Komisi (%)</label>
                  <input
                    type="number"
                    value={commissionPercent}
                    onChange={e => setCommissionPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Agen / PT *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT Loket Bahari Utama Travel"
                  value={agentName}
                  onChange={e => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
                <input
                  type="text"
                  placeholder="e.g. Ibu Ratna Juwita"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Agen'}
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
