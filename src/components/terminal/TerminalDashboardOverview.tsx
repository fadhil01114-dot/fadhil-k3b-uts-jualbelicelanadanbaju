import React from 'react';
import { 
  Container, Layers, Wrench, Anchor, Truck, Ship, TrendingUp, 
  CheckCircle2, ArrowUpRight, Plus, Box 
} from 'lucide-react';
import { 
  YardBlock, Equipment, Berth, VesselCall, GateTransaction 
} from '../../types/terminal';

interface TerminalDashboardOverviewProps {
  yardBlocks: YardBlock[];
  equipments: Equipment[];
  berths: Berth[];
  vesselCalls: VesselCall[];
  gateTransactions: GateTransaction[];
  onNavigateTab: (tab: any) => void;
}

export const TerminalDashboardOverview: React.FC<TerminalDashboardOverviewProps> = ({
  yardBlocks,
  equipments,
  berths,
  vesselCalls,
  gateTransactions,
  onNavigateTab,
}) => {
  // Stats Computations
  const totalCapacityTeu = yardBlocks.reduce((sum, b) => sum + b.capacityTeu, 0);
  const currentTeuInYard = yardBlocks.reduce((sum, b) => sum + b.currentTeuCount, 0);
  const yorPercentage = totalCapacityTeu > 0 ? Math.round((currentTeuInYard / totalCapacityTeu) * 100) : 0;

  const activeVesselsCount = vesselCalls.filter(v => v.status === 'Berthing' || v.status === 'Loading/Unloading').length;
  const operationalEquipments = equipments.filter(e => e.status === 'In Use' || e.status === 'Operational').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Container className="w-80 h-80" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-800/80 text-cyan-200 text-xs font-semibold border border-cyan-600/40">
            <span>TERMINAL OPERATING SYSTEM (TOS) LIVE DASHBOARD</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Sistem Operasional Terminal Peti Kemas (TPS Global Port)
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pantau arus bongkar muat kapal peti kemas (*Stevedoring*), transaksi Gate In/Out truk, kapasitas *Yard Occupancy Rate (YOR)*, dan produktivitas derek *Quay Crane (QC)* real-time.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('tx_gate')}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <Truck className="w-4 h-4" />
              <span>Input Gate In / Gate Out</span>
            </button>
            <button
              onClick={() => onNavigateTab('tx_vessel_calls')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700"
            >
              <Ship className="w-4 h-4 text-cyan-400" />
              <span>Jadwal Vessel Sandar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('master_yard')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Yard Occupancy Rate (YOR)</span>
            <Layers className="w-5 h-5 text-cyan-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{yorPercentage}%</span>
            <span className="text-xs text-slate-500">Terisi</span>
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {currentTeuInYard.toLocaleString('id-ID')} / {totalCapacityTeu.toLocaleString('id-ID')} TEU
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('tx_vessel_calls')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Kapal Sandar & Bongkar Muat</span>
            <Ship className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeVesselsCount}</span>
            <span className="text-xs text-slate-500">Kapal di Quay</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold">
            Status: Berthing & Unloading
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('tx_gate')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Transaksi Gate In / Gate Out</span>
            <Truck className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {gateTransactions.length} Truk
          </div>
          <div className="text-[11px] text-slate-500">
            Aktivitas gate hari ini
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('master_equipment')}
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Alat Berat & Crane Siap</span>
            <Wrench className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {operationalEquipments} / {equipments.length} Alat
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">
            QC Crane, RTG, Reach Stacker
          </div>
        </div>

      </div>

      {/* Main Section: Yard Block Capacity & Vessel Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Yard Block Capacity Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Status Kapasitas Lapangan Penumpukan (Yard Blocks)</h3>
              <p className="text-xs text-slate-500">Kondisi keterisian kontainer per blok yard penumpukan.</p>
            </div>
            <button
              onClick={() => onNavigateTab('master_yard')}
              className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
            >
              Lihat Blok Yard <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {yardBlocks.map(block => {
              const pct = Math.round((block.currentTeuCount / block.capacityTeu) * 100);
              return (
                <div key={block.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-extrabold text-slate-900 text-xs">{block.blockCode}</div>
                    <span className="text-xs font-bold text-slate-700">
                      {block.currentTeuCount.toLocaleString('id-ID')} / {block.capacityTeu.toLocaleString('id-ID')} TEU ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        pct > 85 ? 'bg-rose-500' :
                        pct > 65 ? 'bg-amber-500' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Kategori: <strong>{block.categoryAllowed}</strong></span>
                    <span>Status: <strong className="text-slate-900">{block.status}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Vessel Calls Summary */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Vessel Call Activity</h3>
            <button
              onClick={() => onNavigateTab('tx_vessel_calls')}
              className="text-xs font-bold text-cyan-700 hover:underline"
            >
              Kelola Sandar
            </button>
          </div>

          <div className="space-y-3">
            {vesselCalls.map(call => (
              <div key={call.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono font-black text-cyan-700 text-[11px]">{call.callSign}</div>
                    <div className="font-extrabold text-slate-900 text-xs">{call.vesselName}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    call.status === 'Loading/Unloading' ? 'bg-sky-100 text-sky-800' :
                    call.status === 'Berthing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {call.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Dermaga: <strong className="text-slate-800">{call.berthName}</strong>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-600 pt-1 border-t border-slate-200/60">
                  <span>Bongkar: {call.inboundTeu} TEU</span>
                  <span>Muat: {call.outboundTeu} TEU</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
