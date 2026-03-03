'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { outreachSuggestions } from '../../data/outreach';
import { OutreachSuggestion } from '../../lib/types';
import { useToast } from '../../hooks/useToast';
import { timeAgo } from '../../lib/utils';

type FilterKey = 'all' | 'Market & Portfolio' | 'Life Events' | 'Account Activity' | 'Relationship' | 'Planning Milestones';
type DismissReason = 'Already handled' | 'Not relevant' | 'Client preference' | 'Other';
type WizardStep = 1 | 2 | 3;
type CompletionMethod = 'Sent email' | 'Phone call' | 'In-person meeting' | 'Resolved itself' | 'Other';
type Outcome = 'Client engaged' | 'Left voicemail' | 'No response needed' | 'Needs follow-up';
type Sentiment = 'Positive' | 'Neutral' | 'Concerned';
type EmailTone = 'professional' | 'friendly' | 'empathetic' | 'urgent';
type EmailLength = 'brief' | 'standard' | 'detailed';
type OnboardingStep = 1 | 2 | 3 | 4 | 5;

function priorityOrder(p: string): number {
  switch (p) {
    case 'urgent': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    default: return 4;
  }
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    urgent: 'bg-red-50 text-red-600 border border-red-200',
    high: 'bg-surface-inset text-ink border border-border',
    medium: 'bg-surface-inset text-ink-muted border border-border-faint',
    low: 'bg-surface-inset text-ink-faint border border-border-faint',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${styles[priority] || styles.low}`}>
      {priority}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="rounded-full bg-surface-inset px-2.5 py-0.5 text-[11px] font-medium text-ink-muted whitespace-nowrap">
      {category}
    </span>
  );
}

// ── Email generation helpers ────────────────────────────────────────

function generateEmail(item: OutreachSuggestion, tone: EmailTone, length: EmailLength): string {
  const name = item.clientName;
  const trigger = item.trigger;
  const action = item.suggestedAction;

  const greetings: Record<EmailTone, string> = {
    professional: `Dear ${name},`,
    friendly: `Hi ${name}!`,
    empathetic: `Hi ${name},`,
    urgent: `${name} —`,
  };

  const closings: Record<EmailTone, string> = {
    professional: `Best regards,\nSarah Mitchell, CFP\u00ae\nVantage Wealth Partners`,
    friendly: `Talk soon!\n\nSarah`,
    empathetic: `I\u2019m here whenever you\u2019re ready to talk.\n\nWarmly,\nSarah`,
    urgent: `Please let me know as soon as possible so we can act quickly.\n\nSarah Mitchell, CFP\u00ae\nVantage Wealth Partners`,
  };

  if (item.draftBody && tone === (item.draftTone || 'professional') && length === 'standard') {
    return item.draftBody;
  }

  if (length === 'brief') {
    const bodies: Record<EmailTone, string> = {
      professional: `${greetings.professional}\n\nI wanted to flag something for your review: ${trigger.toLowerCase().replace(/\.$/, '')}.\n\nCould we schedule a brief call this week to discuss next steps?\n\n${closings.professional}`,
      friendly: `${greetings.friendly}\n\nQuick heads up \u2014 ${trigger.toLowerCase().replace(/\.$/, '')}. Want to hop on a call to chat about it?\n\n${closings.friendly}`,
      empathetic: `${greetings.empathetic}\n\nI\u2019ve been thinking about your situation and noticed ${trigger.toLowerCase().replace(/\.$/, '')}. I want to make sure we\u2019re looking out for you. Let me know if you\u2019d like to talk.\n\n${closings.empathetic}`,
      urgent: `${greetings.urgent}\n\nThis needs your attention: ${trigger} We should discuss this as soon as possible.\n\n${closings.urgent}`,
    };
    return bodies[tone];
  }

  if (length === 'detailed') {
    const bodies: Record<EmailTone, string> = {
      professional: `${greetings.professional}\n\nI\u2019m reaching out regarding an important development I\u2019ve identified in my ongoing review of your financial situation.\n\nSpecifically, ${trigger.toLowerCase().replace(/\.$/, '')}.\n\nHere\u2019s why this matters:\n${item.whyExplanation}\n\nMy recommendation:\n${action}\n\nAdditional context:\n${item.context.map(c => `\u2022 ${c.label}: ${c.value}`).join('\n')}\n\nI\u2019d like to schedule a meeting at your earliest convenience to walk through our options in detail. Would any time this week or next work for you?\n\n${closings.professional}`,
      friendly: `${greetings.friendly}\n\nHope you\u2019re doing well! I was going through your accounts and noticed something I wanted to share with you.\n\n${trigger}\n\nHere\u2019s the backstory \u2014 ${item.whyExplanation.toLowerCase()}\n\nWhat I\u2019d suggest we do:\n${action}\n\nA few numbers for context:\n${item.context.map(c => `\u2022 ${c.label}: ${c.value}`).join('\n')}\n\nNo rush, but I\u2019d love to chat about this when you have a chance. Coffee meeting? \u2615\n\n${closings.friendly}`,
      empathetic: `${greetings.empathetic}\n\nI hope this message finds you well. I\u2019ve been giving careful thought to your financial picture, and I wanted to bring something to your attention \u2014 not to cause any worry, but because I believe in being proactive about your financial wellbeing.\n\n${trigger}\n\nI understand this may feel like a lot to process. Here\u2019s some context that may help:\n${item.whyExplanation}\n\nWhat I\u2019d recommend, whenever you\u2019re ready:\n${action}\n\nFor reference:\n${item.context.map(c => `\u2022 ${c.label}: ${c.value}`).join('\n')}\n\nThere\u2019s no pressure to act immediately. I\u2019m here to help at whatever pace feels right for you.\n\n${closings.empathetic}`,
      urgent: `${greetings.urgent}\n\nI need to bring something time-sensitive to your attention.\n\n${trigger}\n\nWhy this is urgent:\n${item.whyExplanation}\n\nRecommended immediate action:\n${action}\n\nKey figures:\n${item.context.map(c => `\u2022 ${c.label}: ${c.value}`).join('\n')}\n\nI\u2019ve blocked time on my calendar this week specifically for this. Can we connect today or tomorrow?\n\n${closings.urgent}`,
    };
    return bodies[tone];
  }

  // Standard length
  const bodies: Record<EmailTone, string> = {
    professional: `${greetings.professional}\n\nI wanted to reach out regarding a matter that warrants your attention: ${trigger.toLowerCase().replace(/\.$/, '')}.\n\n${item.whyExplanation}\n\nMy recommendation: ${action.toLowerCase()}\n\nWould you be available for a call this week to discuss?\n\n${closings.professional}`,
    friendly: `${greetings.friendly}\n\nHope you\u2019re having a great week! I noticed something in your portfolio I wanted to flag \u2014 ${trigger.toLowerCase().replace(/\.$/, '')}.\n\n${item.whyExplanation}\n\nI think the best move would be to ${action.toLowerCase()} What do you think? Happy to jump on a quick call whenever works for you.\n\n${closings.friendly}`,
    empathetic: `${greetings.empathetic}\n\nI hope you\u2019re doing well. I wanted to reach out because I\u2019ve been reviewing your situation and noticed something worth discussing: ${trigger.toLowerCase().replace(/\.$/, '')}.\n\n${item.whyExplanation}\n\nWhen you\u2019re ready, I\u2019d suggest we ${action.toLowerCase()} No rush at all \u2014 just want to make sure we\u2019re looking out for you.\n\n${closings.empathetic}`,
    urgent: `${greetings.urgent}\n\nThis requires prompt attention: ${trigger}\n\n${item.whyExplanation}\n\nI strongly recommend we ${action.toLowerCase()} Can we connect today or tomorrow?\n\n${closings.urgent}`,
  };
  return bodies[tone];
}

// ── Completion Wizard ───────────────────────────────────────────────

function CompletionWizard({ item, onClose, onConfirm }: {
  item: OutreachSuggestion;
  onClose: () => void;
  onConfirm: (data: { method: CompletionMethod; notes: string; outcome: Outcome; sentiment: Sentiment; followUpDate: string }) => void;
}) {
  const [step, setStep] = useState<WizardStep>(1);
  const [method, setMethod] = useState<CompletionMethod>('Phone call');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<Outcome>('Client engaged');
  const [sentiment, setSentiment] = useState<Sentiment>('Positive');
  const [followUpDate, setFollowUpDate] = useState('');

  const methods: CompletionMethod[] = ['Sent email', 'Phone call', 'In-person meeting', 'Resolved itself', 'Other'];
  const outcomes: Outcome[] = ['Client engaged', 'Left voicemail', 'No response needed', 'Needs follow-up'];
  const sentiments: Sentiment[] = ['Positive', 'Neutral', 'Concerned'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-3">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-ink' : 'bg-surface-inset'}`} />
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div>
            <h3 className="text-base font-semibold text-ink">Mark Complete</h3>
            <p className="text-xs text-ink-faint">{item.clientName} &middot; Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors p-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        <div className="px-6 py-4 min-h-[220px]">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-ink">How was this completed?</p>
              <div className="space-y-2">
                {methods.map(m => (
                  <label key={m} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${method === m ? 'border-ink' : 'border-border group-hover:border-ink-faint'}`}>
                      {method === m && <div className="h-2 w-2 rounded-full bg-ink" />}
                    </div>
                    <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{m}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-ink-faint">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any additional context..."
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-ink transition-colors resize-none h-20"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-sm font-medium text-ink">Outcome</p>
                <div className="mt-2 space-y-2">
                  {outcomes.map(o => (
                    <label key={o} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${outcome === o ? 'border-ink' : 'border-border group-hover:border-ink-faint'}`}>
                        {outcome === o && <div className="h-2 w-2 rounded-full bg-ink" />}
                      </div>
                      <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{o}</span>
                    </label>
                  ))}
                </div>
              </div>

              {outcome === 'Needs follow-up' && (
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-ink-faint">Follow-up date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink transition-colors"
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-ink">Client Sentiment</p>
                <div className="mt-2 flex gap-2">
                  {sentiments.map(s => (
                    <button
                      key={s}
                      onClick={() => setSentiment(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        sentiment === s
                          ? s === 'Positive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s === 'Concerned' ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-surface-inset text-ink border border-border'
                          : 'border border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm font-medium text-ink">Review &amp; Confirm</p>
              <div className="rounded-lg border border-border bg-surface-inset/30 px-4 py-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Client</span>
                  <span className="font-medium text-ink">{item.clientName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Method</span>
                  <span className="font-medium text-ink">{method}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Outcome</span>
                  <span className="font-medium text-ink">{outcome}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Sentiment</span>
                  <span className={`font-medium ${sentiment === 'Positive' ? 'text-emerald-600' : sentiment === 'Concerned' ? 'text-red-600' : 'text-ink'}`}>{sentiment}</span>
                </div>
                {followUpDate && (
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-faint">Follow-up</span>
                    <span className="font-medium text-ink">{new Date(followUpDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {notes && (
                  <div className="border-t border-border-faint pt-2 mt-2">
                    <p className="text-[11px] text-ink-faint">Notes</p>
                    <p className="text-xs text-ink mt-0.5">{notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            onClick={() => step === 1 ? onClose() : setStep((step - 1) as WizardStep)}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as WizardStep)}
              className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => onConfirm({ method, notes, outcome, sentiment, followUpDate })}
              className="rounded-full bg-accent-green px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
            >
              Confirm Completion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Onboarding Wizard ───────────────────────────────────────────────

interface OnboardingData {
  accountType: string;
  registrationType: string;
  fundingMethod: string;
  fundingAmount: string;
  investmentObjective: string;
  riskTolerance: string;
  timeHorizon: string;
  docsCollected: string[];
  advisorNotes: string;
}

function OnboardingWizard({ clientName, onClose, onConfirm }: {
  clientName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>({
    accountType: 'Individual Brokerage',
    registrationType: 'Individual',
    fundingMethod: 'ACAT Transfer',
    fundingAmount: '',
    investmentObjective: 'Growth & Income',
    riskTolerance: 'Moderate',
    timeHorizon: '10+ years',
    docsCollected: [],
    advisorNotes: '',
  });

  const accountTypes = ['Individual Brokerage', 'Joint Brokerage', 'Traditional IRA', 'Roth IRA', 'SEP IRA', 'Trust Account', '529 Education Plan', 'Custodial (UTMA)'];
  const registrationTypes = ['Individual', 'Joint WROS', 'Joint TIC', 'Community Property', 'Revocable Trust', 'Irrevocable Trust'];
  const fundingMethods = ['ACAT Transfer', 'Wire Transfer', 'Check Deposit', 'ACH Transfer', 'In-Kind Transfer', 'Rollover (401k/IRA)'];
  const objectives = ['Capital Preservation', 'Income', 'Growth & Income', 'Growth', 'Aggressive Growth', 'Speculation'];
  const riskLevels = ['Conservative', 'Moderately Conservative', 'Moderate', 'Moderately Aggressive', 'Aggressive'];
  const horizons = ['< 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
  const requiredDocs = [
    'Government-issued photo ID',
    'Social Security card or W-9',
    'Proof of address (utility bill/bank statement)',
    'Most recent account statement (for transfers)',
    'Trust documents (if applicable)',
    'Corporate resolution (if applicable)',
    'Signed advisory agreement',
    'Investment Policy Statement (IPS)',
  ];

  function toggleDoc(doc: string) {
    setData(prev => ({
      ...prev,
      docsCollected: prev.docsCollected.includes(doc)
        ? prev.docsCollected.filter(d => d !== doc)
        : [...prev.docsCollected, doc],
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-xl max-h-[85vh] rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-3">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-ink' : 'bg-surface-inset'}`} />
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-ink">Account Opening</h3>
            <p className="text-xs text-ink-faint">{clientName} &middot; Step {step} of 5</p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors p-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-ink">Account Type &amp; Registration</p>
              <div>
                <label className="text-xs font-medium text-ink-faint">Account Type</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {accountTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setData(d => ({ ...d, accountType: t }))}
                      className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                        data.accountType === t
                          ? 'border-ink bg-surface-inset text-ink font-medium'
                          : 'border-border text-ink-muted hover:border-ink-faint hover:text-ink'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-faint">Registration Type</label>
                <select
                  value={data.registrationType}
                  onChange={e => setData(d => ({ ...d, registrationType: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink transition-colors"
                >
                  {registrationTypes.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-ink">Funding Details</p>
              <div>
                <label className="text-xs font-medium text-ink-faint">Funding Method</label>
                <div className="mt-2 space-y-2">
                  {fundingMethods.map(m => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${data.fundingMethod === m ? 'border-ink' : 'border-border group-hover:border-ink-faint'}`}>
                        {data.fundingMethod === m && <div className="h-2 w-2 rounded-full bg-ink" />}
                      </div>
                      <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-faint">Estimated Funding Amount</label>
                <input
                  type="text"
                  value={data.fundingAmount}
                  onChange={e => setData(d => ({ ...d, fundingAmount: e.target.value }))}
                  placeholder="$250,000"
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-ink">Investment Profile</p>
              <div>
                <label className="text-xs font-medium text-ink-faint">Investment Objective</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {objectives.map(o => (
                    <button
                      key={o}
                      onClick={() => setData(d => ({ ...d, investmentObjective: o }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        data.investmentObjective === o
                          ? 'bg-ink text-white'
                          : 'border border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-faint">Risk Tolerance</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {riskLevels.map(r => (
                    <button
                      key={r}
                      onClick={() => setData(d => ({ ...d, riskTolerance: r }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        data.riskTolerance === r
                          ? 'bg-ink text-white'
                          : 'border border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-faint">Time Horizon</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {horizons.map(h => (
                    <button
                      key={h}
                      onClick={() => setData(d => ({ ...d, timeHorizon: h }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        data.timeHorizon === h
                          ? 'bg-ink text-white'
                          : 'border border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-ink">Document Checklist</p>
              <p className="text-xs text-ink-faint">Check off documents as they are received.</p>
              <div className="space-y-2">
                {requiredDocs.map(doc => (
                  <label key={doc} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                      data.docsCollected.includes(doc) ? 'bg-ink border-ink' : 'border-border group-hover:border-ink-faint'
                    }`}>
                      {data.docsCollected.includes(doc) && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${data.docsCollected.includes(doc) ? 'text-ink line-through' : 'text-ink-muted group-hover:text-ink'}`}>{doc}</span>
                  </label>
                ))}
              </div>
              <div className="pt-1">
                <p className="text-[11px] text-ink-faint">{data.docsCollected.length} of {requiredDocs.length} collected</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm font-medium text-ink">Review &amp; Submit</p>
              <div className="rounded-lg border border-border bg-surface-inset/30 px-4 py-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Client</span>
                  <span className="font-medium text-ink">{clientName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Account Type</span>
                  <span className="font-medium text-ink">{data.accountType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Registration</span>
                  <span className="font-medium text-ink">{data.registrationType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Funding</span>
                  <span className="font-medium text-ink">{data.fundingMethod}{data.fundingAmount ? ` \u2014 ${data.fundingAmount}` : ''}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Objective</span>
                  <span className="font-medium text-ink">{data.investmentObjective}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Risk</span>
                  <span className="font-medium text-ink">{data.riskTolerance}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Time Horizon</span>
                  <span className="font-medium text-ink">{data.timeHorizon}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-faint">Documents</span>
                  <span className="font-medium text-ink">{data.docsCollected.length} / {requiredDocs.length} collected</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-faint">Advisor Notes</label>
                <textarea
                  value={data.advisorNotes}
                  onChange={e => setData(d => ({ ...d, advisorNotes: e.target.value }))}
                  placeholder="Any special instructions for operations team..."
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-ink transition-colors resize-none h-16"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 shrink-0">
          <button
            onClick={() => step === 1 ? onClose() : setStep((step - 1) as OnboardingStep)}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep((step + 1) as OnboardingStep)}
              className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onConfirm}
              className="rounded-full bg-accent-green px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
            >
              Submit to Operations
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export default function OutreachPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [items, setItems] = useState<OutreachSuggestion[]>(outreachSuggestions);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showDismissDropdown, setShowDismissDropdown] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Draft email modal state
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftItem, setDraftItem] = useState<OutreachSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [emailTone, setEmailTone] = useState<EmailTone>('professional');
  const [emailLength, setEmailLength] = useState<EmailLength>('standard');

  // Completion wizard state
  const [wizardItem, setWizardItem] = useState<OutreachSuggestion | null>(null);

  // Onboarding wizard state
  const [onboardingClient, setOnboardingClient] = useState<string | null>(null);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (onboardingClient) { setOnboardingClient(null); return; }
      if (wizardItem) { setWizardItem(null); return; }
      if (showDraftModal) { setShowDraftModal(false); return; }
      if (showDismissDropdown) { setShowDismissDropdown(null); return; }
    }
  }, [showDraftModal, showDismissDropdown, wizardItem, onboardingClient]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const pendingItems = items
    .filter((i) => i.status === 'pending')
    .filter((i) => filter === 'all' || i.category === filter)
    .sort((a, b) => {
      const pDiff = priorityOrder(a.priority) - priorityOrder(b.priority);
      if (pDiff !== 0) return pDiff;
      return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
    });

  const completedItems = items.filter((i) => i.status === 'completed');
  const allPending = items.filter((i) => i.status === 'pending');
  const urgentCount = allPending.filter((i) => i.priority === 'urgent').length;

  const categoryFilters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'Market & Portfolio', label: 'Market & Portfolio' },
    { key: 'Life Events', label: 'Life Events' },
    { key: 'Account Activity', label: 'Account Activity' },
    { key: 'Relationship', label: 'Relationship' },
    { key: 'Planning Milestones', label: 'Planning Milestones' },
  ];

  function getCategoryCount(key: FilterKey): number {
    if (key === 'all') return allPending.length;
    return allPending.filter((i) => i.category === key).length;
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDismiss(id: string, reason?: DismissReason) {
    const prev = items.find((i) => i.id === id);
    setItems((items) => items.map((i) => i.id === id ? { ...i, status: 'dismissed' as const } : i));
    setShowDismissDropdown(null);
    showToast(`Dismissed${reason ? `: ${reason}` : ''}`, () => {
      if (prev) setItems((items) => items.map((i) => i.id === id ? { ...i, status: prev.status } : i));
    });
  }

  function handleSnooze(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'snoozed' as const, snoozedUntil: '2026-03-09' } : i));
    showToast('Snoozed for 1 week');
  }

  function handleCompleteWizard(id: string, data: { method: CompletionMethod; notes: string; outcome: Outcome; sentiment: Sentiment; followUpDate: string }) {
    setItems((prev) => prev.map((i) => i.id === id ? {
      ...i,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      completionMethod: data.method,
    } : i));
    setWizardItem(null);
    showToast('Marked as complete');
  }

  function handleDraftEmail(item: OutreachSuggestion) {
    setDraftItem(item);
    setIsGenerating(true);
    setIsEditing(false);
    setIsEdited(false);
    setEmailTone(item.draftTone === 'warm' ? 'friendly' : (item.draftTone as EmailTone) || 'professional');
    setEmailLength('standard');
    setTimeout(() => {
      setIsGenerating(false);
      setShowDraftModal(true);
    }, 1500);
  }

  function handleSendDraft() {
    if (!draftItem) return;
    const body = isEdited ? editedText : generateEmail(draftItem, emailTone, emailLength);
    const subject = draftItem.draftSubject || `Following up \u2014 ${draftItem.clientName}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    setItems((prev) => prev.map((i) => i.id === draftItem.id ? {
      ...i,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      completionMethod: 'Email sent',
    } : i));
    setShowDraftModal(false);
    setDraftItem(null);
    showToast('Opening in Outlook...');
  }

  function handleToneChange(tone: EmailTone) {
    setEmailTone(tone);
    setIsEdited(false);
    setEditedText('');
  }

  function handleLengthChange(len: EmailLength) {
    setEmailLength(len);
    setIsEdited(false);
    setEditedText('');
  }

  const currentDraftText = draftItem
    ? (isEdited ? editedText : generateEmail(draftItem, emailTone, emailLength))
    : '';

  const stats = [
    { value: String(allPending.length), label: 'Suggested', accent: 'border-l-accent-blue' },
    { value: String(urgentCount), label: 'Urgent', accent: 'border-l-accent-blue' },
    { value: String(completedItems.length), label: 'Completed This Week', accent: 'border-l-accent-blue' },
  ];

  const toneOptions: { value: EmailTone; label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'empathetic', label: 'Empathetic' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const lengthOptions: { value: EmailLength; label: string }[] = [
    { value: 'brief', label: 'Brief' },
    { value: 'standard', label: 'Standard' },
    { value: 'detailed', label: 'Detailed' },
  ];

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-ink">Proactive Outreach</h1>
      <p className="mt-1 text-sm text-ink-muted">AI-suggested reasons to reach out before your clients reach out to you</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border border-border border-l-[3px] px-4 py-4 ${stat.accent}`}
          >
            <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex gap-0.5 border-b border-border overflow-x-auto">
        {categoryFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3 pb-2.5 text-xs transition-colors ${
              filter === f.key
                ? 'border-b-2 border-ink font-medium text-ink'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {f.label}
            <span className="ml-1 text-ink-faint">{getCategoryCount(f.key)}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6">
        {pendingItems.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-raised px-8 py-12 text-center">
            <p className="text-sm text-ink-faint">No outreach suggestions match this filter.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface-raised overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  <th className="py-2 pl-3 pr-1 w-8"></th>
                  <th className="py-2 pr-3">Client</th>
                  <th className="py-2 pr-3">Priority</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Trigger</th>
                  <th className="py-2 pr-3">Context</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingItems.map((item) => {
                  const isExpanded = expandedIds.has(item.id);
                  return (
                    <Fragment key={item.id}>
                      <tr className="border-b border-border-faint last:border-0 transition-colors hover:bg-surface-inset/30">
                        {/* Expand chevron */}
                        <td className="py-2 pl-3 pr-1">
                          <button onClick={() => toggleExpand(item.id)} className="text-ink-faint hover:text-ink transition-colors p-0.5">
                            <svg className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                        </td>

                        {/* Client */}
                        <td className="py-2 pr-3">
                          <button
                            onClick={() => router.push(`/clients?highlight=${item.clientId}`)}
                            className="font-medium text-ink hover:text-accent-blue transition-colors text-left whitespace-nowrap"
                          >
                            {item.clientName}
                          </button>
                          <p className="text-[11px] text-ink-faint">{timeAgo(item.detectedAt)}</p>
                        </td>

                        {/* Priority */}
                        <td className="py-2 pr-3">
                          <PriorityBadge priority={item.priority} />
                        </td>

                        {/* Category */}
                        <td className="py-2 pr-3">
                          <CategoryBadge category={item.category} />
                        </td>

                        {/* Trigger */}
                        <td className="py-2 pr-3 max-w-[240px]">
                          <p className="text-xs text-ink-muted truncate" title={item.trigger}>{item.trigger}</p>
                        </td>

                        {/* Context */}
                        <td className="py-2 pr-3">
                          <div className="space-y-0.5">
                            {item.context.slice(0, 2).map((c) => (
                              <p key={c.label} className="text-[11px] text-ink-faint whitespace-nowrap">
                                <span>{c.label}:</span> <span className="font-medium text-ink-muted">{c.value}</span>
                              </p>
                            ))}
                            {item.context.length > 2 && (
                              <p className="text-[10px] text-ink-faint">+{item.context.length - 2} more</p>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-2 pr-4">
                          <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                            {/* Draft Email */}
                            <button
                              onClick={() => handleDraftEmail(item)}
                              title="Draft Email"
                              className="rounded-md p-1.5 text-ink-faint hover:text-ink hover:bg-surface-inset transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                              </svg>
                            </button>

                            {/* Mark Complete */}
                            <button
                              onClick={() => setWizardItem(item)}
                              title="Mark Complete"
                              className="rounded-md p-1.5 text-ink-faint hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>

                            {/* Open Account */}
                            <button
                              onClick={() => setOnboardingClient(item.clientName)}
                              title="Open Account"
                              className="rounded-md p-1.5 text-ink-faint hover:text-accent-blue hover:bg-blue-50 transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </button>

                            {/* Snooze */}
                            <button
                              onClick={() => handleSnooze(item.id)}
                              title="Snooze 1 Week"
                              className="rounded-md p-1.5 text-ink-faint hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>

                            {/* Dismiss */}
                            <div className="relative">
                              <button
                                onClick={() => setShowDismissDropdown(showDismissDropdown === item.id ? null : item.id)}
                                title="Dismiss"
                                className="rounded-md p-1.5 text-ink-faint hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              {showDismissDropdown === item.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowDismissDropdown(null)} />
                                  <div className="absolute right-0 bottom-full z-50 mb-1 w-44 rounded-lg border border-border bg-surface-raised py-1 shadow-lg">
                                    {(['Already handled', 'Not relevant', 'Client preference', 'Other'] as DismissReason[]).map((reason) => (
                                      <button
                                        key={reason}
                                        onClick={() => handleDismiss(item.id, reason)}
                                        className="w-full px-3 py-1.5 text-left text-xs text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                                      >
                                        {reason}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr className="border-b border-border-faint bg-surface-inset/20">
                          <td colSpan={7} className="px-5 py-4">
                            <div className="grid grid-cols-2 gap-6 animate-fade-in">
                              <div className="space-y-3">
                                {/* Full trigger */}
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Trigger</p>
                                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.trigger}</p>
                                </div>

                                {/* Why explanation */}
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Why This Suggestion?</p>
                                  <p className="mt-1 text-sm leading-relaxed text-ink-faint">{item.whyExplanation}</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {/* Suggested action */}
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Recommended Action</p>
                                  <div className="mt-1 flex items-start gap-2 rounded-md bg-surface-inset/60 px-3 py-2">
                                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                    </svg>
                                    <p className="text-xs text-ink-muted">{item.suggestedAction}</p>
                                  </div>
                                </div>

                                {/* All context values */}
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Context</p>
                                  <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                                    {item.context.map((c) => (
                                      <div key={c.label} className="flex items-center gap-1.5 text-xs">
                                        <span className="text-ink-faint">{c.label}:</span>
                                        <span className="font-medium text-ink">{c.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {item.resurfaced && (
                                  <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Snoozed \u2014 resurfaced</span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed section */}
      {completedItems.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <svg className={`h-3.5 w-3.5 transition-transform ${showCompleted ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Completed (Last 30 Days)
            <span className="text-ink-faint font-normal">{completedItems.length}</span>
          </button>

          {showCompleted && (
            <div className="mt-3 rounded-lg border border-border bg-surface-raised overflow-hidden animate-fade-in">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    <th className="py-2 pl-4 pr-6">Client</th>
                    <th className="py-2 pr-6">Trigger</th>
                    <th className="py-2 pr-6">Completed</th>
                    <th className="py-2 pr-4">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {completedItems.map((item) => (
                    <tr key={item.id} className="border-b border-border-faint last:border-0">
                      <td className="py-2.5 pl-4 pr-6 font-medium text-ink">{item.clientName}</td>
                      <td className="max-w-xs truncate py-2.5 pr-6 text-ink-muted">{item.trigger}</td>
                      <td className="py-2.5 pr-6 text-ink-faint whitespace-nowrap">
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}
                      </td>
                      <td className="py-2.5 pr-4 text-ink-faint">{item.completionMethod || '\u2014'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Generating overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/60">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-5 py-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:0ms]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:150ms]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:300ms]" />
            </div>
            <p className="text-sm text-ink-muted">Generating outreach email...</p>
          </div>
        </div>
      )}

      {/* Draft Email Modal */}
      {showDraftModal && draftItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowDraftModal(false)} />
          <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
            {/* Modal header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">AI-Generated Outreach Email</h3>
                </div>
                <p className="mt-0.5 text-xs text-ink-faint">
                  To {draftItem.clientName} &middot; {draftItem.category}
                </p>
              </div>
              <button onClick={() => setShowDraftModal(false)} className="text-ink-muted hover:text-ink transition-colors p-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tone & Length controls */}
            <div className="shrink-0 border-b border-border-faint px-6 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-ink-faint uppercase tracking-wider w-12">Tone</span>
                <div className="flex gap-1.5">
                  {toneOptions.map(t => (
                    <button
                      key={t.value}
                      onClick={() => handleToneChange(t.value)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        emailTone === t.value
                          ? 'bg-ink text-white'
                          : 'border border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-ink-faint uppercase tracking-wider w-12">Length</span>
                <div className="flex gap-1.5">
                  {lengthOptions.map(l => (
                    <button
                      key={l.value}
                      onClick={() => handleLengthChange(l.value)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        emailLength === l.value
                          ? 'bg-ink text-white'
                          : 'border border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject line */}
            <div className="shrink-0 border-b border-border-faint px-6 py-2.5">
              <p className="text-xs text-ink-faint">Subject: <span className="font-medium text-ink">{draftItem.draftSubject || `Following up \u2014 ${draftItem.clientName}`}</span></p>
            </div>

            {/* Draft body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {isEditing ? (
                <textarea
                  autoFocus
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-full min-h-[200px] resize-none border-0 bg-transparent text-sm leading-relaxed text-ink outline-none focus:ring-0"
                />
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {currentDraftText}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center justify-between border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => { setIsEdited(true); setIsEditing(false); }}
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); if (!isEdited) setEditedText(''); }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditedText(isEdited ? editedText : currentDraftText);
                        setIsEditing(true);
                      }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Edit Draft
                    </button>
                    <button
                      onClick={() => {
                        if (isEdited && !confirm('Regenerating will discard your edits. Continue?')) return;
                        setIsEdited(false);
                        setEditedText('');
                      }}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:bg-surface-inset"
                    >
                      Regenerate
                    </button>
                  </>
                )}
                {isEdited && !isEditing && (
                  <span className="text-[10px] text-ink-faint">Edited</span>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={handleSendDraft}
                  className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                >
                  Approve &amp; Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completion Wizard */}
      {wizardItem && (
        <CompletionWizard
          item={wizardItem}
          onClose={() => setWizardItem(null)}
          onConfirm={(data) => handleCompleteWizard(wizardItem.id, data)}
        />
      )}

      {/* Onboarding Wizard */}
      {onboardingClient && (
        <OnboardingWizard
          clientName={onboardingClient}
          onClose={() => setOnboardingClient(null)}
          onConfirm={() => {
            setOnboardingClient(null);
            showToast('Account opening submitted to operations');
          }}
        />
      )}
    </div>
  );
}

