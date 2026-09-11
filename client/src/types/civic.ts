export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus =
  | 'DRAFT'
  | 'ACTION READY'
  | 'ACTION_READY'
  | 'IN PROGRESS'
  | 'IN_PROGRESS'
  | 'RESOLVED';

export interface EvidenceItem {
  type: 'image' | 'text' | 'voice';
  description: string;
}

export interface LocationInfo {
  provided: boolean;
  description: string | null;
}

export interface CivicAnalysisResult {
  issueTitle: string;
  category: string;
  summary: string;
  detailedDescription: string;
  severity: SeverityLevel;
  urgency: UrgencyLevel;
  location: LocationInfo;
  evidence: EvidenceItem[];
  detectedEntities: string[];
  recommendedDepartment: string;
  recommendedAction: string;
  nextSteps: string[];
  reportDraft: string;
  confidence: number;
  uncertainties: string[];
  missingInformation: string[];
  analysisEngine?: 'gemini-2.5-flash' | 'diagnostic-fallback';
}

export interface CivicInputState {
  text: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  location: string;
  isTranscribing: boolean;
  voiceTranscript?: string;
  hasVoice?: boolean;
}

export interface CivicReport {
  id: string;
  sessionId?: string;
  createdAt: string;
  updatedAt?: string;
  status: ReportStatus;
  statusNote?: string | null;

  // Title / Headline
  issueTitle?: string;
  title?: string; // backwards compatibility

  // Details
  category: string;
  summary?: string;
  detailedDescription?: string;
  description?: string; // backwards compatibility

  // Classification
  severity: SeverityLevel;
  urgency: UrgencyLevel;
  location: LocationInfo | string;

  // Evidence & Department
  evidence?: EvidenceItem[];
  evidenceCount?: number;
  detectedEntities?: string[];
  recommendedDepartment: string;
  recommendedAction?: string;
  requestedAction?: string;
  nextSteps?: string[];

  // Formatted draft & Metrics
  reportDraft?: string;
  imagePreviewUrl?: string | null;
  confidence: number;
  uncertainties?: string[];
  missingInformation?: string[];

  // Engine & Storage metadata
  analysisEngine?: 'gemini-2.5-flash' | 'diagnostic-fallback';
  storageType?: 'firestore' | 'local_demo';
}

export type ScreenType =
  | 'home'
  | 'processing'
  | 'analysis'
  | 'action_center'
  | 'report_editor'
  | 'report_ready'
  | 'ledger'
  | 'how_it_works';
