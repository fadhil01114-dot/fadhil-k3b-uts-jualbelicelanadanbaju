import React from 'react';
import { 
  Ship, Compass, Package, Users, MapPin, TrendingUp, DollarSign, 
  ArrowUpRight, AlertCircle, Clock, CheckCircle2, FileText, Plus 
} from 'lucide-react';
import { Vessel, Voyage, CargoBooking, Port, MaintenanceLog } from '../types/shipping';

interface DashboardOverviewProps {
  vessels: Vessel[];
  voyages: Voyage[];
  bookings: CargoBooking[];
  ports: Port[];
  maintenances: MaintenanceLog[];
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  vessels,
  voyages,
  bookings,
  ports,
  maintenances,
  onNavigateTab,
}) => {
  // Stats
  const activeFleetCount = vessels.filter(v => v.status === 'Active' || v.status === 'In Voyage').length;
  const sailingVoyages = voyages.filter(v => v.status === 'Sailing' || v.status === 'Loading').length;
  
  const totalFreightRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid In Full' || b.paymentStatus === 'Partial')
    .reduce((sum, b) => sum + b.totalFreightFee, 0);

  const totalVolume = bookings.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Ship className="w-80 h-80" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800/80 text-sky-200 text-xs font-semibold border border-sky-600/40">
            <span>SISTEM INFORMASI CRITICAL LOGISTICS & FLEET</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Selamat Datang di Portal Manajemen Perusahaan Pelayaran
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pantau status armada kapal, jadwal pelayaran inter-insular (Voyage), booking kargo Bill of Lading, dan performa keuangan freight secara real-time.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('tx_voyages')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <Compass className="w-4 h-4" />
              <span>Kelola Jadwal Voyage</span>
            </button>
            <button
              onClick={() => onNavigateTab('tx_bookings')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Input Booking Kargo Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('master_vessels')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Armada Kapal Siap Operasi</span>
            <Ship className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeFleetCount}</span>
            <span className="text-xs text-slate-500">/ {vessels.length} Kapal</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{vessels.filter(v => v.status === 'In Voyage').length} Kapal sedang Berlayar</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('tx_voyages')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Pelayaran Berjalan (Voyage)</span>
            <Compass className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{sailingVoyages}</span>
            <span className="text-xs text-slate-500">Rute Aktif</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold">
            Status: Loading & Sailing
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('rpt_financial')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Total Pendapatan Freight</span>
            <TrendingUp className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            Rp {(totalFreightRevenue / 1000000).toFixed(1)} Juta
          </div>
          <div className="text-[11px] text-slate-500">
            Dari {bookings.length} Transaksi Booking Kargo
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('tx_maintenances')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Kapal Dalam Maintenance</span>
            <AlertCircle className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {vessels.filter(v => v.status === 'Under Maintenance').length} Kapal
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">
            {maintenances.length} Log Perbaikan Aktif
          </div>
        </div>

      </div>

      {/* Main Grid: Active Voyages & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Voyages List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Jadwal Pelayaran Aktif (Voyage Manifest)</h3>
              <p className="text-xs text-slate-500">Daftar rute keberangkatan dan kedatangan kapal saat ini.</p>
            </div>
            <button
              onClick={() => onNavigateTab('tx_voyages')}
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {voyages.map(voy => (
              <div key={voy.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sky-700 text-xs">{voy.voyageNumber}</span>
                    <span className="font-bold text-slate-900 text-xs">{voy.vesselName}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    voy.status === 'Sailing' ? 'bg-sky-100 text-sky-800' :
                    voy.status === 'Loading' ? 'bg-amber-100 text-amber-800' :
                    voy.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {voy.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{voy.originPortName}</span>
                  </div>
                  <span className="text-slate-400 font-bold">➔</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{voy.destinationPortName}</span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>ETD: <strong>{voy.etd}</strong> • ETA: <strong>{voy.eta}</strong></span>
                  <span>Nakhoda: <strong className="text-slate-800">{voy.captainName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Fleet Status Overview */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Status Kapal Armada</h3>
            <button
              onClick={() => onNavigateTab('master_vessels')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              Kelola Kapal
            </button>
          </div>

          <div className="space-y-3">
            {vessels.map(v => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={v.photoUrl} alt={v.name} className="w-10 h-10 object-cover rounded-lg bg-slate-200 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">{v.name}</div>
                    <div className="text-[10px] text-slate-500">{v.vesselType} • {v.dwtCapacity.toLocaleString('id-ID')} DWT</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  v.status === 'In Voyage' ? 'bg-sky-100 text-sky-800' :
                  v.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  v.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                }`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
