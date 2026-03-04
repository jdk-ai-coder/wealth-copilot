'use client';

import { useRouter } from 'next/navigation';
import { emails } from '../../data/emails';
import { outreachSuggestions } from '../../data/outreach';

type ScheduleRow = {
  id: string;
  time: string;
  sortMinutes: number;
  type: 'Email' | 'Outreach';
  title: string;
  client: string;
  status: string;
  href: string;
  action: string;
  priority?: string;
};

function formatIsoTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function ScheduleTable() {
  const router = useRouter();
  const recentEmails = emails.filter((e) => {
    const received = new Date(e.receivedAt);
    const cutoff = new Date('2026-03-01T00:00:00Z');
    return received >= cutoff;
  });

  const urgentHighOutreach = outreachSuggestions.filter(
    (o) => o.status === 'pending' && (o.priority === 'urgent' || o.priority === 'high')
  );

  const emailRows: ScheduleRow[] = recentEmails.map((e) => ({
    id: `email-${e.id}`,
    time: formatIsoTime(e.receivedAt),
    sortMinutes: new Date(e.receivedAt).getUTCHours() * 60 + new Date(e.receivedAt).getUTCMinutes(),
    type: 'Email' as const,
    title: e.subject,
    client: e.clientName,
    status: e.isRead ? 'Read' : 'Unread',
    href: '/follow-up',
    action: e.draftReply ? 'Review draft' : 'Open',
  })).sort((a, b) => a.sortMinutes - b.sortMinutes);

  const outreachRows: ScheduleRow[] = urgentHighOutreach.map((o) => ({
    id: `outreach-${o.id}`,
    time: '\u2014',
    sortMinutes: o.priority === 'urgent' ? -2 : -1,
    type: 'Outreach' as const,
    title: o.trigger.length > 80 ? o.trigger.slice(0, 80) + '\u2026' : o.trigger,
    client: o.clientName,
    status: o.priority.charAt(0).toUpperCase() + o.priority.slice(1),
    href: `/outreach#outreach-${o.id}`,
    action: 'View',
    priority: o.priority,
  }));

  function statusBadge(status: string, priority?: string) {
    if (priority === 'urgent') {
      return <span className="rounded-full bg-accent-red-light px-2.5 py-0.5 text-[11px] font-semibold text-accent-red">Urgent</span>;
    }
    if (priority === 'high') {
      return <span className="rounded-full bg-accent-amber-light px-2.5 py-0.5 text-[11px] font-semibold text-accent-amber">High</span>;
    }
    switch (status) {
      case 'Unread':
        return <span className="rounded-full bg-accent-blue-light px-2.5 py-0.5 text-[11px] font-medium text-accent-blue">Unread</span>;
      default:
        return <span className="text-[11px] text-ink-faint">{status}</span>;
    }
  }

  function typePill(type: string) {
    switch (type) {
      case 'Email':
        return <span className="inline-block rounded-full bg-accent-purple-light px-2.5 py-0.5 text-[11px] font-medium text-accent-purple">Email</span>;
      case 'Outreach':
        return <span className="inline-block rounded-full bg-accent-amber-light px-2.5 py-0.5 text-[11px] font-medium text-accent-amber">Outreach</span>;
      default:
        return <span className="text-[11px] text-ink-muted">{type}</span>;
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface-raised overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            <th className="py-2.5 pl-4 pr-6">Time</th>
            <th className="py-2.5 pr-6">Type</th>
            <th className="py-2.5 pr-6">Title</th>
            <th className="py-2.5 pr-6">Client</th>
            <th className="py-2.5 pr-6">Status</th>
            <th className="py-2.5 pr-4"></th>
          </tr>
        </thead>
        <tbody>
          {/* Suggested Outreach section */}
          {outreachRows.length > 0 && (
            <>
              <tr>
                <td colSpan={6} className="bg-surface-inset/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3 w-3 text-accent-amber" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Suggested Outreach
                  </div>
                </td>
              </tr>
              {outreachRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(row.href)}
                  className="group cursor-pointer border-b border-border-faint transition-colors hover:bg-surface-inset/40"
                >
                  <td className="whitespace-nowrap py-2.5 pl-4 pr-6 text-ink-faint">{row.time}</td>
                  <td className="py-2.5 pr-6">{typePill(row.type)}</td>
                  <td className="max-w-xs truncate py-2.5 pr-6 font-medium text-ink">{row.title}</td>
                  <td className="py-2.5 pr-6 text-ink-muted whitespace-nowrap">{row.client}</td>
                  <td className="py-2.5 pr-6">{statusBadge(row.status, row.priority)}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className="text-xs font-medium text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      {row.action} &rarr;
                    </span>
                  </td>
                </tr>
              ))}
            </>
          )}
          {/* Email section header */}
          {outreachRows.length > 0 && emailRows.length > 0 && (
            <tr>
              <td colSpan={6} className="bg-surface-inset/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted border-b border-border">
                Emails &amp; Follow-ups
              </td>
            </tr>
          )}
          {emailRows.map((row) => (
            <tr
              key={row.id}
              onClick={() => router.push(row.href)}
              className="group cursor-pointer border-b border-border-faint last:border-0 transition-colors hover:bg-surface-inset/40"
            >
              <td className="whitespace-nowrap py-2.5 pl-4 pr-6 font-semibold text-ink">{row.time}</td>
              <td className="py-2.5 pr-6">{typePill(row.type)}</td>
              <td className="max-w-xs truncate py-2.5 pr-6 font-medium text-ink">{row.title}</td>
              <td className="py-2.5 pr-6 text-ink-muted whitespace-nowrap">{row.client}</td>
              <td className="py-2.5 pr-6">{statusBadge(row.status)}</td>
              <td className="py-2.5 pr-4 text-right">
                <span className="text-xs font-medium text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                  {row.action} &rarr;
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
