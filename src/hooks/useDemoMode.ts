'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import { demoSteps, demoPhases, demoStats } from '../data/demo-steps';

interface DemoState {
  isActive: boolean;
  currentStepIndex: number;
  accumulatedManualTime: number;
  accumulatedAiTime: number;
  completedSteps: number[];
  showImpact: boolean;
}

interface DemoContextValue extends DemoState {
  toggleDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  currentStep: typeof demoSteps[0] | null;
  currentPhase: typeof demoPhases[0] | null;
  totalSteps: number;
  phases: typeof demoPhases;
  stats: typeof demoStats;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemoMode() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoMode must be used within DemoProvider');
  return ctx;
}

export function useDemoState(): DemoContextValue {
  const [state, setState] = useState<DemoState>({
    isActive: false,
    currentStepIndex: 0,
    accumulatedManualTime: 0,
    accumulatedAiTime: 0,
    completedSteps: [],
    showImpact: false,
  });

  const toggleDemo = useCallback(() => {
    setState((s) => ({
      ...s,
      isActive: !s.isActive,
      currentStepIndex: 0,
      accumulatedManualTime: 0,
      accumulatedAiTime: 0,
      completedSteps: [],
      showImpact: false,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((s) => {
      const step = demoSteps[s.currentStepIndex];
      if (!step) return s;
      const nextIndex = s.currentStepIndex + 1;
      const isLast = nextIndex >= demoSteps.length;
      return {
        ...s,
        currentStepIndex: isLast ? s.currentStepIndex : nextIndex,
        accumulatedManualTime: s.accumulatedManualTime + step.manualTime,
        accumulatedAiTime: s.accumulatedAiTime + step.aiTime,
        completedSteps: [...s.completedSteps, step.id],
        showImpact: isLast,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((s) => {
      if (s.currentStepIndex <= 0) return s;
      const prevIndex = s.currentStepIndex - 1;
      const prevStepData = demoSteps[prevIndex];
      return {
        ...s,
        currentStepIndex: prevIndex,
        accumulatedManualTime: s.accumulatedManualTime - prevStepData.manualTime,
        accumulatedAiTime: s.accumulatedAiTime - prevStepData.aiTime,
        completedSteps: s.completedSteps.filter((id) => id !== prevStepData.id),
        showImpact: false,
      };
    });
  }, []);

  const goToStep = useCallback((index: number) => {
    setState((s) => {
      let manualTime = 0;
      let aiTime = 0;
      const completed: number[] = [];
      for (let i = 0; i < index; i++) {
        manualTime += demoSteps[i].manualTime;
        aiTime += demoSteps[i].aiTime;
        completed.push(demoSteps[i].id);
      }
      return {
        ...s,
        currentStepIndex: index,
        accumulatedManualTime: manualTime,
        accumulatedAiTime: aiTime,
        completedSteps: completed,
        showImpact: false,
      };
    });
  }, []);

  const currentStep = state.isActive ? demoSteps[state.currentStepIndex] ?? null : null;
  const currentPhase = currentStep
    ? demoPhases.find((p) => p.id === currentStep.phase) ?? null
    : null;

  return {
    ...state,
    toggleDemo,
    nextStep,
    prevStep,
    goToStep,
    currentStep,
    currentPhase,
    totalSteps: demoSteps.length,
    phases: demoPhases,
    stats: demoStats,
  };
}

export { DemoContext };
