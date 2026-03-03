'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Meeting, PrepDoc } from '../../../lib/types';
import PrepTab from '../../../components/prep/PrepTab';
import AgendaTab from '../../../components/prep/AgendaTab';

type TabKey = 'prep' | 'agenda';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'prep', label: 'Meeting Prep' },
  { key: 'agenda', label: 'Agenda' },
];

const typeLabel: Record<Meeting['type'], string> = {
  'quarterly-review': 'Quarterly Review',
  'portfolio-review': 'Portfolio Review',
  planning: 'Planning',
  'check-in': 'Check-In',
  onboarding: 'Onboarding',
};

interface PrepPageClientProps {
  meeting: Meeting;
  prepDoc: PrepDoc;
}

export default function PrepPageClient({ meeting, prepDoc }: PrepPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('prep');

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
        <span className="font-medium text-ink">Meeting Prep</span>
      </nav>

      {/* Meeting Header */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
          <span className="text-sm text-ink-muted">{typeLabel[meeting.type]}</span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{meeting.clientName} &middot; AI-generated prep based on client history</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
          <span>
            {new Date(meeting.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
          </span>
          <span>{meeting.time}</span>
          <span>{meeting.duration} min</span>
          <span>{meeting.attendees.join(', ')}</span>
        </div>

        {meeting.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {meeting.tags.map((tag) => (
              <span key={tag} className="text-xs text-ink-muted">
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
        {activeTab === 'prep' && <PrepTab prepDoc={prepDoc} />}
        {activeTab === 'agenda' && <AgendaTab items={prepDoc.suggestedAgenda} />}
      </div>
    </div>
  );
}
