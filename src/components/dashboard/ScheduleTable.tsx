'use client';

import { useRouter } from 'next/navigation';
import { meetings } from '../../data/meetings';
import { emails } from '../../data/emails';
import { outreachSuggestions } from '../../data/outreach';

type ScheduleRow = {
  id: string;
  time: string;
  sortMinutes: number;
  type: 'Meeting' | 'Email' | 'Outreach';
  title: string;
  client: string;
  status: string;
  live: boolean;
  href: string;
  action: string;
  priority?: string;
};

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatIsoTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function statusText(status: string): string {
  switch (status) {
    case 'completed': return 'Completed';
    case 'upcoming': return 'Upcoming';
    case 'in-progress': return 'Live';
    default: return status;
  }
}

export default function ScheduleTable() {
  const router = useRouter();
  const todayMeetings = meetings.filter((m) => m.date === '2026-03-02');
  const recentEmails = emails.filter((e) => {
    const received = new Date(e.receivedAt);
    const cutoff = new Date('2026-03-01T00:00:00Z');
    return received >= cutoff;
  });

  const urgentHighOutreach = outreachSuggestions.filter(
    (o) => o.status === 'pending' && (o.priority === 'urgent' || o.priority === 'high')
  );

  const rows: ScheduleRow[] = [
    ...todayMeetings.map((m) => ({
      id: `meeting-${m.id}`,
      time: m.time,
      sortMinutes: parseTimeToMinutes(m.time),
      type: 'Meeting' as const,
      title: m.title,
      client: m.clientName,
      status: statusText(m.status),
      live: m.status === 'in-progress',
      href: m.status === 'completed' ? `/meetings/${m.id}` : `/prep/${m.id}`,
      action: m.status === 'completed' ? 'Review notes' : m.status === 'in-progress' ? 'View live' : 'Prep now',
    })),
    ...recentEmails.map((e) => ({
      id: `email-${e.id}`,
      time: formatIsoTime(e.receivedAt),
      sortMinutes: new Date(e.receivedAt).getUTCHours() * 60 + new Date(e.receivedAt).getUTCMinutes(),
      type: 'Email' as const,
      title: e.subject,
      client: e.clientName,
      status: e.isRead ? 'Read' : 'Unread',
      live: false,
      href: '/follow-up',
      action: e.draftReply ? 'Review draft' : 'Open',
    })),
  ].sort((a, b) => a.sortMinutes - b.sortMinutes);

  const outreachRows: ScheduleRow[] = urgentHighOutreach.map((o) => ({
    id: `outreach-${o.id}`,
    time: '—',
    sortMinutes: o.priority === 'urgent' ? -2 : -1,
    type: 'Outreach' as const,
    title: o.trigger.length > 80 ? o.trigger.slice(0, 80) + '…' : o.trigger,
    client: o.clientName,
    status: o.priority.charAt(0).toUpperCase() + o.priority.slice(1),
    live: false,
    href: `/outreach#outreach-${o.id}`,
    action: 'View',
    priority: o.priority,
  }));

  function statusBadge(status: string, live: boolean, priority?: string) {
    if (live) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green-light px-2.5 py-0.5 text-[11px] font-medium text-accent-green">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse-dot" />
          Live
        </span>
      );
    }
    if (priority === 'urgent') {
      return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">Urgent</span>;
    }
    if (priority === 'high') {
      return <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">High</span>;
    }
    switch (status) {
      case 'Unread':
        return <span className="rounded-full bg-accent-blue-light px-2.5 py-0.5 text-[11px] font-medium text-accent-blue">Unread</span>;
      case 'Upcoming':
        return <span className="rounded-full bg-accent-amber-light px-2.5 py-0.5 text-[11px] font-medium text-accent-amber">Upcoming</span>;
      case 'Completed':
        return <span className="rounded-full bg-surface-inset px-2.5 py-0.5 text-[11px] font-medium text-ink-faint">Completed</span>;
      default:
        return <span className="text-[11px] text-ink-faint">{status}</span>;
    }
  }

  function typeColor(type: string): string {
    switch (type) {
      case 'Meeting': return 'text-accent-blue';
      case 'Email': return 'text-accent-purple';
      case 'Outreach': return 'text-orange-600';
      default: return 'text-ink-muted';
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface-raised shadow-sm overflow-hidden">
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
                <td colSpan={6} className="bg-orange-50/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-orange-700 border-b border-orange-200/50">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Suggested Outreach
                  </div>
                </td>
              </tr>
              {outreachRows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(row.href)}
                  className={`group cursor-pointer border-b border-border-faint transition-colors hover:bg-orange-50/50 ${
                    i % 2 === 1 ? 'bg-surface-inset/20' : ''
                  }`}
                >
                  <td className="whitespace-nowrap py-3 pl-4 pr-6 text-ink-faint">{row.time}</td>
                  <td className="py-3 pr-6">
                    <span className={`text-xs font-medium ${typeColor(row.type)}`}>{row.type}</span>
                  </td>
                  <td className="max-w-xs truncate py-3 pr-6 font-medium text-ink">{row.title}</td>
                  <td className="py-3 pr-6 text-ink-muted">{row.client}</td>
                  <td className="py-3 pr-6">
                    {statusBadge(row.status, row.live, row.priority)}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="text-xs font-medium text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      {row.action} &rarr;
                    </span>
                  </td>
                </tr>
              ))}
              {/* Divider between outreach and timed items */}
              <tr>
                <td colSpan={6} className="bg-surface-inset/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint border-b border-border">
                  Today&apos;s Schedule
                </td>
              </tr>
            </>
          )}
          {rows.map((row, i) => (
            <tr
              key={row.id}
              onClick={() => router.push(row.href)}
              className={`group cursor-pointer border-b border-border-faint transition-colors hover:bg-accent-blue-light/50 ${
                i % 2 === 1 ? 'bg-surface-inset/30' : ''
              }`}
            >
              <td className="whitespace-nowrap py-3 pl-4 pr-6 font-semibold text-ink">{row.time}</td>
              <td className="py-3 pr-6">
                <span className={`text-xs font-medium ${typeColor(row.type)}`}>{row.type}</span>
              </td>
              <td className="max-w-xs truncate py-3 pr-6 font-medium text-ink">{row.title}</td>
              <td className="py-3 pr-6 text-ink-muted">{row.client}</td>
              <td className="py-3 pr-6">
                {statusBadge(row.status, row.live)}
              </td>
              <td className="py-3 pr-4 text-right">
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
