'use client';

import { PrepDoc } from '../../lib/types';
import { formatCurrency, formatPercent } from '../../lib/utils';

interface PrepTabProps {
  prepDoc: PrepDoc;
}

export default function PrepTab({ prepDoc }: PrepTabProps) {
  const snap = prepDoc.financialSnapshot;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-ink">AI-Generated Meeting Prep</h2>
        <p className="mt-1 text-sm text-ink-muted">Personalized briefing compiled from client data, market activity, and prior meetings</p>
      </div>

      {/* Overview */}
      <section>
        <SectionLabel label="Overview" />
        <div className="space-y-3">
          {prepDoc.overview.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink-muted">{para}</p>
          ))}
        </div>
      </section>

      {/* Conversation Starters */}
      <section>
        <SectionLabel label="Conversation Starters" />
        <div className="space-y-3">
          {prepDoc.conversationStarters.map((starter, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink-muted pl-4 border-l-2 border-border">
              {starter}
            </p>
          ))}
        </div>
      </section>

      {/* Financial Snapshot */}
      <section>
        <SectionLabel label="Financial Snapshot" />
        <div className="flex items-baseline gap-8 text-sm text-ink-muted">
          <span>
            <span className="text-xl font-semibold text-ink">{formatCurrency(snap.totalAssets)}</span>{' '}
            total assets
          </span>
          <span>
            <span className="text-xl font-semibold text-ink">{formatPercent(snap.ytdReturn)}</span>{' '}
            YTD return
          </span>
          <span>
            <span className="text-xl font-semibold text-ink">
              {(snap.portfolioChange >= 0 ? '+' : '') + formatCurrency(snap.portfolioChange)}
            </span>{' '}
            change
          </span>
        </div>

        {snap.keyMetrics.length > 0 && (
          <div className="mt-4 space-y-1">
            {snap.keyMetrics.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-ink-faint w-40">{m.label}</span>
                <span className="text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <SectionLabel label="Recent Activity" />
        <div className="space-y-2">
          {prepDoc.recentActivity.map((activity, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink-muted">
              <span className="text-ink-faint mr-2">-</span>
              {activity}
            </p>
          ))}
        </div>
      </section>

      {/* Open Tasks */}
      {prepDoc.clientTasks.length > 0 && (
        <section>
          <SectionLabel label="Client Tasks" />
          <div className="space-y-0">
            {prepDoc.clientTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {prepDoc.plannerTasks.length > 0 && (
        <section>
          <SectionLabel label="Your Tasks" />
          <div className="space-y-0">
            {prepDoc.plannerTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
      {label}
    </h3>
  );
}

function TaskRow({ task }: { task: PrepDoc['clientTasks'][number] }) {
  return (
    <div className="flex items-center gap-3 border-b border-border-faint py-2.5">
      <span className="text-xs text-ink-faint capitalize w-16">{task.status.replace('-', ' ')}</span>
      <span className="flex-1 text-sm text-ink truncate">{task.title}</span>
      <span className="text-xs text-ink-faint capitalize">{task.priority}</span>
      <span className="text-xs text-ink-faint">
        {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
}
