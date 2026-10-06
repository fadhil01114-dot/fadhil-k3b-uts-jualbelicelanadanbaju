import React from 'react';
import { Bell, Check, X, Sparkles, ShoppingBag, FileCheck, Info } from 'lucide-react';
import { StoreNotification } from '../types';
import { markNotificationRead } from '../lib/db';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StoreNotification[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-8 z-50 max-w-sm w-full bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="font-extrabold text-sm">Notifikasi Pesanan Masuk</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800 p-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Belum ada notifikasi pesanan baru.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-3 rounded-xl transition-colors cursor-pointer flex gap-3 items-start ${
                n.read ? 'bg-slate-900 opacity-70' : 'bg-slate-800/90 hover:bg-slate-800 border-l-4 border-red-500'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-700 text-red-400 shrink-0">
                {n.type === 'new_order' ? <ShoppingBag className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
