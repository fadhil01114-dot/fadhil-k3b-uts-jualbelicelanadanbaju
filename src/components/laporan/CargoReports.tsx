import React from 'react';
import { Package, Download, Users, TrendingUp } from 'lucide-react';
import { CargoBooking, Shipper } from '../../types/shipping';

interface CargoReportsProps {
  bookings: CargoBooking[];
  shippers: Shipper[];
}

export const CargoReports: React.FC<CargoReportsProps> = ({ bookings, shippers }) => {
  const handleExportCSV = () => {
    const csvRows = [
      ['Klien Shipper', 'Tipe Muatan Kargo', 'Volume / Satuan', 'Total Nilai Freight (Rp)', 'Status Kargo'],
      ...bookings.map(b => [
        `"${b.shipperName}"`,
        `"${b.cargoTypeName}"`,
        b.quantity,
        b.totalFreightFee,
        b.cargoStatus
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Volume_Kargo_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Volume Pengiriman Kargo & Klien Shipper</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laporan rincian volume muatan kargo per perusahaan pengirim (shipper) dan jenis muatan.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Cargo Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Rincian Manifest Pengiriman Kargo
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Klien Shipper</th>
                <th className="p-4">Jenis Muatan</th>
                <th className="p-4">Jumlah Volume</th>
                <th className="p-4">Total Fee Freight</th>
                <th className="p-4">Status Posisi Muatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-extrabold text-slate-900 text-sm">{b.shipperName}</td>
                  <td className="p-4 font-bold text-slate-800">{b.cargoTypeName}</td>
                  <td className="p-4 font-black text-slate-900">{b.quantity} Unit / Ton</td>
                  <td className="p-4 font-black text-emerald-600">Rp {b.totalFreightFee.toLocaleString('id-ID')}</td>
                  <td className="p-4 font-bold text-slate-800">{b.cargoStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
