import { ReactNode } from 'react';

interface KpiCardProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  sublabel?: string;
}

export default function KpiCard({ icon, iconBg, iconColor, value, label, sublabel }: KpiCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface-raised p-5 shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-ink">{value}</p>
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        {sublabel && (
          <p className="text-xs text-ink-faint">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
