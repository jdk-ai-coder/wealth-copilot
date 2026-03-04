'use client';

import { AgendaItem } from '../../lib/types';

interface AgendaTabProps {
  items: AgendaItem[];
}

export default function AgendaTab({ items }: AgendaTabProps) {
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          Suggested Agenda
        </h3>
        <span className="text-xs text-ink-faint">{totalDuration} min total</span>
      </div>

      {/* Agenda items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-inset border border-border-faint text-xs font-medium text-ink-faint">
                  {index + 1}
                </span>
                <h4 className={`text-sm font-medium ${item.completed ? 'text-ink-faint line-through' : 'text-ink'}`}>
                  {item.title}
                </h4>
                {item.completed && (
                  <span className="text-xs text-ink-faint">Done</span>
                )}
              </div>
              <span className="rounded-full bg-surface-inset border border-border-faint px-2.5 py-0.5 text-xs text-ink-faint">{item.duration} min</span>
            </div>

            {item.notes && (
              <p className="mt-2 pl-9 text-sm text-ink-muted leading-relaxed">{item.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
