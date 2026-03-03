'use client';

import { AgendaItem } from '../../lib/types';

export default function AgendaTab({ items }: { items: AgendaItem[] }) {
  return (
    <div className="space-y-0">
      {items.length === 0 ? (
        <p className="py-8 text-sm text-ink-faint">No agenda items for this meeting.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="border-b border-border-faint py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <span className="text-xs text-ink-faint">Done</span>
                ) : (
                  <span className="h-2 w-2 rounded-full border border-border" />
                )}
                <h3 className={`text-sm ${item.completed ? 'text-ink-faint line-through' : 'text-ink'}`}>
                  {item.title}
                </h3>
              </div>
              <span className="text-xs text-ink-faint">{item.duration} min</span>
            </div>
            {item.notes && (
              <p className="mt-1.5 pl-7 text-sm text-ink-muted leading-relaxed">{item.notes}</p>
            )}
          </div>
        ))
      )}

      {items.length > 0 && (
        <div className="flex items-center justify-between pt-4 text-sm text-ink-muted">
          <span>{items.filter((i) => i.completed).length} of {items.length} completed</span>
          <span>Total: {items.reduce((sum, i) => sum + i.duration, 0)} min</span>
        </div>
      )}
    </div>
  );
}
