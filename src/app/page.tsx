import Link from 'next/link';
import { meetings } from '../data/meetings';
import { emails } from '../data/emails';
import { tasks } from '../data/tasks';
import { clients } from '../data/clients';
import { outreachSuggestions } from '../data/outreach';
import ScheduleTable from '../components/dashboard/ScheduleTable';

function MeetingTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    'quarterly-review': 'Quarterly Review',
    'portfolio-review': 'Portfolio Review',
    'planning': 'Planning',
    'check-in': 'Check-in',
    'onboarding': 'Onboarding',
  };
  return (
    <span className="rounded-full bg-surface-inset px-2 py-0.5 text-[10px] font-medium text-ink-muted">
      {labels[type] || type}
    </span>
  );
}

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

  const nextUpcoming = todayMeetings.find((m) => m.status === 'upcoming');
  const liveMeeting = todayMeetings.find((m) => m.status === 'in-progress');

  const stats = [
    { value: String(todayMeetings.length), label: 'Meetings today', sub: 'Click below to prep', href: '#meetings', accent: 'border-l-accent-blue' },
    { value: String(unreadEmails.length), label: 'Emails to review', sub: `${draftsReady} AI drafts ready`, href: '/follow-up', accent: 'border-l-accent-purple' },
    { value: String(pendingOutreach.length), label: 'Outreach suggested', sub: `${urgentOutreach} urgent`, href: '/outreach', accent: 'border-l-accent-amber' },
    { value: String(openTasks.length), label: 'Open tasks', sub: `${overdueTasks.length} overdue`, href: '#schedule', accent: 'border-l-accent-green' },
    { value: aumFormatted, label: 'Total AUM', sub: `${clients.length} households`, href: '/clients', accent: 'border-l-accent-blue' },
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
          <span className="ml-1 font-semibold text-accent-red">{overdueTasks.length} tasks overdue.</span>
        )}
      </p>

      {/* Stats cards */}
      <div className="mt-8 grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group rounded-lg border border-border border-l-[3px] px-4 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-ink/20 ${stat.accent}`}
          >
            <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">{stat.label}</p>
            <p className="mt-1 text-[11px] text-ink-faint group-hover:text-ink-muted transition-colors">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Meetings section */}
      <div className="mt-12" id="meetings">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Today&apos;s Meetings</h2>
            <p className="mt-1 text-sm text-ink-faint">{todayMeetings.length} meetings scheduled &mdash; click to prep or review</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {todayMeetings.map((meeting) => {
            const isLive = meeting.status === 'in-progress';
            const isCompleted = meeting.status === 'completed';
            const href = isCompleted ? `/meetings/${meeting.id}` : `/prep/${meeting.id}`;
            const actionLabel = isCompleted ? 'Review' : isLive ? 'View Live' : 'Prep';

            return (
              <Link
                key={meeting.id}
                href={href}
                className={`group relative rounded-lg border bg-surface-raised px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  isLive ? 'border-accent-green shadow-sm' : 'border-border hover:border-ink/20'
                }`}
              >
                {/* Live indicator */}
                {isLive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-[10px] font-semibold text-accent-green uppercase tracking-wider">Live</span>
                  </div>
                )}

                {/* Time */}
                <p className="text-sm font-semibold text-ink">{meeting.time}</p>

                {/* Client name */}
                <p className="mt-1.5 text-base font-bold text-ink leading-tight">{meeting.clientName}</p>

                {/* Type badge */}
                <div className="mt-2">
                  <MeetingTypeBadge type={meeting.type} />
                </div>

                {/* Duration */}
                <p className="mt-2 text-[11px] text-ink-faint">{meeting.duration} min</p>

                {/* Action button */}
                <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isLive
                    ? 'bg-accent-green-light text-accent-green'
                    : isCompleted
                    ? 'bg-surface-inset text-ink-muted group-hover:text-ink'
                    : 'bg-accent-blue-light text-accent-blue'
                }`}>
                  {actionLabel}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-ink">Quick Actions</h2>
        <p className="mt-1 text-sm text-ink-faint">Jump to what matters most right now</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {nextUpcoming ? (
            <Link
              href={`/prep/${nextUpcoming.id}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-surface-raised px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-ink/20"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue-light">
                <svg className="h-5 w-5 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Prep for next meeting</p>
                <p className="mt-0.5 text-xs text-ink-faint truncate">{nextUpcoming.clientName} at {nextUpcoming.time}</p>
              </div>
            </Link>
          ) : liveMeeting ? (
            <Link
              href={`/prep/${liveMeeting.id}`}
              className="group flex items-center gap-4 rounded-lg border border-accent-green bg-surface-raised px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-green-light">
                <svg className="h-5 w-5 text-accent-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Join live meeting</p>
                <p className="mt-0.5 text-xs text-ink-faint truncate">{liveMeeting.clientName}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 rounded-lg border border-border-faint bg-surface-inset/30 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-inset">
                <svg className="h-5 w-5 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-faint">All meetings prepped</p>
                <p className="mt-0.5 text-xs text-ink-faint">No upcoming meetings to prepare for</p>
              </div>
            </div>
          )}

          <Link
            href="/follow-up"
            className="group flex items-center gap-4 rounded-lg border border-border bg-surface-raised px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-ink/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple-light">
              <svg className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Review drafts</p>
              <p className="mt-0.5 text-xs text-ink-faint">{draftsReady} AI drafts ready to review</p>
            </div>
          </Link>

          <Link
            href="/outreach"
            className="group flex items-center gap-4 rounded-lg border border-border bg-surface-raised px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-ink/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-amber-light">
              <svg className="h-5 w-5 text-accent-amber" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Check outreach</p>
              <p className="mt-0.5 text-xs text-ink-faint">{urgentOutreach} urgent suggestions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Emails & Outreach table */}
      <div className="mt-10" id="schedule">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Emails &amp; Outreach</h2>
            <p className="mt-1 text-sm text-ink-faint">Recent emails and priority outreach suggestions</p>
          </div>
          <Link href="/follow-up" className="text-xs font-medium text-accent-blue hover:text-ink transition-colors">
            View all emails &rarr;
          </Link>
        </div>
        <div className="mt-4">
          <ScheduleTable />
        </div>
      </div>
    </div>
  );
}
