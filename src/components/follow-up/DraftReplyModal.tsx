'use client';

import { useEffect } from 'react';
import { Email } from '../../lib/types';

interface DraftReplyModalProps {
  email: Email;
  onClose: () => void;
  onApprove: () => void;
}

export default function DraftReplyModal({ email, onClose, onApprove }: DraftReplyModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const draft = email.draftReply;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mx-4 flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-surface-raised">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-ink">Email Review</h2>
            <span className="text-sm text-ink-muted">{email.clientName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content: Two-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Original Email */}
          <div className="flex flex-1 flex-col border-r border-border">
            <div className="border-b border-border-faint px-6 py-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint">Original Email</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                <div className="space-y-1 text-sm">
                  <p className="text-ink-muted"><span className="font-medium text-ink">From:</span> {email.clientName}</p>
                  <p className="text-ink-muted"><span className="font-medium text-ink">Subject:</span> {email.subject}</p>
                  <p className="text-ink-muted"><span className="font-medium text-ink">Received:</span> {new Date(email.receivedAt).toLocaleString()}</p>
                </div>
                <div className="border-t border-border-faint pt-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                    {email.body}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Draft Reply */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-border-faint px-6 py-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint">AI-Drafted Reply</h3>
              {draft && (
                <span className="text-xs text-ink-faint capitalize">{draft.tone} tone</span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {draft ? (
                <div className="space-y-4">
                  <div className="space-y-1 text-sm">
                    <p className="text-ink-muted"><span className="font-medium text-ink">Subject:</span> {draft.subject}</p>
                  </div>
                  <div className="border-t border-border-faint pt-4">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                      {draft.body}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-ink-faint">No AI draft available for this email.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-inset">
              Edit Draft
            </button>
            <button
              onClick={onApprove}
              className="rounded-full bg-ink px-5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
            >
              Approve &amp; Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
