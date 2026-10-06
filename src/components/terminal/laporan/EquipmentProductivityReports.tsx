import React from 'react';
import { Wrench, Download, Activity } from 'lucide-react';
import { Equipment, ContainerJob } from '../../../types/terminal';

interface EquipmentProductivityReportsProps {
  equipments: Equipment[];
  containerJobs: ContainerJob[];
}

export const EquipmentProductivityReports: React.FC<EquipmentProductivityReportsProps> = ({
  equipments,
  containerJobs,
}) => {
  const handleExportCSV = () => {
    const csvRows = [
      ['Kode Alat / Crane', 'Tipe Equipment', 'Kapasitas Lift (Ton)', 'Operator Bertugas', 'Jumlah Movement Job', 'Status'],
      ...equipments.map(e => {
        const jobCount = containerJobs.filter(j => j.equipmentCode === e.code).length;
        return [
          `"${e.code}"`,
          `"${e.equipmentType}"`,
          e.maxCapacityTons,
          `"${e.operatorName}"`,
          jobCount,
          e.status
        ];
      })
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Produktivitas_Equipment_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Wrench className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Laporan Produktivitas Crane & Alat Berat</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluasi jumlah pergerakan (*movement jobs*) per derek Quay Crane (QC), RTG, dan Reach Stacker.
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

      {/* Equipment Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Produktivitas Pergerakan Per Alat Berat
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Kode Alat Berat</th>
                <th className="p-4">Tipe Crane / Equipment</th>
                <th className="p-4">Kapasitas Lift (Ton)</th>
                <th className="p-4">Operator Utama</th>
                <th className="p-4">Total Movement Job Order</th>
                <th className="p-4">Status Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equipments.map(e => {
                const jobCount = containerJobs.filter(j => j.equipmentCode === e.code).length;
                return (
                  <tr key={e.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-mono font-black text-cyan-800 text-sm">{e.code}</td>
                    <td className="p-4 font-extrabold text-slate-900">{e.equipmentType}</td>
                    <td className="p-4 font-black text-slate-900">{e.maxCapacityTons} Ton</td>
                    <td className="p-4 font-bold text-slate-800">{e.operatorName}</td>
                    <td className="p-4 font-black text-emerald-600 text-sm">{jobCount} Movement Jobs</td>
                    <td className="p-4 font-bold text-slate-800">{e.status}</td>
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
