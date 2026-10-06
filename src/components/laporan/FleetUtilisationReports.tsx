import React from 'react';
import { Ship, Download, Compass, BarChart2 } from 'lucide-react';
import { Vessel, Voyage } from '../../types/shipping';

interface FleetUtilisationReportsProps {
  vessels: Vessel[];
  voyages: Voyage[];
}

export const FleetUtilisationReports: React.FC<FleetUtilisationReportsProps> = ({
  vessels,
  voyages,
}) => {
  const handleExportCSV = () => {
    const csvRows = [
      ['Nama Kapal', 'Tipe Kapal', 'Kapasitas DWT', 'Jumlah Voyage Selesai / Aktif', 'Status Saat Ini'],
      ...vessels.map(v => {
        const count = voyages.filter(voy => voy.vesselId === v.id).length;
        return [
          `"${v.name}"`,
          v.vesselType,
          v.dwtCapacity,
          count,
          v.status
        ];
      })
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Utilisasi_Armada_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Ship className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Utilisasi & Frekuensi Voyage Armada Kapal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analisis penggunaan kapasitas DWT kapal, rasio hari berlayar, dan produktivitas rute pelayaran.
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

      {/* Fleet Utilisation Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Ringkasan Produktivitas Kapal
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Nama Kapal Armada</th>
                <th className="p-4">Tipe Kapal</th>
                <th className="p-4">Kapasitas DWT</th>
                <th className="p-4">Total Voyage Dijalankan</th>
                <th className="p-4">Status Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vessels.map(v => {
                const voyCount = voyages.filter(voy => voy.vesselId === v.id).length;
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-extrabold text-slate-900 text-sm">{v.name}</td>
                    <td className="p-4 font-bold text-slate-700">{v.vesselType}</td>
                    <td className="p-4 font-black text-slate-900">{v.dwtCapacity.toLocaleString('id-ID')} DWT</td>
                    <td className="p-4 font-black text-sky-700">{voyCount} Trip Voyage</td>
                    <td className="p-4 font-bold text-slate-800">{v.status}</td>
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
