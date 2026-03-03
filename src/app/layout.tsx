import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutShell from '../components/LayoutShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Wealth Management Demo',
  description: 'AI-powered wealth copilot for financial advisors',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-surface text-ink`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
