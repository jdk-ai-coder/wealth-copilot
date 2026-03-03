import { DemoStep, DemoPhase } from '../lib/types';

export const demoSteps: DemoStep[] = [
  // Phase 1: Meeting Prep (Manual)
  {
    id: 1,
    phase: 1,
    title: 'Review client file manually',
    description: 'Open CRM, review account holdings, recent transactions, and notes from last meeting.',
    route: '/',
    manualTime: 15,
    aiTime: 0,
    highlight: 'dashboard',
  },
  {
    id: 2,
    phase: 1,
    title: 'Check market updates',
    description: 'Review relevant market news and how it affects the Stern portfolio.',
    route: '/',
    manualTime: 10,
    aiTime: 0,
  },
  {
    id: 3,
    phase: 1,
    title: 'Draft meeting agenda',
    description: 'Write agenda items, prepare talking points, and note follow-up items from last quarter.',
    route: '/',
    manualTime: 12,
    aiTime: 0,
  },
  {
    id: 4,
    phase: 1,
    title: 'Calculate portfolio metrics',
    description: 'Pull performance reports, calculate YTD returns, and prepare comparison charts.',
    route: '/',
    manualTime: 8,
    aiTime: 0,
  },

  // Phase 2: Meeting Prep (AI)
  {
    id: 5,
    phase: 2,
    title: 'AI generates complete prep doc',
    description: 'The copilot automatically generates a comprehensive meeting prep document with portfolio analysis, conversation starters, and suggested agenda.',
    route: '/prep/meeting-001',
    manualTime: 0,
    aiTime: 2,
    highlight: 'prep-doc',
    action: 'View the AI-generated prep doc for the Stern meeting',
  },

  // Phase 3: Post-Meeting Follow-up (Manual)
  {
    id: 6,
    phase: 3,
    title: 'Review meeting notes',
    description: 'Go through handwritten notes and recall key discussion points from the Gordon meeting.',
    route: '/',
    manualTime: 10,
    aiTime: 0,
  },
  {
    id: 7,
    phase: 3,
    title: 'Draft follow-up email',
    description: 'Write a personalized follow-up email summarizing decisions and next steps.',
    route: '/',
    manualTime: 15,
    aiTime: 0,
  },
  {
    id: 8,
    phase: 3,
    title: 'Create action items',
    description: 'Enter tasks into CRM, assign to team members, set due dates.',
    route: '/',
    manualTime: 8,
    aiTime: 0,
  },
  {
    id: 9,
    phase: 3,
    title: 'Update client records',
    description: 'Update portfolio notes, risk profile changes, and compliance documentation.',
    route: '/',
    manualTime: 7,
    aiTime: 0,
  },

  // Phase 4: Post-Meeting Follow-up (AI)
  {
    id: 10,
    phase: 4,
    title: 'AI captures meeting details',
    description: 'The copilot automatically transcribes the meeting, generates a summary, and extracts action items.',
    route: '/meetings/meeting-006',
    manualTime: 0,
    aiTime: 1,
    highlight: 'meeting-summary',
    action: 'View the AI-generated meeting summary and tasks for the Gordon meeting',
  },
  {
    id: 11,
    phase: 4,
    title: 'AI drafts follow-up email',
    description: 'Review and approve the AI-drafted follow-up email with meeting summary and next steps.',
    route: '/follow-up',
    manualTime: 0,
    aiTime: 1,
    highlight: 'draft-email',
    action: 'Review the AI-drafted follow-up email',
  },

  // Phase 5: Impact Summary
  {
    id: 12,
    phase: 5,
    title: 'Impact Summary',
    description: 'See the total time savings and productivity gains across the workflow.',
    route: '/',
    manualTime: 0,
    aiTime: 0,
    action: 'View the impact dashboard',
  },
];

export const demoPhases: DemoPhase[] = [
  {
    id: 1,
    title: 'Meeting Prep — Manual Process',
    description: 'Watch how a financial advisor typically prepares for a client meeting without AI assistance.',
    steps: demoSteps.filter((s) => s.phase === 1),
  },
  {
    id: 2,
    title: 'Meeting Prep — With AI Copilot',
    description: 'See how the AI copilot generates a complete meeting prep document in seconds.',
    steps: demoSteps.filter((s) => s.phase === 2),
  },
  {
    id: 3,
    title: 'Post-Meeting Follow-up — Manual Process',
    description: 'The traditional workflow for following up after a client meeting.',
    steps: demoSteps.filter((s) => s.phase === 3),
  },
  {
    id: 4,
    title: 'Post-Meeting Follow-up — With AI Copilot',
    description: 'The copilot automatically handles transcription, summarization, and follow-up drafting.',
    steps: demoSteps.filter((s) => s.phase === 4),
  },
  {
    id: 5,
    title: 'Impact Summary',
    description: 'Total time savings and ROI across the advisory workflow.',
    steps: demoSteps.filter((s) => s.phase === 5),
  },
];

export const demoStats = {
  totalManualTime: 85, // minutes
  totalAiTime: 4, // minutes
  timeSaved: 81, // minutes
  percentSaved: 95,
  meetingsPerWeek: 20,
  weeklyTimeSaved: 27, // hours
  annualTimeSaved: 1350, // hours
  additionalClients: 15, // could serve per year
  revenueImpact: '$450K',
};
