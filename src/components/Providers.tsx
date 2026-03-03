'use client';

import { ReactNode } from 'react';
import { DemoContext, useDemoState } from '../hooks/useDemoMode';

export default function Providers({ children }: { children: ReactNode }) {
  const demo = useDemoState();
  return <DemoContext.Provider value={demo}>{children}</DemoContext.Provider>;
}
