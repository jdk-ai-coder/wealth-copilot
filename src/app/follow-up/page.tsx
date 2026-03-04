'use client';

import { useState, useEffect, useCallback } from 'react';
import { Email } from '../../lib/types';
import { emails } from '../../data/emails';
import { timeAgo } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';

type FilterKey = 'all' | 'unread' | 'drafts' | 'follow-ups';

// ── Draft Tweak Chips ────────────────────────────────────────────────
const TWEAK_CHIPS = [
  { id: 'personal', label: 'More Personal' },
  { id: 'professional', label: 'More Professional' },
  { id: 'shorter', label: 'Shorter' },
  { id: 'detail', label: 'More Detail' },
  { id: 'warmer', label: 'Warmer Tone' },
  { id: 'urgency', label: 'Add Urgency' },
] as const;

function applyTweak(body: string, chipId: string): string {
  switch (chipId) {
    case 'personal':
      return body
        .replace(/^Hi (\w+),/, 'Hi $1 — hope you\'re doing well!')
        .replace(/Best regards,\nSarah/, 'Looking forward to connecting,\nSarah')
        .replace(/Best,\nSarah/, 'Looking forward to connecting,\nSarah');
    case 'professional':
      return body
        .replace(/^Hi (\w+) — hope you're doing well!/, 'Dear $1,')
        .replace(/^Hi (\w+),/, 'Dear $1,')
        .replace(/Looking forward to connecting,\nSarah/, 'Best regards,\nSarah Mitchell, CFP\nVantage Wealth Management');
    case 'shorter': {
      const lines = body.split('\n').filter(l => l.trim());
      if (lines.length > 4) {
        return [lines[0], '', lines[1], '', lines[lines.length - 2], lines[lines.length - 1]].join('\n');
      }
      return body;
    }
    case 'detail':
      return body.replace(
        /Would you like.*\?|Would you have.*\?|Free for a quick.*\?|Would it be helpful.*\?|Would next week work.*\?|Let me know if.*\.|Happy to.*\./,
        'I\'ve prepared a brief analysis specific to your situation that covers the key considerations. Would you have 20-30 minutes this week to review it together?'
      );
    case 'warmer':
      return body
        .replace(/^Dear (\w+),/, 'Hi $1,')
        .replace(/Best regards,\nSarah.*/, 'Warmly,\nSarah')
        .replace(/Best,\nSarah/, 'Warmly,\nSarah');
    case 'urgency':
      return body.replace(
        /Would you like.*\?|Would you have.*\?|Free for a quick.*\?|Would it be helpful.*\?|Would next week work.*\?|Let me know if.*\.|Happy to.*\./,
        'Given the timing, acting before the end of this quarter could make a meaningful difference. I have a few openings this week — would any of them work for a quick call?'
      );
    default:
      return body;
  }
}

export default function FollowUpPage() {
  const { showToast } = useToast();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0] ?? null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterKey>('all');
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [showReplyCompose, setShowReplyCompose] = useState(false);
  const [showForwardCompose, setShowForwardCompose] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [appliedTweaks, setAppliedTweaks] = useState<Set<string>>(new Set());
  const [isTweaking, setIsTweaking] = useState<string | null>(null);
  const [tweakedBody, setTweakedBody] = useState<string>('');

  const isApproved = selectedEmail ? approvedIds.has(selectedEmail.id) : false;
  const draft = selectedEmail?.draftReply;

  const handleApprove = () => {
    if (selectedEmail && !isSending) {
      setIsSending(true);
      setTimeout(() => {
        setApprovedIds((prev) => new Set(prev).add(selectedEmail.id));
        setShowDraftModal(false);
        setIsSending(false);
        showToast('Reply sent successfully');
      }, 800);
    }
  };

  const handleSelectEmail = (email: Email) => {
    if (isEditing && isEdited) {
      if (!confirm('You have unsaved edits. Discard changes?')) return;
    }
    setSelectedEmail(email);
    setShowDraftModal(false);
    setIsEditing(false);
    setIsEdited(false);
    setEditedText('');
    setShowReplyCompose(false);
    setShowForwardCompose(false);
    setComposeText('');
    setReadIds((prev) => new Set(prev).add(email.id));
    setAppliedTweaks(new Set());
    setIsTweaking(null);
    setTweakedBody('');
  };

  const handleCloseModal = () => {
    if (isEditing && editedText !== (draft?.body ?? '')) {
      if (!confirm('You have unsaved edits. Discard changes?')) return;
    }
    setShowDraftModal(false);
    setIsEditing(false);
  };

  const handleSendCompose = (type: 'reply' | 'forward') => {
    if (!composeText.trim() || isSending) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowReplyCompose(false);
      setShowForwardCompose(false);
      setComposeText('');
      showToast(type === 'reply' ? 'Reply sent' : 'Email forwarded');
    }, 800);
  };

  const handleGenerateReply = () => {
    setIsGenerating(true);
    setIsEditing(false);
    setIsEdited(false);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowDraftModal(true);
    }, 1500);
  };

  const handleEditDraft = () => {
    if (draft) {
      setEditedText(isEdited ? editedText : (tweakedBody || draft.body));
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    setIsEdited(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (!isEdited) setEditedText('');
  };

  const handleRegenerate = () => {
    if (isEdited) {
      if (!confirm('You have unsaved edits. Regenerating will discard them. Continue?')) return;
    }
    setIsEdited(false);
    setEditedText('');
    setAppliedTweaks(new Set());
    setTweakedBody('');
    setShowDraftModal(false);
    setTimeout(handleGenerateReply, 100);
  };

  const handleTweakChip = (chipId: string) => {
    if (isTweaking || !draft) return;
    setIsTweaking(chipId);
    setTimeout(() => {
      const currentBody = tweakedBody || draft.body;
      setTweakedBody(applyTweak(currentBody, chipId));
      setAppliedTweaks(prev => new Set(prev).add(chipId));
      setIsTweaking(null);
    }, 800);
  };

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showDraftModal) { setShowDraftModal(false); setIsEditing(false); return; }
      if (showReplyCompose) { setShowReplyCompose(false); setComposeText(''); return; }
      if (showForwardCompose) { setShowForwardCompose(false); setComposeText(''); return; }
    }
  }, [showDraftModal, showReplyCompose, showForwardCompose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const unreadCount = emails.filter((e) => !e.isRead).length;
  const draftsCount = emails.filter((e) => e.draftReply && !approvedIds.has(e.id)).length;
  const followUpCount = emails.filter((e) => e.type === 'follow-up').length;

  const filteredEmails = emails.filter((e) => {
    switch (filter) {
      case 'unread': return !e.isRead;
      case 'drafts': return !!e.draftReply && !approvedIds.has(e.id);
      case 'follow-ups': return e.type === 'follow-up';
      default: return true;
    }
  });

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: emails.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'drafts', label: 'Has Draft', count: draftsCount },
    { key: 'follow-ups', label: 'Follow-ups', count: followUpCount },
  ];

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Left panel — email list */}
      <div className="flex w-[380px] shrink-0 flex-col border-r border-border">
        {/* Header */}
        <div className="shrink-0 px-4 pt-5 pb-0">
          <h1 className="text-lg font-semibold tracking-tight">Inbox</h1>
          <p className="mt-0.5 text-xs text-ink-muted">
            {unreadCount > 0 ? (
              <><span className="font-medium text-ink">{unreadCount} unread</span> &middot; {emails.length} total</>
            ) : (
              <>All caught up &middot; {emails.length} total</>
            )}
            {approvedIds.size > 0 && <> &middot; {approvedIds.size} sent today</>}
          </p>

          {/* Filter tabs */}
          <div className="mt-3 flex gap-0.5 border-b border-border">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-2.5 pb-2 text-xs transition-colors ${
                  filter === f.key
                    ? 'border-b-2 border-ink font-medium text-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {f.label}
                <span className="ml-1 text-ink-faint">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="px-4 py-12">
              <p className="text-sm text-ink-faint">No emails match this filter.</p>
            </div>
          ) : (
            filteredEmails.map((email) => {
              const approved = approvedIds.has(email.id);
              const isSelected = selectedEmail?.id === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={`cursor-pointer border-b border-border-faint px-4 py-3 transition-colors ${
                    isSelected ? 'bg-surface-inset' : 'hover:bg-surface-inset/50'
                  } ${approved ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Unread dot */}
                    <div className="pt-1.5 w-2 shrink-0">
                      {!email.isRead && !approved && !readIds.has(email.id) && (
                        <span className="block h-1.5 w-1.5 rounded-full bg-ink" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${!email.isRead ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                          {email.clientName}
                        </span>
                        <span className="shrink-0 text-[11px] text-ink-faint">{timeAgo(email.receivedAt)}</span>
                      </div>
                      <p className={`mt-0.5 text-sm truncate ${!email.isRead ? 'text-ink' : 'text-ink-muted'}`}>
                        {email.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-faint truncate leading-relaxed">
                        {email.preview}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        {approved && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-faint">Sent</span>
                        )}
                        {email.priority === 'high' && !approved && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-muted">High</span>
                        )}
                        {email.type === 'follow-up' && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-faint">Follow-up</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel — reading pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedEmail ? (
          <>
            {/* Subject bar with actions */}
            <div className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2">
                {!isApproved && (
                  <>
                    <button
                      onClick={() => { setShowReplyCompose(true); setShowForwardCompose(false); setComposeText(''); }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => { setShowForwardCompose(true); setShowReplyCompose(false); setComposeText(''); }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                    >
                      Forward
                    </button>
                    {draft && (
                      <button
                        onClick={handleGenerateReply}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                        {isGenerating ? 'Generating...' : 'Generate AI Reply'}
                      </button>
                    )}
                  </>
                )}
                {isApproved && (
                  <span className="text-xs text-ink-faint">Reply sent</span>
                )}
              </div>
            </div>

            {/* Email body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Thread history */}
              {selectedEmail.thread && selectedEmail.thread.length > 0 && (
                <div className="space-y-4 border-b border-border pb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Earlier in this thread</p>
                  {selectedEmail.thread.map((msg) => (
                    <div key={msg.id} className="rounded-lg border border-border-faint bg-surface-inset/30 px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-ink">{msg.from}</span>
                        <span className="text-[10px] text-ink-faint">
                          {new Date(msg.date).toLocaleString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-xs leading-relaxed text-ink-faint">
                        {msg.body}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Original message */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-ink-muted">
                      {selectedEmail.clientName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{selectedEmail.clientName}</p>
                      <p className="text-xs text-ink-faint">
                        {new Date(selectedEmail.receivedAt).toLocaleString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-ink-faint capitalize">{selectedEmail.priority} priority</span>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted pl-11">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Sent reply shown inline after approval */}
              {isApproved && draft && (
                <div className="border-t border-border pt-6 opacity-60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-medium text-white">
                      SM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink">Sarah Mitchell</p>
                        <span className="text-[10px] text-ink-faint">Sent</span>
                      </div>
                      <p className="text-xs text-ink-faint">{draft.subject}</p>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted pl-11">
                    {isEdited ? editedText : (tweakedBody || draft.body)}
                  </div>
                </div>
              )}
            </div>

            {/* Reply / Forward compose panel */}
            {(showReplyCompose || showForwardCompose) && selectedEmail && (
              <div className="shrink-0 border-t border-border px-6 py-4 bg-surface-inset/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-ink">
                    {showReplyCompose ? `Reply to ${selectedEmail.clientName}` : 'Forward email'}
                  </p>
                  <button
                    onClick={() => { setShowReplyCompose(false); setShowForwardCompose(false); setComposeText(''); }}
                    className="text-xs text-ink-faint hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {showForwardCompose && (
                  <input
                    type="text"
                    placeholder="To: email@example.com"
                    className="w-full mb-2 rounded border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
                  />
                )}
                <textarea
                  autoFocus
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  rows={4}
                  placeholder={showReplyCompose ? 'Write your reply...' : 'Add a message...'}
                  className="w-full rounded border border-border bg-surface-raised p-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink resize-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleSendCompose(showReplyCompose ? 'reply' : 'forward')}
                    disabled={!composeText.trim() || isSending}
                    className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                  >
                    {isSending ? 'Sending...' : showReplyCompose ? 'Send Reply' : 'Forward'}
                  </button>
                </div>
              </div>
            )}

            {/* Generating indicator overlay */}
            {isGenerating && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-surface/60">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:0ms]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:150ms]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:300ms]" />
                  </div>
                  <p className="text-sm text-ink-muted">Analyzing email and generating reply...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-ink-faint">Select an email to read</p>
          </div>
        )}
      </div>

      {/* AI Draft Reply Modal */}
      {showDraftModal && draft && selectedEmail && !isApproved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={handleCloseModal} />
          <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
            {/* Modal header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">AI-Generated Reply</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-muted capitalize">{draft.tone} tone</span>
                </div>
                <p className="mt-0.5 text-xs text-ink-faint">
                  Re: {draft.subject} &middot; To {selectedEmail.clientName}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-ink-muted hover:text-ink transition-colors p-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                  {isEdited ? editedText : (tweakedBody || draft.body)}
                </div>
              )}
            </div>

            {/* Quick-Tweak Chips */}
            {!isEditing && (
              <div className="shrink-0 border-t border-border-faint px-6 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {TWEAK_CHIPS.map(chip => (
                    <button
                      key={chip.id}
                      onClick={() => handleTweakChip(chip.id)}
                      disabled={isTweaking !== null}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        appliedTweaks.has(chip.id)
                          ? 'border-accent-green bg-accent-green-light text-accent-green'
                          : isTweaking === chip.id
                          ? 'border-border bg-surface-inset text-ink-faint animate-pulse'
                          : 'border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {appliedTweaks.has(chip.id) && (
                        <svg className="inline h-3 w-3 mr-0.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      {isTweaking === chip.id ? 'Adjusting...' : chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="shrink-0 flex items-center justify-between border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditDraft}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Edit Draft
                    </button>
                    <button
                      onClick={handleRegenerate}
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
                  onClick={handleApprove}
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
