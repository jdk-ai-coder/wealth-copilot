import { ClientDocument } from '../lib/types';

export const clientDocuments: Record<string, ClientDocument[]> = {
  'client-001': [
    { id: 'doc-001', clientId: 'client-001', name: '2025 Federal Tax Return', type: 'tax-return', uploadedAt: '2026-02-15', size: '2.4 MB' },
    { id: 'doc-002', clientId: 'client-001', name: '2025 Colorado State Return', type: 'tax-return', uploadedAt: '2026-02-15', size: '1.1 MB' },
    { id: 'doc-003', clientId: 'client-001', name: 'Revocable Living Trust', type: 'estate-plan', uploadedAt: '2024-08-20', size: '840 KB' },
    { id: 'doc-004', clientId: 'client-001', name: 'Umbrella Insurance Policy', type: 'insurance', uploadedAt: '2025-11-03', size: '520 KB' },
    { id: 'doc-005', clientId: 'client-001', name: 'DAF Grant Recommendations 2025', type: 'form', uploadedAt: '2025-12-10', size: '180 KB' },
    { id: 'doc-006', clientId: 'client-001', name: 'Roth Conversion Analysis Memo', type: 'other', uploadedAt: '2026-01-22', size: '340 KB' },
  ],
  'client-004': [
    { id: 'doc-007', clientId: 'client-004', name: 'Practice Partnership Agreement', type: 'agreement', uploadedAt: '2025-06-14', size: '1.8 MB' },
    { id: 'doc-008', clientId: 'client-004', name: 'Malpractice Insurance Policy', type: 'insurance', uploadedAt: '2025-03-01', size: '620 KB' },
    { id: 'doc-009', clientId: 'client-004', name: '2025 Federal Tax Return', type: 'tax-return', uploadedAt: '2026-02-20', size: '3.1 MB' },
    { id: 'doc-010', clientId: 'client-004', name: 'Defined Benefit Plan Document', type: 'agreement', uploadedAt: '2025-01-15', size: '2.2 MB' },
    { id: 'doc-011', clientId: 'client-004', name: '529 Plan Statements — Twins', type: 'statement', uploadedAt: '2026-01-31', size: '280 KB' },
  ],
  'client-006': [
    { id: 'doc-012', clientId: 'client-006', name: 'RSU Vesting Schedule', type: 'form', uploadedAt: '2026-01-08', size: '140 KB' },
    { id: 'doc-013', clientId: 'client-006', name: '10b5-1 Plan Draft', type: 'agreement', uploadedAt: '2026-02-25', size: '480 KB' },
    { id: 'doc-014', clientId: 'client-006', name: 'Lisa Practice Buy-In Loan Agreement', type: 'agreement', uploadedAt: '2025-04-10', size: '920 KB' },
    { id: 'doc-015', clientId: 'client-006', name: '2025 Federal Tax Return', type: 'tax-return', uploadedAt: '2026-02-18', size: '2.8 MB' },
    { id: 'doc-016', clientId: 'client-006', name: 'Stock Concentration Analysis', type: 'other', uploadedAt: '2026-02-20', size: '260 KB' },
    { id: 'doc-017', clientId: 'client-006', name: 'Term Life Insurance — David', type: 'insurance', uploadedAt: '2025-09-15', size: '380 KB' },
    { id: 'doc-018', clientId: 'client-006', name: 'Term Life Insurance — Lisa', type: 'insurance', uploadedAt: '2025-09-15', size: '360 KB' },
  ],
  'client-009': [
    { id: 'doc-019', clientId: 'client-009', name: 'Harold Vance Death Certificate', type: 'form', uploadedAt: '2025-02-10', size: '120 KB' },
    { id: 'doc-020', clientId: 'client-009', name: 'Estate Settlement Summary', type: 'estate-plan', uploadedAt: '2025-06-20', size: '1.4 MB' },
    { id: 'doc-021', clientId: 'client-009', name: 'Account Consolidation Tracker', type: 'other', uploadedAt: '2026-02-25', size: '90 KB' },
    { id: 'doc-022', clientId: 'client-009', name: 'Vanguard Account Statement', type: 'statement', uploadedAt: '2026-03-01', size: '220 KB' },
    { id: 'doc-023', clientId: 'client-009', name: 'Edward Jones Account Statement', type: 'statement', uploadedAt: '2026-03-01', size: '180 KB' },
    { id: 'doc-024', clientId: 'client-009', name: 'Pacific Life Insurance Policy', type: 'insurance', uploadedAt: '2026-03-01', size: '540 KB' },
  ],
  'client-010': [
    { id: 'doc-025', clientId: 'client-010', name: 'Chick-fil-A Franchise Agreement — Location 1', type: 'agreement', uploadedAt: '2024-11-10', size: '3.4 MB' },
    { id: 'doc-026', clientId: 'client-010', name: 'Chick-fil-A Franchise Agreement — Location 2', type: 'agreement', uploadedAt: '2024-11-10', size: '3.2 MB' },
    { id: 'doc-027', clientId: 'client-010', name: 'Buy-Sell Agreement (2022)', type: 'agreement', uploadedAt: '2022-08-15', size: '1.6 MB' },
    { id: 'doc-028', clientId: 'client-010', name: '2025 Business Tax Returns — Both Locations', type: 'tax-return', uploadedAt: '2026-02-28', size: '4.2 MB' },
    { id: 'doc-029', clientId: 'client-010', name: 'Location 2 Lease Agreement', type: 'agreement', uploadedAt: '2023-08-01', size: '780 KB' },
    { id: 'doc-030', clientId: 'client-010', name: 'Succession Planning Framework', type: 'other', uploadedAt: '2026-02-23', size: '420 KB' },
    { id: 'doc-031', clientId: 'client-010', name: 'SEP-IRA vs Solo 401(k) Comparison', type: 'other', uploadedAt: '2026-02-23', size: '180 KB' },
  ],
  'client-005': [
    { id: 'doc-032', clientId: 'client-005', name: 'Retirement Projection Report', type: 'other', uploadedAt: '2026-02-15', size: '560 KB' },
    { id: 'doc-033', clientId: 'client-005', name: 'ACA Marketplace Plan Comparison', type: 'insurance', uploadedAt: '2026-02-20', size: '340 KB' },
    { id: 'doc-034', clientId: 'client-005', name: 'Robert Pension Summary', type: 'statement', uploadedAt: '2026-01-10', size: '280 KB' },
    { id: 'doc-035', clientId: 'client-005', name: 'Social Security Optimization Analysis', type: 'other', uploadedAt: '2026-02-15', size: '420 KB' },
    { id: 'doc-036', clientId: 'client-005', name: '2025 Federal Tax Return', type: 'tax-return', uploadedAt: '2026-02-12', size: '2.1 MB' },
  ],
};
