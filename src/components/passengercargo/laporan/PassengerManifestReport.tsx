import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Download, Search, ShieldCheck, Ship, Users } from 'lucide-react';
import { PassengerTicket, ShipVoyage } from '../../../types/passengerCargo';

interface PassengerManifestReportProps {
  tickets: PassengerTicket[];
  voyages: ShipVoyage[];
}

export const PassengerManifestReport: React.FC<PassengerManifestReportProps> = ({ tickets, voyages }) => {
  const [selectedVoyage, setSelectedVoyage] = useState<string>(voyages[0]?.voyageCode || '');
  const [search, setSearch] = useState<string>('');

  const currentVoyage = voyages.find(v => v.voyageCode === selectedVoyage) || voyages[0];

  const filteredTickets = tickets.filter(t => 
    (!selectedVoyage || t.voyageCode === selectedVoyage) &&
    (t.passengerName.toLowerCase().includes(search.toLowerCase()) ||
     t.nikNumber.includes(search) ||
     t.pnrCode.toLowerCase().includes(search.toLowerCase()))
  );

  const exportToCSV = () => {
    const headers = ['Kode PNR', 'Nama Penumpang', 'NIK KTP', 'Gender', 'Usia', 'Kelas Kabin', 'Nomor Bed/Kabin', 'Tarif Tiket', 'Status Check-In'];
    const rows = filteredTickets.map(t => [
      t.pnrCode,
      `"${t.passengerName}"`,
      `"${t.nikNumber}"`,
      t.gender,
      t.age,
      `"${t.ticketClass}"`,
      `"${t.cabinBedNo}"`,
      t.fareAmount,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Manifest_Penumpang_${selectedVoyage || 'All'}.csv`);
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
            <span className="p-1.5 bg-cyan-100 text-cyan-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">Dokumen Manifest Penumpang Resmi Syahbandar</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laporan keselamatan manifest penumpang kapal terintegrasi untuk verifikasi Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP).
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
            className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Manifest</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700 shrink-0">Pilih Voyage Keberangkatan:</span>
          <select
            value={selectedVoyage}
            onChange={e => setSelectedVoyage(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:border-cyan-600"
          >
            <option value="">-- Semua Voyage --</option>
            {voyages.map(v => (
              <option key={v.id} value={v.voyageCode}>{v.voyageCode} - {v.shipName} ({v.routeCode})</option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Filter nama penumpang, NIK, PNR..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-cyan-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Official Syahbandar Document Box */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
              REPUBLIK INDONESIA - KEMENTERIAN PERHUBUNGAN
            </h3>
            <p className="text-xs font-extrabold text-slate-700">
              KANTOR KESYAHBANDARAN DAN OTORITAS PELABUHAN (KSOP)
            </p>
            <p className="text-[11px] font-bold text-cyan-800 uppercase tracking-widest pt-1">
              DAFTAR MANIFEST PENUMPANG (PASSENGER MANIFEST LOG)
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="p-2 bg-slate-100 rounded-xl inline-block">
              <ShieldCheck className="w-8 h-8 text-cyan-700" />
            </div>
            <div className="text-[10px] font-mono text-slate-500">Document ID: SYH-{Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        {/* Voyage Info Banner */}
        {currentVoyage && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
            <div>
              <span className="text-slate-500 block">Nama Kapal:</span>
              <span className="font-black text-slate-900">{currentVoyage.shipName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Kode Voyage:</span>
              <span className="font-mono font-bold text-cyan-800">{currentVoyage.voyageCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pelabuhan Asal & Tujuan:</span>
              <span className="font-bold text-slate-900">{currentVoyage.originPort} → {currentVoyage.destinationPort}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total On Board:</span>
              <span className="font-black text-slate-900">{filteredTickets.length} Orang Penumpang</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 border-r">No</th>
                <th className="p-3 border-r">Kode PNR</th>
                <th className="p-3 border-r">Nama Penumpang (Sesuai KTP)</th>
                <th className="p-3 border-r">NIK Nomor Induk Kependudukan</th>
                <th className="p-3 border-r">Gender</th>
                <th className="p-3 border-r">Usia</th>
                <th className="p-3 border-r">Kelas Kabin</th>
                <th className="p-3 border-r">No. Bed / Kabin</th>
                <th className="p-3">Status Boarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ada data penumpang pada voyage ini.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/80">
                    <td className="p-3 border-r text-center font-bold">{idx + 1}</td>
                    <td className="p-3 border-r font-mono font-bold text-cyan-800">{t.pnrCode}</td>
                    <td className="p-3 border-r font-extrabold text-slate-900">{t.passengerName}</td>
                    <td className="p-3 border-r font-mono text-slate-800">{t.nikNumber}</td>
                    <td className="p-3 border-r">{t.gender}</td>
                    <td className="p-3 border-r">{t.age} Thn</td>
                    <td className="p-3 border-r font-bold text-slate-800">{t.ticketClass}</td>
                    <td className="p-3 border-r font-bold text-amber-700">{t.cabinBedNo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        t.status === 'Boarded / Check-In' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signatures Footer */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs font-semibold text-center border-t border-slate-200">
          <div>
            <p className="text-slate-500 mb-12">Petugas Loket / Ticketing Supervisor</p>
            <p className="font-extrabold text-slate-900 uppercase">
              ( Ibu Ratna Juwita )
            </p>
            <p className="text-[10px] text-slate-400">NIP. 19840219 200801 2 001</p>
          </div>
          <div>
            <p className="text-slate-500 mb-12">Petugas Otoritas Syahbandar (Port Authority)</p>
            <p className="font-extrabold text-slate-900 uppercase">
              ( Capt. Hendra Gunawan, M.Mar )
            </p>
            <p className="text-[10px] text-slate-400">NIP. 19781104 200212 1 003</p>
          </div>
        </div>

      </div>

    </div>
  );
};
