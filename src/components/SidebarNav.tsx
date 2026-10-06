import React from 'react';
import { 
  Anchor, LayoutDashboard, Ship, Compass, Package, Users, 
  MapPin, FileText, Wrench, BarChart3, LogOut, ArrowRightLeft, ShieldCheck, UserCheck
} from 'lucide-react';
import { UserAccount } from '../types/shipping';

export type NavItemKey = 
  | 'dashboard'
  | 'master_vessels'
  | 'master_ports'
  | 'master_cargos'
  | 'master_shippers'
  | 'master_crews'
  | 'tx_voyages'
  | 'tx_bookings'
  | 'tx_maintenances'
  | 'rpt_financial'
  | 'rpt_utilisation'
  | 'rpt_cargos';

interface SidebarNavProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  user: UserAccount;
  onLogout: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
}) => {
  const masterNav = [
    { key: 'master_vessels', label: 'Data Kapal / Armada', icon: Ship },
    { key: 'master_ports', label: 'Data Pelabuhan & Terminal', icon: MapPin },
    { key: 'master_cargos', label: 'Data Tipe Muatan & Tarif', icon: Package },
    { key: 'master_shippers', label: 'Data Klien / Shipper', icon: Users },
    { key: 'master_crews', label: 'Data ABK & Nakhoda', icon: UserCheck },
  ];

  const txNav = [
    { key: 'tx_voyages', label: 'Jadwal Pelayaran (Voyage)', icon: Compass },
    { key: 'tx_bookings', label: 'Booking Kargo (BL)', icon: FileText },
    { key: 'tx_maintenances', label: 'Pemeliharaan Kapal', icon: Wrench },
  ];

  const rptNav = [
    { key: 'rpt_financial', label: 'Laporan Pendapatan Freight', icon: BarChart3 },
    { key: 'rpt_utilisation', label: 'Laporan Utilisasi Armada', icon: Ship },
    { key: 'rpt_cargos', label: 'Laporan Volume Kargo', icon: Package },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 font-sans">
      
      {/* Brand Header */}
      <div>
        <div className="p-4 bg-slate-950 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-sky-600 text-white rounded-xl shadow-md">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-tight leading-none">
              SAMUDERA
            </div>
            <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mt-1">
              Maritime System
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none text-xs">
          
          {/* Overview */}
          <div>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Dashboard Utama</span>
            </button>
          </div>

          {/* MASTER DATA */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              1. MASTER DATA
            </div>
            {masterNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key as NavItemKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* TRANSAKSI DATA */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              2. TRANSAKSI DATA
            </div>
            {txNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key as NavItemKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* LAPORAN DATA */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              3. LAPORAN & ANALITIK
            </div>
            {rptNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key as NavItemKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-2 px-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-bold text-white text-xs truncate">{user.fullName}</div>
            <div className="text-[10px] text-sky-400">{user.role}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-red-950 hover:text-red-300 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-800"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sistem</span>
        </button>
      </div>

    </aside>
  );
};
