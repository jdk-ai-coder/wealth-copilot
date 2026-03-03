import { clients } from '../data/clients';
import { emails } from '../data/emails';
import { meetings } from '../data/meetings';
import { tasks } from '../data/tasks';
import { outreachSuggestions } from '../data/outreach';

export interface SearchResult {
  type: 'client' | 'email' | 'meeting' | 'task' | 'outreach';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export function globalSearch(query: string): Record<string, SearchResult[]> {
  const q = query.toLowerCase().trim();
  if (!q) return {};

  const results: Record<string, SearchResult[]> = {};

  // Clients
  const clientResults = clients
    .filter((c) => c.name.toLowerCase().includes(q) || c.occupation.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)))
    .slice(0, 3)
    .map((c): SearchResult => ({
      type: 'client',
      id: c.id,
      title: c.name,
      subtitle: c.occupation,
      href: `/clients?highlight=${c.id}`,
    }));
  if (clientResults.length) results['Clients'] = clientResults;

  // Emails
  const emailResults = emails
    .filter((e) => e.subject.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q) || e.preview.toLowerCase().includes(q))
    .slice(0, 3)
    .map((e): SearchResult => ({
      type: 'email',
      id: e.id,
      title: e.subject,
      subtitle: e.clientName,
      href: '/follow-up',
    }));
  if (emailResults.length) results['Emails'] = emailResults;

  // Meetings
  const meetingResults = meetings
    .filter((m) => m.clientName.toLowerCase().includes(q) || m.title.toLowerCase().includes(q))
    .slice(0, 3)
    .map((m): SearchResult => ({
      type: 'meeting',
      id: m.id,
      title: `${m.title} — ${m.clientName}`,
      subtitle: `${m.date} at ${m.time}`,
      href: `/prep/${m.id}`,
    }));
  if (meetingResults.length) results['Meetings'] = meetingResults;

  // Tasks
  const taskResults = tasks
    .filter((t) => t.title.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q))
    .slice(0, 3)
    .map((t): SearchResult => ({
      type: 'task',
      id: t.id,
      title: t.title,
      subtitle: `${t.clientName} · ${t.status}`,
      href: '/',
    }));
  if (taskResults.length) results['Tasks'] = taskResults;

  // Outreach
  const outreachResults = outreachSuggestions
    .filter((o) => o.clientName.toLowerCase().includes(q) || o.trigger.toLowerCase().includes(q) || o.category.toLowerCase().includes(q))
    .slice(0, 3)
    .map((o): SearchResult => ({
      type: 'outreach',
      id: o.id,
      title: o.clientName,
      subtitle: o.trigger.slice(0, 60) + (o.trigger.length > 60 ? '...' : ''),
      href: `/outreach#outreach-${o.id}`,
    }));
  if (outreachResults.length) results['Outreach'] = outreachResults;

  return results;
}
