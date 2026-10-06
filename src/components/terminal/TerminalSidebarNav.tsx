import React from 'react';
import { 
  Container, LayoutDashboard, Box, Wrench, Anchor, Truck, 
  Ship, ArrowRightLeft, BarChart3, LogOut, Layers, ShieldCheck 
} from 'lucide-react';
import { UserAccount } from '../../types/terminal';

export type TerminalNavKey = 
  | 'dashboard'
  | 'master_yard'
  | 'master_equipment'
  | 'master_berths'
  | 'master_categories'
  | 'master_lines'
  | 'tx_vessel_calls'
  | 'tx_gate'
  | 'tx_jobs'
  | 'rpt_throughput'
  | 'rpt_yor'
  | 'rpt_productivity';

interface TerminalSidebarNavProps {
  activeTab: TerminalNavKey;
  onSelectTab: (tab: TerminalNavKey) => void;
  user: UserAccount;
  onLogout: () => void;
}

export const TerminalSidebarNav: React.FC<TerminalSidebarNavProps> = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
}) => {
  const masterNav = [
    { key: 'master_yard', label: 'Blok Stack & Yard Lapangan', icon: Layers },
    { key: 'master_equipment', label: 'Alat Berat & Crane (QC/RTG)', icon: Wrench },
    { key: 'master_berths', label: 'Dermaga & Quay Sandar', icon: Anchor },
    { key: 'master_categories', label: 'Kategori Container & Tarif', icon: Box },
    { key: 'master_lines', label: 'Shipping Lines / Agen Kapal', icon: Ship },
  ];

  const txNav = [
    { key: 'tx_vessel_calls', label: 'Bongkar Muat Vessel & Sandar', icon: Ship },
    { key: 'tx_gate', label: 'Gate In / Gate Out Peti Kemas', icon: Truck },
    { key: 'tx_jobs', label: 'Job Order Movement Crane', icon: ArrowRightLeft },
  ];

  const rptNav = [
    { key: 'rpt_throughput', label: 'Laporan Throughput TEU', icon: BarChart3 },
    { key: 'rpt_yor', label: 'Laporan Yard Occupancy (YOR)', icon: Layers },
    { key: 'rpt_productivity', label: 'Laporan Produktivitas Crane', icon: Wrench },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 font-sans">
      
      {/* Brand Header */}
      <div>
        <div className="p-4 bg-slate-950 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-cyan-600 text-white rounded-xl shadow-md">
            <Container className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-tight leading-none">
              TPS PORT TOS
            </div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-1">
              Terminal Peti Kemas
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none text-xs">
          
          {/* Dashboard */}
          <div>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-700 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard Terminal TOS</span>
            </button>
          </div>

          {/* MASTER DATA */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              1. MASTER DATA TERMINAL
            </div>
            {masterNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key as TerminalNavKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-700 text-white font-bold shadow-md'
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
              2. TRANSAKSI OPERASIONAL
            </div>
            {txNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key as TerminalNavKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-700 text-white font-bold shadow-md'
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
                  onClick={() => onSelectTab(item.key as TerminalNavKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-700 text-white font-bold shadow-md'
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
          <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-bold text-white text-xs truncate">{user.fullName}</div>
            <div className="text-[10px] text-cyan-400">{user.role}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-red-950 hover:text-red-300 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-800"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Portal</span>
        </button>
      </div>

    </aside>
  );
};
