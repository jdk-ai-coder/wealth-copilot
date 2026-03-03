'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../../lib/types';
import ChatMessage from './ChatMessage';

/* ── Pre-scripted AI responses keyed by trigger phrase ──────────────── */
const SCRIPTED_RESPONSES: Record<string, string> = {
  'Summarize my day': `Here's your day at a glance, Sarah:

**5 client meetings** on today's schedule.

**9:00 AM** — Q2 Financial Review with Dr. Benjamin & Claire Stern *(happening now)*. Covering practice valuation, defined benefit plan optimization, and 529 catch-up for the twins. Prep doc is ready.

**10:00 AM** — Q2 Financial Review with Deborah & John Millman. Key topics: Roth conversion ladder analysis, estate plan update for new grandchild Oliver, and DAF contribution timing.

**11:30 AM** — Retirement Planning Check-in with Margaret & Robert Kim. Margaret's early retirement timeline is the focus — plan probability dropped to 87%. Healthcare bridge strategy and pension analysis on the agenda.

**2:00 PM** — Financial Reset Review with Frank Delgado. Post-divorce financial rebuild — budget, QDRO processing, beneficiary updates, and college planning reassessment.

**3:30 PM** — Onboarding with Sandra & Michael Torres. First meeting — comprehensive plan buildout, emergency fund ($8K is critically low), student loans ($47K), and life insurance gaps.

**Action items:** 38 open tasks across all clients. 5 AI-drafted email replies are ready for your review on the Follow Up page. You also have a new prospect referral from Harriet Spencer — Rose Chen is requesting an introductory call.

Would you like me to dive deeper into any of these?`,

  'Portfolio performance update': `Here's a snapshot of portfolio performance across your clients:

**Deborah & John Millman** — $4.2M total assets, YTD return **+8.7%**. Moderate allocation slightly equity-heavy (58% vs 55% target). Roth conversion strategy in progress.

**Harriet & William Spencer** — $6.8M total assets, YTD return **+5.2%**. Well-positioned moderate allocation. QCD strategy reducing RMD tax impact effectively.

**David & Lisa Nakamura** — $5.4M total assets, YTD return **+14.8%**. Strong performance but 39% concentrated in single stock — 10b5-1 plan in compliance review. RSU vest of 2,400 shares coming March 15.

**Dr. Benjamin & Claire Stern** — $3.1M total assets, YTD return **+7.9%**. Defined benefit plan and 401(k) performing well. 529 catch-up contributions needed for twins.

**Eleanor Vance** — $3.8M total assets, YTD return **+3.8%**. Conservative allocation appropriate for her situation. Account consolidation from 8 institutions in progress.

**Overall book of business:** $51.6M AUM across 10 households, average YTD return of **+7.1%** vs. benchmark +6.4%.

Want me to pull up detailed holdings for any specific client?`,

  'Draft email to client': `Sure! I can help draft an email. Here are some templates I can start with:

1. **Post-meeting summary** — Recap key decisions and action items
2. **Market update** — Proactive outreach about recent volatility
3. **Review reminder** — Upcoming quarterly or annual review
4. **Tax planning** — Year-end or quarterly tax strategy recommendations
5. **Life event check-in** — Following up on a personal milestone

Which client would you like to email, and what type of message? For example, you could say:

*"Draft a market update email to Margaret Kim reassuring her about the recent volatility"*

Or I can draft something from scratch if you give me the key points to cover.`,

  'Tax planning strategies': `Here are the most relevant tax planning strategies across your client base right now:

**Q1 Priority Actions:**

1. **Deborah & John Millman** — Roth conversion window. Converting $85-100K annually before RMDs begin at 73 could save **$180,000-$240,000** in lifetime taxes. Currently in-progress — analysis due March 5.

2. **David Nakamura** — RSU vesting tax management. 2,400 shares vesting March 15 (~$340K). Recommend selling 75% and diversifying. Combined with 10b5-1 plan, could reduce concentrated position from 39% to under 25% within 18 months.

3. **James & Patricia Gordon** — CA state tax optimization. Move from OR (0% state tax) to CA (13.3% top rate) creates significant tax burden. Modeling RSU vesting impact across 4-year period — potential to save **$50,000-$80,000** through strategic timing of beneficiary IRA distributions.

4. **Frank Delgado** — QDRO processing. $210,000 transfer from 401(k) to ex-wife. Need to ensure proper tax treatment and avoid early withdrawal penalties.

5. **Tony & Angela Russo** — Solo 401(k) vs SEP-IRA. Converting to solo 401(k) would unlock Roth contributions and loan provisions. At their income level, could shelter **$66,000+** annually.

Shall I prepare a detailed implementation timeline for any of these?`,

  'Compare fund options': `I can compare funds across several dimensions. Here are some common comparisons clients have been asking about:

**Current Client-Relevant Comparisons:**

For the **Millman Roth conversion**, we need tax-efficient funds in the Roth accounts:
- Vanguard Total Stock Market (VTI): 0.03% ER, broad market exposure
- iShares Core S&P 500 (IVV): 0.03% ER, large-cap focused
- Best for tax-free growth in Roth accounts

For **Nakamura's diversification** from concentrated stock:
- Direct indexing could reduce tracking error while harvesting ongoing tax losses
- Schwab 1000 Index or Vanguard Growth Index as replacement exposure
- ~40% lower single-stock risk with similar sector exposure

For **Torres's new portfolio**:
- Target-date funds (low-cost, hands-off) vs. custom allocation
- Vanguard Target Retirement 2055: 0.08% ER, age-appropriate for Sandra (38)

Tell me which clients or fund categories you'd like to compare, and I'll pull detailed analytics.`,

  'Client risk assessment': `Here's a risk assessment summary across your active clients:

**Clients Requiring Attention:**

1. **David & Lisa Nakamura** — **HIGH** concentration risk. Single stock at 39% of total assets ($2.1M). Next RSU vest adds $340K more. 10b5-1 plan urgently needed. IPO in 18 months creates additional liquidity event risk.

2. **Margaret & Robert Kim** — **MEDIUM** sequence-of-returns risk. Plan probability dropped to 87% after accelerated retirement timeline. If Margaret retires in 18 months, a market downturn in the first 2 years could significantly impact long-term outcomes.

3. **Sandra & Michael Torres** — **HIGH** emergency/insurance risk. Only $8K emergency fund for family of 5. No life insurance on Michael. Sandra has only 1x salary through employer. A single adverse event could be catastrophic.

4. **Frank Delgado** — **MEDIUM** cash flow risk. Post-divorce financial reset in progress. Emergency fund depleted ($12K from $45K). Single income supporting shared custody of two kids.

**Clients Well-Positioned:**

5. **Deborah & John Millman** — Risk profile well-aligned. Conservative-moderate allocation with Roth conversion strategy reducing future tax risk.

6. **Harriet & William Spencer** — Strong position. $6.8M with conservative allocation, ample income, and philanthropic structure in place.

7. **Tony & Angela Russo** — Business risk is primary concern, but $3M franchise value provides strong asset base. Succession plan reduces key-person risk over time.

Would you like a deeper dive on any client's risk profile?`,
};

