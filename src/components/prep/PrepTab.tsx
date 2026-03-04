'use client';

import { PrepDoc } from '../../lib/types';
import { formatCurrency, formatPercent } from '../../lib/utils';

interface PrepTabProps {
  prepDoc: PrepDoc;
}

export default function PrepTab({ prepDoc }: PrepTabProps) {
  const snap = prepDoc.financialSnapshot;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-ink">AI-Generated Meeting Prep</h2>
        <p className="mt-1 text-sm text-ink-muted">Personalized briefing compiled from client data, market activity, and prior meetings</p>
      </div>

      {/* Overview */}
      <Card>
        <SectionLabel label="Overview" />
        <div className="space-y-3">
          {prepDoc.overview.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink-muted">{para}</p>
          ))}
        </div>
      </Card>

      {/* Financial Snapshot */}
      <Card>
        <SectionLabel label="Financial Snapshot" />
        <div className="grid grid-cols-3 gap-4">
          <StatBox label="Total Assets" value={formatCurrency(snap.totalAssets)} />
          <StatBox label="YTD Return" value={formatPercent(snap.ytdReturn)} />
          <StatBox
            label="Portfolio Change"
            value={(snap.portfolioChange >= 0 ? '+' : '') + formatCurrency(snap.portfolioChange)}
          />
        </div>

        {snap.keyMetrics.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">
            {snap.keyMetrics.map((m, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-sm py-1.5 border-b border-border-faint last:border-0">
                <span className="text-ink-faint">{m.label}</span>
                <span className="text-ink font-medium">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Conversation Starters */}
      <Card>
        <SectionLabel label="Conversation Starters" />
        <div className="grid grid-cols-2 gap-3">
          {prepDoc.conversationStarters.map((starter, i) => (
            <div key={i} className="rounded-md border border-border-faint bg-surface-inset p-3">
              <p className="text-sm leading-relaxed text-ink-muted">{starter}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <SectionLabel label="Recent Activity" />
        <div className="space-y-0">
          {prepDoc.recentActivity.map((activity, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border-faint last:border-0">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
              <p className="text-sm leading-relaxed text-ink-muted">{activity}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tasks */}
      {(prepDoc.clientTasks.length > 0 || prepDoc.plannerTasks.length > 0) && (
        <div className="grid grid-cols-2 gap-6">
          {prepDoc.clientTasks.length > 0 && (
            <Card>
              <SectionLabel label="Client Tasks" />
              <div className="space-y-0">
                {prepDoc.clientTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </Card>
          )}

          {prepDoc.plannerTasks.length > 0 && (
            <Card>
              <SectionLabel label="Your Tasks" />
              <div className="space-y-0">
                {prepDoc.plannerTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      {children}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
      {label}
    </h3>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-faint bg-surface-inset px-4 py-3">
      <p className="text-xs text-ink-faint mb-1">{label}</p>
      <p className="text-xl font-semibold text-ink">{value}</p>
    </div>
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
