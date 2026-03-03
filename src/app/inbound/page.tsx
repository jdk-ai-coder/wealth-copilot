'use client';

import { useState, useEffect, useCallback } from 'react';
import { leads as initialLeads } from '../../data/leads';
import { Lead, LeadStatus } from '../../lib/types';
import { useToast } from '../../hooks/useToast';
import { timeAgo, formatCurrency } from '../../lib/utils';

type FilterKey = 'all' | LeadStatus;
type SortKey = 'score' | 'balance' | 'name';

const STATUS_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'meeting-scheduled': 'Meeting Scheduled',
  'converted': 'Converted',
  'not-interested': 'Not Interested',
};

const TRIGGER_TYPE_LABELS: Record<string, string> = {
  'aum-threshold': 'AUM Threshold',
  'life-event': 'Life Event',
  'retirement-approaching': 'Retirement',
  'job-change': 'Job Change',
  'rollover-eligible': 'Rollover',
  'vesting-milestone': 'Vesting',
  'referral': 'Referral',
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    'new': 'bg-accent-blue-light text-accent-blue',
    'contacted': 'bg-accent-amber-light text-accent-amber',
    'meeting-scheduled': 'bg-accent-purple-light text-accent-purple',
    'converted': 'bg-accent-green-light text-accent-green',
    'not-interested': 'bg-surface-inset text-ink-faint',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-accent-green' : score >= 40 ? 'bg-accent-amber' : 'bg-accent-red';
  const textColor = score >= 70 ? 'text-accent-green' : score >= 40 ? 'text-accent-amber' : 'text-accent-red';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-surface-inset overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>{score}</span>
    </div>
  );
}

function TriggerBadge({ type }: { type: string }) {
  return (
    <span className="rounded-full bg-surface-inset px-2 py-0.5 text-[10px] font-medium text-ink-muted">
      {TRIGGER_TYPE_LABELS[type] || type}
    </span>
  );
}

