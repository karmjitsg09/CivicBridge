import { z } from 'zod';

export const SeverityLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);
export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

export const UrgencyLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);
export type UrgencyLevel = z.infer<typeof UrgencyLevelSchema>;

export const EvidenceItemSchema = z.object({
  type: z.enum(['image', 'text', 'voice']),
  description: z.string().max(500).describe('What this piece of evidence demonstrates or contains'),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const LocationInfoSchema = z.object({
  provided: z.boolean().describe('Whether location was provided or detected'),
  description: z.string().max(500).nullable().describe('Specific address, landmark, intersection, or description if known'),
});
export type LocationInfo = z.infer<typeof LocationInfoSchema>;

export const CivicAnalysisResultSchema = z.object({
  issueTitle: z.string().min(1).max(300).describe('Clear, concise headline describing the civic issue'),
  category: z.string().min(1).max(100).describe('E.g. Road Infrastructure, Sanitation & Waste, Public Lighting, Water & Utilities, Traffic & Safety, Public Transit, Parks & Green Spaces'),
  summary: z.string().max(1000).describe('A 1-2 sentence executive summary of the issue'),
  detailedDescription: z.string().min(1).max(5000).describe('Structured, objective breakdown of what happened and current situation'),
  severity: SeverityLevelSchema.describe('Impact on safety, public health, or property'),
  urgency: UrgencyLevelSchema.describe('How rapidly action is required'),
  location: LocationInfoSchema,
  evidence: z.array(EvidenceItemSchema).max(20).describe('Verified evidence items from user input, photo, or transcribed audio'),
  detectedEntities: z.array(z.string().max(200)).max(30).describe('Specific objects, hazards, or assets detected'),
  recommendedDepartment: z.string().min(1).max(200).describe('The typical municipal department responsible'),
  recommendedAction: z.string().min(1).max(1000).describe('Primary concrete action needed'),
  nextSteps: z.array(z.string().max(500)).max(20).describe('Sequential, actionable steps for the citizen and civic dispatchers'),
  reportDraft: z.string().min(1).max(10000).describe('A complete, ready-to-file formal civic complaint text'),
  confidence: z.number().min(0).max(100).describe('Confidence score between 0 and 100 based on clarity and evidence'),
  uncertainties: z.array(z.string().max(500)).max(20).describe('Specific ambiguities or assumptions identified in the input'),
  missingInformation: z.array(z.string().max(500)).max(20).describe('Key details needed to file an official report'),
  analysisEngine: z.enum(['gemini-2.5-flash', 'diagnostic-fallback']).optional().describe('Engine that produced this analysis'),
});
export type CivicAnalysisResult = z.infer<typeof CivicAnalysisResultSchema>;

export const AnalyzeInputSchema = z.object({
  text: z.string().max(5000).optional(),
  location: z.string().max(500).optional(),
  voiceTranscript: z.string().max(5000).optional(),
});
export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;
