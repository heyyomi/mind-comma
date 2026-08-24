import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {t.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : t.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : t.type === 'info' ? (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
