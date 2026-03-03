'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { emails } from '../../data/emails';
import { globalSearch, SearchResult } from '../../lib/search';

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

const typeIcons: Record<SearchResult['type'], string> = {
  client: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  email: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  meeting: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  task: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  outreach: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const pageName = getBreadcrumb(pathname);
  const unreadCount = emails.filter((e) => !e.isRead).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => globalSearch(searchQuery), [searchQuery]);
  const hasResults = Object.keys(searchResults).length > 0;
  const totalResults = Object.values(searchResults).reduce((sum, arr) => sum + arr.length, 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    setShowSearch(false);
    setSearchQuery('');
  };

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
          <div className="flex items-center gap-2 rounded-lg border border-border-faint bg-surface-inset/50 px-3 py-1.5 text-xs focus-within:border-ink/30 transition-colors">
            <svg className="h-3.5 w-3.5 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              placeholder="Search clients, emails, meetings..."
              className="w-52 bg-transparent text-xs text-ink placeholder:text-ink-faint focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="text-ink-faint hover:text-ink">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {showSearch && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border border-border bg-surface-raised shadow-lg z-50 max-h-[420px] overflow-y-auto">
              {hasResults ? (
                <>
                  {Object.entries(searchResults).map(([category, items]) => (
                    <div key={category}>
                      <p className="sticky top-0 bg-surface-inset/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                        {category}
                        <span className="ml-1 font-normal">{items.length}</span>
                      </p>
                      {items.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-3 py-2 text-left hover:bg-surface-inset transition-colors flex items-start gap-2.5"
                        >
                          <svg className="h-3.5 w-3.5 mt-0.5 shrink-0 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[result.type]} />
                          </svg>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-ink truncate">{result.title}</p>
                            <p className="text-[11px] text-ink-faint truncate">{result.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                  <p className="px-3 py-2 text-[10px] text-ink-faint text-center border-t border-border-faint">
                    {totalResults} result{totalResults !== 1 ? 's' : ''} found
                  </p>
                </>
              ) : (
                <p className="px-3 py-6 text-xs text-ink-faint text-center">No results for &ldquo;{searchQuery}&rdquo;</p>
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
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-blue text-[9px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
