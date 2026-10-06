import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, X, Check } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin demo credentials: 'admin123' or 'nevada'
    if (password === 'admin123' || password === 'nevada' || password === 'admin') {
      setError('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Sandi admin salah. Coba: admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">Admin Login Nevada</h3>
            <p className="text-xs text-slate-500 mt-1">
              Akses Admin Panel untuk kelola stok, approval bukti bayar, & laporan sales.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password / Kata Sandi Admin:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-bold text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Masuk Admin Panel
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Kredensial Demo Admin: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">admin123</code>
          </div>

        </div>

      </div>
    </div>
  );
};
