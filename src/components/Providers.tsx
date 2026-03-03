'use client';

import { ReactNode } from 'react';
import { DemoContext, useDemoState } from '../hooks/useDemoMode';
import { ToastProvider } from '../hooks/useToast';

export default function Providers({ children }: { children: ReactNode }) {
  const demo = useDemoState();
  return (
    <DemoContext.Provider value={demo}>
      <ToastProvider>{children}</ToastProvider>
    </DemoContext.Provider>
  );
}
