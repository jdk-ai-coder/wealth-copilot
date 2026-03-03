'use client';

import { useEffect, useState } from 'react';
import { useDemoMode } from '../../hooks/useDemoMode';

function AnimatedNumber({
  target,
  prefix = '',
  suffix = '',
  duration = 1200,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatCard({
  label,
  value,
  prefix,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 text-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-3xl font-bold text-white mb-1">
        {visible ? (
          <AnimatedNumber target={value} prefix={prefix} suffix={suffix} duration={1000} />
        ) : (
          <span className="opacity-0">0</span>
        )}
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export default function ImpactSummary() {
  const { stats, toggleDemo, goToStep } = useDemoMode();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    goToStep(0);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        {/* Confetti-like gradient blobs */}
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-[15%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 right-[10%] w-56 h-56 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Hero section */}
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
              />
            </svg>
            <span className="text-sm font-medium text-emerald-400">Demo Complete</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="text-red-400 line-through opacity-60">{stats.totalManualTime} min</span>
            <span className="mx-3 text-slate-500">&rarr;</span>
            <span className="text-emerald-400">{stats.totalAiTime} min</span>
          </h1>

          <p className="text-lg text-slate-300">
            <span className="text-emerald-400 font-bold">{stats.percentSaved}% time reduction</span>{' '}
            per client meeting workflow
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Weekly Hours Saved" value={stats.weeklyTimeSaved} suffix=" hrs" delay={400} />
          <StatCard label="Annual Hours Saved" value={stats.annualTimeSaved} suffix=" hrs" delay={600} />
          <StatCard label="Additional Clients" value={stats.additionalClients} prefix="+" delay={800} />
          <StatCard label="Revenue Impact" value={450} prefix="$" suffix="K" delay={1000} />
        </div>

        {/* Per Meeting breakdown */}
        <div
          className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 mb-8 transition-all duration-700 delay-500 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-sm uppercase tracking-widest text-slate-400 font-medium mb-4">
            Per Meeting Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-red-400">{stats.totalManualTime} min</div>
              <div className="text-xs text-slate-500 mt-0.5">Manual workflow</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{stats.totalAiTime} min</div>
              <div className="text-xs text-slate-500 mt-0.5">With AI Copilot</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.timeSaved} min</div>
              <div className="text-xs text-slate-500 mt-0.5">Time saved per meeting</div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] w-14 text-slate-500 text-right">Manual</span>
              <div className="flex-1 bg-slate-700/30 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-full" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] w-14 text-slate-500 text-right">AI</span>
              <div className="flex-1 bg-slate-700/30 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round((stats.totalAiTime / stats.totalManualTime) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extrapolation note */}
        <p className="text-center text-xs text-slate-500 mb-8">
          Based on {stats.meetingsPerWeek} client meetings per week &middot; 50 weeks per year
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-lg border border-slate-600/50 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-500/50 transition-all"
          >
            Restart Demo
          </button>
          <button
            onClick={toggleDemo}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-400 transition-all"
          >
            Schedule a Demo
          </button>
        </div>
      </div>
    </div>
  );
}
