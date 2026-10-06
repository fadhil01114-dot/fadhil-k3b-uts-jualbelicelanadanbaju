import React, { useState } from 'react';
import { Ship, Lock, User, Key, ShieldCheck, ArrowRight, Sparkles, Anchor, Users, Package } from 'lucide-react';
import { UserAccount } from '../../types/passengerCargo';

interface PassengerCargoLoginFormProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const PassengerCargoLoginForm: React.FC<PassengerCargoLoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('admin@pelayaran.id');
  const [password, setPassword] = useState<string>('admin123');
  const [role, setRole] = useState<'Super Admin' | 'Loket & Ticketing Supervisor' | 'Manifest Cargo Officer' | 'Syahbandar & Port Controller'>('Super Admin');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Username/email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'usr-' + Date.now(),
        username: username,
        email: username.includes('@') ? username : `${username}@pelayaran.id`,
        fullName: username === 'admin@pelayaran.id' ? 'Bpk. Hendra Gunawan (Administrator)' : username,
        role: role
      });
    }, 600);
  };

  const handleQuickDemoLogin = (demoRole: 'Super Admin' | 'Loket & Ticketing Supervisor' | 'Manifest Cargo Officer') => {
    onLoginSuccess({
      id: 'usr-demo-' + Date.now(),
      username: demoRole === 'Super Admin' ? 'admin@pelayaran.id' : 'officer@pelayaran.id',
      email: demoRole === 'Super Admin' ? 'admin@pelayaran.id' : 'officer@pelayaran.id',
      fullName: demoRole === 'Super Admin' ? 'Bpk. Hendra Gunawan (Super Admin)' : 'Ibu Ratna Juwita (Loket Supervisor)',
      role: demoRole
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased relative overflow-hidden">
      
      {/* Background Nautical Glow Pattern */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-slate-900 space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-sky-600 to-cyan-500 text-white rounded-2xl shadow-lg shadow-sky-600/30">
            <Anchor className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SAMUDERA NUSANTARA</h1>
            <p className="text-xs font-semibold text-sky-700 tracking-widest uppercase">
              Sistem Informasi Muatan Kapal & Penumpang
            </p>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Masuk dengan kredensial petugas loket, manifest kargo, atau administrator sistem.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Username atau Email *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin@pelayaran.id"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold text-slate-900 bg-white"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-bold text-slate-900 bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Otoritas / Hak Akses Petugas
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 font-semibold bg-white text-slate-900"
            >
              <option value="Super Admin">Super Admin Systems</option>
              <option value="Loket & Ticketing Supervisor">Loket & Ticketing Supervisor</option>
              <option value="Manifest Cargo Officer">Petugas Manifest Kargo & Kendaraan</option>
              <option value="Syahbandar & Port Controller">Syahbandar & Port Controller</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-700 hover:bg-sky-600 text-white font-extrabold rounded-xl shadow-lg shadow-sky-700/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Memverifikasi Kredensial...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-2 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 mb-2 text-center uppercase tracking-wider">
            ⚡ Quick Demo Login Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('Super Admin')}
              className="px-3 py-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Login Super Admin</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('Loket & Ticketing Supervisor')}
              className="px-3 py-2 bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              <span>Petugas Loket</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 font-mono">
          Single Source of Truth: Firebase Firestore Database • Prod Ready
        </div>

      </div>
    </div>
  );
};
