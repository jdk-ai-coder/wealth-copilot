import { Holding } from '../lib/types';

export const clientHoldings: Record<string, Holding[]> = {
  'client-001': [
    // Deborah & John Millman — $3.86M portfolio, Moderate
    { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', shares: 2_140, price: 282.50, value: 604_550, costBasis: 480_000, gain: 124_550, gainPct: 25.9, accountType: 'Joint Brokerage' },
    { ticker: 'VXUS', name: 'Vanguard Total International Stock ETF', shares: 3_200, price: 62.40, value: 199_680, costBasis: 176_000, gain: 23_680, gainPct: 13.5, accountType: 'Joint Brokerage' },
    { ticker: 'BND', name: 'Vanguard Total Bond Market ETF', shares: 4_800, price: 72.10, value: 346_080, costBasis: 350_400, gain: -4_320, gainPct: -1.2, accountType: 'Joint Brokerage' },
    { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF', shares: 1_600, price: 81.20, value: 129_920, costBasis: 104_000, gain: 25_920, gainPct: 24.9, accountType: 'Joint Brokerage' },
    { ticker: 'VFIAX', name: 'Vanguard 500 Index Fund', shares: 1_420, price: 485.30, value: 689_126, costBasis: 540_000, gain: 149_126, gainPct: 27.6, accountType: 'Traditional IRA (Deborah)' },
    { ticker: 'VTIP', name: 'Vanguard Short-Term TIPS ETF', shares: 2_600, price: 50.40, value: 131_040, costBasis: 130_000, gain: 1_040, gainPct: 0.8, accountType: 'Traditional IRA (John)' },
    { ticker: 'QQQ', name: 'Invesco QQQ Trust', shares: 520, price: 518.60, value: 269_672, costBasis: 208_000, gain: 61_672, gainPct: 29.7, accountType: 'Roth IRA (Deborah)' },
    { ticker: 'AAPL', name: 'Apple Inc.', shares: 400, price: 238.50, value: 95_400, costBasis: 64_000, gain: 31_400, gainPct: 49.1, accountType: 'Roth IRA (John)' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', shares: 280, price: 442.80, value: 123_984, costBasis: 78_400, gain: 45_584, gainPct: 58.1, accountType: 'Roth IRA (John)' },
  ],
  'client-003': [
    // Harriet & William Spencer — $3.62M, Conservative
    { ticker: 'BND', name: 'Vanguard Total Bond Market ETF', shares: 8_400, price: 72.10, value: 605_640, costBasis: 613_200, gain: -7_560, gainPct: -1.2, accountType: 'Joint Brokerage' },
    { ticker: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond', shares: 5_200, price: 81.30, value: 422_760, costBasis: 432_640, gain: -9_880, gainPct: -2.3, accountType: 'Joint Brokerage' },
    { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', shares: 1_800, price: 282.50, value: 508_500, costBasis: 378_000, gain: 130_500, gainPct: 34.5, accountType: 'Trust Account' },
    { ticker: 'VIG', name: 'Vanguard Dividend Appreciation ETF', shares: 2_400, price: 192.60, value: 462_240, costBasis: 360_000, gain: 102_240, gainPct: 28.4, accountType: 'Trust Account' },
    { ticker: 'VMFXX', name: 'Vanguard Federal Money Market', shares: 320_000, price: 1.00, value: 320_000, costBasis: 320_000, gain: 0, gainPct: 0, accountType: 'Cash Reserve' },
    { ticker: 'VGSH', name: 'Vanguard Short-Term Treasury ETF', shares: 5_100, price: 58.20, value: 296_820, costBasis: 300_900, gain: -4_080, gainPct: -1.4, accountType: 'Traditional IRA (Harriet)' },
  ],
  'client-006': [
    // David & Lisa Nakamura — $5.42M, Aggressive
    { ticker: 'PRIV', name: 'NovaTech Inc. (Private — Employer)', shares: 14_800, price: 142.00, value: 2_101_600, costBasis: 296_000, gain: 1_805_600, gainPct: 610.0, accountType: 'Individual Brokerage' },
    { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', shares: 2_600, price: 282.50, value: 734_500, costBasis: 546_000, gain: 188_500, gainPct: 34.5, accountType: 'Joint Brokerage' },
    { ticker: 'VXUS', name: 'Vanguard Total International Stock ETF', shares: 4_800, price: 62.40, value: 299_520, costBasis: 264_000, gain: 35_520, gainPct: 13.5, accountType: 'Joint Brokerage' },
    { ticker: 'QQQ', name: 'Invesco QQQ Trust', shares: 800, price: 518.60, value: 414_880, costBasis: 320_000, gain: 94_880, gainPct: 29.7, accountType: '401(k)' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 1_200, price: 178.40, value: 214_080, costBasis: 168_000, gain: 46_080, gainPct: 27.4, accountType: 'Roth IRA (David)' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', shares: 600, price: 212.30, value: 127_380, costBasis: 96_000, gain: 31_380, gainPct: 32.7, accountType: 'Roth IRA (Lisa)' },
  ],
  'client-004': [
    // Dr. Benjamin & Claire Stern — $6.2M, Moderate-Aggressive
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', shares: 3_400, price: 520.80, value: 1_770_720, costBasis: 1_224_000, gain: 546_720, gainPct: 44.7, accountType: 'Joint Brokerage' },
    { ticker: 'VXUS', name: 'Vanguard Total International Stock ETF', shares: 6_200, price: 62.40, value: 386_880, costBasis: 341_000, gain: 45_880, gainPct: 13.5, accountType: 'Joint Brokerage' },
    { ticker: 'BND', name: 'Vanguard Total Bond Market ETF', shares: 5_400, price: 72.10, value: 389_340, costBasis: 394_200, gain: -4_860, gainPct: -1.2, accountType: 'Joint Brokerage' },
    { ticker: 'VGT', name: 'Vanguard Information Technology ETF', shares: 1_200, price: 582.40, value: 698_880, costBasis: 480_000, gain: 218_880, gainPct: 45.6, accountType: 'Defined Benefit Plan' },
    { ticker: 'VTSAX', name: 'Vanguard Total Stock Market Index', shares: 2_800, price: 128.50, value: 359_800, costBasis: 280_000, gain: 79_800, gainPct: 28.5, accountType: '529 Plan (Twin 1)' },
    { ticker: 'VTSAX', name: 'Vanguard Total Stock Market Index', shares: 2_600, price: 128.50, value: 334_100, costBasis: 260_000, gain: 74_100, gainPct: 28.5, accountType: '529 Plan (Twin 2)' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', shares: 400, price: 890.20, value: 356_080, costBasis: 120_000, gain: 236_080, gainPct: 196.7, accountType: 'Roth IRA (Benjamin)' },
  ],
};
