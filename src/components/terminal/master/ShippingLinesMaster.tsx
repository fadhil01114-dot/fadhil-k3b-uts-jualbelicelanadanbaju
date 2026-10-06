import React, { useState } from 'react';
import { Ship, Plus, Edit, Trash2, Search, Mail, Phone } from 'lucide-react';
import { ShippingLine } from '../../../types/terminal';
import { addShippingLine, updateShippingLine, deleteShippingLine } from '../../../lib/terminalDb';

interface ShippingLinesMasterProps {
  shippingLines: ShippingLine[];
}

export const ShippingLinesMaster: React.FC<ShippingLinesMasterProps> = ({ shippingLines }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ShippingLine | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [lineName, setLineName] = useState<string>('');
  const [isoCode, setIsoCode] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('Indonesia 🇮🇩');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setLineName('');
    setIsoCode('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setCountry('Indonesia 🇮🇩');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (s: ShippingLine) => {
    setEditingItem(s);
    setLineName(s.lineName);
    setIsoCode(s.isoCode);
    setContactPerson(s.contactPerson);
    setEmail(s.email);
    setPhone(s.phone);
    setCountry(s.country);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineName || !email) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateShippingLine(editingItem.id, { lineName, isoCode, contactPerson, email, phone, country });
        alert(`✅ Shipping line "${lineName}" berhasil diperbarui!`);
      } else {
        await addShippingLine({ lineName, isoCode, contactPerson, email, phone, country });
        alert(`✅ Shipping line baru "${lineName}" berhasil ditambahkan!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal menyimpan shipping line.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, sName: string) => {
    if (confirm(`Hapus agen shipping line "${sName}" dari database?`)) {
      try {
        await deleteShippingLine(id);
        alert(`🗑️ "${sName}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus shipping line.');
      }
    }
  };

  const filtered = shippingLines.filter(s => 
    s.lineName.toLowerCase().includes(search.toLowerCase()) ||
    s.isoCode.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Ship className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Shipping Lines / Agen Kapal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data perusahaan pelayaran mitra terminal, kode ISO agen, kontak operasional, dan email booking.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Shipping Line Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama shipping line, kode ISO, kontak..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Shipping Lines Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Perusahaan Shipping Line</th>
                <th className="p-4">Kode ISO Prefix</th>
                <th className="p-4">Penanggung Jawab (PIC)</th>
                <th className="p-4">Email & No. Telepon</th>
                <th className="p-4">Asal Negara</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{s.lineName}</td>
                  <td className="p-4 font-mono font-bold text-cyan-800">{s.isoCode}</td>
                  <td className="p-4 font-bold text-slate-800">{s.contactPerson}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{s.email}</div>
                    <div className="text-[10px] text-slate-500">{s.phone}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{s.country}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.lineName)}
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
              {editingItem ? 'Edit Shipping Line' : 'Tambah Shipping Line Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Shipping Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maersk Line A/S"
                  value={lineName}
                  onChange={e => setLineName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode ISO Prefix</label>
                  <input
                    type="text"
                    placeholder="e.g. MAEU"
                    value={isoCode}
                    onChange={e => setIsoCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIC Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Telepon</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Asal Negara</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold text-white rounded-xl shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Shipping Line'}
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
