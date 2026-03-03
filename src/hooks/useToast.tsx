'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Toast {
  id: string;
  message: string;
  undoAction?: () => void;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, undoAction?: () => void) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  showToast: () => {},
  dismissToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, undoAction?: () => void) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, undoAction }]);
    setTimeout(() => dismissToast(id), 4500);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-up rounded-lg border border-border bg-surface-raised px-4 py-3 shadow-lg flex items-center gap-3 min-w-[240px] max-w-[380px]"
          >
            <p className="text-sm text-ink flex-1">{toast.message}</p>
            {toast.undoAction && (
              <button
                onClick={() => {
                  toast.undoAction?.();
                  dismissToast(toast.id);
                }}
                className="shrink-0 text-xs font-semibold text-accent-blue hover:text-ink transition-colors"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-ink-faint hover:text-ink transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
