'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { planner } from '../../data/planner';
import { tasks } from '../../data/tasks';
import { emails } from '../../data/emails';
import { outreachSuggestions } from '../../data/outreach';
import { leads } from '../../data/leads';
import { useToast } from '../../hooks/useToast';

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function ClientsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
    </svg>
  );
}

function OutreachIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function InboundIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
  );
}

function CopilotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

const navLinks = [
  { label: 'Dashboard', href: '/', icon: DashboardIcon },
  { label: 'Inbox', href: '/follow-up', icon: InboxIcon },
  { label: 'Outreach', href: '/outreach', icon: OutreachIcon },
  { label: 'Inbound', href: '/inbound', icon: InboundIcon },
  { label: 'Clients', href: '/clients', icon: ClientsIcon },
  { label: 'Copilot', href: '/chat', icon: CopilotIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [showSettings, setShowSettings] = useState(false);

  const unreadEmails = emails.filter((e) => !e.isRead).length;
  const pendingOutreach = outreachSuggestions.filter((o) => o.status === 'pending').length;
  const newLeads = leads.filter((l) => l.status === 'new').length;

  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const due = new Date(t.dueDate);
    const today = new Date('2026-03-02');
    return due < today;
  });

  const initials = planner.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-surface-raised">
      {/* Branding */}
      <Link href="/" className="shrink-0 px-5 pt-5 pb-4 block hover:bg-surface-inset/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-blue text-sm font-bold text-white">
            V
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-tight">Vantage</p>
            <p className="text-[10px] text-ink-faint leading-tight">Wealth Copilot</p>
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          const showBadge = (href === '/follow-up' && unreadEmails > 0) || (href === '/outreach' && pendingOutreach > 0) || (href === '/inbound' && newLeads > 0);
          const badgeCount = href === '/follow-up' ? unreadEmails : href === '/inbound' ? newLeads : pendingOutreach;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-accent-blue-light text-accent-blue font-medium'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-inset'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {showBadge && (
                <span className={`text-[10px] font-medium ${isActive ? 'text-accent-blue/70' : 'text-ink-faint'}`}>
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border px-3 py-4 space-y-3">
        {overdueTasks.length > 0 && (
          <p className="px-1 text-xs text-ink-muted">
            <span className="font-semibold text-ink">{overdueTasks.length} overdue</span> tasks
          </p>
        )}

        {/* User profile — clickable for settings */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-inset"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple text-xs font-medium text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink leading-tight">{planner.name}</p>
              <p className="text-[11px] text-ink-muted leading-tight">{planner.title}</p>
            </div>
          </button>

          {/* Settings popover */}
          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
              <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-lg border border-border bg-surface-raised py-1">
                <button
                  onClick={() => { setShowSettings(false); showToast('Settings coming soon'); }}
                  className="w-full px-4 py-2 text-left text-sm text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={() => { setShowSettings(false); showToast('Help center coming soon'); }}
                  className="w-full px-4 py-2 text-left text-sm text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                >
                  Help &amp; Support
                </button>
                <div className="my-1 border-t border-border-faint" />
                <button
                  onClick={() => { setShowSettings(false); showToast('Signed out'); router.push('/'); }}
                  className="w-full px-4 py-2 text-left text-sm text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
