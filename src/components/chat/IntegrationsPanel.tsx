'use client';

const SOURCES = [
  { id: 'Schwab API', name: 'Schwab Custody API', emoji: '🏦', status: 'green' as const, detail: 'Real-time · 47ms' },
  { id: 'Morningstar', name: 'Morningstar Data', emoji: '📊', status: 'green' as const, detail: 'Daily sync · 2h ago' },
  { id: 'CRM Sync', name: 'CRM (Redtail)', emoji: '🔍', status: 'green' as const, detail: 'Live · last sync 5m' },
  { id: 'Calendar API', name: 'Calendar (Google)', emoji: '📅', status: 'green' as const, detail: 'Connected · 12s ago' },
  { id: 'Tax Lot Engine', name: 'Tax Engine (BNA)', emoji: '📋', status: 'green' as const, detail: 'Ready · 2026 tables' },
  { id: 'Email Scanner', name: 'Email (Outlook)', emoji: '📧', status: 'yellow' as const, detail: 'Syncing · 3 new' },
  { id: 'Compliance', name: 'Compliance (RIA IQ)', emoji: '🛡️', status: 'green' as const, detail: 'Active · all clear' },
] as const;

// Map tool names used in thinking steps to source IDs
const TOOL_TO_SOURCE: Record<string, string> = {
  'Schwab API': 'Schwab API',
  'Morningstar': 'Morningstar',
  'CRM Sync': 'CRM Sync',
  'Calendar API': 'Calendar API',
  'Tax Lot Engine': 'Tax Lot Engine',
  'IRS RegDB': 'Tax Lot Engine',
  'Projection Model': 'Tax Lot Engine',
  'Email Scanner': 'Email Scanner',
  'Analysis Engine': 'Schwab API',
  'Risk Engine': 'Morningstar',
  'Knowledge Base': 'CRM Sync',
  'Response': '',
};

export default function IntegrationsPanel({ activeTool }: { activeTool: string | null }) {
  const activeSourceId = activeTool ? TOOL_TO_SOURCE[activeTool] ?? null : null;
  const greenCount = SOURCES.filter((s) => s.status === 'green').length;
  const total = SOURCES.length;

  return (
    <div className="w-[240px] shrink-0 border-l border-border bg-surface overflow-y-auto">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold text-ink uppercase tracking-wider">Connected Sources</h2>
      </div>
      <div className="px-3 py-2 space-y-1">
        {SOURCES.map((source) => {
          const isActive = activeSourceId === source.id;
          return (
            <div
              key={source.id}
              className={`rounded-lg px-3 py-2.5 transition-all duration-300 ${
                isActive ? 'bg-blue-50/80 ring-1 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  {source.status === 'green' && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      source.status === 'green'
                        ? 'bg-emerald-500'
                        : source.status === 'yellow'
                          ? 'bg-amber-400'
                          : 'bg-red-500'
                    }`}
                  />
                </span>
                <span className="text-xs font-medium text-ink truncate">{source.name}</span>
              </div>
              <p className="mt-0.5 ml-4 text-[11px] text-ink-faint">{source.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-3 border-t border-border mt-1">
        <p className="text-[11px] text-ink-faint">
          {total} sources · {greenCount === total ? 'All healthy' : `${greenCount} healthy`}
        </p>
      </div>
    </div>
  );
}
