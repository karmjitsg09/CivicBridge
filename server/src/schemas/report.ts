import { z } from 'zod';
import {
  SeverityLevelSchema,
  UrgencyLevelSchema,
  EvidenceItemSchema,
  LocationInfoSchema,
} from './civic.js';

export const ReportStatusSchema = z.enum(['DRAFT', 'ACTION_READY', 'IN_PROGRESS', 'RESOLVED']);
export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export const CreateReportSchema = z.object({
  issueTitle: z.string().min(1).max(300),
  category: z.string().min(1).max(100),
  summary: z.string().max(1000).default(''),
  detailedDescription: z.string().min(1).max(5000),
  severity: SeverityLevelSchema,
  urgency: UrgencyLevelSchema,
  location: LocationInfoSchema,
  evidence: z.array(EvidenceItemSchema).max(20).default([]),
  detectedEntities: z.array(z.string().max(200)).max(30).default([]),
  recommendedDepartment: z.string().min(1).max(200),
  recommendedAction: z.string().min(1).max(1000),
  nextSteps: z.array(z.string().max(500)).max(20).default([]),
  reportDraft: z.string().min(1).max(10000),
  confidence: z.number().min(0).max(100).default(85),
  uncertainties: z.array(z.string().max(500)).max(20).default([]),
  missingInformation: z.array(z.string().max(500)).max(20).default([]),
  analysisEngine: z.enum(['gemini-2.5-flash', 'diagnostic-fallback']).default('diagnostic-fallback'),
  initialStatus: ReportStatusSchema.optional().default('ACTION_READY'),
});
export type CreateReportInput = z.infer<typeof CreateReportSchema>;

export const UpdateReportSchema = z.object({
  issueTitle: z.string().min(1).max(300).optional(),
  category: z.string().min(1).max(100).optional(),
  summary: z.string().max(1000).optional(),
  detailedDescription: z.string().min(1).max(5000).optional(),
  severity: SeverityLevelSchema.optional(),
  urgency: UrgencyLevelSchema.optional(),
  location: LocationInfoSchema.optional(),
  recommendedDepartment: z.string().min(1).max(200).optional(),
  recommendedAction: z.string().min(1).max(1000).optional(),
  reportDraft: z.string().min(1).max(10000).optional(),
  status: ReportStatusSchema.optional(),
});
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;

export const CivicReportSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: ReportStatusSchema,
  statusNote: z.string().nullable().optional(),
  
  issueTitle: z.string(),
  category: z.string(),
  summary: z.string(),
  detailedDescription: z.string(),
  
  severity: SeverityLevelSchema,
  urgency: UrgencyLevelSchema,
  location: LocationInfoSchema,
  
  evidence: z.array(EvidenceItemSchema),
  detectedEntities: z.array(z.string()),
  
  recommendedDepartment: z.string(),
  recommendedAction: z.string(),
  nextSteps: z.array(z.string()),
  
  reportDraft: z.string(),
  
  confidence: z.number().min(0).max(100),
  uncertainties: z.array(z.string()),
  missingInformation: z.array(z.string()),
  
  analysisEngine: z.enum(['gemini-2.5-flash', 'diagnostic-fallback']).optional(),
  storageType: z.enum(['firestore', 'local_demo']).default('local_demo'),
});
export type CivicReport = z.infer<typeof CivicReportSchema>;
