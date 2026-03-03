'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopNavProps {
  demoActive: boolean;
  onToggleDemo: () => void;
}

const navLinks = [
  { label: 'My Day', href: '/' },
  { label: 'Follow Up', href: '/follow-up' },
  { label: 'Chat', href: '/chat' },
];

export default function TopNav({ demoActive, onToggleDemo }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between h-full px-6 max-w-screen-2xl mx-auto">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-blue-600 text-lg leading-none">✦</span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Vantage <span className="font-light text-slate-500">Copilot</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-1 h-full ml-10">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative flex items-center h-full px-4 text-sm transition-colors
                  ${
                    isActive
                      ? 'font-semibold text-slate-900'
                      : 'font-medium text-slate-500 hover:text-slate-700'
                  }
                `}
              >
                {label}
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-2 h-[2.5px] rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-5">
          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemo}
            className="flex items-center gap-2.5 group"
            aria-label="Toggle demo mode"
          >
            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
              Demo
            </span>
            <div
              className={`
                relative w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer
                ${demoActive ? 'bg-blue-600' : 'bg-slate-200'}
              `}
            >
              <div
                className={`
                  absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200
                  ${demoActive ? 'translate-x-[22px]' : 'translate-x-[3px]'}
                `}
              />
            </div>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Advisor Avatar */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            RP
          </div>
        </div>
      </div>
    </header>
  );
}
