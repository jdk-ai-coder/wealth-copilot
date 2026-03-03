'use client';

import { MeetingSummary } from '../../lib/types';

export default function SummaryTab({ summary }: { summary: MeetingSummary }) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Overview</h3>
        <p className="text-sm leading-relaxed text-ink-muted">{summary.overview}</p>
      </section>

      {/* Client Sentiment */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-ink-muted">Client sentiment:</span>
        <span className="font-medium text-ink capitalize">{summary.clientSentiment}</span>
      </div>

      {/* Key Decisions */}
      <section>
        <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Key Decisions</h3>
        <ol className="space-y-2">
          {summary.keyDecisions.map((decision, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-muted">
              <span className="font-medium text-ink-faint">{i + 1}.</span>
              <span className="leading-relaxed">{decision}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Action Items */}
      <section>
        <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">Action Items</h3>
        <ul className="space-y-2">
          {summary.actionItems.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-muted">
              <span className="text-ink-faint">-</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Follow-up Date */}
      {summary.followUpDate && (
        <p className="text-sm text-ink-muted">
          Follow-up scheduled:{' '}
          <span className="font-medium text-ink">
            {new Date(summary.followUpDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
          </span>
        </p>
      )}
    </div>
  );
}
