'use client';

import { ReactNode } from 'react';
import Providers from './Providers';
import Sidebar from './nav/Sidebar';
import TopBar from './nav/TopBar';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56">
        <TopBar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Shell>{children}</Shell>
    </Providers>
  );
}
