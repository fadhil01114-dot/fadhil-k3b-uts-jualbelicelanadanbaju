import React from 'react';
import { BarChart3, Download, Ship, TrendingUp } from 'lucide-react';
import { VesselCall, GateTransaction } from '../../../types/terminal';

interface ThroughputReportsProps {
  vesselCalls: VesselCall[];
  gateTransactions: GateTransaction[];
}

export const ThroughputReports: React.FC<ThroughputReportsProps> = ({
  vesselCalls,
  gateTransactions,
}) => {
  const totalInboundTeu = vesselCalls.reduce((sum, v) => sum + v.inboundTeu, 0);
  const totalOutboundTeu = vesselCalls.reduce((sum, v) => sum + v.outboundTeu, 0);
  const totalThroughput = totalInboundTeu + totalOutboundTeu;

  const handleExportCSV = () => {
    const csvRows = [
      ['Kode Call Sign', 'Nama Vessel', 'Shipping Line', 'Dermaga', 'Inbound TEU (Bongkar)', 'Outbound TEU (Muat)', 'Total TEU'],
      ...vesselCalls.map(v => [
        v.callSign,
        `"${v.vesselName}"`,
        `"${v.shippingLineName}"`,
        `"${v.berthName}"`,
        v.inboundTeu,
        v.outboundTeu,
        v.inboundTeu + v.outboundTeu
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Throughput_TEU_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Throughput Peti Kemas (TEU Throughput)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan total volume arus bongkar muat kontainer (Inbound/Outbound) per kapal dan shipping line.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Download className="w-4 h-4" />
          <span>Export Laporan CSV</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Total TEU Throughput</div>
          <div className="text-2xl font-black text-cyan-800">
            {totalThroughput.toLocaleString('id-ID')} TEU
          </div>
          <div className="text-[11px] text-slate-400">Arus Bongkar & Muat Gabungan</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Inbound TEU (Bongkar)</div>
          <div className="text-2xl font-black text-emerald-600">
            {totalInboundTeu.toLocaleString('id-ID')} TEU
          </div>
          <div className="text-[11px] text-slate-400">Kontainer Impor / Masuk</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Outbound TEU (Muat)</div>
          <div className="text-2xl font-black text-sky-600">
            {totalOutboundTeu.toLocaleString('id-ID')} TEU
          </div>
          <div className="text-[11px] text-slate-400">Kontainer Ekspor / Keluar</div>
        </div>
      </div>

      {/* Throughput Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Rincian Throughput TEU Per Vessel Call
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Call Sign</th>
                <th className="p-4">Nama Kapal Vessel</th>
                <th className="p-4">Shipping Line Agen</th>
                <th className="p-4">Dermaga Sandar</th>
                <th className="p-4">Inbound (Bongkar)</th>
                <th className="p-4">Outbound (Muat)</th>
                <th className="p-4">Total Volume TEU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vesselCalls.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-mono font-black text-cyan-800">{v.callSign}</td>
                  <td className="p-4 font-extrabold text-slate-900">{v.vesselName}</td>
                  <td className="p-4 font-semibold text-slate-700">{v.shippingLineName}</td>
                  <td className="p-4 text-slate-800 font-bold">{v.berthName}</td>
                  <td className="p-4 font-black text-emerald-600">{v.inboundTeu} TEU</td>
                  <td className="p-4 font-black text-sky-600">{v.outboundTeu} TEU</td>
                  <td className="p-4 font-black text-slate-900 text-sm">{v.inboundTeu + v.outboundTeu} TEU</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
