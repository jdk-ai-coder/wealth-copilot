import { ClientDocument } from '../lib/types';

// Extract last name from client name for personalizing doc names
function lastName(name: string): string {
  const parts = name.replace(/^(Dr\.\s+)/, '').split(' ');
  return parts[parts.length - 1];
}

// Generate a standard set of docs for a client, personalized by name
function generateDocs(clientId: string, name: string, extras?: ClientDocument[]): ClientDocument[] {
  const ln = lastName(name);
  const base: ClientDocument[] = [
    { id: `${clientId}-doc-1`, clientId, name: `2025 Federal Tax Return — ${ln}`, type: 'tax-return', uploadedAt: '2026-02-15', size: '2.4 MB' },
    { id: `${clientId}-doc-2`, clientId, name: `2025 Colorado State Return — ${ln}`, type: 'tax-return', uploadedAt: '2026-02-15', size: '1.1 MB' },
    { id: `${clientId}-doc-3`, clientId, name: `Financial Plan — ${ln} Household`, type: 'other', uploadedAt: '2025-09-20', size: '1.8 MB' },
    { id: `${clientId}-doc-4`, clientId, name: `Investment Policy Statement — ${ln}`, type: 'agreement', uploadedAt: '2025-06-10', size: '420 KB' },
    { id: `${clientId}-doc-5`, clientId, name: `Quarterly Account Statement Q4 2025`, type: 'statement', uploadedAt: '2026-01-15', size: '340 KB' },
  ];
  return extras ? [...base, ...extras] : base;
}

