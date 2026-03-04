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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
          <span className="rounded-full bg-surface-inset border border-border-faint px-2.5 py-0.5 text-xs font-medium text-ink-muted">{typeLabel[meeting.type]}</span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{meeting.clientName} &middot; AI-generated prep based on client history</p>

        {/* Meeting details bar */}
        <div className="mt-5 rounded-lg border border-border bg-surface p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span className="text-ink">
              {new Date(meeting.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="text-ink">{meeting.time}</span>
            <span className="text-ink-faint">&middot;</span>
            <span className="text-ink-muted">{meeting.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-ink-faint" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span className="text-ink-muted">{meeting.attendees.join(', ')}</span>
          </div>
          {meeting.tags.length > 0 && (
            <div className="flex items-center gap-2">
              {meeting.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-surface-inset border border-border-faint px-2 py-0.5 text-xs text-ink-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {meeting.meetingLink && (
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Join Meeting
            </a>
          )}
        </div>

        {/* Last meeting notes & prep checklist */}
        {(meeting.lastMeetingNotes || checklist.length > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {meeting.lastMeetingNotes && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-2">Last Meeting Notes</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{meeting.lastMeetingNotes}</p>
              </div>
            )}
            {checklist.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-4">
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
