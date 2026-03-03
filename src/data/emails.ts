import { Email, ThreadMessage } from '../lib/types';

export const emails: Email[] = [
  // ── Inbound emails (spec-required) ──────────────────────────────────

  {
    id: 'email-001',
    clientId: 'prospect-001',
    clientName: 'Rose Chen',
    subject: 'Referral from Harriet Spencer — seeking financial guidance',
    preview: 'Hello Sarah, I was referred to you by your client Harriet Spencer. I was hoping I can get your assistance with my finances and investments.',
    body: `Hello Sarah,

I was referred to you by your client Harriet Spencer. I was hoping I can get your assistance with my finances and investments.

A little about me: I'm 44 years old, recently promoted to VP of Product at a healthcare tech company here in Denver. My husband Kevin and I have been managing our own investments for years, but things have gotten more complex — between his small business income, my equity compensation, and our goal of retiring by 60, we feel like we need professional guidance.

Harriet speaks so highly of you and your team. She mentioned you're particularly skilled at tax planning and helping families think long-term. That really resonated with us.

Would it be possible to schedule an introductory call? I'm generally available Tuesdays and Thursdays after 2 PM.

Thank you,
Rose Chen`,
    receivedAt: '2026-03-02T07:22:00Z',
    isRead: false,
    priority: 'high',
    type: 'inbound',
    draftReply: {
      subject: 'Re: Referral from Harriet Spencer — seeking financial guidance',
      body: `Hi Rose,

Thanks so much for reaching out — and please thank Harriet for the referral! She and William are wonderful clients.

It sounds like you and Kevin are at an exciting stage. Equity comp, small business income, and an early retirement target create a lot of great planning opportunities, especially around taxes and investment structuring.

I have time this Thursday at 2:30 PM or next Tuesday at 3:00 PM for an intro call — about 30 minutes, no obligation. If either works, I'll send a calendar invite and a short questionnaire so I can come prepared.

Looking forward to it!

Best,
Sarah Mitchell, CFP® | Meridian Wealth Partners`,
      tone: 'warm',
      status: 'draft',
    },
  },
  {
    id: 'email-002',
    clientId: 'client-005',
    clientName: 'Margaret & Robert Kim',
    subject: 'Concerned about market volatility — can we chat?',
    preview: 'Hi Sarah, I hope you\'re doing well. I\'ve been feeling a bit uneasy with all the recent market volatility and would appreciate your perspective.',
    body: `Hi Sarah,

I hope you're doing well. I've been feeling a bit uneasy with all the recent market volatility and would appreciate your perspective.

I know we have our check-in scheduled for later today, but I wanted to send this ahead of time so you'd know what's on my mind. The S&P dropped almost 4% last week, and I couldn't help but think about our retirement timeline. With me potentially retiring in 18 months, I'm worried about a market downturn right when we'd need to start drawing down.

Robert keeps telling me not to check the portfolio every day, but it's hard not to when the headlines are so alarming. I saw something about a potential recession and it really shook me.

A few specific concerns:
1. Should we be moving more to bonds or cash given my retirement timeline?
2. Is our plan probability still at 87%? Has the market drop affected it?
3. If I do retire next year, do we have enough of a cash cushion to avoid selling at a loss?

I trust your judgment completely — I just need some reassurance and maybe a plan adjustment if warranted.

Thank you,
Margaret`,
    receivedAt: '2026-03-02T06:51:00Z',
    isRead: false,
    priority: 'high',
    type: 'inbound',
    thread: [
      {
        id: 'thread-002-1',
        from: 'Sarah Mitchell',
        date: '2026-02-20T14:30:00Z',
        body: 'Hi Margaret,\n\nJust wanted to let you know I ran the updated retirement projections with the new timeline. Your plan probability is sitting at 87%, which is solid. I\'ll have the full report ready for our March 2nd meeting.\n\nAlso, I found a great ACA marketplace plan option for your healthcare bridge — I think you\'ll be pleasantly surprised at the cost.\n\nSee you soon!\nSarah',
      },
      {
        id: 'thread-002-2',
        from: 'Margaret Kim',
        date: '2026-02-21T09:15:00Z',
        body: 'Thanks Sarah, that\'s reassuring to hear. Robert and I are looking forward to the meeting. I know I worry too much sometimes but it helps knowing the numbers are still strong.\n\nSee you on the 2nd!\nMargaret',
      },
    ],
    draftReply: {
      subject: 'Re: Concerned about market volatility — can we chat?',
      body: `Hi Margaret,

Totally understand the unease — those headlines are hard to ignore, especially with retirement on the horizon. Let me give you some quick reassurance before we meet today.

Your portfolio is doing exactly what it was designed to do. The S&P dropped ~4% last week, but your portfolio was only down about 1.8% because of the bond and cash buffer we built in. That 35% fixed income + 10% cash allocation is doing its job.

On your specific questions:

1. **Allocation changes:** I wouldn't recommend shifting more to bonds right now. Selling after a 4% dip locks in losses. We built this portfolio for exactly these moments.
2. **Plan probability:** Ran the numbers this morning — we've slipped from 87% to about 85%. That's normal fluctuation, not a red flag.
3. **Cash cushion:** You have roughly 24 months of living expenses in cash and short-term bonds. You wouldn't need to sell any equities even if the market stayed flat for two years.

Let's walk through the updated projections at our 11:30 meeting. I think you'll feel a lot better once we look at the scenarios together.

Talk soon,
Sarah`,
      tone: 'warm',
      status: 'draft',
    },
  },
  {
    id: 'email-003',
    clientId: 'client-006',
    clientName: 'David & Lisa Nakamura',
    subject: 'Quick question about RSU vesting',
    preview: 'Hey Sarah, my next RSU tranche vests on the 15th — about 2,400 shares. Should we sell immediately or hold? The stock is up 12% this month.',
    body: `Hey Sarah,

My next RSU tranche vests on the 15th — about 2,400 shares. Should we sell immediately or hold? The stock is up 12% this month and I'm tempted to ride the momentum.

I know we talked about the 10b5-1 plan but that's not set up yet. So for this vest, I need to make a call. At current prices, that's roughly $340,000 worth of shares vesting.

Quick context: our concentrated stock position is already at $2.1M which I know you've flagged as too high. But the stock has been on fire and I hate to sell into strength.

Also, Lisa wanted me to ask — can we use some of the RSU proceeds to make a bigger dent in her practice buy-in loan? The rate is 5.2% and she'd feel better having that reduced. We owe about $340K on it.

Let me know your thoughts. No rush but would love to have a game plan before the 15th.

Thanks,
David`,
    receivedAt: '2026-03-02T08:03:00Z',
    isRead: false,
    priority: 'high',
    type: 'inbound',
    draftReply: {
      subject: 'Re: Quick question about RSU vesting',
      body: `Hi David,

Great question, and I'm glad you're thinking about this ahead of the vest date. Let me give you my recommendation and then we can discuss if you want to adjust.

My strong recommendation is to sell at least 75% of the vesting shares (1,800 of 2,400). Here's why: your concentrated stock position is already $2.1M — that's 39% of your total assets tied to a single company. Adding another $340K would push it to $2.44M, or roughly 42%. That's a level of concentration that creates real risk to your family's financial security, regardless of how well the stock is performing.

I know it feels counterintuitive to sell when a stock is up 12% in a month, but that's actually the ideal time to diversify. You're selling at strength, not weakness. Remember — you still get upside exposure through the shares you keep and your unvested RSUs. You're not "betting against" the company; you're managing risk like a prudent investor.

Regarding Lisa's practice loan at 5.2% — I think directing a portion of the proceeds toward the loan is a reasonable move. Here's what I'd suggest:
- Sell 1,800 shares (~$255,000 after taxes)
- Direct $100,000 toward Lisa's practice loan (reducing it from $340K to $240K)
- Invest $155,000 into your diversified portfolio

This accomplishes three things: reduces concentration risk, makes meaningful progress on the loan, and adds to your investment base.

For the remaining 600 shares, I'd recommend holding them and folding them into the 10b5-1 plan once it's established. Speaking of which — the compliance review should be complete by end of this week, and we can have the plan ready for your signature by March 20th.

Want to hop on a quick call this week to finalize the strategy? I have time Thursday at 11 AM or Friday at 2 PM.

Best,
Sarah Mitchell, CFP® | Senior Financial Advisor | Meridian Wealth Partners`,
      tone: 'professional',
      status: 'draft',
    },
  },
  {
    id: 'email-004',
    clientId: 'client-010',
    clientName: 'Tony & Angela Russo',
    subject: 'The big beautiful bill — what does it mean for us?',
    preview: 'Good morning Sarah, with the recent announcement of the big beautiful bill, Angela and I have some questions about how this might affect our business and personal finances.',
    body: `Good morning Sarah,

With the recent announcement of the "big beautiful bill," Angela and I have some questions about how this might affect our business and personal finances.

From what we've been reading, there seem to be changes coming to:
1. Business tax rates — will this affect our franchise income?
2. Estate tax exemptions — how does this impact our succession plan for Marco?
3. Capital gains treatment — relevant since we're thinking about buying the commercial space for the second location
4. Retirement plan contribution limits — any changes we should take advantage of?

I know some of this might still be uncertain until the final bill passes, but I want to make sure we're positioned to take advantage of any opportunities and avoid any pitfalls.

Also, quick update on the succession front: I spoke with our Chick-fil-A regional operator and they confirmed that franchise transfers to family members are permitted with a 6-month approval process. That's great news for the Marco transition plan.

Can you give us your initial take? We can discuss in more detail at our next meeting.

Thanks,
Tony`,
    receivedAt: '2026-03-01T14:17:00Z',
    isRead: true,
    priority: 'medium',
    type: 'inbound',
    draftReply: {
      subject: 'Re: The big beautiful bill — what does it mean for us?',
      body: `Hi Tony and Angela,

Great questions, and I appreciate you being proactive about this. The legislative landscape is still evolving, but here's my initial take on how the key provisions could affect your situation:

**Business Tax Impact:** The proposed changes would likely maintain or slightly reduce the qualified business income (QBI) deduction that benefits your franchise income. Your effective tax rate on franchise profits may decrease by 1-2 percentage points. We should model the exact impact once final numbers are available, but directionally this is positive for you.

**Estate Tax & Succession Planning:** This is the big one for you. The bill appears to make the current elevated estate tax exemption ($13.61M per person) permanent, rather than letting it sunset in 2026. If that holds, it significantly simplifies your succession plan for Marco — you'd have ample room to transfer franchise equity without triggering estate or gift taxes. This is excellent news for the 5-year transition framework we discussed.

**Capital Gains:** The proposed changes to capital gains treatment could affect the commercial real estate purchase. If rates change, the timing of when you buy (and eventually sell) the property matters. I'd recommend we model both the current rate scenario and the proposed rate scenario before committing to the lease-vs-buy decision in August.

**Retirement Plans:** There are proposals to increase catch-up contribution limits for ages 50-59 and to expand Roth options in employer plans. Both of these would benefit you directly, especially with the solo 401(k) conversion we're planning.

Regarding the CFA franchise transfer update — that 6-month approval timeline is great news. It means if we target starting Marco's transition in Q4 2026, we should begin the application process by Q2. I'll factor this into our timeline.

Let's plan to do a deep dive at our March 25th meeting. I'll have specific modeling done by then. In the meantime, I'd hold off on any major tax-motivated decisions until the final bill language is clearer.

Best,
Sarah Mitchell, CFP® | Senior Financial Advisor | Meridian Wealth Partners`,
      tone: 'professional',
      status: 'draft',
    },
  },
  {
    id: 'email-005',
    clientId: 'client-009',
    clientName: 'Eleanor Vance',
    subject: 'Found more of Harold\'s accounts',
    preview: 'Sarah, I was going through Harold\'s office this weekend and found statements from Vanguard and a small account at Edward Jones I didn\'t know about.',
    body: `Sarah,

I was going through Harold's office this weekend and found statements from Vanguard and a small account at Edward Jones I didn't know about. Should I bring these to our next meeting?

The Vanguard statement shows a balance of about $42,000 — it looks like it's in some kind of index fund. The Edward Jones one is smaller, around $18,000, and I think it might be individual stocks.

I also found what looks like an old life insurance policy from Harold's contracting business. I'm not sure if it's still active or if it's already been claimed. The face value says $250,000 and the company is Pacific Life.

I know we're already working on consolidating everything, and I'm sorry to keep finding more accounts. Harold was a wonderful man but his idea of financial organization was putting statements in different desk drawers. I'm going through them one drawer at a time.

I have to admit, each time I find something new it brings up a lot of emotions. But I'm also relieved to know it's being found rather than forgotten.

Thank you for your patience with all of this.

Eleanor`,
    receivedAt: '2026-03-02T08:47:00Z',
    isRead: false,
    priority: 'medium',
    type: 'inbound',
    thread: [
      {
        id: 'thread-005-1',
        from: 'Sarah Mitchell',
        date: '2026-02-25T16:00:00Z',
        body: 'Hi Eleanor,\n\nIt was wonderful meeting with you today. I know going through Harold\'s papers is emotional, but you\'re doing a great job. We made real progress on the consolidation plan.\n\nIf you find any more statements as you continue going through his office, just bring them to our next meeting or scan and email them to me. No rush at all.\n\nWarmly,\nSarah',
      },
      {
        id: 'thread-005-2',
        from: 'Eleanor Vance',
        date: '2026-02-26T10:20:00Z',
        body: 'Dear Sarah,\n\nThank you for being so kind today. I will keep looking through his desk. There are still two drawers I haven\'t gotten to yet.\n\nEleanor',
      },
    ],
    draftReply: {
      subject: 'Re: Found more of Harold\'s accounts',
      body: `Hi Eleanor,

Please don't apologize — this is exactly the kind of thing we want to find. Every account we uncover is a step toward the full picture.

Here's my take on each item:

**Vanguard ($42K):** Bring the statement to our next meeting. This likely got a stepped-up basis, so we're in good shape tax-wise. We'll transfer it to your Schwab account with the rest.

**Edward Jones ($18K):** Same — bring the statement and we'll start the transfer. If it's individual stocks, we'll review what to keep vs. sell.

**Pacific Life policy ($250K):** This one could be significant. I'd suggest calling Pacific Life at 1-800-800-7681 with Harold's death certificate handy to check the policy status. If it was active when he passed, you may still be able to claim the benefit. Happy to make that call for you if you'd prefer — just send me a copy of the policy doc.

Take this at whatever pace feels right. We're not in a rush. Bring everything you've found to our next meeting and we'll sort through it together.

Warmly,
Sarah`,
      tone: 'warm',
      status: 'draft',
    },
  },

  // ── Post-meeting follow-up emails ───────────────────────────────────

  {
    id: 'email-006',
    clientId: 'client-002',
    clientName: 'James & Patricia Gordon',
    subject: 'Great connecting — follow-up from our discovery call',
    preview: 'Hi Sarah, Patricia and I really enjoyed our conversation on Thursday. It was refreshing to talk with someone who actually took the time to understand our full picture.',
    body: `Hi Sarah,

Patricia and I really enjoyed our conversation on Thursday. It was refreshing to talk with someone who actually took the time to understand our full picture rather than just asking about our risk tolerance and calling it a day.

A few things I wanted to follow up on:

1. I got the beneficiary IRA statements from Fidelity — Mom's account has $380,000 and we haven't taken any distributions yet. I know the 10-year clock started in November 2024. Should I start taking distributions now or wait?

2. My HR team sent over the RSU vesting schedule. I'll forward it to you separately — it's pretty detailed with the four-year vest.

3. Patricia wanted me to ask about her Traditional IRA. She's been contributing $7,000 per year, but with our combined income in California, are we even getting a tax deduction on that?

4. On the 529 front — our daughter at Oregon State has a plan through the Oregon plan, and our son at USC is on the California plan. Should we consolidate or keep them separate?

Looking forward to seeing the comprehensive plan. This move to LA was stressful, but having a clear financial roadmap will help a lot.

Best,
James`,
    receivedAt: '2026-03-01T11:14:00Z',
    isRead: false,
    priority: 'medium',
    type: 'follow-up',
    meetingId: 'meeting-006',
    thread: [
      {
        id: 'thread-006-1',
        from: 'Sarah Mitchell',
        date: '2026-02-26T09:00:00Z',
        body: 'Hi James and Patricia,\n\nThank you again for a great discovery call yesterday. I\'m excited to work with you both on building a comprehensive plan.\n\nAs discussed, here are the next steps:\n1. Please gather the beneficiary IRA statements from Fidelity\n2. Forward your RSU vesting schedule when you receive it from HR\n3. I\'ll begin modeling the CA tax implications\n\nI\'m targeting March 15th to have a draft plan ready. In the meantime, don\'t hesitate to reach out with any questions.\n\nBest,\nSarah Mitchell, CFP®',
      },
    ],
    draftReply: {
      subject: 'Re: Great connecting — follow-up from our discovery call',
      body: `Hi James and Patricia,

It was a pleasure getting to know you both as well. I'm excited to build a plan that addresses the complexity of your situation — the relocation, equity comp, and beneficiary IRA together create some really interesting planning opportunities.

Let me address each of your questions:

**Beneficiary IRA ($380K):** You have flexibility here, but I'd recommend starting distributions sooner rather than later. Since the 10-year clock started in November 2024, you have until December 2034 to fully distribute. If we spread distributions evenly over the remaining 8.5 years, that's roughly $45,000 per year. However, given your higher CA income in 2026-2029 (with RSU vesting), it might be smarter to take smaller distributions now ($20-25K/year) and larger ones later when your income may be lower. I'll model this out in the comprehensive plan.

**RSU Schedule:** Please do forward that — it's critical for our tax projections. We'll want to map each vest against your estimated income to see if there are any years where we should consider deferral strategies.

**Patricia's IRA Deduction:** Great catch. With your combined income above $246,000 (the 2026 phase-out limit for active participants), Patricia's Traditional IRA contribution is NOT deductible. However, she can still contribute to a Roth IRA through the "backdoor" strategy — contribute to the Traditional IRA, then immediately convert to Roth. Since she has an existing Traditional IRA balance, we need to be careful about the pro-rata rule. Let's discuss the specifics at our next meeting.

**529 Consolidation:** I'd actually recommend keeping them in their respective state plans. The Oregon plan offers a state tax deduction for Oregon residents (which you no longer are, so that benefit is gone), but California's ScholarShare plan has competitive investment options and no state tax deduction regardless. The bigger question is whether the funding levels are adequate — we'll do a gap analysis in the plan.

I'm targeting March 15th to have the draft comprehensive plan ready for your review. I'll send a calendar invite for a 60-minute meeting to walk through it.

Best regards,
Sarah Mitchell, CFP® | Senior Financial Advisor | Meridian Wealth Partners`,
      tone: 'professional',
      status: 'draft',
    },
  },
  {
    id: 'email-007',
    clientId: 'client-009',
    clientName: 'Eleanor Vance',
    subject: 'Thank you for your patience today',
    preview: 'Dear Sarah, I wanted to thank you for being so patient with me during our meeting today. I know I got a little emotional when we started talking about the accounts.',
    body: `Dear Sarah,

I wanted to thank you for being so patient with me during our meeting today. I know I got a little emotional when we started talking about the accounts and what to do with Harold's investments. It's still hard sometimes.

The plan you outlined for consolidating everything makes a lot of sense. Having things in one place instead of scattered across eight different companies will help me feel more in control. Harold would appreciate that someone is finally organizing things properly — he always meant to but just never got around to it.

A couple of things:
- I found those Vanguard and Edward Jones statements I mentioned. I'll bring them to our next meeting.
- My son Thomas said he'd be happy to join a call to discuss the power of attorney and estate plan updates. What times work for you?
- Harriet Spencer mentioned she'd love to introduce me to another one of your clients for the watercolor class. Is that something you could help facilitate?

Thank you again for making this process feel manageable.

Warmly,
Eleanor`,
    receivedAt: '2026-02-25T15:38:00Z',
    isRead: true,
    priority: 'low',
    type: 'follow-up',
    meetingId: 'meeting-007',
    draftReply: {
      subject: 'Re: Thank you for your patience today',
      body: `Hi Eleanor,

Please never apologize — this is all part of the process, and Harold clearly built a great foundation. Our job is just to organize it so it keeps working for you.

Glad the consolidation plan makes sense! Once everything's in one place, it'll feel a lot more manageable.

On your follow-ups:

**Vanguard & Edward Jones:** Bring the statements on March 15th — I'll have the transfer paperwork ready.

**Thomas:** I can do March 12th at 10 AM or March 13th at 2 PM for a 30-minute call. We'd cover the POA discussion, estate plan status, and any questions he has.

**Watercolor class with Harriet:** Love this idea! I'll reach out to Harriet and make the intro.

See you on the 15th!

Warmly,
Sarah`,
      tone: 'warm',
      status: 'draft',
    },
  },
  {
    id: 'email-008',
    clientId: 'client-010',
    clientName: 'Tony & Angela Russo',
    subject: 'Following up on succession planning meeting',
    preview: 'Hi Sarah, Angela and I have been talking a lot since our session last week. We\'re both really excited about the plan for Marco.',
    body: `Hi Sarah,

Angela and I have been talking a lot since our session last week. We're both really excited about the plan for Marco and the franchise transition. A few follow-up items:

1. I spoke with our Chick-fil-A regional operator about the franchise transfer process. He confirmed that family transfers are permitted with a 6-month corporate approval process. He's sending me the formal application packet.

2. Angela pulled our latest P&L for both locations. Revenue for the trailing 12 months:
   - Location 1 (University Blvd): $2.8M
   - Location 2 (Park Meadows): $2.2M
   She'll email those to you directly.

3. On the buy-vs-lease question for Location 2 — our landlord mentioned he might be willing to sell the building. The space is about 4,200 sq ft and he's thinking around $1.8M. Is that worth exploring?

4. Marco asked me to ask you — when would be a good time for him to join one of our meetings? He's taking a business valuation class at CSU and is very eager to learn about the financial side.

Thanks for putting this whole framework together. It feels real now.

Tony`,
    receivedAt: '2026-02-27T10:32:00Z',
    isRead: true,
    priority: 'medium',
    type: 'follow-up',
    meetingId: 'meeting-008',
    draftReply: {
      subject: 'Re: Following up on succession planning meeting',
      body: `Hi Tony and Angela,

I love the momentum here — your energy on this is exactly what's needed to make the succession plan successful. Let me respond to each item:

**Franchise Transfer Application:** This is great news. A 6-month approval process means if we target a Q4 2026 start for Marco's transition, we should begin the application by June. When you receive the packet, please forward it to me so I can review the financial and operational requirements.

**P&L Data:** Thank you, Angela — I'll watch for those. The combined $5M in revenue is strong and will be important for the business valuation. Please also include the last three years if you have them, so the valuation firm can assess trends.

**Commercial Real Estate ($1.8M for Location 2):** This is absolutely worth exploring. At $1.8M for 4,200 sq ft, that's roughly $429/sq ft, which is in line with Denver-area commercial food service space. The key question is whether the cash flow from Location 2 ($2.2M revenue, ~$180-220K net profit) can support the mortgage payments while maintaining adequate cash reserves. I'll run the numbers, but my initial sense is that buying could be very advantageous — you'd be building equity instead of paying rent, and you'd have more control over the space for Marco's eventual operation. I'd recommend not letting the landlord know your level of interest until we've done our analysis.

**Marco Joining a Meeting:** I think that's a wonderful idea. I'd suggest he join our March 25th meeting for the second half — we can cover the succession timeline and give him context on the financial structure. It'll also give me a chance to understand his vision for the business. Would that work?

Looking forward to keeping this moving. You and Angela have built something really special with these franchises, and creating a path for Marco to carry it forward is smart family and business planning.

Best,
Sarah Mitchell, CFP® | Senior Financial Advisor | Meridian Wealth Partners`,
      tone: 'professional',
      status: 'draft',
    },
  },
];
