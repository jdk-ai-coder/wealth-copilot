'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Lead, LeadStatus, LeadTriggerType } from '../../../lib/types';
import { formatCurrency } from '../../../lib/utils';
import { useToast } from '../../../hooks/useToast';

type Tab = 'overview' | 'triggers' | 'outreach' | 'notes';

const STATUS_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'meeting-scheduled': 'Meeting Scheduled',
  'converted': 'Converted',
  'not-interested': 'Not Interested',
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  'new': 'bg-accent-blue-light text-accent-blue',
  'contacted': 'bg-accent-amber-light text-accent-amber',
  'meeting-scheduled': 'bg-accent-purple-light text-accent-purple',
  'converted': 'bg-accent-green-light text-accent-green',
  'not-interested': 'bg-surface-inset text-ink-faint',
};

const TRIGGER_TYPE_LABELS: Record<LeadTriggerType, string> = {
  'aum-threshold': 'AUM Threshold',
  'life-event': 'Life Event',
  'retirement-approaching': 'Retirement Approaching',
  'job-change': 'Job Change',
  'rollover-eligible': 'Rollover Eligible',
  'vesting-milestone': 'Vesting Milestone',
  'referral': 'Referral',
};

const TRIGGER_COLORS: Record<LeadTriggerType, string> = {
  'aum-threshold': 'bg-emerald-100 text-emerald-700',
  'life-event': 'bg-rose-100 text-rose-700',
  'retirement-approaching': 'bg-amber-100 text-amber-700',
  'job-change': 'bg-sky-100 text-sky-700',
  'rollover-eligible': 'bg-violet-100 text-violet-700',
  'vesting-milestone': 'bg-teal-100 text-teal-700',
  'referral': 'bg-orange-100 text-orange-700',
};

// ── Draft Tweak Chips ────────────────────────────────────────────────
const TWEAK_CHIPS = [
  { id: 'personal', label: 'More Personal' },
  { id: 'professional', label: 'More Professional' },
  { id: 'shorter', label: 'Shorter' },
  { id: 'detail', label: 'More Detail' },
  { id: 'warmer', label: 'Warmer Tone' },
  { id: 'urgency', label: 'Add Urgency' },
] as const;

