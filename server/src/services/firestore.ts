import { Firestore } from '@google-cloud/firestore';
import { CivicReport, UpdateReportInput } from '../schemas/report.js';

const COLLECTION_NAME = 'civic_reports';

// In-Memory Fallback Storage for local development when GCP credentials are not active
class LocalDemoStorage {
  private reports = new Map<string, CivicReport>();

  constructor() {
    this.seedInitialDemoData();
  }

  private seedInitialDemoData() {
    const seedReports: CivicReport[] = [
      {
        id: 'REP-2026-1042',
        sessionId: 'demo_seed_session',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'ACTION_READY',
        statusNote: null,
        issueTitle: 'Deep Roadway Cavity at Lincoln High School Crossing',
        category: 'Road Infrastructure',
        summary: 'Deep crater in active school crosswalk causing vehicle swerving into oncoming lane during drop-off hours.',
        detailedDescription: 'A severe pothole approximately 18 inches in diameter and 4 inches deep has developed directly on the pedestrian crossing outside Lincoln School. Vehicles are forced to veer into oncoming traffic.',
        severity: 'high',
        urgency: 'high',
        location: { provided: true, description: '1420 Lincoln Ave, opposite School Gate 2' },
        evidence: [
          { type: 'text', description: 'Citizen reported recurring vehicular swerve near school crosswalk' },
        ],
        detectedEntities: ['Pothole Cavity', 'Asphalt Delamination', 'Pedestrian Crosswalk'],
        recommendedDepartment: 'Department of Transportation & Municipal Road Maintenance',
        recommendedAction: 'Deploy emergency cold-mix patching crew and place high-visibility traffic cones immediately.',
        nextSteps: [
          'Review citizen report details and verify location accuracy',
          'Transmit structured complaint package to Department of Transportation',
          'Monitor municipal dispatch ledger for resolution confirmation',
        ],
        reportDraft: 'OFFICIAL MUNICIPAL WORK REQUEST: Roadway Surface Cavity\nLocation: 1420 Lincoln Ave\nUrgency: HIGH\nImmediate asphalt patching requested to protect school pedestrian crossing.',
        confidence: 94,
        uncertainties: ['Exact subsurface base failure depth unmeasured'],
        missingInformation: [],
        analysisEngine: 'gemini-2.5-flash',
        storageType: 'local_demo',
      },
      {
        id: 'REP-2026-1088',
        sessionId: 'demo_seed_session',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'RESOLVED',
        statusNote: 'Marked resolved by user',
        issueTitle: 'Continuous Potable Water Main Leak on Subterranean Pipe',
        category: 'Water & Utilities',
        summary: 'Clean water bubbling up through curb joint at 15 gallons/min without interruption for 48 hours.',
        detailedDescription: 'Pressurized clean water is escaping through the concrete curb joint at Elm and 5th St, washing away pavement foundation substrate.',
        severity: 'high',
        urgency: 'high',
        location: { provided: true, description: 'Corner of Elm St & 5th Ave' },
        evidence: [
          { type: 'text', description: 'Citizen observed continuous clear water pooling on dry day' },
        ],
        detectedEntities: ['Water Main Fracture', 'Pavement Undermining', 'Curb Joint'],
        recommendedDepartment: 'Municipal Water & Sewer Authority',
        recommendedAction: 'Dispatch acoustic leak detection team and isolation valve crew.',
        nextSteps: ['Dispatch utility team to isolate main valve', 'Excavate and repair pipe section'],
        reportDraft: 'UTILITY COMPLAINT: Continuous Potable Water Leak\nCorner of Elm St & 5th Ave\nImmediate valve shutoff and structural inspection needed.',
        confidence: 96,
        uncertainties: [],
        missingInformation: [],
        analysisEngine: 'gemini-2.5-flash',
        storageType: 'local_demo',
      },
    ];

    for (const r of seedReports) {
      this.reports.set(r.id, r);
    }
  }

  async save(report: CivicReport): Promise<CivicReport> {
    const stored = { ...report, storageType: 'local_demo' as const };
    this.reports.set(report.id, stored);
    return stored;
  }