export default function InboundPage() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('score');
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftLead, setDraftLead] = useState<Lead | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConverted, setShowConverted] = useState(false);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && showDraftModal) {
      setShowDraftModal(false);
    }
  }, [showDraftModal]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Filter and sort
  const activeLeads = leads
    .filter((l) => l.status !== 'converted')
    .filter((l) => filter === 'all' || l.status === filter)
    .sort((a, b) => {
      switch (sort) {
        case 'score': return b.conversionScore - a.conversionScore;
        case 'balance': return b.balance401k - a.balance401k;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const convertedLeads = leads.filter((l) => l.status === 'converted');
  const allNonConverted = leads.filter((l) => l.status !== 'converted');
  const highPriority = allNonConverted.filter((l) => l.conversionScore >= 70).length;
  const inProgress = allNonConverted.filter((l) => l.status === 'contacted' || l.status === 'meeting-scheduled').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads.length / leads.length) * 100) : 0;

  const filterTabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'meeting-scheduled', label: 'Meeting Scheduled' },
    { key: 'not-interested', label: 'Not Interested' },
  ];

  function getFilterCount(key: FilterKey): number {
    if (key === 'all') return allNonConverted.length;
    return allNonConverted.filter((l) => l.status === key).length;
  }

  function advanceStatus(id: string) {
    setLeads((prev) => prev.map((l) => {
      if (l.id !== id) return l;
      const nextStatus: Record<string, LeadStatus> = {
        'new': 'contacted',
        'contacted': 'meeting-scheduled',
        'meeting-scheduled': 'converted',
      };
      const next = nextStatus[l.status];
      if (!next) return l;
      return { ...l, status: next, lastContactedAt: new Date().toISOString() };
    }));
    showToast('Status updated');
  }

  function dismissLead(id: string) {
    setLeads((prev) => prev.map((l) =>
      l.id === id ? { ...l, status: 'not-interested' as LeadStatus } : l
    ));
    showToast('Lead dismissed');
  }

  function handleDraftOutreach(lead: Lead) {
    setDraftLead(lead);
    setIsGenerating(true);
    setIsEditing(false);
    setIsEdited(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowDraftModal(true);
    }, 1200);
  }

  function handleSendDraft() {
    if (draftLead && !isSending) {
      setIsSending(true);
      setTimeout(() => {
        setLeads((prev) => prev.map((l) =>
          l.id === draftLead.id ? { ...l, status: 'contacted' as LeadStatus, lastContactedAt: new Date().toISOString() } : l
        ));
        setShowDraftModal(false);
        setDraftLead(null);
        setIsSending(false);
        showToast('Email sent successfully');
      }, 800);
    }
  }

  function getAdvanceLabel(status: LeadStatus): string | null {
    switch (status) {
      case 'new': return 'Mark Contacted';
      case 'contacted': return 'Schedule Meeting';
      case 'meeting-scheduled': return 'Mark Converted';
      default: return null;
    }
  }

  const stats = [
    { value: String(allNonConverted.length), label: 'Total Leads', accent: 'border-l-accent-blue' },
    { value: String(highPriority), label: 'High Priority', accent: 'border-l-accent-green' },
    { value: String(inProgress), label: 'In Progress', accent: 'border-l-accent-amber' },
    { value: `${conversionRate}%`, label: 'Conversion Rate', accent: 'border-l-accent-purple' },
  ];

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-ink">Inbound Leads</h1>
      <p className="mt-1 text-sm text-ink-muted">401(k) participants identified as candidates for full wealth management — your inbound pipeline</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border border-border border-l-[3px] px-4 py-4 ${stat.accent}`}
          >
            <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs + Sort */}
      <div className="mt-8 flex items-center justify-between border-b border-border">
        <div className="flex gap-0.5 overflow-x-auto">
          {filterTabs.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 pb-2.5 text-xs transition-colors ${
                filter === f.key
                  ? 'border-b-2 border-ink font-medium text-ink'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f.label}
              <span className="ml-1 text-ink-faint">{getFilterCount(f.key)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2.5">
          <span className="text-[11px] text-ink-faint">Sort:</span>
          {([['score', 'Score'], ['balance', 'Balance'], ['name', 'Name']] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] transition-colors ${
                sort === key ? 'bg-ink text-white font-medium' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lead cards */}
      <div className="mt-6 space-y-4">
        {activeLeads.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-raised px-8 py-12 text-center">
            <p className="text-sm text-ink-faint">No leads match this filter.</p>
          </div>
        ) : (
          activeLeads.map((lead) => {
            const visibleTriggers = lead.triggers.slice(0, 3);
            const extraTriggers = lead.triggers.length - 3;
            const advanceLabel = getAdvanceLabel(lead.status);
            const oldestTrigger = lead.triggers.reduce((oldest, t) =>
              new Date(t.detectedAt) < new Date(oldest.detectedAt) ? t : oldest
            , lead.triggers[0]);

            return (
              <div key={lead.id} className="rounded-lg border border-border bg-surface-raised overflow-hidden">
                <div className="px-5 py-4">
                  {/* Top row: status + trigger count + time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={lead.status} />
                      <span className="text-[11px] text-ink-faint">{lead.triggers.length} triggers</span>
                    </div>
                    <span className="text-[11px] text-ink-faint">{timeAgo(oldestTrigger.detectedAt)}</span>
                  </div>

                  {/* Name + employer + job title */}
                  <div className="mt-3">
                    <p className="text-base font-semibold text-ink">{lead.name}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{lead.jobTitle} at {lead.employer}</p>
                  </div>

                  {/* Key metrics row */}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-ink-faint">401(k):</span>
                      <span className="font-medium text-ink">{formatCurrency(lead.balance401k)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-ink-faint">Est. Wealth:</span>
                      <span className="font-medium text-ink">{formatCurrency(lead.estimatedTotalWealth)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-ink-faint">Vesting:</span>
                      <span className="font-medium text-ink">{lead.vestingPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-ink-faint">Age:</span>
                      <span className="font-medium text-ink">{lead.age}</span>
                    </div>
                  </div>

                  {/* Conversion score bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-ink-faint">Conversion Score</span>
                    </div>
                    <ScoreBar score={lead.conversionScore} />
                  </div>

                  {/* Trigger badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {visibleTriggers.map((t) => (
                      <TriggerBadge key={t.id} type={t.type} />
                    ))}
                    {extraTriggers > 0 && (
                      <span className="rounded-full bg-surface-inset px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                        +{extraTriggers} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex items-center gap-2 border-t border-border-faint px-5 py-3 bg-surface-inset/30">
                  <button
                    onClick={() => handleDraftOutreach(lead)}
                    className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Draft Outreach
                  </button>
                  {advanceLabel && (
                    <button
                      onClick={() => advanceStatus(lead.id)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      {advanceLabel}
                    </button>
                  )}
                  {lead.status !== 'not-interested' && (
                    <button
                      onClick={() => dismissLead(lead.id)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Converted section */}
      {convertedLeads.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowConverted(!showConverted)}
            className="flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <svg className={`h-3.5 w-3.5 transition-transform ${showConverted ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Converted Leads
            <span className="text-ink-faint font-normal">{convertedLeads.length}</span>
          </button>

          {showConverted && (
            <div className="mt-3 rounded-lg border border-border bg-surface-raised overflow-hidden animate-fade-in">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    <th className="py-2.5 pl-4 pr-6">Name</th>
                    <th className="py-2.5 pr-6">Employer</th>
                    <th className="py-2.5 pr-6">401(k) Balance</th>
                    <th className="py-2.5 pr-6">Est. Wealth</th>
                    <th className="py-2.5 pr-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {convertedLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border-faint last:border-0">
                      <td className="py-2.5 pl-4 pr-6 font-medium text-ink">{lead.name}</td>
                      <td className="py-2.5 pr-6 text-ink-muted">{lead.employer}</td>
                      <td className="py-2.5 pr-6 text-ink-muted">{formatCurrency(lead.balance401k)}</td>
                      <td className="py-2.5 pr-6 text-ink-muted">{formatCurrency(lead.estimatedTotalWealth)}</td>
                      <td className="py-2.5 pr-4">
                        <span className="text-xs font-semibold text-accent-green">{lead.conversionScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Generating overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/60">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-5 py-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:0ms]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:150ms]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:300ms]" />
            </div>
            <p className="text-sm text-ink-muted">Generating outreach email...</p>
          </div>
        </div>
      )}

      {/* Draft Outreach Modal */}
      {showDraftModal && draftLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowDraftModal(false)} />
          <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
            {/* Modal header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">AI-Generated Outreach Email</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-muted capitalize">{draftLead.aiOutreach.tone} tone</span>
                </div>
                <p className="mt-0.5 text-xs text-ink-faint">
                  To {draftLead.name} &middot; {draftLead.employer} &middot; Score: {draftLead.conversionScore}
                </p>
              </div>
              <button onClick={() => setShowDraftModal(false)} className="text-ink-muted hover:text-ink transition-colors p-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Subject line */}
            <div className="shrink-0 border-b border-border-faint px-6 py-2.5">
              <p className="text-xs text-ink-faint">Subject: <span className="font-medium text-ink">{draftLead.aiOutreach.subject}</span></p>
            </div>

            {/* Draft body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {isEditing ? (
                <textarea
                  autoFocus
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-full min-h-[200px] resize-none border-0 bg-transparent text-sm leading-relaxed text-ink outline-none focus:ring-0"
                />
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {isEdited ? editedText : draftLead.aiOutreach.body}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center justify-between border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => { setIsEdited(true); setIsEditing(false); }}
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); if (!isEdited) setEditedText(''); }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditedText(isEdited ? editedText : draftLead.aiOutreach.body);
                        setIsEditing(true);
                      }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Edit Draft
                    </button>
                    <button
                      onClick={() => {
                        if (isEdited && !confirm('Regenerating will discard your edits. Continue?')) return;
                        setIsEdited(false);
                        setEditedText('');
                        setShowDraftModal(false);
                        setTimeout(() => handleDraftOutreach(draftLead), 100);
                      }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Regenerate
                    </button>
                  </>
                )}
                {isEdited && !isEditing && (
                  <span className="text-[10px] text-ink-faint">Edited</span>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={handleSendDraft}
                  disabled={isSending}
                  className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                >
                  {isSending ? 'Sending...' : 'Approve & Send'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
