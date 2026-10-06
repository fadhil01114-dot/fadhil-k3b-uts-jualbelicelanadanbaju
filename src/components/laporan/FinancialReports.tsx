import React, { useState } from 'react';
import { BarChart3, Download, Printer, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { CargoBooking, MaintenanceLog, Voyage } from '../../types/shipping';

interface FinancialReportsProps {
  bookings: CargoBooking[];
  maintenances: MaintenanceLog[];
  voyages: Voyage[];
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  bookings,
  maintenances,
  voyages,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = bookings.filter(b => 
    statusFilter === 'all' || b.paymentStatus === statusFilter
  );

  const totalFreightIncome = filteredBookings.reduce((sum, b) => sum + b.totalFreightFee, 0);
  const totalMaintenanceCost = maintenances.reduce((sum, m) => sum + m.costAmount, 0);
  const netOperatingMargin = totalFreightIncome - totalMaintenanceCost;

  const handleExportCSV = () => {
    const csvRows = [
      ['No. BL', 'Kode Voyage', 'Nama Klien Shipper', 'Tipe Kargo', 'Jumlah', 'Total Freight (Rp)', 'Status Bayar'],
      ...filteredBookings.map(b => [
        b.bookingNumber,
        b.voyageNumber,
        `"${b.shipperName}"`,
        `"${b.cargoTypeName}"`,
        b.quantity,
        b.totalFreightFee,
        b.paymentStatus
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_Freight_${new Date().toISOString().slice(0, 10)}.csv`);
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
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Pendapatan Freight & Biaya Operasional</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan pendapatan dari Bill of Lading, biaya maintenance galangan, dan margin operasional bersih.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export Laporan CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Gross Freight Revenue</div>
          <div className="text-2xl font-black text-emerald-600">
            Rp {totalFreightIncome.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400">Dari {filteredBookings.length} transaksi Bill of Lading</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Biaya Maintenance Armada</div>
          <div className="text-2xl font-black text-rose-600">
            Rp {totalMaintenanceCost.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400">Dari {maintenances.length} pekerjaan repair galangan</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Net Freight Margin</div>
          <div className={`text-2xl font-black ${netOperatingMargin >= 0 ? 'text-sky-600' : 'text-rose-600'}`}>
            Rp {netOperatingMargin.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400">Estimasi margin operasional bersih</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Filter Pembayaran:
          </span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="Paid In Full">Paid In Full</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <div className="font-bold text-slate-500">
          Total Data: <strong className="text-slate-900">{filteredBookings.length}</strong> Record
        </div>
      </div>

      {/* Detailed Revenue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Rincian Transaksi Pendapatan Freight (Bill of Lading)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">No. BL</th>
                <th className="p-4">Voyage</th>
                <th className="p-4">Klien Shipper</th>
                <th className="p-4">Tipe Kargo</th>
                <th className="p-4">Volume</th>
                <th className="p-4">Total Freight (Rp)</th>
                <th className="p-4">Status Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-mono font-black text-sky-700">{b.bookingNumber}</td>
                  <td className="p-4 font-mono font-bold text-slate-800">{b.voyageNumber}</td>
                  <td className="p-4 font-bold text-slate-900">{b.shipperName}</td>
                  <td className="p-4 text-slate-700">{b.cargoTypeName}</td>
                  <td className="p-4 font-bold text-slate-900">{b.quantity} Unit</td>
                  <td className="p-4 font-black text-emerald-600">
                    Rp {b.totalFreightFee.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 font-bold text-slate-800">{b.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
