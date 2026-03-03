'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { outreachSuggestions } from '../../data/outreach';
import { OutreachSuggestion } from '../../lib/types';
import { useToast } from '../../hooks/useToast';
import { timeAgo } from '../../lib/utils';

type FilterKey = 'all' | 'Market & Portfolio' | 'Life Events' | 'Account Activity' | 'Relationship' | 'Planning Milestones';
type DismissReason = 'Already handled' | 'Not relevant' | 'Client preference' | 'Other';

function priorityOrder(p: string): number {
  switch (p) {
    case 'urgent': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    default: return 4;
  }
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    urgent: 'bg-red-50 text-red-600 border border-red-200',
    high: 'bg-surface-inset text-ink border border-border',
    medium: 'bg-surface-inset text-ink-muted border border-border-faint',
    low: 'bg-surface-inset text-ink-faint border border-border-faint',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${styles[priority] || styles.low}`}>
      {priority}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="rounded-full bg-surface-inset px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
      {category}
    </span>
  );
}

export default function OutreachPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [items, setItems] = useState<OutreachSuggestion[]>(outreachSuggestions);
  const [expandedWhyIds, setExpandedWhyIds] = useState<Set<string>>(new Set());
  const [showDismissDropdown, setShowDismissDropdown] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftItem, setDraftItem] = useState<OutreachSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showDraftModal) { setShowDraftModal(false); return; }
      if (showDismissDropdown) { setShowDismissDropdown(null); return; }
    }
  }, [showDraftModal, showDismissDropdown]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const pendingItems = items
    .filter((i) => i.status === 'pending')
    .filter((i) => filter === 'all' || i.category === filter)
    .sort((a, b) => {
      const pDiff = priorityOrder(a.priority) - priorityOrder(b.priority);
      if (pDiff !== 0) return pDiff;
      return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
    });

  const completedItems = items.filter((i) => i.status === 'completed');
  const allPending = items.filter((i) => i.status === 'pending');
  const urgentCount = allPending.filter((i) => i.priority === 'urgent').length;

  const categoryFilters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'Market & Portfolio', label: 'Market & Portfolio' },
    { key: 'Life Events', label: 'Life Events' },
    { key: 'Account Activity', label: 'Account Activity' },
    { key: 'Relationship', label: 'Relationship' },
    { key: 'Planning Milestones', label: 'Planning Milestones' },
  ];

  function getCategoryCount(key: FilterKey): number {
    if (key === 'all') return allPending.length;
    return allPending.filter((i) => i.category === key).length;
  }

  function toggleWhy(id: string) {
    setExpandedWhyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDismiss(id: string, reason?: DismissReason) {
    const prev = items.find((i) => i.id === id);
    setItems((items) => items.map((i) => i.id === id ? { ...i, status: 'dismissed' as const } : i));
    setShowDismissDropdown(null);
    showToast(`Dismissed${reason ? `: ${reason}` : ''}`, () => {
      if (prev) setItems((items) => items.map((i) => i.id === id ? { ...i, status: prev.status } : i));
    });
  }

  function handleSnooze(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'snoozed' as const, snoozedUntil: '2026-03-09' } : i));
    showToast('Snoozed for 1 week');
  }

  function handleComplete(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? {
      ...i,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      completionMethod: 'Marked complete',
    } : i));
    showToast('Marked as complete');
  }

  function handleDraftEmail(item: OutreachSuggestion) {
    setDraftItem(item);
    setIsGenerating(true);
    setIsEditing(false);
    setIsEdited(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowDraftModal(true);
    }, 1500);
  }

  function handleSendDraft() {
    if (draftItem && !isSending) {
      setIsSending(true);
      setTimeout(() => {
        setItems((prev) => prev.map((i) => i.id === draftItem.id ? {
          ...i,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          completionMethod: 'Email sent',
        } : i));
        setShowDraftModal(false);
        setDraftItem(null);
        setIsSending(false);
        showToast('Email sent successfully');
      }, 800);
    }
  }

  const stats = [
    { value: String(allPending.length), label: 'Suggested', accent: 'border-l-ink/20' },
    { value: String(urgentCount), label: 'Urgent', accent: 'border-l-ink/20' },
    { value: String(completedItems.length), label: 'Completed This Week', accent: 'border-l-ink/20' },
  ];

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-ink">Proactive Outreach</h1>
      <p className="mt-1 text-sm text-ink-muted">AI-suggested reasons to reach out before your clients reach out to you</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border border-border border-l-[3px] px-4 py-4 shadow-sm ${stat.accent}`}
          >
            <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex gap-0.5 border-b border-border overflow-x-auto">
        {categoryFilters.map((f) => (
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
            <span className="ml-1 text-ink-faint">{getCategoryCount(f.key)}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-6 space-y-4">
        {pendingItems.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-raised px-8 py-12 text-center">
            <p className="text-sm text-ink-faint">No outreach suggestions match this filter.</p>
          </div>
        ) : (
          pendingItems.map((item) => (
            <div key={item.id} id={`outreach-${item.id}`} className="rounded-lg border border-border bg-surface-raised shadow-sm overflow-hidden">
              <div className="px-5 py-4">
                {/* Top row: badges + timestamp */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={item.priority} />
                    <CategoryBadge category={item.category} />
                    {item.resurfaced && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Snoozed — resurfaced</span>
                    )}
                  </div>
                  <span className="text-[11px] text-ink-faint">Detected {timeAgo(item.detectedAt)}</span>
                </div>

                {/* Client name */}
                <button
                  onClick={() => router.push(`/clients?highlight=${item.clientId}`)}
                  className="mt-3 text-base font-semibold text-ink hover:text-accent-blue transition-colors text-left"
                >
                  {item.clientName}
                </button>

                {/* Trigger */}
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.trigger}</p>

                {/* Context row */}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {item.context.map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5 text-xs">
                      <span className="text-ink-faint">{c.label}:</span>
                      <span className="font-medium text-ink">{c.value}</span>
                    </div>
                  ))}
                </div>

                {/* Suggested action */}
                <div className="mt-3 flex items-start gap-2 rounded-md bg-surface-inset/60 px-3 py-2">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  <p className="text-xs text-ink-muted"><span className="font-medium text-ink">Recommended:</span> {item.suggestedAction}</p>
                </div>

                {/* Why this suggestion? */}
                <button
                  onClick={() => toggleWhy(item.id)}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-ink-faint hover:text-ink transition-colors"
                >
                  <svg className={`h-3 w-3 transition-transform ${expandedWhyIds.has(item.id) ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Why this suggestion?
                </button>
                {expandedWhyIds.has(item.id) && (
                  <p className="mt-2 ml-4 text-xs leading-relaxed text-ink-faint animate-fade-in">{item.whyExplanation}</p>
                )}
              </div>

              {/* Actions bar */}
              <div className="flex items-center gap-2 border-t border-border-faint px-5 py-3 bg-surface-inset/30">
                <button
                  onClick={() => handleDraftEmail(item)}
                  className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Draft Email
                </button>
                <button
                  onClick={() => handleComplete(item.id)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => handleSnooze(item.id)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                >
                  Snooze 1 Week
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowDismissDropdown(showDismissDropdown === item.id ? null : item.id)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                  >
                    Dismiss
                  </button>
                  {showDismissDropdown === item.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDismissDropdown(null)} />
                      <div className="absolute bottom-full left-0 z-50 mb-1 w-44 rounded-lg border border-border bg-surface-raised py-1 shadow-lg">
                        {(['Already handled', 'Not relevant', 'Client preference', 'Other'] as DismissReason[]).map((reason) => (
                          <button
                            key={reason}
                            onClick={() => handleDismiss(item.id, reason)}
                            className="w-full px-3 py-1.5 text-left text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed section */}
      {completedItems.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <svg className={`h-3.5 w-3.5 transition-transform ${showCompleted ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Completed (Last 30 Days)
            <span className="text-ink-faint font-normal">{completedItems.length}</span>
          </button>

          {showCompleted && (
            <div className="mt-3 rounded-lg border border-border bg-surface-raised overflow-hidden animate-fade-in">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    <th className="py-2.5 pl-4 pr-6">Client</th>
                    <th className="py-2.5 pr-6">Trigger</th>
                    <th className="py-2.5 pr-6">Completed</th>
                    <th className="py-2.5 pr-4">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {completedItems.map((item) => (
                    <tr key={item.id} className="border-b border-border-faint last:border-0">
                      <td className="py-2.5 pl-4 pr-6 font-medium text-ink">{item.clientName}</td>
                      <td className="max-w-xs truncate py-2.5 pr-6 text-ink-muted">{item.trigger}</td>
                      <td className="py-2.5 pr-6 text-ink-faint whitespace-nowrap">
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="py-2.5 pr-4 text-ink-faint">{item.completionMethod || '—'}</td>
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

      {/* Draft Email Modal */}
      {showDraftModal && draftItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowDraftModal(false)} />
          <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
            {/* Modal header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">AI-Generated Outreach Email</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-muted capitalize">{draftItem.draftTone || 'professional'} tone</span>
                </div>
                <p className="mt-0.5 text-xs text-ink-faint">
                  To {draftItem.clientName} &middot; {draftItem.category}
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
              <p className="text-xs text-ink-faint">Subject: <span className="font-medium text-ink">{draftItem.draftSubject || `Following up — ${draftItem.clientName}`}</span></p>
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
                  {isEdited ? editedText : (draftItem.draftBody || `Hi ${draftItem.clientName},\n\nI wanted to reach out regarding: ${draftItem.trigger}\n\n${draftItem.suggestedAction}\n\nLet me know if you'd like to discuss — happy to jump on a quick call.\n\nBest,\nSarah`)}
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
                        const body = draftItem.draftBody || `Hi ${draftItem.clientName},\n\nI wanted to reach out regarding: ${draftItem.trigger}\n\n${draftItem.suggestedAction}\n\nLet me know if you'd like to discuss — happy to jump on a quick call.\n\nBest,\nSarah`;
                        setEditedText(isEdited ? editedText : body);
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
                        setTimeout(() => handleDraftEmail(draftItem), 100);
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
