'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { emails } from '../../data/emails';
import { clients } from '../../data/clients';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/follow-up': 'Inbox',
  '/outreach': 'Outreach',
  '/chat': 'Copilot',
};

function getBreadcrumb(pathname: string): string {
  if (pageNames[pathname]) return pageNames[pathname];
  if (pathname.startsWith('/meetings/')) return 'Meeting Detail';
  if (pathname.startsWith('/prep/')) return 'Meeting Prep';
  return 'Page';
}

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const pageName = getBreadcrumb(pathname);
  const unreadCount = emails.filter((e) => !e.isRead).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim().length > 0
    ? clients.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-12 items-center justify-between border-b border-border px-6">
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/" className="text-ink-faint hover:text-ink transition-colors">Home</Link>
        <span className="text-ink-faint">/</span>
        <span className="font-medium text-ink">{pageName}</span>
      </nav>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 rounded-lg border border-border-faint px-3 py-1.5 text-xs focus-within:border-ink/30 transition-colors">
            <svg className="h-3.5 w-3.5 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              placeholder="Search clients, emails..."
              className="w-40 bg-transparent text-xs text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
          {showSearch && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-border bg-surface-raised py-1 shadow-lg z-50">
              {searchResults.length > 0 ? (
                searchResults.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { router.push(`/clients?highlight=${c.id}`); setShowSearch(false); setSearchQuery(''); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-surface-inset transition-colors flex items-center justify-between"
                  >
                    <span className="text-ink font-medium">{c.name}</span>
                    <span className="text-[10px] text-ink-faint">${(c.totalAssets / 1_000_000).toFixed(1)}M</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-xs text-ink-faint text-center">No clients found</p>
              )}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <Link href="/follow-up" className="relative p-1 text-ink-muted hover:text-ink transition-colors">
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