const QUICK_ACTIONS = [
  { label: 'Summarize my day', icon: 'calendar' },
  { label: 'Portfolio performance update', icon: 'chart' },
  { label: 'Draft email to client', icon: 'email' },
  { label: 'Tax planning strategies', icon: 'tax' },
  { label: 'Compare fund options', icon: 'compare' },
  { label: 'Client risk assessment', icon: 'shield' },
] as const;

const RECENT_QUERIES = [
  { query: 'What are the Millmans\' Roth conversion options for 2026-2028?', time: '2 hours ago' },
  { query: 'Show me David Nakamura\'s concentrated stock exposure', time: '3 hours ago' },
  { query: 'What tax-loss harvesting opportunities are available in Q1?', time: 'Yesterday' },
  { query: 'Summarize Eleanor Vance\'s account consolidation progress', time: 'Yesterday' },
];

function QuickActionIcon({ type }: { type: string }) {
  switch (type) {
    case 'calendar':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      );
    case 'chart':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case 'email':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case 'tax':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      );
    case 'compare':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      );
    case 'shield':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    default:
      return null;
  }
}

function getTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const matchKey = Object.keys(SCRIPTED_RESPONSES).find(
      (key) => text.toLowerCase().includes(key.toLowerCase())
    );
    const responseText =
      matchKey
        ? SCRIPTED_RESPONSES[matchKey]
        : `I'd be happy to help with that. Let me look into "${text}" for you.\n\nBased on your client data and recent activity, I can provide insights on this topic. Could you give me a bit more context about which client or portfolio you're referring to? That will help me give you the most relevant information.`;

    setTimeout(() => {
      const aiMessage: ChatMessageType = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const handleQuickAction = (label: string) => {
    sendMessage(label);
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <div className="flex min-h-full flex-col items-center justify-center px-8 py-10">
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  What can I help you with?
                </h1>
              </div>
              <p className="text-sm text-ink-muted mb-8 pl-[52px]">
                I can access all your client data, meeting history, portfolios, and financial plans.
              </p>

              {/* Quick action grid — 2 cols, bigger cards */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="group flex items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-surface-inset hover:border-ink/20"
                  >
                    <div className="mt-0.5 text-ink-muted group-hover:text-ink transition-colors shrink-0">
                      <QuickActionIcon type={action.icon} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{action.label}</p>
                      <p className="mt-0.5 text-xs text-ink-faint leading-relaxed">
                        {action.icon === 'calendar' && 'Meetings, tasks, and action items for today'}
                        {action.icon === 'chart' && 'YTD returns, AUM, and allocations across clients'}
                        {action.icon === 'email' && 'Draft personalized emails for any client'}
                        {action.icon === 'tax' && 'Roth conversions, loss harvesting, and more'}
                        {action.icon === 'compare' && 'Side-by-side fund and portfolio analysis'}
                        {action.icon === 'shield' && 'Concentration risk, insurance gaps, red flags'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <p className="text-[11px] text-ink-faint uppercase tracking-wider font-medium mb-2">Recent</p>
                <div className="space-y-0.5">
                  {RECENT_QUERIES.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(item.query)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:text-ink hover:bg-surface-inset transition-colors"
                    >
                      <span className="truncate">{item.query}</span>
                      <span className="shrink-0 text-[11px] text-ink-faint ml-4">{item.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs text-ink-muted">
                  M
                </div>
                <div className="rounded-lg border border-border-faint px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:0ms]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:150ms]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-2.5 focus-within:border-ink/30 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your clients, portfolios, or strategies..."
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-white transition-opacity hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-ink-faint">
          AI-generated insights — always verify before acting on recommendations.
        </p>
      </div>
    </div>
  );
}
