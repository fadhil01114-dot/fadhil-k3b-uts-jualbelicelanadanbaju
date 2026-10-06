import React, { useState } from 'react';
import { Ship, Lock, Mail, ShieldCheck, ArrowRight, Anchor, Compass } from 'lucide-react';
import { UserAccount } from '../types/shipping';

interface LoginFormProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('admin@samudera.co.id');
  const [password, setPassword] = useState<string>('admin123');
  const [error, setError] = useState<string>('');

  const demoAccounts: UserAccount[] = [
    {
      id: 'usr-001',
      username: 'admin_ops',
      email: 'admin@samudera.co.id',
      fullName: 'Bpk. Hendra Pratama, S.T., M.Mar',
      role: 'Super Admin'
    },
    {
      id: 'usr-002',
      username: 'fleet_mgr',
      email: 'fleet@samudera.co.id',
      fullName: 'Capt. Bambang Suryono',
      role: 'Fleet Manager'
    },
    {
      id: 'usr-003',
      username: 'ops_port',
      email: 'ops@samudera.co.id',
      fullName: 'Ibu Ratna Juwita',
      role: 'Port Operations'
    },
    {
      id: 'usr-004',
      username: 'finance_billing',
      email: 'finance@samudera.co.id',
      fullName: 'Bpk. Agus Santoso, S.E.',
      role: 'Finance Officer'
    }
  ];

  const handleSelectDemo = (acc: UserAccount) => {
    setEmail(acc.email);
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Mohon isi email/username dan password.');
      return;
    }

    const matched = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (matched || password === 'admin123' || password === 'admin') {
      const activeUser = matched || {
        id: 'usr-custom-' + Date.now(),
        username: email.split('@')[0],
        email: email,
        fullName: 'Bpk. Hendra Pratama (Administrator)',
        role: 'Super Admin'
      };
      onLoginSuccess(activeUser);
    } else {
      setError('Email atau kata sandi tidak cocok. Gunakan salah satu akun demo diatas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 antialiased">
      
      {/* Container */}
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-600 text-white shadow-xl shadow-sky-600/30">
            <Anchor className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              SAMUDERA NUSANTARA
            </h1>
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mt-0.5">
              Maritime & Fleet Management System
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Masuk Portal Sistem</h2>
            <p className="text-xs text-slate-500">
              Silakan login dengan kredensial staf pelayaran Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Email atau Username *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@samudera.co.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 font-medium text-slate-900 text-xs transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Password / Kata Sandi *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 font-medium text-slate-900 text-xs transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 font-semibold text-xs border border-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Masuk Sistem Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>PILIH AKUN DEMO PERUSAHAAN:</span>
              <span className="text-sky-600">Password: admin123</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {demoAccounts.map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    email === acc.email
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{acc.fullName}</div>
                  <div className="text-[10px] text-slate-500">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400">
          PT Samudera Nusantara Maritime Tbk • Production Real-time Database
        </div>

      </div>
    </div>
  );
};
