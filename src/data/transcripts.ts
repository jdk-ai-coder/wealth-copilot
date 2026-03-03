import { Transcript } from "../lib/types";

export const transcripts: Transcript[] = [
  {
    id: "transcript-006",
    meetingId: "meeting-006",
    entries: [
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:00",
        text: "James, welcome. It's great to finally meet in person. I know we had that introductory phone call last week, but it's always nice to sit down face to face. Can I get you anything? Coffee, water?",
      },
      {
        speaker: "James Gordon",
        timestamp: "00:10",
        text: "Coffee would be great, thanks. Black, if you have it. And please, call me James. Patricia sends her apologies -- she had a client deadline for a custom illustration set and couldn't step away.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:20",
        text: "No worries at all. We'll make sure she's looped in on everything. I saw on her website, actually -- her Etsy shop? The watercolor pet portraits are beautiful.",
      },
      {
        speaker: "James Gordon",
        timestamp: "00:29",
        text: "Ha, yeah, she's talented. It started as a hobby when we were still in Bend, but it's turned into a real business. She's pulling in about forty-five to fifty thousand a year from it now, which is great because it's something she loves.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:40",
        text: "That's wonderful. And speaking of Bend -- congratulations on the new role out here. VP of Engineering, right? That's a big move.",
      },
      {
        speaker: "James Gordon",
        timestamp: "00:48",
        text: "Thanks. Yeah, it's been a whirlwind. We just closed on a house in Pasadena about six weeks ago. The company recruited me pretty aggressively -- I was at a mid-size SaaS company in Bend for eight years, and this opportunity was just too good to pass up. The comp package is significantly better. Base is three-twenty, bonus target is thirty percent, and I'm getting RSUs that vest at roughly two hundred thousand a year over four years.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "01:12",
        text: "That's a strong package. And I know you mentioned on our call that one of the big reasons you wanted to connect with a planner was the tax situation. Going from Oregon -- no income tax -- to California is quite a shock.",
      },
      {
        speaker: "James Gordon",
        timestamp: "01:24",
        text: "Shock is an understatement. I about fell out of my chair when I did the rough math. Between federal and California state tax, I'm looking at losing, what, close to forty-five percent on the RSU income? In Oregon, there was state tax, but California's top rate is thirteen point three percent. It's brutal.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "01:41",
        text: "You're in the right ballpark. With your total comp -- let's call it roughly five-twenty to five-forty all-in with base, bonus, and RSU vesting -- you're firmly in the top California bracket. Your effective combined federal and state rate on the RSU income is going to be around forty-eight to fifty percent once you factor in the Medicare surtax and net investment income tax. So on that two hundred thousand in annual RSU vesting, you're netting closer to a hundred to a hundred and five thousand after tax.",
      },
      {
        speaker: "James Gordon",
        timestamp: "02:08",
        text: "Yeah, that's painful. But the total comp is still a big jump from what I was making. I was at two-twenty all-in back in Bend. So net-net, even after the California tax hit, we're ahead. It's just... it stings seeing those withholding numbers.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "02:22",
        text: "Absolutely. And we'll build a comprehensive tax strategy to minimize the pain where we can. But let me first make sure I understand the full picture. Walk me through everything -- the 401(k) rollover, the inherited IRA, the 529 situation. Let's lay it all out.",
      },
      {
        speaker: "James Gordon",
        timestamp: "02:36",
        text: "Okay, so we've got a few things going on. First, I just rolled over my old 401(k) from my previous employer. That was about six hundred and eighty thousand. It's sitting in a rollover IRA right now, mostly in a target-date fund. Then Patricia and I have a joint taxable account with about four hundred and twenty thousand. And we each have Roth IRAs -- mine has about two-ten, hers has about ninety-five. Plus the house, which we bought for one point four million with twenty percent down.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "03:08",
        text: "Got it. So roughly one point eight million in investable assets, excluding the home equity. That's a strong foundation, James. Now, tell me about the inherited IRA from your mother. I'm sorry for your loss, by the way.",
      },
      {
        speaker: "James Gordon",
        timestamp: "03:20",
        text: "Thank you. She passed in August of twenty-four. It's been... yeah. She was eighty-one. Very sharp until the end, managed her own finances her whole life. She left me a beneficiary IRA -- it's about three hundred and ninety thousand. I know there's some kind of ten-year rule, but honestly, I haven't figured out what I'm supposed to do with it. My brother got the house, I got the IRA. Seemed fair at the time.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "03:45",
        text: "Okay, so this is actually one of the more important things we need to plan around. Under the SECURE Act rules, since your mother passed after the required beginning date for her own RMDs -- which she had, at eighty-one -- you're subject to what's called the ten-year rule with annual required distributions. A lot of people think they can just wait until year ten and take a lump sum, but that's not the case when the original owner was already taking RMDs.",
      },
      {
        speaker: "James Gordon",
        timestamp: "04:12",
        text: "Wait, so I have to take money out every year? I thought I had ten years to just let it grow.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:17",
        text: "Unfortunately, no. You need to take annual distributions in years one through nine based on your single life expectancy, and then the entire remaining balance has to come out by the end of year ten. The annual RMDs won't be huge -- probably in the twelve to fifteen thousand range initially -- but here's the strategic issue. Every dollar that comes out of that inherited IRA is taxed as ordinary income, and you're now in one of the highest combined tax brackets in the country.",
      },
      {
        speaker: "James Gordon",
        timestamp: "04:43",
        text: "So I'm paying close to fifty percent tax on those distributions. That's terrible. Is there a way to minimize that?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:50",
        text: "There is, and it takes some planning. One strategy is to accelerate distributions in any year where your income is lower. For instance, if Patricia has a down year with her illustration work, or if there's a year where your bonus doesn't hit, or even if one of you takes an extended leave -- those are the years we pull more from the inherited IRA because your marginal rate is lower. We essentially smooth the tax cost over the ten years rather than letting it pile up.",
      },
      {
        speaker: "James Gordon",
        timestamp: "05:16",
        text: "That makes sense. Are there any other levers?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "05:19",
        text: "A few. We can maximize your pre-tax 401(k) contributions at the new employer to offset some of the inherited IRA income. We should also look at whether charitable giving through a donor-advised fund makes sense -- you can bunch deductions in a year where we're pulling more from the inherited IRA to get the itemized deduction over the standard deduction threshold. And frankly, the tax-loss harvesting in your taxable account can help offset some of the ordinary income too, indirectly.",
      },
      {
        speaker: "James Gordon",
        timestamp: "05:46",
        text: "Okay, this is exactly why I needed a planner. I was just going to let that IRA sit there and figure it out later. So that's a big one. What about the kids' college situation? That's the thing Patricia is most anxious about.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "05:58",
        text: "Tell me where things stand.",
      },
      {
        speaker: "James Gordon",
        timestamp: "06:01",
        text: "So we have two kids in college right now. Our daughter Lily is a junior at USC -- she's in the film production program, which is incredible but also incredibly expensive. Tuition, fees, housing -- we're looking at about eighty-five thousand a year. Then our son Marcus just started at Oregon State. He's doing computer science, which is more reasonable -- around thirty-two thousand a year with out-of-state tuition since we just moved.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "06:28",
        text: "That's a hundred and seventeen thousand a year combined. What's the 529 situation?",
      },
      {
        speaker: "James Gordon",
        timestamp: "06:33",
        text: "Not great, honestly. We started late. Lily's 529 has about twenty-eight thousand left. Marcus's has about forty-five thousand. So there's a significant gap, especially for Lily's remaining year and a half at USC. We've been cash-flowing the difference, which was manageable in Oregon with lower cost of living and no state tax, but now with the Pasadena mortgage and California taxes, it's tighter.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "06:58",
        text: "Okay, so let's map this out. Lily has roughly three semesters left at USC -- call it a hundred and twenty-eight thousand in remaining costs. You've got twenty-eight thousand in the 529, so the gap is about a hundred thousand. Marcus has probably six more semesters -- about ninety-six thousand remaining at Oregon State rates, with forty-five thousand in the 529, so his gap is about fifty-one thousand. Total funding gap of roughly a hundred and fifty thousand over the next three years.",
      },
      {
        speaker: "James Gordon",
        timestamp: "07:27",
        text: "When you lay it out like that, it's actually less scary than I thought. But where does it come from?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "07:32",
        text: "A few options. First, with your higher income now, you can cash-flow more of it. I'd estimate about five thousand a month from your paycheck could go toward education costs without pinching your other goals. That's sixty thousand a year. Second, we could tap the taxable account strategically -- sell some positions with a lower tax basis to cover the gaps. Third, and I want to be careful here, but some of the inherited IRA distributions that you have to take anyway could be earmarked for education costs.",
      },
      {
        speaker: "James Gordon",
        timestamp: "08:02",
        text: "I like the idea of using the inherited IRA distributions for tuition. My mom would have wanted that. She was a retired teacher -- education was everything to her.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "08:12",
        text: "That's a lovely way to honor her. We'll build that into the plan. James, I want to shift gears for a second and talk about goals. Beyond the tax optimization and the college funding, what does the big picture look like for you and Patricia? When do you want to retire? What does that look like?",
      },
      {
        speaker: "James Gordon",
        timestamp: "08:28",
        text: "You know, I've been thinking about that a lot since the move. I don't see myself doing this past sixty. That gives me eight more years. Patricia doesn't really want to retire -- the Etsy business is her passion, she'd do it for free. But I'd love to get to a place where work is optional by sixty. Maybe we move back to Oregon or up to Ashland. I miss the fly fishing, honestly. There's nothing like standing in the Deschutes River at dawn.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "08:52",
        text: "That's a beautiful vision. And with your savings rate at this income level, eight years is very achievable. The key is making sure we're not letting the California tax situation erode what should be a very strong accumulation phase. Between maxing the 401(k), managing the RSU taxes, strategically drawing down the inherited IRA, and getting the kids through school, there are a lot of moving pieces. But that's what I love about this work.",
      },
      {
        speaker: "James Gordon",
        timestamp: "09:14",
        text: "This is a lot more complicated than I thought when I walked in. I'm glad Patricia's friend recommended you.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "09:20",
        text: "I'm glad too. Here's what I'd like to do for next steps. I'm going to put together a comprehensive financial plan that covers the tax strategy for the RSU vesting, a distribution schedule for the inherited IRA that minimizes the tax hit over the ten-year window, a college funding roadmap for both Lily and Marcus, and a retirement projection based on the sixty-by-sixty goal. I'd also like Patricia to join us for the next meeting so she's part of the conversation.",
      },
      {
        speaker: "James Gordon",
        timestamp: "09:47",
        text: "Absolutely. She'll want to be there. She's the one who keeps asking me if we're going to be okay with all these changes.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "09:53",
        text: "Tell her that based on what I'm seeing, you're going to be more than okay. The fundamentals are strong. We just need to be smart about the tax planning and the sequencing. I'll have the draft plan ready in about ten days, and we can schedule that follow-up. Sound good?",
      },
      {
        speaker: "James Gordon",
        timestamp: "10:05",
        text: "Sounds great. And Sarah? Thanks for not making this feel overwhelming. I walked in here pretty stressed.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "10:11",
        text: "That's exactly what I'm here for. Oh, and James -- if you find any good fly fishing spots out here in Southern California, let me know. My dad's been looking for somewhere to cast a line.",
      },
      {
        speaker: "James Gordon",
        timestamp: "10:20",
        text: "Ha, it's not the Deschutes, but I've heard the Eastern Sierras have some decent trout streams. I'll do some recon this summer. Thanks again, Sarah.",
      },
    ],
  },
  {
    id: "transcript-007",
    meetingId: "meeting-007",
    entries: [
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:00",
        text: "Eleanor, come on in. It's so good to see you. How are you doing?",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "00:05",
        text: "Oh, I'm managing, dear. Some days are better than others. Hemingway -- that's my cat -- he's been very clingy lately, which I suppose is his way of looking after me. But I'm here, and I have my list of questions, so let's see if we can make sense of all this.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:18",
        text: "I love that you brought a list. That's perfect. And how's the watercolor class going? You mentioned you'd started one with Harriet.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "00:25",
        text: "Oh, it's lovely. Harriet Spencer talked me into it -- she's been going for years. I'm terrible at it, but the instructor says that's the point. Something about letting go of control. I told Harold -- well, I started to tell Harold, and then I remembered. That still happens sometimes.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:42",
        text: "That's completely natural, Eleanor. It's only been fourteen months. There's no timeline for this.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "00:48",
        text: "I know. Everyone says that. The grief counselor says it too. I just... Harold handled all of this, Sarah. Every bill, every investment, every tax return. For forty-three years. I was a librarian -- I organized books, not bank statements. And now I've got accounts at eight different places and I don't even understand half the statements that come in the mail.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "01:10",
        text: "And that's exactly why we're doing this. Eleanor, I want you to know that there is no question too basic, no concern too small. We're going to go through everything at whatever pace feels comfortable, and by the end of this process, you're going to understand where your money is, how it's working for you, and what you need to do. I promise.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "01:28",
        text: "Thank you. That means a lot. Okay, so where do we start?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "01:32",
        text: "Let's start with the big picture. I've been working through the statements and documents you dropped off last week, and I have a much clearer view now. Your total assets across all accounts come to approximately three point eight million dollars. That includes the investment accounts, the bank accounts, Harold's old business accounts, the life insurance proceeds, and the retirement accounts.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "01:55",
        text: "Three point eight million. You know, I hear that number and it doesn't feel real. Harold started as a framing carpenter. He built that contracting business from nothing. I just... I had no idea it had grown to this.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "02:10",
        text: "He did an incredible job providing for your family. And our job now is to make sure these assets take care of you for the rest of your life. So let me walk through where everything is. You've got accounts at Fidelity, Schwab, two local bank CDs, a Vanguard IRA, a small account at Edward Jones, the business checking at US Bank, and the life insurance proceeds that are sitting in a money market at Prudential. Eight institutions, like you said.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "02:38",
        text: "It's so scattered. Every few weeks I get a statement from somebody new and I put it on the pile. I've got a whole box at home.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "02:46",
        text: "Well, the first thing I want to recommend is consolidation. There's no reason to have your assets spread across eight institutions. It makes it nearly impossible to manage, and honestly, some of these accounts are in investments that aren't coordinated with each other. I'd like to consolidate everything into two institutions -- Fidelity for the investment accounts and one local bank for your checking and short-term needs.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "03:08",
        text: "That sounds so much simpler. But is it... is it safe to have everything in one place? Harold always said not to put all your eggs in one basket.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "03:16",
        text: "Harold was right about diversification in your investments, and we'll absolutely maintain that. But having multiple custodians doesn't add safety -- your accounts at Fidelity are protected by SIPC insurance up to five hundred thousand per account type, and the investments themselves are diversified across hundreds of companies and bonds. The consolidation is about simplification and coordination, not concentration.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "03:38",
        text: "Okay. That makes sense. I trust your judgment on that. Now, can I ask about something? My nephew -- he's a financial advisor at Edward Jones -- he keeps calling me and saying I should move everything to him. He means well, but it makes me uncomfortable.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "03:53",
        text: "I appreciate you being honest about that. Family and finances can be tricky. You're absolutely under no obligation to work with your nephew, and frankly, it's important that your advisor is someone you chose independently, without family pressure. If you'd like, I can handle the communication about closing that Edward Jones account so you don't have to have that conversation.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "04:10",
        text: "Oh, would you? That would be such a relief. I don't want to hurt his feelings, but I just... I need someone who's looking out for me, not someone who's going to make Thanksgiving awkward.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:20",
        text: "Say no more. I'll take care of it professionally. Now, let's talk about something really important -- the stepped-up basis on the assets you inherited from Harold. This is actually very good news from a tax perspective.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "04:32",
        text: "Stepped-up basis. Harold used to mention that. Something about the value resetting?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:38",
        text: "Exactly right. When Harold passed, the cost basis of the assets he owned -- or his share of jointly owned assets -- was reset to the fair market value on the date of his death. This is huge because Harold had been investing for decades. Some of those stock positions had enormous gains that would have been taxable if he'd sold them during his lifetime. But because of the step-up, those gains essentially disappeared for tax purposes.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "05:04",
        text: "So if I sell something now, I wouldn't owe as much in taxes?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "05:08",
        text: "In many cases, you'd owe little to no capital gains tax, at least on the portion that received the step-up. For example, Harold had about two hundred thousand dollars in a concentrated stock position -- a construction company stock he'd held for over twenty years. His original cost was about fifteen thousand. Normally, selling that would trigger a hundred and eighty-five thousand dollars in capital gains. But with the stepped-up basis, the gain is essentially zero since the stock hasn't moved much since the date of death.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "05:38",
        text: "My goodness. So we should sell that now before it changes?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "05:42",
        text: "That's exactly what I'd recommend. We want to take advantage of the stepped-up basis on any positions that are concentrated or not aligned with your needs. We sell them now, pay minimal tax, and redeploy into a diversified portfolio that generates income for you. The window is basically now, while the prices are close to the date-of-death value. If these positions appreciate significantly from here, you'd start building new gains.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "06:04",
        text: "Okay, let's do that. Now, Sarah, the thing that keeps me up at night... I just need to know -- am I going to be okay? Can I stay in the house? Can I keep living the way Harold and I lived? I don't need much, but I don't want to be a burden on my children.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "06:20",
        text: "Eleanor, I want to put your mind at ease. With three point eight million in assets and proper management, you are going to be absolutely fine. Let me show you some numbers. Your Social Security benefit -- you're receiving the higher survivor benefit from Harold's record, correct?",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "06:35",
        text: "Yes, they switched me over. I'm getting about thirty-eight hundred a month now.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "06:40",
        text: "Good, so that's forty-five thousand six hundred a year. Your essential living expenses -- mortgage is paid off, so we're talking property taxes, insurance, utilities, groceries, healthcare, car -- I'd estimate around seventy-two thousand a year. So you need about twenty-six to twenty-seven thousand a year from your investments to cover the basics. That's less than one percent of your portfolio. Even with travel, the watercolor classes, spoiling the grandkids, charitable giving -- let's say your total spending is ninety-five thousand a year. Your portfolio only needs to generate about fifty thousand a year after Social Security, which is a very comfortable withdrawal rate of about one point three percent.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "07:18",
        text: "One point three percent. Is that good? I don't know what's normal.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "07:22",
        text: "It's excellent. The standard guideline is four percent, and you're well under that. This means your portfolio isn't just sustaining your lifestyle -- it's going to continue to grow even while you're spending from it. You could increase your spending significantly and still be fine. Barring something truly catastrophic, you will not run out of money, Eleanor. Period.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "07:42",
        text: "Oh, Sarah. You have no idea how much I needed to hear that. I've been lying awake thinking about it. Harold always said we'd be fine, but he never showed me the numbers. I just had to trust him.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "07:55",
        text: "Well, now you've seen the numbers yourself. And going forward, I want you to understand every piece of your financial picture. No more trusting blindly. Not me, not anyone. I'll always explain the why behind every recommendation. Now, let me talk about how we generate that income. Right now, a lot of your money is sitting in cash and CDs earning very little. Those two bank CDs -- they're paying what, two and a quarter percent?",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "08:18",
        text: "Something like that. Harold set those up years ago. I've just been rolling them over.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "08:23",
        text: "We can do much better. Here's what I'm proposing for your overall allocation. About forty percent in high-quality bonds -- a mix of treasuries and investment-grade corporate bonds -- which will generate steady, predictable income. Another twenty percent in dividend-paying stocks -- blue chip companies that have been paying dividends for decades. Twenty percent in a diversified stock index fund for growth to keep pace with inflation over time. And twenty percent in cash, money markets, and short-term bonds as your safety net.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "08:54",
        text: "That sounds... conservative? Harold always said he liked to be aggressive.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "08:59",
        text: "Harold could afford to be aggressive because he had a high-income business generating cash flow. Your situation is different now. You're drawing from the portfolio, not adding to it. The priority shifts to preservation and income. And honestly, at one point three percent withdrawal rate, even this conservative allocation will likely grow your assets over time. You don't need to take big risks.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "09:18",
        text: "That makes sense. I don't want big risks. I want to sleep at night and know my library volunteering and my watercolors and my life aren't going to be disrupted.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "09:28",
        text: "They won't be. I'm going to make sure of that. So here are our action items. First, I'll start the account consolidation process -- I'll prepare the paperwork for transferring the Schwab, Vanguard, Edward Jones, and Prudential accounts into Fidelity. Second, we'll sell the stepped-up basis positions and redeploy into the new allocation. Third, I'll set up a monthly distribution from your investment account into your checking account so you have a predictable income stream, like a paycheck. Fourth, I'll handle the conversation with your nephew's office professionally.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "10:02",
        text: "A monthly distribution. I like that. How much would that be?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "10:06",
        text: "I'd suggest four thousand a month from the investment accounts. Combined with your Social Security of thirty-eight hundred, that gives you seventy-eight hundred a month of steady income, which covers your expenses with a nice buffer. And we can adjust it anytime.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "10:20",
        text: "That sounds manageable. And Sarah? I want to do something for my grandchildren -- maybe set up education accounts. Harold would have wanted that. But can we talk about that next time? I think I've absorbed about all I can for today.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "10:33",
        text: "Absolutely. We'll put that on the agenda for next time. Eleanor, you're doing great. I know this is a lot, and I know it's hard doing it without Harold. But you're not alone in this anymore. I'm here, and we're going to take it one step at a time.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "10:47",
        text: "Thank you, dear. You know, Harold would have liked you. He didn't trust many people with money, but he would have trusted you. I can tell.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "10:55",
        text: "That's the nicest thing anyone's said to me in a while. Give Hemingway a treat for me, and I'll see you in two weeks with the consolidation paperwork. Enjoy your watercolor class this weekend.",
      },
      {
        speaker: "Eleanor Vance",
        timestamp: "11:04",
        text: "I will. Harriet and I are painting landscapes this week. I'll try not to ruin it. Thank you, Sarah. Truly.",
      },
    ],
  },
  {
    id: "transcript-008",
    meetingId: "meeting-008",
    entries: [
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:00",
        text: "Tony, Angela, come on in. How's business?",
      },
      {
        speaker: "Tony Russo",
        timestamp: "00:04",
        text: "Can't complain. The Broomfield location just had its best quarter ever. The one on South Colorado is steady as always. Angela's got the numbers if you want to geek out.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "00:13",
        text: "I always have the numbers. Combined gross revenue across both locations was two point one million last quarter. Net operating income after everything -- labor, food costs, royalties, marketing -- was about three hundred and ten thousand. That's up eight percent year over year.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:27",
        text: "That's excellent. You two run a tight operation. And Tony, I saw the Boys and Girls Club gala photos on Instagram. Looked like a great event.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "00:35",
        text: "Yeah, we raised a hundred and twenty thousand for the after-school programs. That organization means the world to me. I was one of those kids, you know? Boys Club kept me off the streets in Pueblo. But hey, we're here to talk about Marco and the succession plan, right? That's the big one.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "00:50",
        text: "It is. Let's dig in. So Marco is a junior at CSU, studying business administration, and the plan is to transition one of the franchises to him over the next five years. Let's start with the big question -- which location, and why?",
      },
      {
        speaker: "Tony Russo",
        timestamp: "01:04",
        text: "The Broomfield one. It's newer, it's in a growing area, and honestly, it's the one that runs more smoothly right now. The South Colorado location is more complex -- older building, more maintenance, and the lease situation is different. I figured I'd give Marco the one where he can focus on growing the business rather than fighting fires.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "01:22",
        text: "Also, the Broomfield location is closer to Fort Collins, so when Marco graduates, he wouldn't have as long a commute while he's learning the ropes.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "01:31",
        text: "Those are both solid reasons. Now, there's a crucial first question. Tony, have you talked to Chick-fil-A corporate about the transfer? Because franchise transfers aren't automatic -- they have their own approval process.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "01:43",
        text: "Yeah, I've had preliminary conversations with my operator consultant. The good news is they're generally supportive of family transitions, especially when the successor has been involved in the business. Marco's been working at the Broomfield location every summer since he was sixteen. He knows the operation inside and out -- he can run a shift, he knows the inventory system, the team respects him.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "02:05",
        text: "That's great. His operational experience is going to matter a lot in their evaluation. Now, let's talk about the financial structure of the transition. You could do this several ways. A straight sale, a gifting strategy, or a combination. Given the business value and your estate planning goals, I'd recommend a hybrid approach.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "02:23",
        text: "What does that look like exactly?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "02:26",
        text: "So the Broomfield location -- we had it valued at about one point six million as a going concern, right? That includes goodwill, equipment, and the remaining lease value. Here's the structure I'm proposing. You gift Marco a minority interest of, say, twenty percent in year one. That's a gift of roughly three hundred and twenty thousand. With the annual gift exclusion and your lifetime estate exemption, there's no gift tax on that. Then over years two through five, Marco buys the remaining eighty percent through an installment sale, funded by the business's cash flow.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "03:00",
        text: "So the business essentially pays for itself. Marco uses the profits from his growing ownership stake to buy more of the business from Tony.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "03:08",
        text: "Exactly. And here's the tax advantage. By gifting the first twenty percent, you reduce the total amount subject to capital gains on the installment sale. On the remaining eighty percent -- about one point two eight million -- we structure the installment payments over five years. Tony, your gain on the sale portion, after your cost basis, will be taxed at long-term capital gains rates. But because it's spread over five years, you stay in a lower bracket each year rather than taking a big hit all at once.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "03:38",
        text: "What's my basis in the Broomfield location? I honestly don't remember.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "03:42",
        text: "I pulled the records. Your initial franchise fee was ten thousand -- that's the Chick-fil-A model, low entry cost. Equipment purchases over the years were about three hundred and forty thousand, mostly depreciated. Leasehold improvements, another hundred and sixty thousand. So your adjusted basis is probably in the two hundred to two-fifty range after depreciation recapture.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:02",
        text: "Angela, I love that you have all this at your fingertips. So we're looking at roughly a million dollars in gain on the sale portion. Spread over five years, that's about two hundred thousand a year in capital gains. At the long-term rate of twenty percent, plus the three point eight percent net investment income tax, you're looking at roughly forty-seven thousand a year in federal tax on the installment income. Very manageable.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "04:27",
        text: "That's a lot better than I expected. I thought Uncle Sam was going to eat me alive on this.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:32",
        text: "The installment sale is one of the best tools for business transitions for exactly that reason. Now, there's another piece we need to address -- the buy-sell agreement. You and Angela don't currently have a formal buy-sell agreement for the businesses, correct?",
      },
      {
        speaker: "Tony Russo",
        timestamp: "04:45",
        text: "No, we've just been operating on a handshake. Angela manages the books, I run the operations. Everything goes into the same pot.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "04:53",
        text: "We need to formalize that, especially now that we're bringing Marco into ownership. A buy-sell agreement protects everyone. It establishes what happens if one of you becomes disabled, if there's a divorce in the family, or God forbid, if someone passes unexpectedly. It also sets the valuation methodology so there are no disputes later. I've seen families torn apart by business succession without a proper buy-sell.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "05:15",
        text: "What about between Marco and us? Does he need to be part of the agreement too?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "05:19",
        text: "Yes. As Marco becomes an owner of the Broomfield location, we need a buy-sell that covers all parties. It should include a right of first refusal if Marco ever wants to sell his interest, disability and death provisions funded by life insurance, and a clear valuation formula that gets updated annually. I'd recommend we use a formula-based approach rather than a fixed price, so it adjusts with the business's performance.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "05:43",
        text: "Makes sense. I don't want any drama down the road. What about our daughter? Isabella just graduated from CU Boulder -- she's starting a marketing job in Denver. She has zero interest in the restaurants, but I want to make sure she doesn't feel left out.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "05:57",
        text: "Great question, and that's an estate planning consideration. One approach is to equalize the inheritance outside the business. As you receive the installment payments from Marco over five years, that cash can be directed into investment accounts earmarked for Isabella. You could also increase your life insurance to ensure Isabella receives a comparable inheritance. The key is transparency -- talk to both kids about the plan so there are no surprises.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "06:20",
        text: "We've already started that conversation. Isabella totally gets it. She said, and I quote, 'I love you, but I never want to smell like a fryer again.' She's supportive of Marco getting the restaurant.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "06:31",
        text: "Ha, well that makes things easier. Okay, let's pivot to retirement accounts. Tony, you're currently contributing to a SEP-IRA, right? How much did you put in last year?",
      },
      {
        speaker: "Tony Russo",
        timestamp: "06:41",
        text: "About fifty-eight thousand. My accountant said that was the max based on my net self-employment income.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "06:48",
        text: "That's probably right for the SEP. But I want to explore whether a solo 401(k) might be better for you at this point. With a solo 401(k), you can contribute as both employer and employee. The total limit for this year is sixty-nine thousand if you're under fifty, or seventy-six thousand five hundred with the catch-up contribution since you're over fifty. Plus, a solo 401(k) allows Roth contributions, which a SEP doesn't.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "07:12",
        text: "The Roth option is interesting. Tony's income is too high for a regular Roth IRA. This would be a way to get money into a Roth?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "07:19",
        text: "Exactly. You could split the contribution -- do the employer portion as pre-tax and the employee portion as Roth. Over the next fifteen years until retirement, building up a Roth bucket gives you tax-free income in retirement, which is incredibly valuable for tax diversification. And Tony, your current SEP-IRA has about six hundred and forty thousand in it. We can roll that into the solo 401(k) without any tax consequences.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "07:43",
        text: "Okay, I like the sound of that. Angela, what about you?",
      },
      {
        speaker: "Angela Russo",
        timestamp: "07:47",
        text: "I've been contributing to a traditional IRA, but it's only about a hundred and eighty thousand. If we set up a solo 401(k) for the business, can I contribute to it too?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "07:56",
        text: "If you're receiving W-2 income from the business or self-employment income, absolutely. And given that you're managing the books for both locations, you should be. That's another planning point -- we should make sure your compensation structure is optimized for retirement contributions. We'll work with your accountant on that.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "08:13",
        text: "Alright. Now, the other thing I wanted to talk about is the real estate situation. The Broomfield location, we lease. But the South Colorado building -- I own that personally and lease it to the business. My accountant keeps telling me I should put it in an LLC.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "08:28",
        text: "Your accountant is right. The South Colorado property should absolutely be in a separate LLC. Right now, if someone slips and falls at the restaurant and sues, they could potentially reach your personal assets because you own the building personally. An LLC creates a liability shield. Plus, it gives you more flexibility for estate planning -- you can gift LLC interests to the kids over time, and the value can be discounted for lack of marketability and lack of control, which reduces the gift tax impact.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "08:56",
        text: "What's the building worth now?",
      },
      {
        speaker: "Tony Russo",
        timestamp: "08:58",
        text: "Last appraisal was about one point four million. I bought it for six-fifty twelve years ago. It's on a good corner with excellent traffic. I've thought about selling it when we eventually close or sell the South Colorado location, but the capital gains would be enormous.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "09:12",
        text: "You've got about seven hundred and fifty thousand in gain there, minus depreciation recapture. But you have options. If you sell the building down the road, you could do a 1031 exchange into another investment property and defer the gains entirely. Or, if you hold it and pass it to your heirs, they get the stepped-up basis we talked about. There's no rush on that decision, but getting it into an LLC now is the priority.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "09:35",
        text: "Got it. One more thing. How's Marco going to handle the cash flow in the early years? He'll be making installment payments to me and also trying to run a business. I don't want to set him up to fail.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "09:47",
        text: "Great question, and honestly, this is the part that separates a successful transition from a failed one. Here's what I'd propose. In year one, Marco owns twenty percent as a gift and doesn't make any installment payments. He's learning, getting settled, and building his leadership. In year two, we start modest installment payments of about fifty thousand a year, increasing each year as his ownership stake and the business's cash flow grow. By year five, he's making the final payment and owns the business outright.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "10:14",
        text: "And during that time, Tony's still involved as a mentor?",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "10:18",
        text: "That's the ideal scenario. Tony stays on in a consulting or advisory capacity -- not running day-to-day operations, but available for the big decisions. It also gives Chick-fil-A corporate confidence that the transition is being managed responsibly.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "10:31",
        text: "I can do that. I'm not ready to sit on the couch anyway. But I do want to start stepping back. Angela and I want to travel. We've been saying we're going to go to Italy for ten years and we never go.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "10:42",
        text: "We're going to Italy, Tony. This is the year.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "10:46",
        text: "Good. You've earned it. So let me summarize the action items. One, I'll draft the financial structure for the franchise transition -- the gift-plus-installment-sale hybrid. Two, we need a business attorney to draft the buy-sell agreement covering you, Angela, and Marco. Three, I'll work with your accountant to set up the solo 401(k) and roll over the SEP-IRA. Four, we need to get the South Colorado property into an LLC. And five, I'll model out Marco's cash flow projections for years one through five to make sure the installment payments are sustainable.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "11:19",
        text: "That's a lot of moving pieces, but it feels like the right plan. Marco's going to be thrilled. He's been asking me about this since he was eighteen.",
      },
      {
        speaker: "Sarah Mitchell",
        timestamp: "11:27",
        text: "It sounds like you raised a young man who's ready for this. Let's make sure the financial and legal structure matches his ambition. I'll have the draft plan to you within two weeks, and then we'll want to meet with the attorney together. Tony, Angela -- go book that trip to Italy.",
      },
      {
        speaker: "Angela Russo",
        timestamp: "11:40",
        text: "Already looking at flights. Thank you, Sarah. This is a weight off our shoulders.",
      },
      {
        speaker: "Tony Russo",
        timestamp: "11:45",
        text: "Yeah, seriously. Thanks, Sarah. You're the best.",
      },
    ],
  },
];
