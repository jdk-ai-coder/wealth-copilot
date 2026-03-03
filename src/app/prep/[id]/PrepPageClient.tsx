'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Meeting, PrepDoc, PrepChecklistItem } from '../../../lib/types';
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
  const [checklist, setChecklist] = useState<PrepChecklistItem[]>(meeting.prepChecklist ?? []);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  };

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
          {meeting.meetingLink && (
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Join Meeting
            </a>
          )}
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

        {/* Last meeting notes & prep checklist */}
        {(meeting.lastMeetingNotes || checklist.length > 0) && (
          <div className="mt-6 grid grid-cols-2 gap-6">
            {meeting.lastMeetingNotes && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-2">Last Meeting Notes</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{meeting.lastMeetingNotes}</p>
              </div>
            )}
            {checklist.length > 0 && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-2">
                  Prep Checklist
                  <span className="ml-2 text-ink-faint font-normal normal-case">
                    {checklist.filter((i) => i.checked).length}/{checklist.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                        item.checked ? 'bg-ink border-ink' : 'border-border group-hover:border-ink/40'
                      }`}>
                        {item.checked && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${item.checked ? 'text-ink-faint line-through' : 'text-ink-muted'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
