import Link from 'next/link';
import { meetings } from '../data/meetings';
import { emails } from '../data/emails';
import { tasks } from '../data/tasks';
import { clients } from '../data/clients';
import { outreachSuggestions } from '../data/outreach';
import ScheduleTable from '../components/dashboard/ScheduleTable';

export default function Home() {
  const todayMeetings = meetings.filter((m) => m.date === '2026-03-02');
  const unreadEmails = emails.filter((e) => !e.isRead);
  const openTasks = tasks.filter((t) => t.status !== 'completed');
  const draftsReady = emails.filter((e) => e.draftReply && e.draftReply.status !== 'sent').length;

  const totalAum = clients.reduce((sum, c) => sum + c.totalAssets, 0);
  const aumFormatted = `$${(totalAum / 1_000_000).toFixed(1)}M`;

  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const due = new Date(t.dueDate);
    const today = new Date('2026-03-02');
    return due < today;
  });

  const pendingOutreach = outreachSuggestions.filter((o) => o.status === 'pending');
  const urgentOutreach = pendingOutreach.filter((o) => o.priority === 'urgent').length;

  const stats = [
    { value: String(todayMeetings.length), label: 'Meetings today', sub: 'Click below to prep', href: '#schedule', accent: 'border-l-accent-blue bg-accent-blue-light' },
    { value: String(unreadEmails.length), label: 'Emails to review', sub: `${draftsReady} AI drafts ready`, href: '/follow-up', accent: 'border-l-accent-purple bg-accent-purple-light' },
    { value: String(pendingOutreach.length), label: 'Outreach suggested', sub: `${urgentOutreach} urgent`, href: '/outreach', accent: 'border-l-orange-500 bg-orange-50' },
    { value: String(openTasks.length), label: 'Open tasks', sub: `${overdueTasks.length} overdue`, href: '#schedule', accent: 'border-l-accent-amber bg-accent-amber-light' },
    { value: aumFormatted, label: 'Total AUM', sub: `${clients.length} households`, href: '/clients', accent: 'border-l-accent-green bg-accent-green-light' },
  ];

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <p className="text-sm text-ink-faint">Monday, March 2, 2026</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
        Good morning, Sarah
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Here&apos;s what needs your attention today.
        {overdueTasks.length > 0 && (
          <span className="ml-1 font-semibold text-accent-amber">{overdueTasks.length} tasks overdue.</span>
        )}
      </p>

      {/* Stats cards */}
      <div className="mt-8 grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group rounded-lg border border-border border-l-[3px] px-4 py-4 shadow-sm transition-all hover:shadow-md hover:border-ink/20 ${stat.accent}`}
          >
            <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">{stat.label}</p>
            <p className="mt-1 text-[11px] text-ink-faint group-hover:text-ink-muted transition-colors">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Schedule */}
      <div className="mt-12" id="schedule">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Today&apos;s schedule</h2>
            <p className="mt-1 text-sm text-ink-faint">Click any row to prep for a meeting or review an email</p>
          </div>
          <Link href="/follow-up" className="text-xs font-medium text-accent-blue hover:text-ink transition-colors">
            View all emails &rarr;
          </Link>
        </div>
        <div className="mt-6">
          <ScheduleTable />
        </div>
      </div>
    </div>
  );
}
