import React from 'react';
import { Search, Database, Container } from 'lucide-react';
import { UserAccount } from '../../types/terminal';

interface TerminalNavbarProps {
  user: UserAccount;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TerminalNavbar: React.FC<TerminalNavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between gap-4 font-sans shadow-xs">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari no. kontainer (MSKU-...), blok yard, nama vessel, truk..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-cyan-600 focus:bg-white transition-all"
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

      {/* System Status & User Info */}
      <div className="flex items-center gap-4 text-xs">
        
        {/* Real DB Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real Firebase TOS Ready</span>
        </div>

        {/* Active User */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="font-bold text-slate-900">{user.fullName}</div>
            <div className="text-[10px] text-cyan-700 font-bold">{user.role}</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
            {user.fullName.charAt(0)}
          </div>
        </div>

      </div>

    </header>
  );
};
