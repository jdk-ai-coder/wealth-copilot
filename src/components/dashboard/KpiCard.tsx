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
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-stone-900">{value}</p>
        <p className="text-sm font-medium text-stone-500">{label}</p>
        {sublabel && (
          <p className="text-xs text-stone-400">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
