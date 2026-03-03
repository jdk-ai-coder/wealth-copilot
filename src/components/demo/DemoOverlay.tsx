'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoMode } from '../../hooks/useDemoMode';
import DemoStepCard from './DemoStep';
import TimeComparisonBar from './TimeComparisonBar';
import ImpactSummary from './ImpactSummary';

export default function DemoOverlay() {
  const router = useRouter();
  const {
    isActive,
    currentStepIndex,
    completedSteps,
    showImpact,
    toggleDemo,
    nextStep,
    prevStep,
    currentStep,
    currentPhase,
    totalSteps,
    phases,
  } = useDemoMode();

  // Navigate to the current step's route when it changes
  useEffect(() => {
    if (isActive && currentStep?.route) {
      router.push(currentStep.route);
    }
  }, [isActive, currentStep?.route, router, currentStep]);

  if (!isActive) return null;

  // Show impact summary as full-screen overlay
  if (showImpact) {
    return <ImpactSummary />;
  }

  // Calculate global step number for the current step within all phases
  let globalStepNumber = 0;
  let foundCurrent = false;
  const allStepsFlat: { phaseId: number; stepId: number; globalIndex: number }[] = [];
  for (const phase of phases) {
    for (const step of phase.steps) {
      allStepsFlat.push({ phaseId: phase.id, stepId: step.id, globalIndex: globalStepNumber });
      if (!foundCurrent && step.id === currentStep?.id) {
        foundCurrent = true;
      }
      globalStepNumber++;
    }
  }

  // Phase progress: which phase index are we in
  const currentPhaseIndex = currentPhase ? phases.findIndex((p) => p.id === currentPhase.id) : 0;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={toggleDemo}
      />

      {/* Right side panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-[380px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl shadow-black/40 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white leading-tight">Guided Demo</h2>
              <p className="text-[10px] text-slate-400">
                Step {currentStepIndex + 1} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={toggleDemo}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Phase progress indicator */}
        <div className="px-5 py-3 border-b border-slate-700/30">
          <div className="flex items-center gap-1.5 mb-2.5">
            {phases.map((phase, i) => (
              <div key={phase.id} className="flex-1 flex items-center gap-1.5">
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i < currentPhaseIndex
                      ? 'bg-emerald-500'
                      : i === currentPhaseIndex
                        ? 'bg-blue-500'
                        : 'bg-slate-700/50'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Current phase info */}
        {currentPhase && (
          <div className="px-5 py-3 border-b border-slate-700/30">
            <h3 className="text-xs font-semibold text-white mb-1">{currentPhase.title}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">{currentPhase.description}</p>
          </div>
        )}

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {currentPhase?.steps.map((step, i) => {
            // Find the global step number
            const globalEntry = allStepsFlat.find((e) => e.stepId === step.id);
            const stepNumber = globalEntry ? globalEntry.globalIndex + 1 : i + 1;

            return (
              <DemoStepCard
                key={step.id}
                step={step}
                stepNumber={stepNumber}
                isActive={step.id === currentStep?.id}
                isCompleted={completedSteps.includes(step.id)}
              />
            );
          })}
        </div>

        {/* Navigation */}
        <div className="px-5 py-4 border-t border-slate-700/40 bg-slate-900/80">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={prevStep}
              disabled={currentStepIndex <= 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 border border-slate-600/40 hover:bg-slate-800 hover:border-slate-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Previous
            </button>

            <span className="text-[11px] text-slate-500 tabular-nums">
              {currentStepIndex + 1} / {totalSteps}
            </span>

            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400 transition-all"
            >
              {currentStepIndex >= totalSteps - 1 ? 'Finish' : 'Next Step'}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Time comparison bar at the bottom */}
      <TimeComparisonBar />

      {/* Animation keyframes via inline style */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