function applyTweak(body: string, chipId: string): string {
  switch (chipId) {
    case 'personal':
      return body
        .replace(/^Hi (\w+),/, 'Hi $1 — hope you\'re doing well!')
        .replace(/Best regards,\nSarah/, 'Looking forward to connecting,\nSarah')
        .replace(/Best,\nSarah/, 'Looking forward to connecting,\nSarah');
    case 'professional':
      return body
        .replace(/^Hi (\w+) — hope you're doing well!/, 'Dear $1,')
        .replace(/^Hi (\w+),/, 'Dear $1,')
        .replace(/Looking forward to connecting,\nSarah/, 'Best regards,\nSarah Mitchell, CFP\nVantage Wealth Management');
    case 'shorter': {
      const lines = body.split('\n').filter(l => l.trim());
      if (lines.length > 4) {
        return [lines[0], '', lines[1], '', lines[lines.length - 2], lines[lines.length - 1]].join('\n');
      }
      return body;
    }
    case 'detail':
      return body.replace(
        /Would you have.*\?|Free for a quick.*\?|Would it be helpful.*\?|Would next week work.*\?|Would you be interested.*\?|Happy to chat.*\./,
        'I\'ve prepared a brief analysis specific to your situation that covers tax optimization, rollover strategies, and income planning scenarios. Would you have 20-30 minutes this week to review it together?'
      );
    case 'warmer':
      return body
        .replace(/^Dear (\w+),/, 'Hi $1,')
        .replace(/Best regards,\nSarah.*/, 'Warmly,\nSarah')
        .replace(/Best,\nSarah/, 'Warmly,\nSarah');
    case 'urgency':
      return body.replace(
        /Would you have.*\?|Free for a quick.*\?|Would it be helpful.*\?|Would next week work.*\?|Would you be interested.*\?|Happy to chat.*\./,
        'Given the timing, acting before the end of this quarter could make a meaningful difference. I have a few openings this week — would any of them work for a quick call?'
      );
    default:
      return body;
  }
}

// ── Conversion Wizard ────────────────────────────────────────────────
type WizardStep = 1 | 2 | 3;
interface WizardData {
  initialAum: string;
  serviceTier: string;
  accountTypes: string[];
  assignedAdvisor: string;
  targetDate: string;
}

function ConversionWizard({ lead, onClose, onConfirm }: { lead: Lead; onClose: () => void; onConfirm: () => void }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [data, setData] = useState<WizardData>({
    initialAum: lead.estimatedTotalWealth.toLocaleString(),
    serviceTier: 'Full Wealth Management',
    accountTypes: ['IRA Rollover'],
    assignedAdvisor: 'Sarah Mitchell',
    targetDate: '2026-03-17',
  });

  const toggleAccount = (acct: string) => {
    setData(prev => ({
      ...prev,
      accountTypes: prev.accountTypes.includes(acct) ? prev.accountTypes.filter(a => a !== acct) : [...prev.accountTypes, acct],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-ink">Convert Lead to Client</h3>
          <span className="text-xs text-ink-faint">Step {step} of 3</span>
        </div>
        <div className="flex gap-1 px-6 pt-3">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-ink' : 'bg-surface-inset'}`} />
          ))}
        </div>
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (
            <>
              <p className="text-sm font-medium text-ink">Confirm Client Info</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-ink-faint text-xs">Name</span><p className="font-medium text-ink">{lead.name}</p></div>
                <div><span className="text-ink-faint text-xs">Employer</span><p className="font-medium text-ink">{lead.employer}</p></div>
                <div><span className="text-ink-faint text-xs">401(k) Balance</span><p className="font-medium text-ink">{formatCurrency(lead.balance401k)}</p></div>
                <div><span className="text-ink-faint text-xs">Est. Total Wealth</span><p className="font-medium text-ink">{formatCurrency(lead.estimatedTotalWealth)}</p></div>
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Initial AUM</label>
                <input type="text" value={data.initialAum} onChange={e => setData(prev => ({ ...prev, initialAum: e.target.value }))} className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink" />
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Service Tier</label>
                <select value={data.serviceTier} onChange={e => setData(prev => ({ ...prev, serviceTier: e.target.value }))} className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink">
                  <option>Full Wealth Management</option>
                  <option>Retirement Planning Only</option>
                  <option>Investment Advisory</option>
                </select>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm font-medium text-ink">Account Setup</p>
              <div>
                <label className="block text-xs text-ink-faint mb-2">Account Types to Open</label>
                <div className="space-y-2">
                  {['IRA Rollover', 'Roth IRA', 'Individual Brokerage', 'Joint Brokerage', 'Trust'].map(acct => (
                    <label key={acct} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                      <input type="checkbox" checked={data.accountTypes.includes(acct)} onChange={() => toggleAccount(acct)} className="rounded border-border" />
                      {acct}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Assigned Advisor</label>
                <input type="text" value={data.assignedAdvisor} onChange={e => setData(prev => ({ ...prev, assignedAdvisor: e.target.value }))} className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink" />
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Target Onboarding Date</label>
                <input type="date" value={data.targetDate} onChange={e => setData(prev => ({ ...prev, targetDate: e.target.value }))} className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink" />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p className="text-sm font-medium text-ink">Confirm & Convert</p>
              <div className="rounded-lg border border-border bg-surface-inset/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-ink-faint">Client</span><span className="font-medium text-ink">{lead.name}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Initial AUM</span><span className="font-medium text-ink">${data.initialAum}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Service Tier</span><span className="font-medium text-ink">{data.serviceTier}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Accounts</span><span className="font-medium text-ink text-right">{data.accountTypes.join(', ') || 'None'}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Advisor</span><span className="font-medium text-ink">{data.assignedAdvisor}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Onboarding Date</span><span className="font-medium text-ink">{data.targetDate}</span></div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button onClick={() => step === 1 ? onClose() : setStep((step - 1) as WizardStep)} className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors">
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button onClick={() => setStep((step + 1) as WizardStep)} className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity">Next</button>
          ) : (
            <button onClick={onConfirm} className="rounded-full bg-accent-green px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity">Confirm Conversion</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AI Recommendation ────────────────────────────────────────────────
function getAiRecommendation(lead: Lead): string {
  if (lead.conversionScore >= 90) return `${lead.name} is an exceptional prospect with a conversion score of ${lead.conversionScore}. Priority outreach recommended — schedule a discovery call within the next 48 hours focusing on rollover strategy and comprehensive wealth planning.`;
  if (lead.conversionScore >= 70) return `Strong conversion candidate. Recommend personalized outreach highlighting ${lead.triggers[0]?.description?.toLowerCase() || 'key triggers'}. Focus on how coordinated planning can optimize their $${(lead.estimatedTotalWealth / 1_000_000).toFixed(1)}M in total estimated wealth.`;
  if (lead.conversionScore >= 40) return `Moderate prospect — nurture with educational content about retirement planning and wealth management benefits. Monitor for additional trigger events that could increase conversion likelihood.`;
  return `Early-stage prospect with developing wealth. Consider adding to a drip campaign with educational content about the value of professional financial planning.`;
}

// ── Main Component ───────────────────────────────────────────────────
export default function LeadDetailClient({ lead: initialLead }: { lead: Lead }) {
  const { showToast } = useToast();
  const [lead, setLead] = useState(initialLead);
  const [tab, setTab] = useState<Tab>('overview');
  const [notes, setNotes] = useState(lead.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Outreach tab state
  const [outreachBody, setOutreachBody] = useState(lead.aiOutreach.body);
  const [isEditingOutreach, setIsEditingOutreach] = useState(false);
  const [appliedTweaks, setAppliedTweaks] = useState<Set<string>>(new Set());
  const [isTweaking, setIsTweaking] = useState<string | null>(null);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && wizardOpen) setWizardOpen(false);
  }, [wizardOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  function advanceStatus() {
    if (lead.status === 'meeting-scheduled') {
      setWizardOpen(true);
      return;
    }
    const nextStatus: Record<string, LeadStatus> = { 'new': 'contacted', 'contacted': 'meeting-scheduled' };
    const next = nextStatus[lead.status];
    if (next) {
      setLead(prev => ({ ...prev, status: next, lastContactedAt: new Date().toISOString() }));
      showToast('Status updated');
    }
  }

  function handleConversionConfirm() {
    setLead(prev => ({ ...prev, status: 'converted' as LeadStatus, lastContactedAt: new Date().toISOString() }));
    setWizardOpen(false);
    showToast('Lead converted to client successfully!');
  }

  function handleSaveNotes() {
    setNotesSaved(true);
    showToast('Notes saved');
    setTimeout(() => setNotesSaved(false), 2000);
  }

  function handleTweakChip(chipId: string) {
    if (isTweaking) return;
    setIsTweaking(chipId);
    setTimeout(() => {
      setOutreachBody(prev => applyTweak(prev, chipId));
      setAppliedTweaks(prev => new Set(prev).add(chipId));
      setIsTweaking(null);
    }, 800);
  }

  function handleSendOutreach() {
    const to = lead.email || '';
    const subject = lead.aiOutreach.subject;
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(outreachBody)}`;
    window.open(mailtoUrl, '_blank');
    setLead(prev => ({ ...prev, status: 'contacted' as LeadStatus, lastContactedAt: new Date().toISOString() }));
    showToast('Opening in Outlook...');
  }

  function getAdvanceLabel(): string | null {
    switch (lead.status) {
      case 'new': return 'Mark Contacted';
      case 'contacted': return 'Schedule Meeting';
      case 'meeting-scheduled': return 'Convert to Client';
      default: return null;
    }
  }

  const scoreColor = lead.conversionScore >= 70 ? 'text-accent-green' : lead.conversionScore >= 40 ? 'text-accent-amber' : 'text-accent-red';
  const scoreBg = lead.conversionScore >= 70 ? 'bg-accent-green' : lead.conversionScore >= 40 ? 'bg-accent-amber' : 'bg-accent-red';

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'triggers', label: 'Triggers & Timeline' },
    { key: 'outreach', label: 'Outreach' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="px-8 py-10 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-faint mb-6">
        <Link href="/" className="hover:text-ink transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/inbound" className="hover:text-ink transition-colors">Inbound</Link>
        <span>/</span>
        <span className="text-ink font-medium">{lead.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{lead.name}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[lead.status]}`}>
              {STATUS_LABELS[lead.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{lead.jobTitle} at {lead.employer}</p>
          {lead.email && <p className="mt-0.5 text-xs text-ink-faint">{lead.email}</p>}
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold tabular-nums ${scoreColor}`}>{lead.conversionScore}</div>
          <div className="mt-1 w-24 h-2 rounded-full bg-surface-inset overflow-hidden ml-auto">
            <div className={`h-full rounded-full ${scoreBg}`} style={{ width: `${lead.conversionScore}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-ink-faint">Conversion Score</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-0.5 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 pb-2.5 text-sm transition-colors ${
              tab === t.key ? 'border-b-2 border-ink font-medium text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* ── Overview Tab ────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '401(k) Balance', value: formatCurrency(lead.balance401k) },
                { label: 'Est. Total Wealth', value: formatCurrency(lead.estimatedTotalWealth) },
                { label: 'Vesting', value: `${lead.vestingPct}%` },
                { label: 'Years in Plan', value: String(lead.yearsInPlan) },
                { label: 'Age', value: String(lead.age) },
                { label: 'Conversion Score', value: String(lead.conversionScore) },
              ].map(m => (
                <div key={m.label} className="rounded-lg border border-border px-4 py-3">
                  <p className="text-[11px] text-ink-faint">{m.label}</p>
                  <p className="mt-0.5 text-lg font-semibold text-ink">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Employment details */}
            <div className="rounded-lg border border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-ink mb-3">Employment Details</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
                <div className="flex justify-between"><span className="text-ink-faint">Employer</span><span className="text-ink">{lead.employer}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Job Title</span><span className="text-ink">{lead.jobTitle}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Plan Type</span><span className="text-ink">{lead.planType || '401(k)'}</span></div>
                <div className="flex justify-between"><span className="text-ink-faint">Years in Plan</span><span className="text-ink">{lead.yearsInPlan}</span></div>
                {lead.contributionRate !== undefined && (
                  <div className="flex justify-between"><span className="text-ink-faint">Contribution Rate</span><span className="text-ink">{lead.contributionRate}%</span></div>
                )}
                {lead.employerMatch && (
                  <div className="flex justify-between"><span className="text-ink-faint">Employer Match</span><span className="text-ink">{lead.employerMatch}</span></div>
                )}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="rounded-lg border border-accent-blue/30 bg-accent-blue-light/50 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <h3 className="text-sm font-semibold text-accent-blue">AI Recommendation</h3>
              </div>
              <p className="text-sm text-ink leading-relaxed">{getAiRecommendation(lead)}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab('outreach')}
                className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-white hover:opacity-80 transition-opacity"
              >
                Draft Outreach
              </button>
              {getAdvanceLabel() && (
                <button
                  onClick={advanceStatus}
                  className="rounded-full border border-border px-5 py-2 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                >
                  {getAdvanceLabel()}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Triggers & Timeline Tab ─────────────────────────────── */}
        {tab === 'triggers' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    <th className="py-2.5 pl-4 pr-3">Type</th>
                    <th className="py-2.5 pr-3">Description</th>
                    <th className="py-2.5 pr-4">Detected</th>
                  </tr>
                </thead>
                <tbody>
                  {lead.triggers.map(t => (
                    <tr key={t.id} className="border-b border-border-faint last:border-0">
                      <td className="py-3 pl-4 pr-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${TRIGGER_COLORS[t.type]}`}>
                          {TRIGGER_TYPE_LABELS[t.type]}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-ink">{t.description}</td>
                      <td className="py-3 pr-4 text-ink-muted whitespace-nowrap">
                        {new Date(t.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-ink mb-4">Timeline</h3>
              <div className="relative pl-6">
                <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border" />
                {[...lead.triggers]
                  .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
                  .map(t => (
                    <div key={t.id} className="relative mb-5 last:mb-0">
                      <div className="absolute -left-4 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-ink" />
                      <div>
                        <p className="text-xs font-medium text-ink-faint">
                          {new Date(t.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="mt-0.5 text-sm text-ink">{t.description}</p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${TRIGGER_COLORS[t.type]}`}>
                          {TRIGGER_TYPE_LABELS[t.type]}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Outreach Tab ────────────────────────────────────────── */}
        {tab === 'outreach' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border overflow-hidden">
              {/* Subject */}
              <div className="border-b border-border-faint px-5 py-3 bg-surface-inset/30">
                <p className="text-xs text-ink-faint">Subject: <span className="font-medium text-ink">{lead.aiOutreach.subject}</span></p>
              </div>
              {/* Body */}
              <div className="px-5 py-4">
                {isEditingOutreach ? (
                  <textarea
                    autoFocus
                    value={outreachBody}
                    onChange={e => setOutreachBody(e.target.value)}
                    className="w-full min-h-[200px] resize-none border-0 bg-transparent text-sm leading-relaxed text-ink outline-none"
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{outreachBody}</div>
                )}
              </div>

              {/* Quick-Tweak Chips */}
              {!isEditingOutreach && (
                <div className="border-t border-border-faint px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {TWEAK_CHIPS.map(chip => (
                      <button
                        key={chip.id}
                        onClick={() => handleTweakChip(chip.id)}
                        disabled={isTweaking !== null}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          appliedTweaks.has(chip.id)
                            ? 'border-accent-green bg-accent-green-light text-accent-green'
                            : isTweaking === chip.id
                            ? 'border-border bg-surface-inset text-ink-faint animate-pulse'
                            : 'border-border text-ink-muted hover:text-ink hover:bg-surface-inset'
                        }`}
                      >
                        {appliedTweaks.has(chip.id) && (
                          <svg className="inline h-3 w-3 mr-0.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        {isTweaking === chip.id ? 'Adjusting...' : chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  {isEditingOutreach ? (
                    <button
                      onClick={() => setIsEditingOutreach(false)}
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingOutreach(true)}
                        className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setOutreachBody(lead.aiOutreach.body);
                          setAppliedTweaks(new Set());
                        }}
                        className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                      >
                        Regenerate
                      </button>
                    </>
                  )}
                </div>
                {!isEditingOutreach && (
                  <button
                    onClick={handleSendOutreach}
                    className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
                  >
                    Approve &amp; Send
                  </button>
                )}
              </div>
            </div>

            {/* Contact history */}
            {lead.lastContactedAt && (
              <div className="rounded-lg border border-border px-5 py-4">
                <h3 className="text-sm font-semibold text-ink mb-2">Contact History</h3>
                <p className="text-sm text-ink-muted">
                  Last contacted: {new Date(lead.lastContactedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Notes Tab ───────────────────────────────────────────── */}
        {tab === 'notes' && (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="w-full min-h-[200px] rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink resize-none"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveNotes}
                className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-white hover:opacity-80 transition-opacity"
              >
                Save Notes
              </button>
              {notesSaved && <span className="text-xs text-accent-green">Saved</span>}
            </div>
          </div>
        )}
      </div>

      {/* Conversion Wizard */}
      {wizardOpen && (
        <ConversionWizard lead={lead} onClose={() => setWizardOpen(false)} onConfirm={handleConversionConfirm} />
      )}
    </div>
  );
}
