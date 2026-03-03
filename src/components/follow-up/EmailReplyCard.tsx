'use client';

import { Email } from '../../lib/types';
import { timeAgo } from '../../lib/utils';

const priorityLabel: Record<Email['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

interface EmailReplyCardProps {
  email: Email;
  onReview: (email: Email) => void;
}

export default function EmailReplyCard({ email, onReview }: EmailReplyCardProps) {
  return (
    <div className="border-b border-border-faint pb-4">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-ink">{email.clientName}</span>
          <span className="text-xs text-ink-faint">{timeAgo(email.receivedAt)}</span>
          {!email.isRead && (
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          {email.type === 'follow-up' && <span>Follow-up</span>}
          <span>{priorityLabel[email.priority]}</span>
        </div>
      </div>

      {/* Subject */}
      <h3 className={`mt-1.5 text-sm ${email.isRead ? 'text-ink-muted' : 'font-medium text-ink'}`}>
        {email.subject}
      </h3>

      {/* Preview */}
      <p className="mt-1 text-sm text-ink-muted line-clamp-2 leading-relaxed">
        {email.preview}
      </p>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          {email.draftReply && <span>AI draft ready</span>}
        </div>

        <button
          onClick={() => onReview(email)}
          className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
        >
          Review &amp; Send
        </button>
      </div>
    </div>
  );
}
