'use client';

import { useState } from 'react';
import { Client } from '../../lib/types';
import { clients } from '../../data/clients';

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'totalAssets' | 'ytdReturn' | 'nextReview'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = clients
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.occupation.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'totalAssets': cmp = a.totalAssets - b.totalAssets; break;
        case 'ytdReturn': cmp = a.ytdReturn - b.ytdReturn; break;
        case 'nextReview': cmp = a.nextReview.localeCompare(b.nextReview); break;
      }
      return sortAsc ? cmp : -cmp;
    });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'name');
    }
  };

  const sortIndicator = (key: typeof sortKey) => {
    if (sortKey !== key) return '';
    return sortAsc ? ' \u2191' : ' \u2193';
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col px-8 py-8">
      {/* Header */}
      <div className="shrink-0 mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-ink-muted">{clients.length} households &middot; Click any row for details</p>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 border-b border-border pb-1">
          <svg className="h-3.5 w-3.5 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, occupation, or tag..."
            className="w-64 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto border-t border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface">
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-ink-faint">
              <th className="py-3 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('name')}>
                Name{sortIndicator('name')}
              </th>
              <th className="py-3 pr-4">Occupation</th>
              <th className="py-3 pr-4">Risk</th>
              <th className="py-3 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('totalAssets')}>
                Assets{sortIndicator('totalAssets')}
              </th>
              <th className="py-3 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('ytdReturn')}>
                YTD{sortIndicator('ytdReturn')}
              </th>
              <th className="py-3 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('nextReview')}>
                Next Review{sortIndicator('nextReview')}
              </th>
              <th className="py-3">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="h-12 border-b border-border-faint cursor-pointer transition-colors hover:bg-surface-inset"
              >
                <td className="py-3 pr-4 font-medium text-ink whitespace-nowrap">{client.name}</td>
                <td className="py-3 pr-4 text-ink-muted max-w-[200px] truncate">{client.occupation}</td>
                <td className="py-3 pr-4 text-ink-muted whitespace-nowrap">{client.riskProfile}</td>
                <td className="py-3 pr-4 text-ink whitespace-nowrap">{formatCurrency(client.totalAssets)}</td>
                <td className={`py-3 pr-4 whitespace-nowrap ${client.ytdReturn >= 0 ? 'text-ink' : 'text-ink-muted'}`}>
                  {client.ytdReturn >= 0 ? '+' : ''}{client.ytdReturn.toFixed(1)}%
                </td>
                <td className="py-3 pr-4 text-ink-muted whitespace-nowrap">
                  {new Date(client.nextReview + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="py-3">
                  <div className="flex gap-1 overflow-hidden">
                    {client.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs text-ink-faint whitespace-nowrap">{tag}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-faint">No clients match your search.</p>
        )}
      </div>

      {/* Client detail modal */}
      {selectedClient && (
        <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}
    </div>
  );
}

function parseAllocation(allocation: string): { equities: number; fixed: number; alternatives: number; cash: number } {
  const eq = allocation.match(/(\d+)%\s*Equit/i);
  const fi = allocation.match(/(\d+)%\s*Fixed/i);
  const alt = allocation.match(/(\d+)%\s*Alt/i);
  const ca = allocation.match(/(\d+)%\s*Cash/i);
  return {
    equities: eq ? parseInt(eq[1]) : 0,
    fixed: fi ? parseInt(fi[1]) : 0,
    alternatives: alt ? parseInt(alt[1]) : 0,
    cash: ca ? parseInt(ca[1]) : 0,
  };
}

function aggregateAllocation(client: Client): { equities: number; fixed: number; alternatives: number; cash: number } {
  const totalValue = client.accounts.reduce((s, a) => s + a.value, 0);
  if (totalValue === 0) return { equities: 0, fixed: 0, alternatives: 0, cash: 0 };
  let eq = 0, fi = 0, alt = 0, ca = 0;
  for (const acct of client.accounts) {
    const alloc = parseAllocation(acct.allocation);
    const weight = acct.value / totalValue;
    eq += alloc.equities * weight;
    fi += alloc.fixed * weight;
    alt += alloc.alternatives * weight;
    ca += alloc.cash * weight;
  }
  return { equities: Math.round(eq), fixed: Math.round(fi), alternatives: Math.round(alt), cash: Math.round(ca) };
}

type ModalTab = 'overview' | 'portfolio' | 'activity';

type ScheduleStep = 'closed' | 'picking' | 'confirming' | 'confirmed';

const MEETING_TYPES = [
  { label: 'Quarterly Review', value: 'quarterly-review' },
  { label: 'Portfolio Review', value: 'portfolio-review' },
  { label: 'Financial Planning', value: 'planning' },
  { label: 'Check-In Call', value: 'check-in' },
];

function generateTimeSlots() {
  const days = ['Mon, Mar 9', 'Tue, Mar 10', 'Wed, Mar 11', 'Thu, Mar 12', 'Fri, Mar 13'];
  const times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];
  const slots: { day: string; time: string; available: boolean }[] = [];
  for (const day of days) {
    for (const time of times) {
      slots.push({ day, time, available: Math.random() > 0.35 });
    }
  }
  return slots;
}

function ClientDetailModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const [tab, setTab] = useState<ModalTab>('overview');
  const [noteText, setNoteText] = useState(client.notes || '');
  const [noteSaved, setNoteSaved] = useState(false);

  // Schedule meeting state
  const [scheduleStep, setScheduleStep] = useState<ScheduleStep>('closed');
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0].value);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [duration, setDuration] = useState('60');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [timeSlots] = useState(() => generateTimeSlots());

  const initials = client.name.split(' ').filter(n => n.length > 1 && n[0] === n[0].toUpperCase()).map(n => n[0]).slice(0, 2).join('');
  const alloc = aggregateAllocation(client);
  const totalAccountValue = client.accounts.reduce((s, a) => s + a.value, 0);

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleConfirmMeeting = () => {
    setScheduleStep('confirmed');
  };

  const slotsByDay = timeSlots.reduce<Record<string, typeof timeSlots>>((acc, slot) => {
    if (!acc[slot.day]) acc[slot.day] = [];
    acc[slot.day].push(slot);
    return acc;
  }, {});

  const tabs: { key: ModalTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'activity', label: 'Activity' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-surface-raised flex flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-border bg-surface-raised px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-medium text-white">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">{client.name}</h2>
                <p className="text-sm text-ink-muted">{client.occupation}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors p-1">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contact actions */}
          <div className="flex items-center gap-2 mt-3">
            <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Email
            </button>
            <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call
            </button>
            <button
              onClick={() => setScheduleStep('picking')}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Schedule Meeting
            </button>
            <div className="ml-auto flex items-center gap-3 text-xs text-ink-faint">
              <span>Client since {client.relationshipStart}</span>
              <span>Age {client.age}</span>
              <span>{client.riskProfile} risk</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 mt-3 -mb-4 border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 pb-2 text-xs transition-colors ${
                  tab === t.key
                    ? 'border-b-2 border-ink font-medium text-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Key metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">Total Assets</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {client.totalAssets >= 1_000_000
                      ? `$${(client.totalAssets / 1_000_000).toFixed(2)}M`
                      : `$${(client.totalAssets / 1_000).toFixed(0)}K`}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">YTD Return</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {client.ytdReturn >= 0 ? '+' : ''}{client.ytdReturn.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">Annual Income</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    ${client.annualIncome >= 1_000_000
                      ? `${(client.annualIncome / 1_000_000).toFixed(1)}M`
                      : `${(client.annualIncome / 1_000).toFixed(0)}K`}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">Portfolio Value</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {client.portfolioValue >= 1_000_000
                      ? `$${(client.portfolioValue / 1_000_000).toFixed(2)}M`
                      : `$${(client.portfolioValue / 1_000).toFixed(0)}K`}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-0.5 text-xs text-ink-muted">{tag}</span>
                ))}
              </div>

              {/* Goals */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-2">Goals</h3>
                <ul className="space-y-1.5">
                  {client.goals.map((goal, i) => (
                    <li key={i} className="text-sm text-ink-muted leading-relaxed">- {goal}</li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint">Notes</h3>
                  {noteSaved && <span className="text-xs text-ink-faint">Saved</span>}
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none resize-none"
                  placeholder="Add notes about this client..."
                />
                <button
                  onClick={handleSaveNote}
                  className="mt-2 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {tab === 'portfolio' && (
            <div className="space-y-6">
              {/* Aggregate allocation bar */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Asset Allocation</h3>
                <div className="flex h-8 w-full overflow-hidden rounded-lg">
                  {alloc.equities > 0 && (
                    <div className="bg-ink flex items-center justify-center text-[10px] font-medium text-white" style={{ width: `${alloc.equities}%` }}>
                      {alloc.equities}%
                    </div>
                  )}
                  {alloc.fixed > 0 && (
                    <div className="bg-ink-muted flex items-center justify-center text-[10px] font-medium text-white" style={{ width: `${alloc.fixed}%` }}>
                      {alloc.fixed}%
                    </div>
                  )}
                  {alloc.alternatives > 0 && (
                    <div className="bg-ink-faint flex items-center justify-center text-[10px] font-medium text-white" style={{ width: `${alloc.alternatives}%` }}>
                      {alloc.alternatives}%
                    </div>
                  )}
                  {alloc.cash > 0 && (
                    <div className="bg-border flex items-center justify-center text-[10px] font-medium text-ink-muted" style={{ width: `${alloc.cash}%` }}>
                      {alloc.cash}%
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-ink-muted">
                  {alloc.equities > 0 && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink" /> Equities {alloc.equities}%</span>}
                  {alloc.fixed > 0 && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-muted" /> Fixed Income {alloc.fixed}%</span>}
                  {alloc.alternatives > 0 && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-faint" /> Alternatives {alloc.alternatives}%</span>}
                  {alloc.cash > 0 && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-border" /> Cash {alloc.cash}%</span>}
                </div>
              </div>

              {/* Performance summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">YTD Return</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {client.ytdReturn >= 0 ? '+' : ''}{client.ytdReturn.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">Portfolio Value</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {client.portfolioValue >= 1_000_000
                      ? `$${(client.portfolioValue / 1_000_000).toFixed(2)}M`
                      : `$${(client.portfolioValue / 1_000).toFixed(0)}K`}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] text-ink-faint uppercase tracking-wider">Total Accounts</p>
                  <p className="mt-1 text-lg font-semibold text-ink">{client.accounts.length}</p>
                </div>
              </div>

              {/* Accounts detail with allocation bars */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Accounts</h3>
                <div className="space-y-3">
                  {client.accounts.map((acct, i) => {
                    const pct = totalAccountValue > 0 ? (acct.value / totalAccountValue) * 100 : 0;
                    const acctAlloc = parseAllocation(acct.allocation);
                    return (
                      <div key={i} className="rounded-lg border border-border-faint p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-ink">{acct.type}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-ink">
                              {acct.value >= 1_000_000
                                ? `$${(acct.value / 1_000_000).toFixed(2)}M`
                                : `$${(acct.value / 1_000).toFixed(0)}K`}
                            </span>
                            <span className="ml-2 text-xs text-ink-faint">{pct.toFixed(0)}%</span>
                          </div>
                        </div>
                        {/* Mini allocation bar */}
                        <div className="flex h-1.5 w-full overflow-hidden rounded-full">
                          {acctAlloc.equities > 0 && <div className="bg-ink" style={{ width: `${acctAlloc.equities}%` }} />}
                          {acctAlloc.fixed > 0 && <div className="bg-ink-muted" style={{ width: `${acctAlloc.fixed}%` }} />}
                          {acctAlloc.alternatives > 0 && <div className="bg-ink-faint" style={{ width: `${acctAlloc.alternatives}%` }} />}
                          {acctAlloc.cash > 0 && <div className="bg-border" style={{ width: `${acctAlloc.cash}%` }} />}
                        </div>
                        <p className="mt-1 text-[11px] text-ink-faint">{acct.allocation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-6">
              {/* Recent activity */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {client.recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
                      <p className="text-sm text-ink-muted leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next review */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-ink-faint uppercase tracking-wider">Next Review</p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {new Date(client.nextReview + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <button className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>

              {/* Goals progress */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Goals</h3>
                <div className="space-y-2">
                  {client.goals.map((goal, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-border-faint p-3">
                      <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                      <p className="text-sm text-ink-muted leading-relaxed">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Meeting Overlay */}
        {scheduleStep !== 'closed' && (
          <div className="absolute inset-0 z-20 flex flex-col bg-surface-raised">
            {/* Overlay header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  {scheduleStep === 'confirmed' ? 'Meeting Scheduled' : 'Schedule Meeting'}
                </h3>
                <p className="text-xs text-ink-muted">with {client.name}</p>
              </div>
              <button
                onClick={() => { setScheduleStep('closed'); setSelectedSlot(null); setMeetingNotes(''); }}
                className="text-ink-muted hover:text-ink transition-colors p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {scheduleStep === 'confirmed' ? (
                /* Confirmation screen */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white mb-4">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-ink">Meeting Confirmed</h4>
                  <p className="mt-2 text-sm text-ink-muted max-w-sm">
                    {MEETING_TYPES.find(t => t.value === meetingType)?.label} with {client.name}
                  </p>
                  <div className="mt-4 rounded-lg border border-border px-5 py-3 text-sm">
                    <p className="font-medium text-ink">{selectedSlot?.day}, 2026</p>
                    <p className="text-ink-muted">{selectedSlot?.time} &middot; {duration} minutes</p>
                  </div>
                  {meetingNotes && (
                    <p className="mt-3 text-xs text-ink-faint max-w-sm">Notes: {meetingNotes}</p>
                  )}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => { setScheduleStep('closed'); setSelectedSlot(null); setMeetingNotes(''); }}
                      className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => { setScheduleStep('closed'); setSelectedSlot(null); setMeetingNotes(''); }}
                      className="rounded-full border border-border px-5 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                    >
                      Add to Calendar
                    </button>
                  </div>
                </div>
              ) : scheduleStep === 'confirming' && selectedSlot ? (
                /* Review & confirm step */
                <div className="space-y-5 max-w-md">
                  <div>
                    <h4 className="text-sm font-medium text-ink mb-3">Review Details</h4>
                    <div className="rounded-lg border border-border divide-y divide-border-faint">
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-ink-faint">Client</span>
                        <span className="text-sm text-ink">{client.name}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-ink-faint">Type</span>
                        <span className="text-sm text-ink">{MEETING_TYPES.find(t => t.value === meetingType)?.label}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-ink-faint">Date</span>
                        <span className="text-sm text-ink">{selectedSlot.day}, 2026</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-ink-faint">Time</span>
                        <span className="text-sm text-ink">{selectedSlot.time}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-ink-faint">Duration</span>
                        <span className="text-sm text-ink">{duration} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-ink-faint mb-1.5">Meeting notes (optional)</label>
                    <textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      rows={3}
                      placeholder="Add agenda items or notes for this meeting..."
                      className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleConfirmMeeting}
                      className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    >
                      Confirm &amp; Send Invite
                    </button>
                    <button
                      onClick={() => setScheduleStep('picking')}
                      className="rounded-full border border-border px-4 py-2 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                /* Time slot picker step */
                <div className="space-y-5">
                  {/* Meeting type & duration */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-ink-faint mb-1.5">Meeting type</label>
                      <select
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
                      >
                        {MEETING_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-ink-faint mb-1.5">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
                      >
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                      </select>
                    </div>
                  </div>

                  {/* Time slot grid */}
                  <div>
                    <label className="block text-xs text-ink-faint mb-3">Select a time — week of March 9</label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(slotsByDay).map(([day, slots]) => (
                        <div key={day}>
                          <p className="text-[11px] font-medium text-ink mb-2 text-center">{day}</p>
                          <div className="space-y-1.5">
                            {slots.map((slot) => {
                              const isSelected = selectedSlot?.day === slot.day && selectedSlot?.time === slot.time;
                              return (
                                <button
                                  key={`${slot.day}-${slot.time}`}
                                  disabled={!slot.available}
                                  onClick={() => setSelectedSlot({ day: slot.day, time: slot.time })}
                                  className={`w-full rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                                    isSelected
                                      ? 'border-ink bg-ink text-white'
                                      : slot.available
                                        ? 'border-border text-ink-muted hover:border-ink/30 hover:bg-surface-inset'
                                        : 'border-border-faint text-ink-faint/40 cursor-not-allowed line-through'
                                  }`}
                                >
                                  {slot.time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSlot && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setScheduleStep('confirming')}
                        className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-white transition-opacity hover:opacity-80"
                      >
                        Continue &rarr;
                      </button>
                      <span className="text-xs text-ink-faint">
                        {selectedSlot.day} at {selectedSlot.time}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
