'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Client } from '../../lib/types';
import { clients } from '../../data/clients';
import { meetings } from '../../data/meetings';
import { clientHoldings } from '../../data/holdings';
import { clientDocuments } from '../../data/documents';
import { useToast } from '../../hooks/useToast';

// Derive last contacted date from most recent completed meeting per client
const lastContactedMap: Record<string, string> = {};
for (const m of meetings) {
  if (m.status === 'completed') {
    const existing = lastContactedMap[m.clientId];
    if (!existing || m.date > existing) {
      lastContactedMap[m.clientId] = m.date;
    }
  }
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ClientsPage() {
  return (
    <Suspense>
      <ClientsContent />
    </Suspense>
  );
}

function ClientsContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [selectedClient, setSelectedClient] = useState<Client | null>(() => {
    if (highlightId) {
      return clients.find((c) => c.id === highlightId) ?? null;
    }
    return null;
  });
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'totalAssets' | 'ytdReturn' | 'nextReview' | 'lastContacted'>('name');
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
        case 'lastContacted': cmp = (lastContactedMap[a.id] || '').localeCompare(lastContactedMap[b.id] || ''); break;
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
              <th className="py-2 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('name')}>
                Name{sortIndicator('name')}
              </th>
              <th className="py-2 pr-4">Occupation</th>
              <th className="py-2 pr-4">Risk</th>
              <th className="py-2 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('totalAssets')}>
                Assets{sortIndicator('totalAssets')}
              </th>
              <th className="py-2 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('nextReview')}>
                Next Review{sortIndicator('nextReview')}
              </th>
              <th className="py-2 pr-4 cursor-pointer hover:text-ink" onClick={() => handleSort('lastContacted')}>
                Last Contacted{sortIndicator('lastContacted')}
              </th>
              <th className="py-2">Flags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="border-b border-border-faint cursor-pointer transition-colors hover:bg-surface-inset"
              >
                <td className="py-2 pr-4 font-medium text-ink whitespace-nowrap">{client.name}</td>
                <td className="py-2 pr-4 text-ink-muted max-w-[200px] truncate">{client.occupation}</td>
                <td className="py-2 pr-4 text-ink-muted whitespace-nowrap">{client.riskProfile}</td>
                <td className="py-2 pr-4 text-ink whitespace-nowrap">{formatCurrency(client.totalAssets)}</td>
                <td className="py-2 pr-4 text-ink-muted whitespace-nowrap">
                  {new Date(client.nextReview + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="py-2 pr-4 text-ink-muted whitespace-nowrap">
                  {lastContactedMap[client.id]
                    ? new Date(lastContactedMap[client.id] + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '\u2014'}
                </td>
                <td className="py-2">
                  <div className="flex gap-1 overflow-hidden">
                    {client.flags?.map((flag) => (
                      <span
                        key={flag.id}
                        title={flag.detail || flag.label}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${
                          flag.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          flag.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {flag.label}
                      </span>
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
        <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} showToast={showToast} />
      )}
    </div>
  );
}

function parseAllocation(allocation: string): { equities: number; fixed: number; alternatives: number; cash: number } {
  const eq = allocation.match(/(\d+)%\s*Equit/i);
  const fi = allocation.match(/(\d+)%\s*Fixed/i);
  const alt = allocation.match(/(\d+)%\s*Alt/i);
  const ca = allocation.match(/(\d+)%\s*Cash/i);
  const single = allocation.match(/(\d+)%\s*Single\s*Stock/i);
  const google = allocation.match(/(\d+)%\s*Google\s*Stock/i);
  return {
    equities: (eq ? parseInt(eq[1]) : 0) + (single ? parseInt(single[1]) : 0) + (google ? parseInt(google[1]) : 0),
    fixed: fi ? parseInt(fi[1]) : 0,
    alternatives: alt ? parseInt(alt[1]) : 0,
    cash: ca ? parseInt(ca[1]) : 0,
  };
}

function isParseable(allocation: string): boolean {
  const alloc = parseAllocation(allocation);
  return (alloc.equities + alloc.fixed + alloc.alternatives + alloc.cash) > 0;
}

function aggregateAllocation(client: Client): { equities: number; fixed: number; alternatives: number; cash: number } {
  // Only include accounts whose allocation string is parseable into percentages
  const parseable = client.accounts.filter(a => isParseable(a.allocation));
  const totalValue = parseable.reduce((s, a) => s + a.value, 0);
  if (totalValue === 0) return { equities: 0, fixed: 0, alternatives: 0, cash: 0 };
  let eq = 0, fi = 0, alt = 0, ca = 0;
  for (const acct of parseable) {
    const alloc = parseAllocation(acct.allocation);
    const weight = acct.value / totalValue;
    eq += alloc.equities * weight;
    fi += alloc.fixed * weight;
    alt += alloc.alternatives * weight;
    ca += alloc.cash * weight;
  }
  // Round with largest-remainder method so total always equals 100
  const raw = [eq, fi, alt, ca];
  const floored = raw.map(Math.floor);
  let remainder = 100 - floored.reduce((a, b) => a + b, 0);
  const fracs = raw.map((v, i) => ({ i, frac: v - floored[i] })).sort((a, b) => b.frac - a.frac);
  for (let j = 0; j < remainder; j++) floored[fracs[j].i]++;
  return { equities: floored[0], fixed: floored[1], alternatives: floored[2], cash: floored[3] };
}

type ModalTab = 'overview' | 'portfolio' | 'activity' | 'documents';

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

function ClientDetailModal({ client, onClose, showToast }: { client: Client; onClose: () => void; showToast: (msg: string) => void }) {
  const [tab, setTab] = useState<ModalTab>('overview');
  const [noteText, setNoteText] = useState(client.notes || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showEmailCompose, setShowEmailCompose] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [checkedGoals, setCheckedGoals] = useState<Set<number>>(new Set());
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callState, setCallState] = useState<'dialing' | 'connected' | 'ended'>('dialing');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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
    showToast('Note saved');
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleConfirmMeeting = () => {
    setScheduleStep('confirmed');
    showToast('Meeting scheduled — invite sent');
  };

  const handleSendEmail = () => {
    if (!emailBody.trim() || isSendingEmail) return;
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setShowEmailCompose(false);
      setEmailBody('');
      showToast(`Email sent to ${client.name}`);
    }, 800);
  };

  const handleCall = () => {
    setShowCallDialog(true);
    setCallState('dialing');
    setTimeout(() => setCallState('connected'), 2000);
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setShowCallDialog(false);
      showToast('Call ended — 0:42');
    }, 800);
  };

  const toggleGoal = (i: number) => {
    setCheckedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
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
    { key: 'documents', label: 'Documents' },
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
            <button
              onClick={() => { setShowEmailCompose(true); setEmailBody(''); }}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Email
            </button>
            <button
              onClick={handleCall}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
            >
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

          {/* Flags */}
          {client.flags && client.flags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {client.flags.map((flag) => (
                <div
                  key={flag.id}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ${
                    flag.severity === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                    flag.severity === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    {flag.severity === 'critical' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    ) : flag.severity === 'warning' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    )}
                  </svg>
                  <span className="font-medium">{flag.label}</span>
                  {flag.detail && <span className="text-[10px] opacity-75">— {flag.detail}</span>}
                </div>
              ))}
            </div>
          )}

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

              {/* Holdings table */}
              {clientHoldings[client.id] && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Holdings</h3>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-surface-inset/50 text-left text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                          <th className="py-2 pl-3 pr-2">Ticker</th>
                          <th className="py-2 pr-2">Name</th>
                          <th className="py-2 pr-2 text-right">Shares</th>
                          <th className="py-2 pr-2 text-right">Price</th>
                          <th className="py-2 pr-2 text-right">Value</th>
                          <th className="py-2 pr-2 text-right">Gain/Loss</th>
                          <th className="py-2 pr-3">Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientHoldings[client.id].map((h, i) => (
                          <tr key={i} className="border-b border-border-faint last:border-0">
                            <td className="py-2 pl-3 pr-2 font-medium text-ink">{h.ticker}</td>
                            <td className="py-2 pr-2 text-ink-muted max-w-[160px] truncate">{h.name}</td>
                            <td className="py-2 pr-2 text-right text-ink-muted">{h.shares.toLocaleString()}</td>
                            <td className="py-2 pr-2 text-right text-ink-muted">${h.price.toFixed(2)}</td>
                            <td className="py-2 pr-2 text-right text-ink font-medium">${h.value.toLocaleString()}</td>
                            <td className={`py-2 pr-2 text-right ${h.gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {h.gain >= 0 ? '+' : ''}{h.gainPct.toFixed(1)}%
                            </td>
                            <td className="py-2 pr-3 text-[11px] text-ink-faint">{h.accountType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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

          {tab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint">Documents</h3>
              {clientDocuments[client.id] ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-inset/50 text-left text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                        <th className="py-2 pl-3 pr-2">Name</th>
                        <th className="py-2 pr-2">Type</th>
                        <th className="py-2 pr-2">Uploaded</th>
                        <th className="py-2 pr-3 text-right">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientDocuments[client.id].map((doc) => (
                        <tr key={doc.id} onClick={() => showToast(`Opening ${doc.name}...`)} className="border-b border-border-faint last:border-0 hover:bg-surface-inset/30 cursor-pointer transition-colors">
                          <td className="py-2.5 pl-3 pr-2">
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4 shrink-0 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                              <span className="font-medium text-ink">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              doc.type === 'tax-return' ? 'bg-blue-100 text-blue-700' :
                              doc.type === 'estate-plan' ? 'bg-purple-100 text-purple-700' :
                              doc.type === 'insurance' ? 'bg-green-100 text-green-700' :
                              doc.type === 'statement' ? 'bg-amber-100 text-amber-700' :
                              doc.type === 'agreement' ? 'bg-ink/10 text-ink-muted' :
                              doc.type === 'form' ? 'bg-cyan-100 text-cyan-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {doc.type.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 pr-2 text-ink-muted">
                            {new Date(doc.uploadedAt + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-2.5 pr-3 text-right text-ink-faint">{doc.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-border-faint px-8 py-12 text-center">
                  <p className="text-sm text-ink-faint">No documents on file for this client.</p>
                </div>
              )}
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
                  <button
                    onClick={() => { setScheduleStep('picking'); setTab('overview'); }}
                    className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              </div>

              {/* Goals progress */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Goals</h3>
                <div className="space-y-2">
                  {client.goals.map((goal, i) => (
                    <div
                      key={i}
                      onClick={() => toggleGoal(i)}
                      className="flex items-start gap-3 rounded-lg border border-border-faint p-3 cursor-pointer hover:bg-surface-inset/50 transition-colors"
                    >
                      <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                        checkedGoals.has(i) ? 'bg-ink border-ink' : 'border-border'
                      }`}>
                        {checkedGoals.has(i) && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${checkedGoals.has(i) ? 'text-ink-faint line-through' : 'text-ink-muted'}`}>{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Email Compose Overlay */}
        {showEmailCompose && (
          <div className="absolute inset-0 z-20 flex flex-col bg-surface-raised">
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-ink">New Email</h3>
                <p className="text-xs text-ink-muted">To {client.name}</p>
              </div>
              <button
                onClick={() => { setShowEmailCompose(false); setEmailBody(''); }}
                className="text-ink-muted hover:text-ink transition-colors p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <input
                type="text"
                defaultValue={`Check-in — ${client.name}`}
                className="w-full mb-3 border-b border-border-faint pb-2 text-sm font-medium text-ink focus:outline-none focus:border-ink"
              />
              <textarea
                autoFocus
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                placeholder="Write your email..."
                className="w-full border-0 bg-transparent text-sm leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none resize-none"
              />
            </div>
            <div className="shrink-0 flex items-center gap-2 border-t border-border px-6 py-4">
              <button
                onClick={handleSendEmail}
                disabled={!emailBody.trim() || isSendingEmail}
                className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {isSendingEmail ? 'Sending...' : 'Send Email'}
              </button>
              <button
                onClick={() => { setShowEmailCompose(false); setEmailBody(''); }}
                className="rounded-full border border-border px-4 py-1.5 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
                      onClick={() => {
                        showToast('Added to calendar');
                        setScheduleStep('closed'); setSelectedSlot(null); setMeetingNotes('');
                      }}
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
        {/* Call Dialog */}
        {showCallDialog && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink/50">
            <div className="rounded-2xl border border-border bg-surface-raised p-8 text-center shadow-xl w-72 animate-fade-in">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${
                callState === 'dialing' ? 'bg-ink/10 animate-pulse' :
                callState === 'connected' ? 'bg-emerald-100' :
                'bg-red-100'
              }`}>
                <svg className={`h-7 w-7 ${
                  callState === 'connected' ? 'text-emerald-600' : callState === 'ended' ? 'text-red-500' : 'text-ink'
                }`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-ink">{client.name}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {callState === 'dialing' ? 'Dialing...' : callState === 'connected' ? 'Connected' : 'Call ended'}
              </p>
              {callState === 'dialing' && (
                <p className="mt-1 text-xs text-ink-faint">Ringing</p>
              )}
              {callState === 'connected' && (
                <p className="mt-1 text-xs text-emerald-600 font-medium">0:00</p>
              )}
              <div className="mt-6 flex justify-center gap-3">
                {callState !== 'ended' && (
                  <button
                    onClick={handleEndCall}
                    className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.055.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                    </svg>
                    End Call
                  </button>
                )}
                {callState === 'dialing' && (
                  <button
                    onClick={() => { setShowCallDialog(false); showToast('Call cancelled'); }}
                    className="rounded-full border border-border px-4 py-2 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
