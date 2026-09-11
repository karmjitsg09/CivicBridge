import { Router, Request, Response, NextFunction } from 'express';
import { CreateReportSchema, UpdateReportSchema, CivicReport, ReportStatusSchema } from '../schemas/report.js';
import { reportStorage } from '../services/firestore.js';
import { reportsRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Session ID regex: alphanumeric, underscores, hyphens, length 8 to 128
const SESSION_ID_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;

/**
 * Middleware to strictly validate anonymous session header.
 * Rejects missing or malformed session IDs to prevent cross-session leakage.
 */
function validateSession(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['x-session-id'];

  if (typeof header !== 'string' || !header.trim()) {
    res.status(400).json({ error: 'Valid session ID header (x-session-id) is required.' });
    return;
  }

  const trimmed = header.trim();
  if (!SESSION_ID_REGEX.test(trimmed)) {
    res.status(400).json({ error: 'Malformed session ID header.' });
    return;
  }

  // Attach sanitized session ID to request
  (req as any).sessionId = trimmed;
  next();
}

// Generate server-side human-readable reference ID (e.g. REP-2026-4819)
function generateReportId(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `REP-${year}-${randomDigits}`;
}

// Apply rate limiting and session validation across all reports routes
router.use(reportsRateLimiter);
router.use(validateSession);

// POST /api/reports — Create and persist new civic report
router.post('/', async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).sessionId as string;
    const parsed = CreateReportSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid report data. Please verify all required fields.',
      });
      return;
    }

    const input = parsed.data;
    const now = new Date().toISOString();

    const report: CivicReport = {
      id: generateReportId(),
      sessionId,
      createdAt: now,
      updatedAt: now,
      status: input.initialStatus || 'ACTION_READY',
      statusNote: null,

      issueTitle: input.issueTitle,
      category: input.category,
      summary: input.summary || input.detailedDescription.slice(0, 150) + '...',
      detailedDescription: input.detailedDescription,

      severity: input.severity,
      urgency: input.urgency,
      location: input.location,

      evidence: input.evidence,
      detectedEntities: input.detectedEntities,

      recommendedDepartment: input.recommendedDepartment,
      recommendedAction: input.recommendedAction,
      nextSteps: input.nextSteps,

      reportDraft: input.reportDraft,

      confidence: input.confidence,
      uncertainties: input.uncertainties,
      missingInformation: input.missingInformation,

      analysisEngine: input.analysisEngine,
      storageType: reportStorage.getStorageType(),
    };

    const saved = await reportStorage.saveReport(report);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('[Reports Route Error - Create]: Internal storage error occurred');
    res.status(500).json({ error: 'Failed to save civic report to storage.' });
  }
});

// GET /api/reports — List all reports scoped to session with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).sessionId as string;
    
    // Sanitize and validate optional query parameters
    let status: string | undefined = undefined;
    if (typeof req.query.status === 'string') {
      const normalizedStatus = req.query.status.replace(' ', '_');
      const statusParsed = ReportStatusSchema.safeParse(normalizedStatus);
      if (statusParsed.success) {
        status = statusParsed.data;
      }
    }

    let search: string | undefined = undefined;
    if (typeof req.query.search === 'string') {
      search = req.query.search.slice(0, 100).trim();
    }

    const result = await reportStorage.getReportsBySession(sessionId, { status, search });

    res.status(200).json({
      reports: result.reports,
      total: result.reports.length,
      storageType: result.storageType,
    });
  } catch (error: any) {
    console.error('[Reports Route Error - List]: Internal query error occurred');
    res.status(500).json({ error: 'Failed to retrieve reports from storage.' });
  }
});

// GET /api/reports/:id — Retrieve specific report with ownership verification
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).sessionId as string;
    const id = req.params.id.slice(0, 50);

    const report = await reportStorage.getReportById(id, sessionId);
    if (!report) {
      res.status(404).json({ error: 'Report not found or not accessible by this session.' });
      return;
    }

    res.status(200).json(report);
  } catch (error: any) {
    console.error('[Reports Route Error - Get]: Internal retrieval error occurred');
    res.status(500).json({ error: 'Failed to retrieve report.' });
  }
});

// PATCH /api/reports/:id — Update report content or lifecycle status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).sessionId as string;
    const id = req.params.id.slice(0, 50);

    const parsed = UpdateReportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid update payload. Please check field formats.',
      });
      return;
    }

    const updated = await reportStorage.updateReport(id, sessionId, parsed.data);
    if (!updated) {
      res.status(404).json({ error: 'Report not found or not accessible by this session.' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('[Reports Route Error - Update]: Internal update error occurred');
    res.status(500).json({ error: 'Failed to update report in storage.' });
  }
});

// DELETE /api/reports/:id — Delete report scoped to session
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).sessionId as string;
    const id = req.params.id.slice(0, 50);

    const success = await reportStorage.deleteReport(id, sessionId);
    if (!success) {
      res.status(404).json({ error: 'Report not found or not accessible by this session.' });
      return;
    }

    res.status(200).json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('[Reports Route Error - Delete]: Internal delete error occurred');
    res.status(500).json({ error: 'Failed to delete report from storage.' });
  }
});

export default router;
