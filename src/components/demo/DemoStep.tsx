'use client';

import { DemoStep as DemoStepType } from '../../lib/types';

interface DemoStepProps {
  step: DemoStepType;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
}

export default function DemoStep({ step, stepNumber, isActive, isCompleted }: DemoStepProps) {
  return (
    <div
      className={`
        relative rounded-lg border p-3 transition-all duration-300
        ${
          isActive
            ? 'border-blue-500/60 bg-blue-500/10 shadow-md shadow-blue-500/5'
            : isCompleted
              ? 'border-slate-700/40 bg-slate-800/30'
              : 'border-slate-700/20 bg-slate-800/10'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Step number circle */}
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          ) : isActive ? (
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-500/30">
              {stepNumber}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-700/40 border border-slate-600/30 text-slate-500 text-xs font-medium flex items-center justify-center">
              {stepNumber}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium leading-tight ${
              isActive ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {step.title}
          </h4>

          {isActive && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
          )}

          {/* Time indicators */}
          <div className="flex items-center gap-3 mt-1.5">
            {step.manualTime > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-400/80">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {step.manualTime}m manual
              </span>
            )}
            {step.aiTime > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400/80">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                  />
                </svg>
                {step.aiTime}m AI
              </span>
            )}
          </div>

          {/* Action button text */}
          {isActive && step.action && (
            <div className="mt-2 text-[11px] text-blue-400/90 bg-blue-500/10 border border-blue-500/20 rounded-md px-2.5 py-1.5 leading-snug">
              {step.action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
