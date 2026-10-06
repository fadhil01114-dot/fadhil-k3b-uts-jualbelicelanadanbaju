import React, { useState } from 'react';
import { Truck, Plus, Edit, Trash2, Search, ArrowRightLeft, Layers } from 'lucide-react';
import { GateTransaction, GateTransactionType, YardBlock, ContainerCategory } from '../../../types/terminal';
import { addGateTransaction, updateGateTransaction, deleteGateTransaction } from '../../../lib/terminalDb';

interface GateTransactionsTxProps {
  gateTransactions: GateTransaction[];
  yardBlocks: YardBlock[];
  categories: ContainerCategory[];
}

export const GateTransactionsTx: React.FC<GateTransactionsTxProps> = ({
  gateTransactions,
  yardBlocks,
  categories,
}) => {
  const [search, setSearch] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GateTransaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [containerNumber, setContainerNumber] = useState<string>('');
  const [categoryCode, setCategoryCode] = useState<string>(categories[0]?.code || '20GP');
  const [sealNumber, setSealNumber] = useState<string>('');
  const [truckPlate, setTruckPlate] = useState<string>('');
  const [driverName, setDriverName] = useState<string>('');
  const [transactionType, setTransactionType] = useState<GateTransactionType>('Gate In Import');
  const [yardBlockCode, setYardBlockCode] = useState<string>(yardBlocks[0]?.blockCode || 'Blok A1');
  const [yardLocation, setYardLocation] = useState<string>('Row 04 - Tier 02');
  const [status, setStatus] = useState<GateTransaction['status']>('In Yard');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setContainerNumber(`MSKU-${Math.floor(100000 + Math.random() * 900000)}-1`);
    setCategoryCode(categories[0]?.code || '20GP');
    setSealNumber(`SEAL-${Math.floor(10000 + Math.random() * 90000)}`);
    setTruckPlate('B 9812 UI');
    setDriverName('Sdr. Sugeng Rismanto');
    setTransactionType('Gate In Import');
    setYardBlockCode(yardBlocks[0]?.blockCode || 'Blok A1');
    setYardLocation('Row 04 - Tier 02');
    setStatus('In Yard');
    setIsOpenModal(true);
  };

  const handleOpenEdit = (g: GateTransaction) => {
    setEditingItem(g);
    setContainerNumber(g.containerNumber);
    setCategoryCode(g.categoryCode);
    setSealNumber(g.sealNumber);
    setTruckPlate(g.truckPlate);
    setDriverName(g.driverName);
    setTransactionType(g.transactionType);
    setYardBlockCode(g.yardBlockCode);
    setYardLocation(g.yardLocation);
    setStatus(g.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!containerNumber || !truckPlate) return;

    setIsSubmitting(true);
    try {
      const payload = {
        containerNumber,
        categoryCode,
        sealNumber,
        truckPlate,
        driverName,
        transactionType,
        yardBlockCode,
        yardLocation,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status,
      };

      if (editingItem) {
        await updateGateTransaction(editingItem.id, payload);
        alert(`✅ Transaksi gate "${containerNumber}" berhasil diperbarui!`);
      } else {
        await addGateTransaction(payload);
        alert(`✅ Transaksi Gate "${transactionType}" untuk container "${containerNumber}" berhasil dicatat di Firestore!`);
      }
      setIsOpenModal(false);
    } catch (err) {
      alert('⚠️ Gagal mencatat transaksi gate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, cNum: string) => {
    if (confirm(`Hapus transaksi gate untuk container "${cNum}"?`)) {
      try {
        await deleteGateTransaction(id);
        alert(`🗑️ Transaksi "${cNum}" berhasil dihapus.`);
      } catch (err) {
        alert('⚠️ Gagal menghapus transaksi gate.');
      }
    }
  };

  const filtered = gateTransactions.filter(g => 
    g.containerNumber.toLowerCase().includes(search.toLowerCase()) ||
    g.truckPlate.toLowerCase().includes(search.toLowerCase()) ||
    g.driverName.toLowerCase().includes(search.toLowerCase()) ||
    g.yardBlockCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Truck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Transaksi Gate In / Gate Out Peti Kemas (TOS Gate)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan truk masuk/keluar gate terminal, nomor kontainer ISO, nomor seal, dan alokasi blok yard.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Input Gate In / Out Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari no. kontainer, no. plat truk, driver, blok yard..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Gate Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">No. Container ISO</th>
                <th className="p-4">Jenis Transaksi Gate</th>
                <th className="p-4">Truk & Pengemudi</th>
                <th className="p-4">No. Seal Container</th>
                <th className="p-4">Alokasi Lapangan Yard</th>
                <th className="p-4">Waktu Transaksi</th>
                <th className="p-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(g => (
                <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-cyan-800 text-sm">{g.containerNumber}</td>
                  <td className="p-4 font-extrabold text-slate-900">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] ${
                      g.transactionType.includes('Gate In') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {g.transactionType}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 font-mono">{g.truckPlate}</div>
                    <div className="text-[10px] text-slate-500">{g.driverName}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-700 font-semibold">{g.sealNumber || '-'}</td>
                  <td className="p-4 font-bold text-slate-900">
                    <div>{g.yardBlockCode}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{g.yardLocation}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-mono">{g.timestamp}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id, g.containerNumber)}
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
              {editingItem ? 'Edit Transaksi Gate TOS' : 'Input Transaksi Gate In / Out Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Transaksi Gate *</label>
                  <select
                    value={transactionType}
                    onChange={e => setTransactionType(e.target.value as GateTransactionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600 font-bold text-cyan-800"
                  >
                    <option value="Gate In Import">Gate In Import</option>
                    <option value="Gate In Export">Gate In Export</option>
                    <option value="Gate Out Import">Gate Out Import</option>
                    <option value="Gate Out Export">Gate Out Export</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plat Nomor Truk *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B 9812 UI"
                    value={truckPlate}
                    onChange={e => setTruckPlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pengemudi Truk</label>
                  <input
                    type="text"
                    placeholder="e.g. Sdr. Sugeng Rismanto"
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Container</label>
                  <select
                    value={categoryCode}
                    onChange={e => setCategoryCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Seal Container</label>
                  <input
                    type="text"
                    placeholder="e.g. SEAL-88201"
                    value={sealNumber}
                    onChange={e => setSealNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alokasi Blok Yard *</label>
                  <select
                    value={yardBlockCode}
                    onChange={e => setYardBlockCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-600"
                  >
                    {yardBlocks.map(b => (
                      <option key={b.id} value={b.blockCode}>{b.blockCode}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Posisi Stacking (Row-Tier)</label>
                  <input
                    type="text"
                    placeholder="e.g. Row 04 - Tier 02"
                    value={yardLocation}
                    onChange={e => setYardLocation(e.target.value)}
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi Gate'}
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
