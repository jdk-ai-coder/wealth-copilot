'use client';

import { useEffect, useState } from 'react';
import { useDemoMode } from '../../hooks/useDemoMode';

function AnimatedCounter({ target, suffix = 'min' }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setDisplay(0);
      return;
    }
    const duration = 600;
    const start = display;
    const diff = target - start;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <span className="tabular-nums font-semibold">
      {display}
      <span className="text-xs font-normal ml-0.5 opacity-70">{suffix}</span>
    </span>
  );
}

export default function TimeComparisonBar() {
  const { isActive, accumulatedManualTime, accumulatedAiTime, showImpact } = useDemoMode();

  if (!isActive || showImpact) return null;

  const timeSaved = accumulatedManualTime - accumulatedAiTime;
  const percentage =
    accumulatedManualTime > 0
      ? Math.round(((accumulatedManualTime - accumulatedAiTime) / accumulatedManualTime) * 100)
      : 0;

  const maxTime = Math.max(accumulatedManualTime, 1);
  const manualBarWidth = (accumulatedManualTime / maxTime) * 100;
  const aiBarWidth = (accumulatedAiTime / maxTime) * 100;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl shadow-black/20">
        {/* Progress bars */}
        <div className="h-1 flex">
          <div
            className="bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700 ease-out"
            style={{ width: `${manualBarWidth}%` }}
          />
          <div className="flex-1" />
        </div>
        <div className="h-1 flex -mt-1">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 ease-out"
            style={{ width: `${aiBarWidth}%` }}
          />
          <div className="flex-1" />
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-8">
          {/* Manual side */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-400 to-orange-500 shadow-lg shadow-red-500/30" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Manual Process
              </div>
              <div className="text-xl text-red-400">
                <AnimatedCounter target={accumulatedManualTime} />
              </div>
            </div>
          </div>

          {/* Center: time saved */}
          <div className="flex-1 text-center">
            {timeSaved > 0 ? (
              <div className="inline-flex items-center gap-2 bg-slate-800/60 rounded-full px-5 py-2 border border-slate-700/40">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="text-sm text-slate-300">
                  Saved{' '}
                  <span className="text-emerald-400 font-bold">
                    <AnimatedCounter target={timeSaved} />
                  </span>
                </span>
                {percentage > 0 && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                    {percentage}% faster
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500">Complete steps to see time savings</div>
            )}
          </div>

          {/* AI side */}
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium text-right">
                With AI Copilot
              </div>
              <div className="text-xl text-emerald-400 text-right">
                <AnimatedCounter target={accumulatedAiTime} />
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
