import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Download, Search, PackageCheck, Truck } from 'lucide-react';
import { CargoManifest, ShipVoyage } from '../../../types/passengerCargo';

interface CargoManifestReportProps {
  cargoManifests: CargoManifest[];
  voyages: ShipVoyage[];
}

export const CargoManifestReport: React.FC<CargoManifestReportProps> = ({ cargoManifests, voyages }) => {
  const [selectedVoyage, setSelectedVoyage] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const filtered = cargoManifests.filter(cm =>
    (!selectedVoyage || cm.voyageCode === selectedVoyage) &&
    (cm.manifestNo.toLowerCase().includes(search.toLowerCase()) ||
     cm.shipperName.toLowerCase().includes(search.toLowerCase()) ||
     cm.itemDescription.toLowerCase().includes(search.toLowerCase()) ||
     (cm.truckPlate && cm.truckPlate.toLowerCase().includes(search.toLowerCase())))
  );

  const totalWeight = filtered.reduce((acc, c) => acc + (c.weightTon || 0), 0);
  const totalRevenue = filtered.reduce((acc, c) => acc + (c.fareAmount || 0), 0);

  const exportToCSV = () => {
    const headers = ['No Resi Manifest', 'Voyage', 'Pengirim', 'Golongan/Kategori', 'Deskripsi Barang', 'Plat Nomor', 'Berat (Ton)', 'Biaya Kargo (Rp)', 'Status'];
    const rows = filtered.map(c => [
      c.manifestNo,
      c.voyageCode,
      `"${c.shipperName}"`,
      `"${c.cargoCategory}"`,
      `"${c.itemDescription}"`,
      `"${c.truckPlate || '-'}"`,
      c.weightTon,
      c.fareAmount,
      c.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Manifest_Kargo_${selectedVoyage || 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <PackageCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Rekapitulasi Manifest Kargo & Kendaraan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laporan lengkap pemuatan kargo barang, golongan kendaraan (mobil, truk, motor), tonase berat total, dan penerimaan muatan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Laporan</span>
          </button>
        </div>
      </div>

      {/* Filter & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs font-bold text-slate-700 shrink-0">Voyage:</span>
            <select
              value={selectedVoyage}
              onChange={e => setSelectedVoyage(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:border-teal-600 w-full max-w-xs"
            >
              <option value="">-- Semua Voyage --</option>
              {voyages.map(v => (
                <option key={v.id} value={v.voyageCode}>{v.voyageCode} ({v.shipName})</option>
              ))}
            </select>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Cari pengirim, barang, plat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal-600 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="bg-teal-900 text-white p-4 rounded-2xl border border-teal-800 shadow-xs flex justify-around items-center text-center">
          <div>
            <div className="text-[10px] font-extrabold uppercase text-teal-300">Total Berat Tonase</div>
            <div className="text-xl font-black">{totalWeight} Ton</div>
          </div>
          <div className="h-8 w-px bg-teal-700" />
          <div>
            <div className="text-[10px] font-extrabold uppercase text-teal-300">Total Biaya Kargo</div>
            <div className="text-xl font-black">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">No Resi</th>
                <th className="p-4">Voyage</th>
                <th className="p-4">Pengirim & Deskripsi Muatan</th>
                <th className="p-4">Golongan & Plat Nomor</th>
                <th className="p-4">Berat (Ton)</th>
                <th className="p-4">Biaya Kargo</th>
                <th className="p-4">Status Muat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Belum ada data manifest kargo.
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-teal-800">{c.manifestNo}</td>
                    <td className="p-4 font-mono text-sky-700">{c.voyageCode}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{c.shipperName}</div>
                      <div className="text-[11px] text-slate-500">{c.itemDescription}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{c.cargoCategory}</div>
                      {c.truckPlate && <div className="font-mono text-[10px] text-slate-500">Plat: {c.truckPlate}</div>}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">{c.weightTon} Ton</td>
                    <td className="p-4 font-black text-slate-900">Rp {c.fareAmount.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
