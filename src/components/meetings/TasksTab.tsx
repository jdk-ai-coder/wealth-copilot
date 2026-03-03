'use client';

import { Task } from '../../lib/types';

const assigneeLabel: Record<Task['assignee'], string> = {
  planner: 'Planner Tasks',
  client: 'Client Tasks',
  team: 'Team Tasks',
};

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="border-b border-border-faint py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm text-ink">{task.title}</h4>
          <p className="mt-0.5 text-sm text-ink-muted leading-relaxed">{task.description}</p>
        </div>
        <span className="shrink-0 text-xs text-ink-faint capitalize">{task.status.replace('-', ' ')}</span>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-ink-faint">
        <span className="capitalize">{task.priority}</span>
        <span className="capitalize">{task.assignee}</span>
        <span>{task.category}</span>
        <span className="ml-auto">
          {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

export default function TasksTab({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="py-8 text-sm text-ink-faint">No tasks associated with this meeting.</p>;
  }

  const groups: { key: Task['assignee']; tasks: Task[] }[] = (
    ['planner', 'client', 'team'] as const
  )
    .map((assignee) => ({
      key: assignee,
      tasks: tasks.filter((t) => t.assignee === assignee),
    }))
    .filter((g) => g.tasks.length > 0);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.key}>
          <h3 className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-2">
            {assigneeLabel[group.key]} ({group.tasks.length})
          </h3>
          <div>
            {group.tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
