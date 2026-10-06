import React from 'react';
import { 
  Anchor, LayoutDashboard, Ship, Compass, Tag, Truck, Users, 
  CalendarDays, Ticket, PackageCheck, FileSpreadsheet, LogOut, ShieldCheck 
} from 'lucide-react';
import { UserAccount } from '../../types/passengerCargo';

export type PassengerCargoNavKey = 
  | 'dashboard'
  | 'master_ships'
  | 'master_routes'
  | 'master_classes'
  | 'master_cargo_categories'
  | 'master_agents'
  | 'tx_voyages'
  | 'tx_tickets'
  | 'tx_manifests'
  | 'rpt_passenger_manifest'
  | 'rpt_cargo_manifest'
  | 'rpt_revenue';

interface PassengerCargoSidebarNavProps {
  activeTab: PassengerCargoNavKey;
  onSelectTab: (tab: PassengerCargoNavKey) => void;
  user: UserAccount;
  onLogout: () => void;
}

export const PassengerCargoSidebarNav: React.FC<PassengerCargoSidebarNavProps> = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800 font-sans">
      
      {/* Brand Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-tr from-sky-600 to-cyan-500 text-white rounded-xl shadow-md">
          <Anchor className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-extrabold text-white text-sm tracking-tight leading-tight">
            SAMUDERA NUSANTARA
          </h2>
          <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
            Sistem Muatan & Tiket
          </p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 text-xs font-medium">
        
        {/* Main Dashboard */}
        <div>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-extrabold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'hover:bg-slate-800/80 text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Monitoring</span>
          </button>
        </div>

        {/* Master Data Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
            1. MASTER DATA
          </p>
          <button
            onClick={() => onSelectTab('master_ships')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'master_ships'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-4 h-4 text-sky-400" />
            <span>Kapal Penumpang & Ro-Ro</span>
          </button>
          <button
            onClick={() => onSelectTab('master_routes')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'master_routes'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Rute & Pelabuhan Singgah</span>
          </button>
          <button
            onClick={() => onSelectTab('master_classes')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'master_classes'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Kelas Kabin & Tarif Tiket</span>
          </button>
          <button
            onClick={() => onSelectTab('master_cargo_categories')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'master_cargo_categories'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Golongan Kendaraan & Kargo</span>
          </button>
          <button
            onClick={() => onSelectTab('master_agents')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'master_agents'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Agen Tiket & Loket Partner</span>
          </button>
        </div>

        {/* Transaksi Data Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
            2. TRANSAKSI OPERASIONAL
          </p>
          <button
            onClick={() => onSelectTab('tx_voyages')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'tx_voyages'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-sky-400" />
            <span>Jadwal Voyage & Pelayaran</span>
          </button>
          <button
            onClick={() => onSelectTab('tx_tickets')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'tx_tickets'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Tiket Penumpang & PNR</span>
          </button>
          <button
            onClick={() => onSelectTab('tx_manifests')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'tx_manifests'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-teal-400" />
            <span>Manifest Kargo & Kendaraan</span>
          </button>
        </div>

        {/* Laporan Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
            3. LAPORAN & DOKUMEN
          </p>
          <button
            onClick={() => onSelectTab('rpt_passenger_manifest')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'rpt_passenger_manifest'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Manifest Penumpang Syahbandar</span>
          </button>
          <button
            onClick={() => onSelectTab('rpt_cargo_manifest')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'rpt_cargo_manifest'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            <span>Laporan Manifest Kargo</span>
          </button>
          <button
            onClick={() => onSelectTab('rpt_revenue')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'rpt_revenue'
                ? 'bg-sky-600 text-white font-bold'
                : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Laporan Sales & Pendapatan</span>
          </button>
        </div>

      </nav>

      {/* User Footer Account */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-sky-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
            {user.fullName ? user.fullName.charAt(0) : 'A'}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-100 text-xs truncate">
              {user.fullName}
            </div>
            <div className="text-[10px] text-cyan-400 font-medium truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          title="Keluar / Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};
