import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Building2, Mail, Phone } from 'lucide-react';
import { Shipper } from '../../types/shipping';
import { addShipper, updateShipper, deleteShipper } from '../../lib/shippingDb';

interface ShippersMasterProps {
  shippers: Shipper[];
}

export const ShippersMaster: React.FC<ShippersMasterProps> = ({ shippers }) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Shipper | null>(null);

  const [companyName, setCompanyName] = useState<string>('');
  const [npwp, setNpwp] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [creditLimit, setCreditLimit] = useState<number>(5000000000);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCompanyName('');
    setNpwp('01.000.000.0-000.000');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCreditLimit(5000000000);
    setIsOpenModal(true);
  };

  const handleOpenEdit = (s: Shipper) => {
    setEditingItem(s);
    setCompanyName(s.companyName);
    setNpwp(s.npwp);
    setContactPerson(s.contactPerson);
    setEmail(s.email);
    setPhone(s.phone);
    setAddress(s.address);
    setCreditLimit(s.creditLimit);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !phone) return;

    if (editingItem) {
      await updateShipper(editingItem.id, { companyName, npwp, contactPerson, email, phone, address, creditLimit });
    } else {
      await addShipper({ companyName, npwp, contactPerson, email, phone, address, creditLimit, totalBookings: 0 });
    }
    setIsOpenModal(false);
  };

  const handleDelete = async (id: string, sName: string) => {
    if (confirm(`Hapus data klien "${sName}"?`)) {
      await deleteShipper(id);
    }
  };

  const filtered = shippers.filter(s => 
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Master Data Klien & Shipper</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data perusahaan pengirim barang (klien B2B), NPWP, kontak penanggung jawab, dan plafon kredit freight.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Klien Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama perusahaan, kontak, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Shippers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Perusahaan Klien</th>
                <th className="p-4">NPWP Resmi</th>
                <th className="p-4">Penanggung Jawab</th>
                <th className="p-4">Email & Kontak</th>
                <th className="p-4">Credit Limit Freight</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{s.companyName}</td>
                  <td className="p-4 font-mono text-slate-600 font-semibold">{s.npwp}</td>
                  <td className="p-4 font-bold text-slate-800">{s.contactPerson}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{s.email}</div>
                    <div className="text-[10px] text-slate-500">{s.phone}</div>
                  </td>
                  <td className="p-4 font-black text-emerald-600">
                    Rp {(s.creditLimit / 1000000000).toFixed(1)} Miliar
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.companyName)}
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
              {editingItem ? 'Edit Data Klien' : 'Tambah Klien Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan Klien *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT Indofood Sukses Makmur Tbk"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NPWP Perusahaan</label>
                  <input
                    type="text"
                    value={npwp}
                    onChange={e => setNpwp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC) *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Telepon *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Limit Kredit Freight (Rp)</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={e => setCreditLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Kantor</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-xl shadow"
                >
                  Simpan Klien
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
