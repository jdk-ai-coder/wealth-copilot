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

  'Roth conversion options for 2026-2028': `Great question — let me walk you through the Millmans' Roth conversion strategy:

**Current Situation:**
- Deborah (64) & John (65) have **$1.76M in Traditional IRAs** combined
- RMDs begin at age 73 (2035 for Deborah, 2034 for John)
- Current tax bracket: **24%** (taxable income ~$178K with John's Social Security)
- Deborah considering part-time consulting — could add $40-60K/year

**Recommended Conversion Ladder:**

| Year | Convert | Bracket | Tax Cost | Cumulative |
|------|---------|---------|----------|------------|
| 2026 | $95,000 | 24% | $22,800 | $22,800 |
| 2027 | $100,000 | 24% | $24,000 | $46,800 |
| 2028 | $85,000 | 24% | $20,400 | $67,200 |

**Key Considerations:**
1. If Deborah starts consulting in 2027, we should front-load the 2026 conversion to $100K and reduce 2027 to $80K
2. IRMAA thresholds — staying under $206K MAGI keeps Medicare premiums at standard rates
3. Each conversion dollar grows tax-free for 15+ years — projected lifetime tax savings of **$180,000-$240,000**
4. The DAF contribution in Q4 can offset some conversion income

**Next Step:** I'm finishing the detailed model by March 5 — we'll review the three scenarios (no consulting, part-time consulting, full consulting) at today's 10 AM meeting.

Want me to pull up the specific account balances or the DAF strategy?`,

  'David Nakamura\'s concentrated stock exposure': `Here's a breakdown of David Nakamura's concentrated stock position:

**Current Exposure:**
- **Company:** NovaTech Inc. (Series D, pre-IPO)
- **Shares held:** 14,800 shares
- **Estimated value:** $2.1M at current $142/share
- **As % of total assets:** **39%** of $5.42M total portfolio
- **Cost basis:** $296,000 (effective basis ~$20/share from early RSU grants)
- **Unrealized gain:** $1.8M (610% return)

**Upcoming Events:**
- **March 15:** Next RSU vest — 2,400 additional shares (~$340K)
- If held, concentration would rise to **$2.44M / $5.76M = 42%**
- **IPO expected:** ~18 months out — creates additional liquidity event

**Risk Assessment:** The position exceeds our 25% single-stock guideline by 14 percentage points. A 30% decline in NovaTech would erase ~$630K in net worth. With three young kids and $28K/month expenses, this is a material risk.

**Recommended Action Plan:**
1. **Sell 75% of March 15 vest** (1,800 shares → ~$255K after taxes)
2. **Direct $100K** toward Lisa's practice buy-in loan (5.2% rate)
3. **Invest $155K** into diversified portfolio
4. **Establish 10b5-1 plan** (compliance review completing this week) — systematic sales of 500 shares/quarter starting Q2
5. **Target:** Reduce concentration to **under 25%** by Q4 2027

The 10b5-1 plan signature should be ready by March 20th. Shall I draft the email to David with this recommendation?`,

  'tax-loss harvesting opportunities': `Here are the current tax-loss harvesting opportunities across your book:

**Immediate Opportunities (Q1 2026):**

1. **Deborah & John Millman** — Joint Brokerage
   - BND (Vanguard Total Bond Market): Down **-1.2%**, ~$4,320 loss harvestable
   - Swap to: SCHZ (Schwab US Aggregate Bond) — similar exposure, avoids wash sale
   - **Tax savings: ~$1,037** at 24% bracket

2. **Harriet & William Spencer** — Joint Brokerage & IRA
   - VCIT (Intermediate Corporate Bond): Down **-2.3%**, ~$9,880 loss
   - BND (Total Bond Market): Down **-1.2%**, ~$7,560 loss
   - VGSH (Short-Term Treasury): Down **-1.4%**, ~$4,080 loss
   - **Combined harvestable: $21,520 → Tax savings: ~$3,228** at 15% cap gains rate

3. **Dr. Benjamin & Claire Stern** — Joint Brokerage
   - BND: Down **-1.2%**, ~$4,860 loss
   - Swap to: AGG (iShares Core US Aggregate Bond)
   - **Tax savings: ~$1,749** at 35% bracket (highest value harvest)

**Total Harvestable Losses: ~$30,700**
**Estimated Tax Savings: ~$6,014**

**Note:** Bond positions are the primary opportunity this quarter. Equity positions are all positive YTD. The rising rate environment has created temporary bond losses that are ideal for harvesting without changing risk exposure.

**Wash Sale Rules:** Need 31-day separation before repurchasing substantially identical funds. I recommend permanent tax-lot swaps (BND↔SCHZ) rather than temporary sells.

Want me to generate the trade tickets for any of these?`,

  'Eleanor Vance\'s account consolidation progress': `Here's Eleanor's account consolidation status:

**Overview:** Consolidating assets from **8 institutions** into Schwab primary account.

| # | Institution | Amount | Status | Notes |
|---|-------------|--------|--------|-------|
| 1 | Edward Jones (Joint) | $280,000 | **Completed** | Transferred Feb 15 |
| 2 | Fidelity (Harold's 401k) | $195,000 | **Completed** | Rolled to IRA Feb 20 |
| 3 | Denver Credit Union | $42,000 | **Completed** | Cash transfer Feb 22 |
| 4 | Vanguard (Index Fund) | $42,000 | **In Progress** | Paperwork submitted — 5-7 business days |
| 5 | Edward Jones (Small) | $18,000 | **In Progress** | Eleanor bringing statements to next meeting |
| 6 | First Bank of Denver | $85,000 | **Pending** | Need Eleanor's signature on transfer form |
| 7 | Mountain Credit Union | $28,000 | **Pending** | CD matures April 15 — will transfer after |
| 8 | Pacific Life Insurance | $250,000 | **Investigating** | Found policy in Harold's papers — may be unclaimed benefit |

**Progress: 3 of 8 complete (37.5%)**
**Target completion: End of Q2 2026**

**Key Notes:**
- Eleanor is going through Harold's desk drawer by drawer — emotionally difficult but making progress
- The Pacific Life policy ($250K face value) could be a significant discovery. Need to call 1-800-800-7681 with death certificate to check status
- Monthly withdrawal of $4,500 set up from Schwab for living expenses
- Survivor Social Security: $3,800/month (Harold's record)
- Son Thomas has agreed to join a call about POA and estate plan updates

**Next Steps:**
1. Follow up on Vanguard transfer status
2. Prepare First Bank transfer paperwork for Eleanor's signature
3. Call Pacific Life re: insurance policy status
4. Schedule call with Thomas (offered March 12 at 10 AM or March 13 at 2 PM)

Want me to draft the follow-up email to Eleanor about the Pacific Life policy?`,

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

  // ── Short follow-up / client-name triggers ─────────────────────────
  'millman': `Here's a quick snapshot for **Deborah & John Millman**:

**Key Facts:** Ages 64/65 · Moderate risk · Client since 2018
**Total Assets:** $4.2M · **YTD Return:** +8.7%
**Portfolio:** $3.86M across 6 accounts (Joint Brokerage, 2 Traditional IRAs, 2 Roth IRAs, 529 Plan)

**Active Priorities:**
1. Roth conversion ladder — $85K converted in January, modeling $95-100K for 2026
2. Estate plan update needed — new grandchild Oliver (born March 2026)
3. DAF contribution timing — $30K in appreciated stock planned for Q4
4. Medicare supplement review for Deborah (IRMAA considerations if she consults)

**Today:** Q2 Financial Review at 10:00 AM · Zoom link ready · Prep doc complete

What would you like to explore — Roth conversion details, portfolio holdings, or meeting prep?`,

  'nakamura': `Here's a quick snapshot for **David & Lisa Nakamura**:

**Key Facts:** Ages 38/36 · Aggressive risk · Client since 2022
**Total Assets:** $5.4M · **YTD Return:** +14.8%
**Portfolio:** $5.42M — but **39% concentrated in employer stock** (NovaTech Inc.)

**Critical Issues:**
1. **Concentration risk:** $2.1M in single stock — well above 25% guideline
2. **RSU vest March 15:** 2,400 shares (~$340K) — need sell/hold decision
3. **10b5-1 plan:** Compliance review in progress, signature target March 20
4. Lisa's practice buy-in loan: $340K at 5.2% — discuss partial payoff from RSU proceeds

**Recent email:** David asked about March 15 vest strategy. AI draft reply recommends selling 75% (1,800 shares), directing $100K to Lisa's loan.

Want me to pull up the detailed holdings, RSU analysis, or the draft email?`,

  'kim': `Here's a quick snapshot for **Margaret & Robert Kim**:

**Key Facts:** Ages 58/56 · Moderate risk · Client since 2020
**Total Assets:** $2.8M · **YTD Return:** +6.1%
**Portfolio:** Moderate allocation appropriate for pre-retirement

**Active Priorities:**
1. **Plan probability dropped** from 91% to 87% after Margaret's early retirement modeling
2. Healthcare bridge strategy (age 58-65) — ACA marketplace plan comparison ready
3. Robert's pension analysis — full vesting at 63
4. Social Security optimization — when should each claim?
5. Home downsizing consideration ($850K home, $180K mortgage)

**Today:** Retirement Planning Check-in at 11:30 AM · Margaret emailed this morning concerned about market volatility
**Email context:** S&P dropped 4%, Margaret worried about retirement timeline. Portfolio only down 1.8% thanks to bond/cash buffer.

Want me to pull up the retirement projection, the email draft, or the healthcare comparison?`,

  'debbie': `I think you're referring to **Deborah Millman** (Deborah & John Millman):

**Key Facts:** Age 64 · Moderate risk · $4.2M total assets · +8.7% YTD
**Meeting today:** 10:00 AM — Q2 Financial Review

**Current Focus Areas:**
- Roth conversion ladder: $85K converted in Jan, modeling 2026-2028 strategy
- Estate plan update for new grandchild Oliver
- DAF contribution timing for Q4 tax optimization
- Medicare supplement — Deborah considering part-time consulting (IRMAA impact)

**Portfolio Highlights:**
- 6 accounts: Joint Brokerage ($1.28M), 2 Traditional IRAs ($1.76M), 2 Roth IRAs ($800K), 529 ($360K)
- Top holdings: VFIAX, VTI, QQQ, MSFT, AAPL
- Bond allocation: BND, VTIP — performing as buffer in recent volatility

What would you like to know specifically about Deborah?`,

  'vance': `Here's a quick snapshot for **Eleanor Vance**:

**Key Facts:** Age 72 · Conservative risk · Widow (Harold passed 14 months ago)
**Total Assets:** $3.8M · **YTD Return:** +3.8%
**Income:** $4,500/month systematic withdrawal + $3,800/month Survivor SS

**Active Priorities:**
1. **Account consolidation:** 3 of 8 transfers complete (Schwab, Fidelity, credit union) — 5 remaining
2. Newly discovered accounts: Vanguard ($42K) and Edward Jones ($18K)
3. **Pacific Life insurance policy** ($250K face value) found — may be unclaimed benefit
4. Estate plan needs update — documents pre-date Harold's passing
5. Son Thomas joining a call about POA (offered March 12 or 13)

**Recent emails:** Eleanor found more accounts in Harold's desk. She's emotional but making good progress.

Want me to pull up the consolidation tracker, draft the Pacific Life follow-up, or review her portfolio?`,

  'russo': `Here's a quick snapshot for **Tony & Angela Russo**:

**Key Facts:** Ages 55/53 · Moderate risk · Business owners (2 Chick-fil-A franchises)
**Total Assets:** $1.5M (personal) + ~$3M (business value) · **YTD Return:** +5.4%

**Active Priorities:**
1. **Business succession plan:** 5-year framework to transition one franchise to son Marco
2. **Lease renewal Aug 2026:** Location 2 — landlord offering to sell at $1.8M. Buy vs. renew analysis needed
3. Solo 401(k) conversion from SEP-IRA — unlocks Roth contributions + loan provisions
4. Buy-sell agreement stale (last updated 2022) — needs revision
5. "Big beautiful bill" tax implications — Tony asking about business rates, estate exemptions, capital gains

**Recent email:** Tony following up on succession planning session. Marco wants to join March 25 meeting.

Want me to pull up the succession timeline, the real estate analysis, or the tax bill impact?`,

  'stern': `Here's a quick snapshot for **Dr. Benjamin & Claire Stern**:

**Key Facts:** Ages 48/46 · Moderate-Aggressive risk · $6.2M total assets · +7.9% YTD
**Meeting today:** 9:00 AM — Q2 Financial Review *(currently in progress)*

**Active Priorities:**
1. **Practice valuation & transition planning** — Benjamin owns 40%, engaging third-party firm in Q2
2. **Defined benefit plan optimization** — $185K contribution for 2025 already made
3. **529 catch-up** — Twin daughters (16) start college in 2 years, significant funding gap
4. **Insurance review overdue** — Malpractice & umbrella policies not reviewed in 18+ months

**Portfolio Highlights:**
- Top holdings: VOO ($1.77M), VGT ($699K), NVDA ($356K)
- Defined benefit plan performing well
- 529s need catch-up: $360K + $334K currently funded

What would you like to explore?`,

  'gordon': `Here's a quick snapshot for **James & Patricia Gordon**:

**Key Facts:** Ages 52/50 · Moderate-Aggressive risk · **New client** (2026)
**Total Assets:** $1.8M · **YTD Return:** +6.4%

**Active Priorities:**
1. **Beneficiary IRA** ($380K from James's mother) — 10-year rule distribution strategy needed
2. **RSU vesting** — ~$200K/year over 4 years, CA state tax impact significant
3. **529 funding gap** — son at USC, daughter at Oregon State
4. **CA tax optimization** — moved from OR (0% state tax) to CA (13.3% top rate)
5. Patricia's Traditional IRA — not deductible at their income, need backdoor Roth strategy

**Recent email:** James following up from discovery call with questions about beneficiary IRA, RSU schedule, Patricia's IRA deduction, and 529 consolidation.
**Draft plan:** Targeting March 15 delivery

Want me to pull up the tax modeling, the beneficiary IRA strategy, or the email draft?`,

  'delgado': `Here's a quick snapshot for **Frank Delgado**:

**Key Facts:** Age 46 · Moderate risk · Recently divorced (Feb 2026)
**Total Assets:** $820K · **YTD Return:** +4.2%
**Meeting today:** 2:00 PM — Financial Reset Review

**Critical Issues:**
1. **Emergency fund depleted** — only $12K (was $45K before legal fees)
2. **Beneficiary updates pending** — all accounts still list ex-spouse
3. QDRO processing: $210K transfer from 401(k) to ex-wife in progress
4. College planning: 2 kids (14, 11) with shared custody
5. New budget needed — $2,800/month rent in LoDo condo

**Priority Order:**
1. Immediate: Update all beneficiary designations
2. 30 days: Rebuild emergency fund to $25K minimum
3. 60 days: Finalize QDRO and updated estate documents
4. 90 days: Reassess college funding with split household costs

Want me to pull up the meeting prep, the budget template, or the beneficiary update checklist?`,

  'torres': `Here's a quick snapshot for **Sandra & Michael Torres**:

**Key Facts:** Ages 38/40 · Moderate risk · **New clients** (workplace conversion from Edelman seminar)
**Total Assets:** $320K · **YTD Return:** +5.8%
**Meeting today:** 3:30 PM — Onboarding

**Critical Issues:**
1. **Emergency fund critically low** — $8K for family of 5 (3 kids under 7)
2. **No life insurance on Michael** — Sandra has only 1x salary through employer
3. **Student loans:** $47K at 5.8% weighted average — Sandra hasn't enrolled in employer repayment benefit ($5K/year!)
4. Michael's part-time real estate income ($30-40K/year) not being optimized
5. No retirement plan for Michael — self-employed income is unsheltered

**Quick Wins for Today:**
- Enroll Sandra in employer student loan repayment benefit → $5K/year free money
- Get term life quotes for Michael (at least $500K, ideally $1M)
- Set emergency fund target: $25K (3 months expenses)

Want me to pull up the insurance quotes, the student loan analysis, or the meeting prep?`,

  'spencer': `Here's a quick snapshot for **Harriet & William Spencer**:

**Key Facts:** Ages 71/73 · Conservative risk · Client since 2016
**Total Assets:** $6.8M · **YTD Return:** +5.2%

**Key Themes:**
- Well-positioned conservative allocation with ample income
- QCD strategy effectively reducing RMD tax impact
- Granddaughter's wedding in June — may need gift planning discussion
- Harriet just referred new prospect Rose Chen
- Active in community: Rotary Club, watercolor classes with Eleanor Vance
- Winter in Scottsdale — 4 grandchildren (ages 8-22) for legacy planning

**Portfolio:** Trust account, joint brokerage, traditional IRAs. Heavy bond allocation (BND, VCIT, VGSH) with growth via VTI and VIG. $320K cash reserve.

Want me to pull up their holdings, the QCD strategy, or the gift planning options for the wedding?`,
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

    const lowerText = text.toLowerCase();
    const matchKey = Object.keys(SCRIPTED_RESPONSES).find(
      (key) => lowerText.includes(key.toLowerCase())
    );
    const responseText =
      matchKey
        ? SCRIPTED_RESPONSES[matchKey]
        : `Here's what I found related to your query:

**"${text}"**

I've scanned your client data, meeting history, and recent activity. This appears to touch on a topic that spans multiple clients or requires specific parameters to analyze properly.

**Here's what I can do right now:**
- Pull up any specific client's portfolio, risk profile, or recent activity
- Run comparisons across clients (returns, allocations, risk scores)
- Draft communications or meeting prep materials
- Model tax scenarios, retirement projections, or estate planning strategies

**Try being more specific, for example:**
- *"Show me all clients with YTD returns below 5%"*
- *"What's the Nakamuras' concentrated stock position?"*
- *"Draft a market update email to Margaret Kim"*

The more specific your question, the more actionable my response will be.`;

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
