'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string | string[];
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;
const listeners: Set<ToastListener> = new Set();

/** Global trigger function usable anywhere (including Axios interceptors) */
export const toast = {
  show: (item: Omit<ToastItem, 'id'>) => {
    const fullToast: ToastItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    };
    listeners.forEach((listener) => listener(fullToast));
  },
  error: (message: string | string[], title = 'Error') => {
    toast.show({ type: 'error', title, message });
  },
  success: (message: string | string[], title = 'Success') => {
    toast.show({ type: 'success', title, message });
  },
  warning: (message: string | string[], title = 'Warning') => {
    toast.show({ type: 'warning', title, message });
  },
  info: (message: string | string[], title = 'Notification') => {
    toast.show({ type: 'info', title, message });
  },
};

const ToastContext = createContext<{
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const ToastCard: React.FC<{ toastItem: ToastItem; onClose: (id: string) => void }> = ({
  toastItem,
  onClose,
}) => {
  const duration = toastItem.duration || 4500;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose(toastItem.id);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, toastItem.id, onClose]);

  const config = {
    error: {
      border: 'border-rose-200/90',
      bg: 'bg-white/95',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      titleColor: 'text-rose-950',
      barColor: 'bg-rose-500',
      Icon: AlertCircle,
    },
    success: {
      border: 'border-emerald-200/90',
      bg: 'bg-white/95',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      titleColor: 'text-emerald-950',
      barColor: 'bg-emerald-500',
      Icon: CheckCircle2,
    },
    warning: {
      border: 'border-amber-200/90',
      bg: 'bg-white/95',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      titleColor: 'text-amber-950',
      barColor: 'bg-amber-500',
      Icon: AlertTriangle,
    },
    info: {
      border: 'border-teal-200/90',
      bg: 'bg-white/95',
      iconBg: 'bg-teal-50 text-teal-700 border border-teal-100',
      titleColor: 'text-teal-950',
      barColor: 'bg-teal-600',
      Icon: Info,
    },
  }[toastItem.type];

  const IconComponent = config.Icon;
  const messages = Array.isArray(toastItem.message) ? toastItem.message : [toastItem.message];

  return (
    <div
      className={`pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl border ${config.border} ${config.bg} p-4 shadow-xl shadow-slate-900/5 backdrop-blur-md transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
          <IconComponent className="h-5 w-5" />
        </div>

        <div className="flex-1 pr-2">
          <h4 className={`text-sm font-bold tracking-tight ${config.titleColor}`}>
            {toastItem.title}
          </h4>
          <div className="mt-1 space-y-1 text-xs text-slate-600 font-medium">
            {messages.map((msg, idx) => (
              <p key={idx} className="leading-relaxed flex items-start gap-1.5">
                {messages.length > 1 && <span className="text-teal-700 font-bold">•</span>}
                <span>{msg}</span>
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={() => onClose(toastItem.id)}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Animated Progress Timer Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/70">
        <div
          className={`h-full ${config.barColor} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (item: Omit<ToastItem, 'id'>) => {
    toast.show(item);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleNewToast: ToastListener = (newToast) => {
      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 visible toasts
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container Stack */}
      <div
        dir="ltr"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toastItem={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
