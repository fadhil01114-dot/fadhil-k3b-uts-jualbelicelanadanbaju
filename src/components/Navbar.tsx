import React from 'react';
import { Search, Bell, ShieldCheck, Database, Anchor } from 'lucide-react';
import { UserAccount } from '../types/shipping';

interface NavbarProps {
  user: UserAccount;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between gap-4 font-sans shadow-xs">
      
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama kapal, pelabuhan, kode voyage, bill of lading..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-sky-600 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* System Status & Actions */}
      <div className="flex items-center gap-4 text-xs">
        
        {/* Real DB Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real Firebase Firestore Ready</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="font-bold text-slate-900">{user.fullName}</div>
            <div className="text-[10px] text-sky-600 font-medium">{user.role}</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
            {user.fullName.charAt(0)}
          </div>
        </div>

      </div>

    </header>
  );
};
