import React from 'react';
import { Layers, Download, BarChart2 } from 'lucide-react';
import { YardBlock } from '../../../types/terminal';

interface YardOccupancyReportsProps {
  yardBlocks: YardBlock[];
}

export const YardOccupancyReports: React.FC<YardOccupancyReportsProps> = ({ yardBlocks }) => {
  const handleExportCSV = () => {
    const csvRows = [
      ['Kode Blok Yard', 'Kapasitas TEU', 'Jumlah TEU Terisi', 'Persentase YOR (%)', 'Jenis Kargo Allowed', 'Status Blok'],
      ...yardBlocks.map(b => {
        const pct = Math.round((b.currentTeuCount / b.capacityTeu) * 100);
        return [
          `"${b.blockCode}"`,
          b.capacityTeu,
          b.currentTeuCount,
          `${pct}%`,
          `"${b.categoryAllowed}"`,
          b.status
        ];
      })
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Yard_Occupancy_Rate_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Yard Occupancy Rate (YOR %)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analisis efisiensi dan tingkat keterisian penumpukan peti kemas pada masing-masing blok lapangan.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Yard Occupancy Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Tingkat Keterisian Penumpukan Per Blok Yard
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Blok Yard</th>
                <th className="p-4">Kapasitas TEU</th>
                <th className="p-4">Terisi Saat Ini</th>
                <th className="p-4">Rasio YOR (%)</th>
                <th className="p-4">Kategori Kargo Allowed</th>
                <th className="p-4">Status Blok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {yardBlocks.map(b => {
                const pct = Math.round((b.currentTeuCount / b.capacityTeu) * 100);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-extrabold text-slate-900 text-sm">{b.blockCode}</td>
                    <td className="p-4 font-black text-slate-900">{b.capacityTeu.toLocaleString('id-ID')} TEU</td>
                    <td className="p-4 font-bold text-cyan-800">{b.currentTeuCount.toLocaleString('id-ID')} TEU</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                        pct > 85 ? 'bg-rose-100 text-rose-800' :
                        pct > 65 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {pct}% YOR
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{b.categoryAllowed}</td>
                    <td className="p-4 font-bold text-slate-800">{b.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
