import React from 'react';
import { Search, Bell, Database, ShieldCheck, Sparkles, Anchor } from 'lucide-react';
import { UserAccount } from '../../types/passengerCargo';

interface PassengerCargoNavbarProps {
  user: UserAccount;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const PassengerCargoNavbar: React.FC<PassengerCargoNavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 font-sans shadow-2xs">
      
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Cari PNR, nama penumpang, no resi kargo, nama kapal, atau voyage..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-600 font-medium transition-all"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-4">
        
        {/* Firebase Live Connection Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Firestore Live Connected</span>
        </div>

        {/* Notifications */}
        <button
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors"
          title="Notifikasi Operasional Pelayaran"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full" />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="text-xs font-black text-slate-900">{user.fullName}</div>
            <div className="text-[10px] text-sky-700 font-extrabold">{user.role}</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-700 to-cyan-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            {user.fullName ? user.fullName.charAt(0) : 'A'}
          </div>
        </div>

      </div>

    </header>
  );
};