export const clientDocuments: Record<string, ClientDocument[]> = {
  'client-001': generateDocs('client-001', 'Deborah & John Millman', [
    { id: 'doc-001-a', clientId: 'client-001', name: 'Revocable Living Trust — Millman', type: 'estate-plan', uploadedAt: '2024-08-20', size: '840 KB' },
    { id: 'doc-001-b', clientId: 'client-001', name: 'Umbrella Insurance Policy', type: 'insurance', uploadedAt: '2025-11-03', size: '520 KB' },
    { id: 'doc-001-c', clientId: 'client-001', name: 'DAF Grant Recommendations 2025', type: 'form', uploadedAt: '2025-12-10', size: '180 KB' },
    { id: 'doc-001-d', clientId: 'client-001', name: 'Roth Conversion Analysis Memo', type: 'other', uploadedAt: '2026-01-22', size: '340 KB' },
  ]),
  'client-002': generateDocs('client-002', 'James & Patricia Gordon', [
    { id: 'doc-002-a', clientId: 'client-002', name: 'Beneficiary IRA Distribution Strategy', type: 'other', uploadedAt: '2026-02-28', size: '280 KB' },
    { id: 'doc-002-b', clientId: 'client-002', name: 'RSU Vesting Schedule — Gordon', type: 'form', uploadedAt: '2026-03-01', size: '140 KB' },
    { id: 'doc-002-c', clientId: 'client-002', name: 'CA vs OR Tax Impact Analysis', type: 'other', uploadedAt: '2026-02-26', size: '360 KB' },
  ]),
  'client-003': generateDocs('client-003', 'Harriet & William Spencer', [
    { id: 'doc-003-a', clientId: 'client-003', name: 'Spencer Family Trust Document', type: 'estate-plan', uploadedAt: '2023-04-15', size: '1.2 MB' },
    { id: 'doc-003-b', clientId: 'client-003', name: 'QCD Strategy Memo 2026', type: 'other', uploadedAt: '2026-01-05', size: '220 KB' },
    { id: 'doc-003-c', clientId: 'client-003', name: 'Long-Term Care Policy — Harriet', type: 'insurance', uploadedAt: '2024-06-20', size: '480 KB' },
  ]),
  'client-004': generateDocs('client-004', 'Dr. Benjamin & Claire Stern', [
    { id: 'doc-004-a', clientId: 'client-004', name: 'Practice Partnership Agreement', type: 'agreement', uploadedAt: '2025-06-14', size: '1.8 MB' },
    { id: 'doc-004-b', clientId: 'client-004', name: 'Malpractice Insurance Policy', type: 'insurance', uploadedAt: '2025-03-01', size: '620 KB' },
    { id: 'doc-004-c', clientId: 'client-004', name: 'Defined Benefit Plan Document', type: 'agreement', uploadedAt: '2025-01-15', size: '2.2 MB' },
    { id: 'doc-004-d', clientId: 'client-004', name: '529 Plan Statements — Twins', type: 'statement', uploadedAt: '2026-01-31', size: '280 KB' },
  ]),
  'client-005': generateDocs('client-005', 'Margaret & Robert Kim', [
    { id: 'doc-005-a', clientId: 'client-005', name: 'Retirement Projection Report — Kim', type: 'other', uploadedAt: '2026-02-15', size: '560 KB' },
    { id: 'doc-005-b', clientId: 'client-005', name: 'ACA Marketplace Plan Comparison', type: 'insurance', uploadedAt: '2026-02-20', size: '340 KB' },
    { id: 'doc-005-c', clientId: 'client-005', name: 'Robert Kim Pension Summary', type: 'statement', uploadedAt: '2026-01-10', size: '280 KB' },
    { id: 'doc-005-d', clientId: 'client-005', name: 'Social Security Optimization Analysis', type: 'other', uploadedAt: '2026-02-15', size: '420 KB' },
  ]),
  'client-006': generateDocs('client-006', 'David & Lisa Nakamura', [
    { id: 'doc-006-a', clientId: 'client-006', name: 'RSU Vesting Schedule — Nakamura', type: 'form', uploadedAt: '2026-01-08', size: '140 KB' },
    { id: 'doc-006-b', clientId: 'client-006', name: '10b5-1 Plan Draft', type: 'agreement', uploadedAt: '2026-02-25', size: '480 KB' },
    { id: 'doc-006-c', clientId: 'client-006', name: 'Lisa Practice Buy-In Loan Agreement', type: 'agreement', uploadedAt: '2025-04-10', size: '920 KB' },
    { id: 'doc-006-d', clientId: 'client-006', name: 'Stock Concentration Analysis', type: 'other', uploadedAt: '2026-02-20', size: '260 KB' },
    { id: 'doc-006-e', clientId: 'client-006', name: 'Term Life Insurance — David', type: 'insurance', uploadedAt: '2025-09-15', size: '380 KB' },
    { id: 'doc-006-f', clientId: 'client-006', name: 'Term Life Insurance — Lisa', type: 'insurance', uploadedAt: '2025-09-15', size: '360 KB' },
  ]),
  'client-007': generateDocs('client-007', 'Frank Delgado', [
    { id: 'doc-007-a', clientId: 'client-007', name: 'Divorce Settlement Agreement', type: 'agreement', uploadedAt: '2026-02-10', size: '2.6 MB' },
    { id: 'doc-007-b', clientId: 'client-007', name: 'QDRO — Delgado 401(k)', type: 'form', uploadedAt: '2026-02-18', size: '320 KB' },
    { id: 'doc-007-c', clientId: 'client-007', name: 'Post-Divorce Budget Worksheet', type: 'other', uploadedAt: '2026-02-25', size: '180 KB' },
  ]),
  'client-008': generateDocs('client-008', 'Sandra & Michael Torres', [
    { id: 'doc-008-a', clientId: 'client-008', name: 'Sandra Torres Benefits Summary', type: 'form', uploadedAt: '2026-02-20', size: '240 KB' },
    { id: 'doc-008-b', clientId: 'client-008', name: 'Student Loan Payoff Analysis', type: 'other', uploadedAt: '2026-02-28', size: '280 KB' },
    { id: 'doc-008-c', clientId: 'client-008', name: 'Term Life Insurance Quote — Michael', type: 'insurance', uploadedAt: '2026-03-01', size: '160 KB' },
  ]),
  'client-009': generateDocs('client-009', 'Eleanor Vance', [
    { id: 'doc-009-a', clientId: 'client-009', name: 'Harold Vance Death Certificate', type: 'form', uploadedAt: '2025-02-10', size: '120 KB' },
    { id: 'doc-009-b', clientId: 'client-009', name: 'Estate Settlement Summary — Vance', type: 'estate-plan', uploadedAt: '2025-06-20', size: '1.4 MB' },
    { id: 'doc-009-c', clientId: 'client-009', name: 'Account Consolidation Tracker', type: 'other', uploadedAt: '2026-02-25', size: '90 KB' },
    { id: 'doc-009-d', clientId: 'client-009', name: 'Vanguard Account Statement', type: 'statement', uploadedAt: '2026-03-01', size: '220 KB' },
    { id: 'doc-009-e', clientId: 'client-009', name: 'Edward Jones Account Statement', type: 'statement', uploadedAt: '2026-03-01', size: '180 KB' },
    { id: 'doc-009-f', clientId: 'client-009', name: 'Pacific Life Insurance Policy', type: 'insurance', uploadedAt: '2026-03-01', size: '540 KB' },
  ]),
  'client-010': generateDocs('client-010', 'Tony & Angela Russo', [
    { id: 'doc-010-a', clientId: 'client-010', name: 'Chick-fil-A Franchise Agreement — Location 1', type: 'agreement', uploadedAt: '2024-11-10', size: '3.4 MB' },
    { id: 'doc-010-b', clientId: 'client-010', name: 'Chick-fil-A Franchise Agreement — Location 2', type: 'agreement', uploadedAt: '2024-11-10', size: '3.2 MB' },
    { id: 'doc-010-c', clientId: 'client-010', name: 'Buy-Sell Agreement (2022)', type: 'agreement', uploadedAt: '2022-08-15', size: '1.6 MB' },
    { id: 'doc-010-d', clientId: 'client-010', name: '2025 Business Tax Returns — Both Locations', type: 'tax-return', uploadedAt: '2026-02-28', size: '4.2 MB' },
    { id: 'doc-010-e', clientId: 'client-010', name: 'Succession Planning Framework', type: 'other', uploadedAt: '2026-02-23', size: '420 KB' },
  ]),
  'client-011': generateDocs('client-011', 'Priya & Arjun Mehta', [
    { id: 'doc-011-a', clientId: 'client-011', name: 'ESPP Share Diversification Plan', type: 'other', uploadedAt: '2026-01-20', size: '220 KB' },
    { id: 'doc-011-b', clientId: 'client-011', name: 'Term Life Insurance — Arjun', type: 'insurance', uploadedAt: '2025-08-12', size: '340 KB' },
  ]),
  'client-012': generateDocs('client-012', 'Charles & Evelyn Washington', [
    { id: 'doc-012-a', clientId: 'client-012', name: 'Fire Department Pension Statement', type: 'statement', uploadedAt: '2026-01-08', size: '180 KB' },
    { id: 'doc-012-b', clientId: 'client-012', name: 'Long-Term Care Policy Review', type: 'insurance', uploadedAt: '2025-10-15', size: '440 KB' },
  ]),
  'client-013': generateDocs('client-013', 'Rachel Goldstein', [
    { id: 'doc-013-a', clientId: 'client-013', name: 'Student Loan Consolidation Summary', type: 'other', uploadedAt: '2025-11-20', size: '260 KB' },
    { id: 'doc-013-b', clientId: 'client-013', name: 'Disability Insurance Policy', type: 'insurance', uploadedAt: '2025-07-01', size: '380 KB' },
  ]),
  'client-014': generateDocs('client-014', "William & Suzanne O'Brien", [
    { id: 'doc-014-a', clientId: 'client-014', name: 'Military Pension & Tricare Summary', type: 'statement', uploadedAt: '2025-12-01', size: '320 KB' },
    { id: 'doc-014-b', clientId: 'client-014', name: 'Breckenridge Cabin Rental Agreement', type: 'agreement', uploadedAt: '2025-05-10', size: '520 KB' },
  ]),
  'client-015': generateDocs('client-015', 'Mei-Ling Chen', [
    { id: 'doc-015-a', clientId: 'client-015', name: 'Equity Compensation Summary — Chen', type: 'form', uploadedAt: '2026-01-12', size: '180 KB' },
    { id: 'doc-015-b', clientId: 'client-015', name: 'Condo Pre-Approval Letter', type: 'other', uploadedAt: '2026-02-08', size: '140 KB' },
  ]),
  'client-016': generateDocs('client-016', 'Robert & Jennifer Hawkins', [
    { id: 'doc-016-a', clientId: 'client-016', name: 'Hawkins Family Trust', type: 'estate-plan', uploadedAt: '2024-11-20', size: '980 KB' },
    { id: 'doc-016-b', clientId: 'client-016', name: 'Charitable Remainder Trust Document', type: 'estate-plan', uploadedAt: '2025-03-15', size: '1.1 MB' },
  ]),
  'client-017': generateDocs('client-017', 'Marcus & Keisha Johnson', [
    { id: 'doc-017-a', clientId: 'client-017', name: 'PT Practice Business Plan', type: 'other', uploadedAt: '2025-08-20', size: '1.4 MB' },
    { id: 'doc-017-b', clientId: 'client-017', name: 'Practice Loan Agreement — Johnson PT', type: 'agreement', uploadedAt: '2022-06-15', size: '680 KB' },
    { id: 'doc-017-c', clientId: 'client-017', name: 'Term Life Insurance — Marcus', type: 'insurance', uploadedAt: '2025-09-01', size: '320 KB' },
  ]),
  'client-018': generateDocs('client-018', 'George & Irene Papadopoulos', [
    { id: 'doc-018-a', clientId: 'client-018', name: 'Restaurant Lease Agreement', type: 'agreement', uploadedAt: '2024-03-10', size: '720 KB' },
    { id: 'doc-018-b', clientId: 'client-018', name: 'SBA Loan Documentation', type: 'agreement', uploadedAt: '2024-03-10', size: '1.8 MB' },
  ]),
  'client-019': generateDocs('client-019', 'Tyler Brooks', [
    { id: 'doc-019-a', clientId: 'client-019', name: 'Rental Property Deed — Brooks', type: 'agreement', uploadedAt: '2025-04-22', size: '540 KB' },
    { id: 'doc-019-b', clientId: 'client-019', name: 'Solo 401(k) Plan Document', type: 'agreement', uploadedAt: '2025-08-15', size: '380 KB' },
  ]),
  'client-020': generateDocs('client-020', 'Diana & Harold Fitzgerald', [
    { id: 'doc-020-a', clientId: 'client-020', name: 'Fitzgerald Living Trust', type: 'estate-plan', uploadedAt: '2024-05-18', size: '920 KB' },
    { id: 'doc-020-b', clientId: 'client-020', name: 'Long-Term Care Policy — Both', type: 'insurance', uploadedAt: '2025-01-20', size: '560 KB' },
  ]),
  'client-021': generateDocs('client-021', 'Carlos & Maria Gutierrez', [
    { id: 'doc-021-a', clientId: 'client-021', name: 'Auto Shop Business Valuation', type: 'other', uploadedAt: '2025-10-05', size: '480 KB' },
    { id: 'doc-021-b', clientId: 'client-021', name: 'Commercial Property Insurance', type: 'insurance', uploadedAt: '2025-06-01', size: '420 KB' },
  ]),
  'client-022': generateDocs('client-022', 'Vivian & Thomas Park', [
    { id: 'doc-022-a', clientId: 'client-022', name: 'Park Family Trust Document', type: 'estate-plan', uploadedAt: '2025-02-14', size: '880 KB' },
    { id: 'doc-022-b', clientId: 'client-022', name: 'Umbrella Insurance Policy — Park', type: 'insurance', uploadedAt: '2025-07-20', size: '320 KB' },
  ]),
  'client-023': generateDocs('client-023', 'Nathan Rivera', [
    { id: 'doc-023-a', clientId: 'client-023', name: 'Rivera Consulting LLC Operating Agreement', type: 'agreement', uploadedAt: '2025-03-28', size: '440 KB' },
  ]),
  'client-024': generateDocs('client-024', 'Patricia & Donald Mitchell', [
    { id: 'doc-024-a', clientId: 'client-024', name: 'Mitchell Revocable Trust', type: 'estate-plan', uploadedAt: '2024-09-12', size: '760 KB' },
    { id: 'doc-024-b', clientId: 'client-024', name: 'Medicare Supplement Comparison', type: 'insurance', uploadedAt: '2025-11-10', size: '280 KB' },
  ]),
  'client-025': generateDocs('client-025', 'Aisha & Omar Hassan', [
    { id: 'doc-025-a', clientId: 'client-025', name: 'Hassan Family LLC Agreement', type: 'agreement', uploadedAt: '2025-05-20', size: '580 KB' },
    { id: 'doc-025-b', clientId: 'client-025', name: 'Halal Investment Screening Report', type: 'other', uploadedAt: '2026-01-15', size: '240 KB' },
  ]),
  'client-026': generateDocs('client-026', 'Christine & Edward Blake', [
    { id: 'doc-026-a', clientId: 'client-026', name: 'Blake Family Trust', type: 'estate-plan', uploadedAt: '2024-07-22', size: '840 KB' },
    { id: 'doc-026-b', clientId: 'client-026', name: 'Vacation Rental Property Deed', type: 'agreement', uploadedAt: '2025-02-18', size: '460 KB' },
  ]),
  'client-027': generateDocs('client-027', 'Samuel & Ruth Abramowitz', [
    { id: 'doc-027-a', clientId: 'client-027', name: 'Charitable Foundation Charter', type: 'agreement', uploadedAt: '2024-04-10', size: '1.2 MB' },
    { id: 'doc-027-b', clientId: 'client-027', name: 'Abramowitz Family Trust', type: 'estate-plan', uploadedAt: '2023-11-05', size: '920 KB' },
  ]),
  'client-028': generateDocs('client-028', 'Stephanie Liu', [
    { id: 'doc-028-a', clientId: 'client-028', name: 'Stock Option Exercise Schedule', type: 'form', uploadedAt: '2026-01-20', size: '160 KB' },
    { id: 'doc-028-b', clientId: 'client-028', name: 'Disability Insurance — Liu', type: 'insurance', uploadedAt: '2025-08-05', size: '340 KB' },
  ]),
  'client-029': generateDocs('client-029', 'Alan & Betty Kowalski', [
    { id: 'doc-029-a', clientId: 'client-029', name: 'Kowalski Family Trust', type: 'estate-plan', uploadedAt: '2024-10-18', size: '780 KB' },
    { id: 'doc-029-b', clientId: 'client-029', name: 'Social Security Claiming Strategy', type: 'other', uploadedAt: '2025-12-15', size: '320 KB' },
  ]),
  'client-030': generateDocs('client-030', 'Jasmine & Derek Williams', [
    { id: 'doc-030-a', clientId: 'client-030', name: 'Williams Home Purchase Contract', type: 'agreement', uploadedAt: '2025-11-08', size: '620 KB' },
    { id: 'doc-030-b', clientId: 'client-030', name: 'Term Life Insurance — Derek', type: 'insurance', uploadedAt: '2025-10-01', size: '280 KB' },
  ]),
  'client-031': generateDocs('client-031', 'Helen & Richard Bergstrom', [
    { id: 'doc-031-a', clientId: 'client-031', name: 'Bergstrom Living Trust', type: 'estate-plan', uploadedAt: '2024-06-30', size: '860 KB' },
    { id: 'doc-031-b', clientId: 'client-031', name: 'RMD Distribution Schedule 2026', type: 'form', uploadedAt: '2026-01-05', size: '120 KB' },
  ]),
  'client-032': generateDocs('client-032', 'Kevin & Amy Tran', [
    { id: 'doc-032-a', clientId: 'client-032', name: 'Tran Dental Practice Valuation', type: 'other', uploadedAt: '2025-09-22', size: '520 KB' },
    { id: 'doc-032-b', clientId: 'client-032', name: 'Practice Buy-In Agreement', type: 'agreement', uploadedAt: '2024-08-10', size: '780 KB' },
  ]),
  'client-033': generateDocs('client-033', 'Lawrence & Janet Crawford', [
    { id: 'doc-033-a', clientId: 'client-033', name: 'Crawford Charitable Remainder Trust', type: 'estate-plan', uploadedAt: '2025-01-28', size: '940 KB' },
    { id: 'doc-033-b', clientId: 'client-033', name: 'Mineral Rights Agreement — Crawford', type: 'agreement', uploadedAt: '2024-05-15', size: '380 KB' },
  ]),
  'client-034': generateDocs('client-034', 'Rebecca & Jonathan Okafor', [
    { id: 'doc-034-a', clientId: 'client-034', name: 'Okafor Family Trust', type: 'estate-plan', uploadedAt: '2025-04-12', size: '820 KB' },
    { id: 'doc-034-b', clientId: 'client-034', name: 'Employer Stock Purchase Plan — Rebecca', type: 'form', uploadedAt: '2026-01-10', size: '180 KB' },
  ]),
  'client-035': generateDocs('client-035', 'Douglas & Linda Pearson', [
    { id: 'doc-035-a', clientId: 'client-035', name: 'Pearson Family Ranch LLC', type: 'agreement', uploadedAt: '2024-02-20', size: '680 KB' },
    { id: 'doc-035-b', clientId: 'client-035', name: 'Farm Property Insurance', type: 'insurance', uploadedAt: '2025-06-15', size: '420 KB' },
  ]),
  'client-036': generateDocs('client-036', 'Andrea Simmons', [
    { id: 'doc-036-a', clientId: 'client-036', name: 'Simmons Consulting LLC Agreement', type: 'agreement', uploadedAt: '2025-07-18', size: '380 KB' },
    { id: 'doc-036-b', clientId: 'client-036', name: 'Solo 401(k) Plan — Simmons', type: 'agreement', uploadedAt: '2025-08-22', size: '440 KB' },
  ]),
  'client-037': generateDocs('client-037', 'Howard & Diane Yamamoto', [
    { id: 'doc-037-a', clientId: 'client-037', name: 'Yamamoto Family Trust', type: 'estate-plan', uploadedAt: '2024-08-14', size: '920 KB' },
    { id: 'doc-037-b', clientId: 'client-037', name: 'Long-Term Care Policy — Howard', type: 'insurance', uploadedAt: '2025-03-20', size: '480 KB' },
  ]),
  'client-038': generateDocs('client-038', 'Ryan & Michelle Foster', [
    { id: 'doc-038-a', clientId: 'client-038', name: 'Foster Rental Portfolio Summary', type: 'other', uploadedAt: '2025-12-08', size: '340 KB' },
    { id: 'doc-038-b', clientId: 'client-038', name: '1031 Exchange Documentation', type: 'form', uploadedAt: '2025-10-25', size: '580 KB' },
  ]),
  'client-039': generateDocs('client-039', 'Vincent & Claudia Moretti', [
    { id: 'doc-039-a', clientId: 'client-039', name: 'Moretti Wine Import LLC Agreement', type: 'agreement', uploadedAt: '2024-09-05', size: '620 KB' },
    { id: 'doc-039-b', clientId: 'client-039', name: 'Business Liability Insurance', type: 'insurance', uploadedAt: '2025-05-12', size: '380 KB' },
  ]),
  'client-040': generateDocs('client-040', 'Grace & Peter Andersen', [
    { id: 'doc-040-a', clientId: 'client-040', name: 'Andersen Family Trust', type: 'estate-plan', uploadedAt: '2024-12-10', size: '840 KB' },
    { id: 'doc-040-b', clientId: 'client-040', name: 'Peter Andersen Pension Election', type: 'form', uploadedAt: '2025-11-28', size: '220 KB' },
  ]),
  'client-041': generateDocs('client-041', 'Martin & Susan Blackwell', [
    { id: 'doc-041-a', clientId: 'client-041', name: 'Blackwell Living Trust', type: 'estate-plan', uploadedAt: '2025-01-15', size: '780 KB' },
    { id: 'doc-041-b', clientId: 'client-041', name: 'Umbrella Policy — Blackwell', type: 'insurance', uploadedAt: '2025-09-10', size: '360 KB' },
  ]),
  'client-042': generateDocs('client-042', 'Rose Chen', [
    { id: 'doc-042-a', clientId: 'client-042', name: 'Prospect Intake Questionnaire — Chen', type: 'form', uploadedAt: '2026-03-02', size: '80 KB' },
  ]),
};
