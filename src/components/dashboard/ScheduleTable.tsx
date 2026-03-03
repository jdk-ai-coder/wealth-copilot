'use client';

import { useRouter } from 'next/navigation';
import { meetings } from '../../data/meetings';
import { emails } from '../../data/emails';

type ScheduleRow = {
  id: string;
  time: string;
  sortMinutes: number;
  type: 'Meeting' | 'Email';
  title: string;
  client: string;
  status: string;
  live: boolean;
  href: string;
  action: string;
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

  return (
    <div className="border-t border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-ink-faint">
            <th className="py-3 pr-6">Time</th>
            <th className="py-3 pr-6">Type</th>
            <th className="py-3 pr-6">Title</th>
            <th className="py-3 pr-6">Client</th>
            <th className="py-3 pr-6">Status</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => router.push(row.href)}
              className="group border-b border-border-faint cursor-pointer transition-colors hover:bg-surface-inset"
            >
              <td className="whitespace-nowrap py-3 pr-6 font-medium text-ink">{row.time}</td>
              <td className="py-3 pr-6 text-ink-muted">{row.type}</td>
              <td className="max-w-xs truncate py-3 pr-6 text-ink">{row.title}</td>
              <td className="py-3 pr-6 text-ink-muted">{row.client}</td>
              <td className="py-3 pr-6">
                <span className="flex items-center gap-1.5 text-ink-muted">
                  {row.live && (
                    <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse-dot" />
                  )}
                  {row.status}
                </span>
              </td>
              <td className="py-3 text-right">
                <span className="text-xs text-ink-faint group-hover:text-ink transition-colors">
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
