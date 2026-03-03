'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Meeting, Transcript, Task } from '../../../lib/types';
import { formatTime } from '../../../lib/utils';
import SummaryTab from '../../../components/meetings/SummaryTab';
import TranscriptTab from '../../../components/meetings/TranscriptTab';
import AgendaTab from '../../../components/meetings/AgendaTab';
import TasksTab from '../../../components/meetings/TasksTab';

const statusLabel: Record<Meeting['status'], string> = {
  upcoming: 'Upcoming',
  'in-progress': 'Live',
  completed: 'Completed',
};

type TabKey = 'summary' | 'transcript' | 'agenda' | 'tasks';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'transcript', label: 'Transcript' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'tasks', label: 'Tasks' },
];

interface MeetingDetailClientProps {
  meeting: Meeting;
  transcript?: Transcript;
  meetingTasks: Task[];
}

export default function MeetingDetailClient({
  meeting,
  transcript,
  meetingTasks,
}: MeetingDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  return (
    <div className="px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm">
        <Link href="/" className="text-ink-faint hover:text-ink transition-colors">
          Dashboard
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink-muted">{meeting.clientName}</span>
        <span className="text-ink-faint">/</span>
        <span className="font-medium text-ink">{meeting.title}</span>
      </nav>

      {/* Meeting Header */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
          <span className="text-sm text-ink-muted">{statusLabel[meeting.status]}</span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{meeting.clientName}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
          <span>
            {new Date(meeting.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
          </span>
          <span>{meeting.time}</span>
          <span>{formatTime(meeting.duration)}</span>
          <span>{meeting.attendees.join(', ')}</span>
        </div>

        {meeting.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {meeting.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex gap-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-ink font-medium text-ink'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'summary' && (
          <>
            {meeting.summary ? (
              <SummaryTab summary={meeting.summary} />
            ) : (
              <Placeholder
                title="No summary available"
                description="A summary will be generated after the meeting is completed."
              />
            )}
          </>
        )}

        {activeTab === 'transcript' && (
          <>
            {transcript ? (
              <TranscriptTab transcript={transcript} />
            ) : (
              <Placeholder
                title="No transcript available"
                description="A transcript will be available after the meeting recording is processed."
              />
            )}
          </>
        )}

        {activeTab === 'agenda' && (
          <AgendaTab items={meeting.agendaItems ?? []} />
        )}

        {activeTab === 'tasks' && <TasksTab tasks={meetingTasks} />}
      </div>
    </div>
  );
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-16">
      <h3 className="text-sm font-medium text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>
    </div>
  );
}
