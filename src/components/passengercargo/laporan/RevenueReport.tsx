import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Download, TrendingUp, DollarSign, Calendar, Ship, Ticket, PackageCheck } from 'lucide-react';
import { PassengerTicket, CargoManifest, ShipVoyage } from '../../../types/passengerCargo';

interface RevenueReportProps {
  tickets: PassengerTicket[];
  cargoManifests: CargoManifest[];
  voyages: ShipVoyage[];
}

export const RevenueReport: React.FC<RevenueReportProps> = ({ tickets, cargoManifests, voyages }) => {
  const [selectedVoyage, setSelectedVoyage] = useState<string>('');

  const filteredTickets = tickets.filter(t => !selectedVoyage || t.voyageCode === selectedVoyage);
  const filteredCargo = cargoManifests.filter(c => !selectedVoyage || c.voyageCode === selectedVoyage);

  const ticketTotal = filteredTickets.reduce((acc, t) => acc + (t.fareAmount || 0), 0);
  const cargoTotal = filteredCargo.reduce((acc, c) => acc + (c.fareAmount || 0), 0);
  const grandTotal = ticketTotal + cargoTotal;

  const exportToCSV = () => {
    const headers = ['Tipe Transaksi', 'Kode Referensi', 'Voyage', 'Nama Pelanggan/Pengirim', 'Deskripsi / Kelas Tiket', 'Jumlah Pendapatan (Rp)', 'Status'];
    const rows = [
      ...filteredTickets.map(t => ['Tiket Penumpang', t.pnrCode, t.voyageCode, `"${t.passengerName}"`, `"${t.ticketClass}"`, t.fareAmount, t.status]),
      ...filteredCargo.map(c => ['Manifest Kargo', c.manifestNo, c.voyageCode, `"${c.shipperName}"`, `"${c.cargoCategory}"`, c.fareAmount, c.status])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Pendapatan_Pelayaran_${selectedVoyage || 'All'}.csv`);
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
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Sales & Revenue Pendapatan Pelayaran</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi total penerimaan finansial dari penjualan tiket penumpang dan pengiriman manifest kargo per voyage.
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
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Sales</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <span className="text-xs font-bold text-slate-700">Filter Voyage Keberangkatan:</span>
        <select
          value={selectedVoyage}
          onChange={e => setSelectedVoyage(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:border-emerald-600 max-w-sm"
        >
          <option value="">-- Semua Voyage Pelayaran --</option>
          {voyages.map(v => (
            <option key={v.id} value={v.voyageCode}>{v.voyageCode} - {v.shipName}</option>
          ))}
        </select>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Pendapatan Tiket Penumpang</span>
            <Ticket className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            Rp {ticketTotal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Dari {filteredTickets.length} Penumpang Terdaftar
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Pendapatan Manifest Kargo</span>
            <PackageCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            Rp {cargoTotal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Dari {filteredCargo.length} Resi Manifest Dimuat
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl border border-emerald-700 shadow-md space-y-2">
          <div className="flex items-center justify-between text-emerald-200 text-xs font-extrabold uppercase">
            <span>TOTAL PENDAPATAN VOYAGE</span>
            <TrendingUp className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-2xl font-black">
            Rp {grandTotal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-200 font-medium">
            Grand Total Finansial Real-time Firestore
          </div>
        </div>

      </div>

      {/* Revenue Breakdown Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Rincian Transaksi Finansial Real-time</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3">Tipe Transaksi</th>
                <th className="p-3">Kode Referensi</th>
                <th className="p-3">Voyage</th>
                <th className="p-3">Pelanggan / Pengirim</th>
                <th className="p-3">Kategori / Kabin</th>
                <th className="p-3">Jumlah Pendapatan</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px]">
                      Tiket Penumpang
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-800">{t.pnrCode}</td>
                  <td className="p-3 font-mono text-slate-700">{t.voyageCode}</td>
                  <td className="p-3 font-extrabold text-slate-900">{t.passengerName}</td>
                  <td className="p-3 text-slate-700">{t.ticketClass}</td>
                  <td className="p-3 font-black text-slate-900">Rp {t.fareAmount.toLocaleString('id-ID')}</td>
                  <td className="p-3"><span className="text-[10px] font-bold text-emerald-700">{t.status}</span></td>
                </tr>
              ))}

              {filteredCargo.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded font-bold text-[10px]">
                      Manifest Kargo
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-teal-800">{c.manifestNo}</td>
                  <td className="p-3 font-mono text-slate-700">{c.voyageCode}</td>
                  <td className="p-3 font-extrabold text-slate-900">{c.shipperName}</td>
                  <td className="p-3 text-slate-700">{c.cargoCategory}</td>
                  <td className="p-3 font-black text-slate-900">Rp {c.fareAmount.toLocaleString('id-ID')}</td>
                  <td className="p-3"><span className="text-[10px] font-bold text-emerald-700">{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
