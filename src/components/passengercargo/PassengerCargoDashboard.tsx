import React from 'react';
import { 
  Ship, Ticket, PackageCheck, Users, CalendarDays, TrendingUp, 
  ArrowUpRight, CheckCircle2, AlertCircle, Anchor, Compass 
} from 'lucide-react';
import { 
  PassengerShip, ShipVoyage, PassengerTicket, CargoManifest 
} from '../../types/passengerCargo';
import { PassengerCargoNavKey } from './PassengerCargoSidebarNav';

interface PassengerCargoDashboardProps {
  ships: PassengerShip[];
  voyages: ShipVoyage[];
  tickets: PassengerTicket[];
  cargoManifests: CargoManifest[];
  onNavigateTab: (tab: PassengerCargoNavKey) => void;
}

export const PassengerCargoDashboard: React.FC<PassengerCargoDashboardProps> = ({
  ships,
  voyages,
  tickets,
  cargoManifests,
  onNavigateTab,
}) => {
  // Calculations
  const totalPassengers = tickets.length;
  const totalCheckedIn = tickets.filter(t => t.status === 'Boarded / Check-In').length;
  const totalCargoTons = cargoManifests.reduce((acc, c) => acc + (c.weightTon || 0), 0);
  const totalTicketRevenue = tickets.reduce((acc, t) => acc + (t.fareAmount || 0), 0);
  const totalCargoRevenue = cargoManifests.reduce((acc, c) => acc + (c.fareAmount || 0), 0);
  const activeVoyages = voyages.filter(v => v.status === 'Sailing' || v.status === 'Boarding Open').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 text-white p-6 rounded-3xl border border-sky-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Anchor className="w-64 h-64" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[11px] font-bold border border-cyan-400/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Sistem Operasional Real-time Pelayaran</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Monitoring Muatan Kapal & Tiket Penumpang
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Selamat datang di Dashboard Pengawasan Pelayaran Samudera Nusantara. Seluruh data penumpang, manifest kargo, keberangkatan voyage, dan tarif terhubung secara langsung ke real database Firestore.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Voyages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Voyage Aktif / Sailing</p>
            <h3 className="text-2xl font-black text-slate-900">{activeVoyages} <span className="text-xs font-semibold text-slate-500">Voyage</span></h3>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{ships.length} Kapal Siap Operasi</span>
            </p>
          </div>
          <div className="p-3.5 bg-sky-100 text-sky-700 rounded-2xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Total Passengers & Check-in */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Penumpang PNR</p>
            <h3 className="text-2xl font-black text-slate-900">{totalPassengers} <span className="text-xs font-semibold text-slate-500">Orang</span></h3>
            <p className="text-[11px] text-sky-700 font-bold">
              {totalCheckedIn} Penumpang Check-In
            </p>
          </div>
          <div className="p-3.5 bg-amber-100 text-amber-700 rounded-2xl">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Cargo Weight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Kargo & Kendaraan</p>
            <h3 className="text-2xl font-black text-slate-900">{totalCargoTons} <span className="text-xs font-semibold text-slate-500">Ton</span></h3>
            <p className="text-[11px] text-teal-700 font-bold">
              {cargoManifests.length} Item Manifest Resi
            </p>
          </div>
          <div className="p-3.5 bg-teal-100 text-teal-700 rounded-2xl">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pendapatan Pelayaran</p>
            <h3 className="text-xl font-black text-slate-900">
              Rp {(totalTicketRevenue + totalCargoRevenue).toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold">
              Tiket & Manifest Kargo
            </p>
          </div>
          <div className="p-3.5 bg-emerald-100 text-emerald-700 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                <Ticket className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">Loket Penjualan Tiket</h3>
            </div>
            <button
              onClick={() => onNavigateTab('tx_tickets')}
              className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Terbitkan tiket PNR penumpang baru, pilih kelas kabin, dan cetak boarding pass secara instan.
          </p>
          <button
            onClick={() => onNavigateTab('tx_tickets')}
            className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl transition-colors"
          >
            Buka Transaksi Tiket Penumpang
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                <PackageCheck className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">Manifest Kargo & Kendaraan</h3>
            </div>
            <button
              onClick={() => onNavigateTab('tx_manifests')}
              className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Input manifest pemuatan kendaraan (sepeda motor, mobil, truk) dan barang kargo tonase.
          </p>
          <button
            onClick={() => onNavigateTab('tx_manifests')}
            className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl transition-colors"
          >
            Kelola Manifest Kargo & Kendaraan
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-cyan-100 text-cyan-700 rounded-xl">
                <Compass className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">Dokumen Syahbandar</h3>
            </div>
            <button
              onClick={() => onNavigateTab('rpt_passenger_manifest')}
              className="p-1 text-slate-400 hover:text-cyan-600 transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Cetak Laporan Manifest Penumpang Resmi untuk persetujuan Port Authority / Syahbandar.
          </p>
          <button
            onClick={() => onNavigateTab('rpt_passenger_manifest')}
            className="w-full py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs rounded-xl transition-colors"
          >
            Lihat Laporan Syahbandar
          </button>
        </div>

      </div>

      {/* Voyages Status Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Ship className="w-5 h-5" />
            </span>
            <h3 className="font-black text-slate-900 text-sm">Jadwal Keberangkatan & Status Voyage Real-time</h3>
          </div>
          <button
            onClick={() => onNavigateTab('tx_voyages')}
            className="text-xs font-bold text-sky-700 hover:text-sky-800"
          >
            Lihat Semua Voyage →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3">Kode Voyage</th>
                <th className="p-3">Nama Kapal</th>
                <th className="p-3">Rute Pelayaran</th>
                <th className="p-3">Jadwal ETD / ETA</th>
                <th className="p-3">Total PNR & Vehicles</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {voyages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Belum ada data voyage keberangkatan.
                  </td>
                </tr>
              ) : (
                voyages.slice(0, 5).map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-sky-700">{v.voyageCode}</td>
                    <td className="p-3 font-extrabold text-slate-900">{v.shipName}</td>
                    <td className="p-3 text-slate-700">{v.routeCode}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">
                      <div><span className="font-bold text-slate-800">ETD:</span> {v.etd}</div>
                      <div><span className="font-bold text-slate-800">ETA:</span> {v.eta}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {v.bookedPassengers} Penumpang • {v.bookedVehicles} Kendaraan
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        v.status === 'Sailing' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        v.status === 'Boarding Open' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        v.status === 'Scheduled' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {v.status}
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