  async getBySession(sessionId: string): Promise<CivicReport[]> {
    const list: CivicReport[] = [];
    for (const report of this.reports.values()) {
      // Return user session reports as well as initial seed demo reports so ledger is never blank
      if (report.sessionId === sessionId || report.sessionId === 'demo_seed_session') {
        list.push(report);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getById(id: string, sessionId: string): Promise<CivicReport | null> {
    const report = this.reports.get(id);
    if (!report) return null;
    if (report.sessionId !== sessionId && report.sessionId !== 'demo_seed_session') return null;
    return report;
  }

  async update(id: string, sessionId: string, updates: UpdateReportInput): Promise<CivicReport | null> {
    const report = await this.getById(id, sessionId);
    if (!report) return null;

    const updated: CivicReport = {
      ...report,
      ...updates,
      location: updates.location ? { ...report.location, ...updates.location } : report.location,
      status: updates.status || report.status,
      statusNote: updates.status === 'RESOLVED' ? 'Marked resolved by user' : report.statusNote,
      updatedAt: new Date().toISOString(),
      // Preserve AI provenance
      confidence: report.confidence,
      uncertainties: report.uncertainties,
      missingInformation: report.missingInformation,
      analysisEngine: report.analysisEngine,
      storageType: 'local_demo',
    };

    this.reports.set(id, updated);
    return updated;
  }

  async delete(id: string, sessionId: string): Promise<boolean> {
    const report = await this.getById(id, sessionId);
    if (!report) return false;
    return this.reports.delete(id);
  }
}

class ReportStorageService {
  private firestore: Firestore | null = null;
  private localDemo = new LocalDemoStorage();
  private firestoreAvailable = false;
  private initializationAttempted = false;

  constructor() {
    this.initFirestore();
  }

  private initFirestore() {
    if (this.initializationAttempted) return;
    this.initializationAttempted = true;

    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIRESTORE_PROJECT_ID;
      const clientEmail = process.env.FIRESTORE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIRESTORE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
      const rawCredentialsJson = process.env.GOOGLE_CREDENTIALS || process.env.FIRESTORE_CREDENTIALS;

      let credentials: { client_email: string; private_key: string } | undefined;

      // 1. Support raw JSON string directly from Vercel environment variables
      if (rawCredentialsJson) {
        try {
          const parsed = JSON.parse(rawCredentialsJson);
          if (parsed.client_email && parsed.private_key) {
            credentials = {
              client_email: parsed.client_email,
              private_key: parsed.private_key.replace(/\\n/g, '\n'),
            };
          }
        } catch {
          console.warn('[CivicBridge Storage] Failed to parse GOOGLE_CREDENTIALS JSON string from environment.');
        }
      } else if (clientEmail && rawPrivateKey) {
        // 2. Support discrete client_email and private_key environment variables
        credentials = {
          client_email: clientEmail,
          private_key: rawPrivateKey.replace(/\\n/g, '\n'),
        };
      }

      // Instantiate Firestore with in-memory credentials (for Vercel serverless) or default ADC (for Google Cloud)
      this.firestore = new Firestore({
        projectId: projectId || undefined,
        credentials: credentials || undefined,
      });

      // Probe Firestore connectivity asynchronously
      this.firestore
        .collection(COLLECTION_NAME)
        .limit(1)
        .get()
        .then(() => {
          this.firestoreAvailable = true;
          console.log('[CivicBridge Storage] Connected to Google Cloud Firestore.');
        })
        .catch((err) => {
          this.firestoreAvailable = false;
          console.log(`[CivicBridge Storage] Cloud Firestore unavailable (${err.message}). Activating Local Demo Storage.`);
        });
    } catch (e: any) {
      this.firestoreAvailable = false;
      console.log(`[CivicBridge Storage] Cloud Firestore initialization failed (${e.message}). Using Local Demo Storage.`);
    }
  }

  getStorageType(): 'firestore' | 'local_demo' {
    return this.firestoreAvailable ? 'firestore' : 'local_demo';
  }

  async saveReport(report: CivicReport): Promise<CivicReport> {
    if (this.firestoreAvailable && this.firestore) {
      try {
        const docRef = this.firestore.collection(COLLECTION_NAME).doc(report.id);
        const stored: CivicReport = { ...report, storageType: 'firestore' };
        await docRef.set(stored);
        return stored;
      } catch (err) {
        console.warn('[CivicBridge Storage] Firestore save failed, using local demo storage fallback:', err);
      }
    }
    return this.localDemo.save(report);
  }

  async getReportsBySession(
    sessionId: string,
    filters?: { status?: string; search?: string }
  ): Promise<{ reports: CivicReport[]; storageType: 'firestore' | 'local_demo' }> {
    let reports: CivicReport[] = [];
    let currentStorageType: 'firestore' | 'local_demo' = 'local_demo';

    if (this.firestoreAvailable && this.firestore) {
      try {
        currentStorageType = 'firestore';
        const snapshot = await this.firestore
          .collection(COLLECTION_NAME)
          .where('sessionId', '==', sessionId)
          .orderBy('createdAt', 'desc')
          .get();

        reports = snapshot.docs.map((doc) => doc.data() as CivicReport);
      } catch (err) {
        console.warn('[CivicBridge Storage] Firestore query failed, falling back to local demo:', err);
        currentStorageType = 'local_demo';
        reports = await this.localDemo.getBySession(sessionId);
      }
    } else {
      reports = await this.localDemo.getBySession(sessionId);
    }

    // Apply in-memory filtering for status and search
    if (filters?.status && filters.status !== 'ALL') {
      reports = reports.filter((r) => r.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(
        (r) =>
          r.issueTitle.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.location.description && r.location.description.toLowerCase().includes(q)) ||
          r.id.toLowerCase().includes(q)
      );
    }

    return {
      reports,
      storageType: currentStorageType,
    };
  }

  async getReportById(id: string, sessionId: string): Promise<CivicReport | null> {
    if (this.firestoreAvailable && this.firestore) {
      try {
        const doc = await this.firestore.collection(COLLECTION_NAME).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as CivicReport;
          if (data.sessionId === sessionId) {
            return data;
          }
        }
      } catch (err) {
        console.warn('[CivicBridge Storage] Firestore getById failed:', err);
      }
    }
    return this.localDemo.getById(id, sessionId);
  }

  async updateReport(
    id: string,
    sessionId: string,
    updates: UpdateReportInput
  ): Promise<CivicReport | null> {
    if (this.firestoreAvailable && this.firestore) {
      try {
        const docRef = this.firestore.collection(COLLECTION_NAME).doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          const existing = doc.data() as CivicReport;
          if (existing.sessionId === sessionId) {
            const updated: CivicReport = {
              ...existing,
              ...updates,
              location: updates.location ? { ...existing.location, ...updates.location } : existing.location,
              status: updates.status || existing.status,
              statusNote: updates.status === 'RESOLVED' ? 'Marked resolved by user' : existing.statusNote,
              updatedAt: new Date().toISOString(),
              confidence: existing.confidence,
              uncertainties: existing.uncertainties,
              missingInformation: existing.missingInformation,
              analysisEngine: existing.analysisEngine,
              storageType: 'firestore',
            };
            await docRef.set(updated, { merge: true });
            return updated;
          }
        }
      } catch (err) {
        console.warn('[CivicBridge Storage] Firestore update failed, falling back to local demo:', err);
      }
    }
    return this.localDemo.update(id, sessionId, updates);
  }

  async deleteReport(id: string, sessionId: string): Promise<boolean> {
    if (this.firestoreAvailable && this.firestore) {
      try {
        const docRef = this.firestore.collection(COLLECTION_NAME).doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          const existing = doc.data() as CivicReport;
          if (existing.sessionId === sessionId) {
            await docRef.delete();
            return true;
          }
        }
      } catch (err) {
        console.warn('[CivicBridge Storage] Firestore delete failed:', err);
      }
    }
    return this.localDemo.delete(id, sessionId);
  }
}

export const reportStorage = new ReportStorageService();
