import { describe, expect, it } from 'vitest';
import { AnalyzeInputSchema, CivicAnalysisResultSchema, LocationInfoSchema } from '../src/schemas/civic.js';
import { CreateReportSchema, ReportStatusSchema, UpdateReportSchema } from '../src/schemas/report.js';

const analysisResult = {
  issueTitle: 'Blocked drain',
  category: 'Water & Utilities',
  summary: 'A public drain is blocked.',
  detailedDescription: 'Water is pooling around a blocked public drain.',
  severity: 'medium',
  urgency: 'high',
  location: { provided: true, description: 'Market Road' },
  evidence: [{ type: 'text', description: 'Citizen observation' }],
  detectedEntities: ['Drain'],
  recommendedDepartment: 'Public Works',
  recommendedAction: 'Inspect and clear the drain.',
  nextSteps: ['Verify location'],
  reportDraft: 'Civic complaint draft',
  confidence: 90,
  uncertainties: [],
  missingInformation: [],
  analysisEngine: 'diagnostic-fallback',
};

describe('civic schemas', () => {
  it('accepts a valid analysis result and location', () => {
    expect(CivicAnalysisResultSchema.safeParse(analysisResult).success).toBe(true);
    expect(LocationInfoSchema.safeParse({ provided: false, description: null }).success).toBe(true);
  });

  it('rejects invalid enums, missing required fields, and oversized input', () => {
    expect(CivicAnalysisResultSchema.safeParse({ ...analysisResult, severity: 'urgent' }).success).toBe(false);
    expect(CivicAnalysisResultSchema.safeParse({ ...analysisResult, issueTitle: '' }).success).toBe(false);
    expect(AnalyzeInputSchema.safeParse({ text: 'x'.repeat(5001) }).success).toBe(false);
    expect(LocationInfoSchema.safeParse({ provided: true, description: 123 }).success).toBe(false);
  });
});

describe('report schemas', () => {
  it('accepts valid statuses and update fields', () => {
    expect(ReportStatusSchema.safeParse('ACTION_READY').success).toBe(true);
    expect(UpdateReportSchema.safeParse({ issueTitle: 'New title', status: 'RESOLVED' }).success).toBe(true);
  });

  it('rejects malformed create and update payloads', () => {
    expect(CreateReportSchema.safeParse({ issueTitle: 'Only title' }).success).toBe(false);
    expect(UpdateReportSchema.safeParse({ status: 'CLOSED' }).success).toBe(false);
    expect(UpdateReportSchema.safeParse({ detailedDescription: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('strips unknown fields instead of allowing arbitrary report writes', () => {
    const parsed = UpdateReportSchema.parse({ issueTitle: 'Safe title', isAdmin: true });
    expect(parsed).toEqual({ issueTitle: 'Safe title' });
  });
});
