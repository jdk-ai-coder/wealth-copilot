'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { leads as initialLeads } from '../../data/leads';
import { Lead, LeadStatus } from '../../lib/types';
import { useToast } from '../../hooks/useToast';
import { timeAgo, formatCurrency } from '../../lib/utils';

type FilterKey = 'all' | LeadStatus;
type SortKey = 'score' | 'balance' | 'name';

const STATUS_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'meeting-scheduled': 'Meeting Scheduled',
  'converted': 'Converted',
  'not-interested': 'Not Interested',
};

const TRIGGER_TYPE_LABELS: Record<string, string> = {
  'aum-threshold': 'AUM',
  'life-event': 'Life Event',
  'retirement-approaching': 'Retirement',
  'job-change': 'Job Change',
  'rollover-eligible': 'Rollover',
  'vesting-milestone': 'Vesting',
  'referral': 'Referral',
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    'new': 'bg-accent-blue-light text-accent-blue',
    'contacted': 'bg-accent-amber-light text-accent-amber',
    'meeting-scheduled': 'bg-accent-purple-light text-accent-purple',
    'converted': 'bg-accent-green-light text-accent-green',
    'not-interested': 'bg-surface-inset text-ink-faint',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-accent-green' : score >= 40 ? 'bg-accent-amber' : 'bg-accent-red';
  const textColor = score >= 70 ? 'text-accent-green' : score >= 40 ? 'text-accent-amber' : 'text-accent-red';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-surface-inset overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>{score}</span>
    </div>
  );
}

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
      accountTypes: prev.accountTypes.includes(acct)
        ? prev.accountTypes.filter(a => a !== acct)
        : [...prev.accountTypes, acct],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
        {/* Progress */}
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
                <div>
                  <span className="text-ink-faint text-xs">Name</span>
                  <p className="font-medium text-ink">{lead.name}</p>
                </div>
                <div>
                  <span className="text-ink-faint text-xs">Employer</span>
                  <p className="font-medium text-ink">{lead.employer}</p>
                </div>
                <div>
                  <span className="text-ink-faint text-xs">401(k) Balance</span>
                  <p className="font-medium text-ink">{formatCurrency(lead.balance401k)}</p>
                </div>
                <div>
                  <span className="text-ink-faint text-xs">Est. Total Wealth</span>
                  <p className="font-medium text-ink">{formatCurrency(lead.estimatedTotalWealth)}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Initial AUM</label>
                <input
                  type="text"
                  value={data.initialAum}
                  onChange={e => setData(prev => ({ ...prev, initialAum: e.target.value }))}
                  className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Service Tier</label>
                <select
                  value={data.serviceTier}
                  onChange={e => setData(prev => ({ ...prev, serviceTier: e.target.value }))}
                  className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink"
                >
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
                      <input
                        type="checkbox"
                        checked={data.accountTypes.includes(acct)}
                        onChange={() => toggleAccount(acct)}
                        className="rounded border-border"
                      />
                      {acct}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Assigned Advisor</label>
                <input
                  type="text"
                  value={data.assignedAdvisor}
                  onChange={e => setData(prev => ({ ...prev, assignedAdvisor: e.target.value }))}
                  className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-faint mb-1">Target Onboarding Date</label>
                <input
                  type="date"
                  value={data.targetDate}
                  onChange={e => setData(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full rounded border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm font-medium text-ink">Confirm & Convert</p>
              <div className="rounded-lg border border-border bg-surface-inset/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-faint">Client</span>
                  <span className="font-medium text-ink">{lead.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Initial AUM</span>
                  <span className="font-medium text-ink">${data.initialAum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Service Tier</span>
                  <span className="font-medium text-ink">{data.serviceTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Accounts</span>
                  <span className="font-medium text-ink text-right">{data.accountTypes.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Advisor</span>
                  <span className="font-medium text-ink">{data.assignedAdvisor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Onboarding Date</span>
                  <span className="font-medium text-ink">{data.targetDate}</span>
                </div>
              </div>
            </>
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
              onClick={onConfirm}
              className="rounded-full bg-accent-green px-5 py-1.5 text-xs font-medium text-white hover:opacity-80 transition-opacity"
            >
              Confirm Conversion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function InboundPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('score');
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftLead, setDraftLead] = useState<Lead | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [showConverted, setShowConverted] = useState(false);
  const [wizardLead, setWizardLead] = useState<Lead | null>(null);
  const [appliedTweaks, setAppliedTweaks] = useState<Set<string>>(new Set());
  const [isTweaking, setIsTweaking] = useState<string | null>(null);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (wizardLead) setWizardLead(null);
      else if (showDraftModal) setShowDraftModal(false);
    }
  }, [showDraftModal, wizardLead]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Filter and sort
  const activeLeads = leads
    .filter((l) => l.status !== 'converted')
    .filter((l) => filter === 'all' || l.status === filter)
    .sort((a, b) => {
      switch (sort) {
        case 'score': return b.conversionScore - a.conversionScore;
        case 'balance': return b.balance401k - a.balance401k;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const convertedLeads = leads.filter((l) => l.status === 'converted');
  const allNonConverted = leads.filter((l) => l.status !== 'converted');
  const highPriority = allNonConverted.filter((l) => l.conversionScore >= 70).length;
  const inProgress = allNonConverted.filter((l) => l.status === 'contacted' || l.status === 'meeting-scheduled').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads.length / leads.length) * 100) : 0;

  const filterTabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'meeting-scheduled', label: 'Meeting Scheduled' },
    { key: 'not-interested', label: 'Not Interested' },
  ];

  function getFilterCount(key: FilterKey): number {
    if (key === 'all') return allNonConverted.length;
    return allNonConverted.filter((l) => l.status === key).length;
  }

  function advanceStatus(id: string) {
    const lead = leads.find(l => l.id === id);
    if (lead?.status === 'meeting-scheduled') {
      setWizardLead(lead);
      return;
    }
    setLeads((prev) => prev.map((l) => {
      if (l.id !== id) return l;
      const nextStatus: Record<string, LeadStatus> = {
        'new': 'contacted',
        'contacted': 'meeting-scheduled',
      };
      const next = nextStatus[l.status];
      if (!next) return l;
      return { ...l, status: next, lastContactedAt: new Date().toISOString() };
    }));
    showToast('Status updated');
  }

  function dismissLead(id: string) {
    setLeads((prev) => prev.map((l) =>
      l.id === id ? { ...l, status: 'not-interested' as LeadStatus } : l
    ));
    showToast('Lead dismissed');
  }

  function handleDraftOutreach(lead: Lead) {
    setDraftLead(lead);
    setIsGenerating(true);
    setIsEditing(false);
    setIsEdited(false);
    setAppliedTweaks(new Set());
    setTimeout(() => {
      setIsGenerating(false);
      setShowDraftModal(true);
    }, 1200);
  }

  function handleSendDraft() {
    if (!draftLead) return;
    const body = isEdited ? editedText : draftLead.aiOutreach.body;
    const subject = draftLead.aiOutreach.subject;
    const to = draftLead.email || '';
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    setLeads((prev) => prev.map((l) =>
      l.id === draftLead.id ? { ...l, status: 'contacted' as LeadStatus, lastContactedAt: new Date().toISOString() } : l
    ));
    setShowDraftModal(false);
    setDraftLead(null);
    showToast('Opening in Outlook...');
  }

  function handleTweakChip(chipId: string) {
    if (!draftLead || isTweaking) return;
    setIsTweaking(chipId);
    setTimeout(() => {
      const currentBody = isEdited ? editedText : draftLead.aiOutreach.body;
      const tweaked = applyTweak(currentBody, chipId);
      setEditedText(tweaked);
      setIsEdited(true);
      setAppliedTweaks(prev => new Set(prev).add(chipId));
      setIsTweaking(null);
    }, 800);
  }

  function handleConversionConfirm() {
    if (!wizardLead) return;
    setLeads(prev => prev.map(l =>
      l.id === wizardLead.id ? { ...l, status: 'converted' as LeadStatus, lastContactedAt: new Date().toISOString() } : l
    ));
    setWizardLead(null);
    showToast('Lead converted to client successfully!');
  }

  function getAdvanceLabel(status: LeadStatus): string | null {
    switch (status) {
      case 'new': return 'Mark Contacted';
      case 'contacted': return 'Schedule Meeting';
      case 'meeting-scheduled': return 'Mark Converted';
      default: return null;
    }
  }

  const stats = [
    { value: String(allNonConverted.length), label: 'Total Leads', accent: 'border-l-accent-blue' },
    { value: String(highPriority), label: 'High Priority', accent: 'border-l-accent-green' },
    { value: String(inProgress), label: 'In Progress', accent: 'border-l-accent-amber' },
    { value: `${conversionRate}%`, label: 'Conversion Rate', accent: 'border-l-accent-purple' },
  ];

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-ink">Inbound Leads</h1>
      <p className="mt-1 text-sm text-ink-muted">401(k) participants identified as candidates for full wealth management</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
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

      {/* Filter tabs + Sort */}
      <div className="mt-8 flex items-center justify-between border-b border-border">
        <div className="flex gap-0.5 overflow-x-auto">
          {filterTabs.map((f) => (
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
              <span className="ml-1 text-ink-faint">{getFilterCount(f.key)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2.5">
          <span className="text-[11px] text-ink-faint">Sort:</span>
          {([['score', 'Score'], ['balance', 'Balance'], ['name', 'Name']] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] transition-colors ${
                sort === key ? 'bg-ink text-white font-medium' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="mt-4">
        {activeLeads.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface-raised px-8 py-12 text-center">
            <p className="text-sm text-ink-faint">No leads match this filter.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface-raised overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  <th className="py-2 pl-4 pr-3">Name</th>
                  <th className="py-2 pr-3">Employer</th>
                  <th className="py-2 pr-3">401(k)</th>
                  <th className="py-2 pr-3">Est. Wealth</th>
                  <th className="py-2 pr-3">Score</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Triggers</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeLeads.map((lead) => {
                  const advanceLabel = getAdvanceLabel(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/inbound/${lead.id}`)}
                      className="border-b border-border-faint last:border-0 cursor-pointer transition-colors hover:bg-surface-inset/50"
                    >
                      <td className="py-2 pl-4 pr-3">
                        <div>
                          <p className="font-medium text-ink whitespace-nowrap">{lead.name}</p>
                          <p className="text-[11px] text-ink-faint">{lead.jobTitle}</p>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-ink-muted whitespace-nowrap">{lead.employer}</td>
                      <td className="py-2 pr-3 text-ink whitespace-nowrap tabular-nums">{formatCurrency(lead.balance401k)}</td>
                      <td className="py-2 pr-3 text-ink whitespace-nowrap tabular-nums">{formatCurrency(lead.estimatedTotalWealth)}</td>
                      <td className="py-2 pr-3"><ScoreBar score={lead.conversionScore} /></td>
                      <td className="py-2 pr-3"><StatusBadge status={lead.status} /></td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-1 flex-wrap">
                          {lead.triggers.slice(0, 2).map(t => (
                            <span key={t.id} className="rounded-full bg-surface-inset px-1.5 py-0.5 text-[9px] font-medium text-ink-muted whitespace-nowrap">
                              {TRIGGER_TYPE_LABELS[t.type] || t.type}
                            </span>
                          ))}
                          {lead.triggers.length > 2 && (
                            <span className="rounded-full bg-surface-inset px-1.5 py-0.5 text-[9px] font-medium text-ink-faint">
                              +{lead.triggers.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          {/* Draft email */}
                          <button
                            onClick={() => handleDraftOutreach(lead)}
                            title="Draft Outreach"
                            className="rounded p-1.5 text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </button>
                          {/* Advance status */}
                          {advanceLabel && (
                            <button
                              onClick={() => advanceStatus(lead.id)}
                              title={advanceLabel}
                              className="rounded p-1.5 text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.69z" />
                              </svg>
                            </button>
                          )}
                          {/* Dismiss */}
                          {lead.status !== 'not-interested' && (
                            <button
                              onClick={() => dismissLead(lead.id)}
                              title="Dismiss"
                              className="rounded p-1.5 text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Converted section */}
      {convertedLeads.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowConverted(!showConverted)}
            className="flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <svg className={`h-3.5 w-3.5 transition-transform ${showConverted ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Converted Leads
            <span className="text-ink-faint font-normal">{convertedLeads.length}</span>
          </button>

          {showConverted && (
            <div className="mt-3 rounded-lg border border-border bg-surface-raised overflow-hidden animate-fade-in">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-inset/50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    <th className="py-2 pl-4 pr-6">Name</th>
                    <th className="py-2 pr-6">Employer</th>
                    <th className="py-2 pr-6">401(k) Balance</th>
                    <th className="py-2 pr-6">Est. Wealth</th>
                    <th className="py-2 pr-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {convertedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/inbound/${lead.id}`)}
                      className="border-b border-border-faint last:border-0 cursor-pointer transition-colors hover:bg-surface-inset/50"
                    >
                      <td className="py-2.5 pl-4 pr-6 font-medium text-ink">{lead.name}</td>
                      <td className="py-2.5 pr-6 text-ink-muted">{lead.employer}</td>
                      <td className="py-2.5 pr-6 text-ink-muted">{formatCurrency(lead.balance401k)}</td>
                      <td className="py-2.5 pr-6 text-ink-muted">{formatCurrency(lead.estimatedTotalWealth)}</td>
                      <td className="py-2.5 pr-4">
                        <span className="text-xs font-semibold text-accent-green">{lead.conversionScore}</span>
                      </td>
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

      {/* Draft Outreach Modal */}
      {showDraftModal && draftLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowDraftModal(false)} />
          <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-border bg-surface-raised flex flex-col animate-fade-in">
            {/* Modal header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">AI-Generated Outreach Email</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-ink-muted capitalize">{draftLead.aiOutreach.tone} tone</span>
                </div>
                <p className="mt-0.5 text-xs text-ink-faint">
                  To {draftLead.name} &middot; {draftLead.employer} &middot; Score: {draftLead.conversionScore}
                </p>
              </div>
              <button onClick={() => setShowDraftModal(false)} className="text-ink-muted hover:text-ink transition-colors p-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Subject line */}
            <div className="shrink-0 border-b border-border-faint px-6 py-2.5">
              <p className="text-xs text-ink-faint">Subject: <span className="font-medium text-ink">{draftLead.aiOutreach.subject}</span></p>
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
                  {isEdited ? editedText : draftLead.aiOutreach.body}
                </div>
              )}
            </div>

            {/* Quick-Tweak Chips */}
            {!isEditing && (
              <div className="shrink-0 border-t border-border-faint px-6 py-3">
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
                        setEditedText(isEdited ? editedText : draftLead.aiOutreach.body);
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
                        setAppliedTweaks(new Set());
                        setShowDraftModal(false);
                        setTimeout(() => handleDraftOutreach(draftLead), 100);
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

      {/* Conversion Wizard */}
      {wizardLead && (
        <ConversionWizard
          lead={wizardLead}
          onClose={() => setWizardLead(null)}
          onConfirm={handleConversionConfirm}
        />
      )}
    </div>
  );
}
