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
        <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Suggested Agenda
        </h3>
        <span className="text-xs text-ink-faint">{totalDuration} min total</span>
      </div>

      {/* Agenda items */}
      <div className="space-y-0">
        {items.map((item, index) => (
          <div key={item.id} className="border-b border-border-faint py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-faint w-5 text-right">{index + 1}.</span>
                <h4 className={`text-sm ${item.completed ? 'text-ink-faint line-through' : 'text-ink'}`}>
                  {item.title}
                </h4>
                {item.completed && (
                  <span className="text-xs text-ink-faint">Done</span>
                )}
              </div>
              <span className="text-xs text-ink-faint">{item.duration} min</span>
            </div>

            {item.notes && (
              <p className="mt-1.5 pl-8 text-sm text-ink-muted leading-relaxed">{item.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
