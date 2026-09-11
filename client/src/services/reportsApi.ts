import { CivicReport } from '../types/civic';
import { getSessionHeaders } from './session';

const API_BASE = '/api/reports';
const REQUEST_TIMEOUT_MS = 15000;

export interface GetReportsResponse {
  reports: CivicReport[];
  total: number;
  storageType: 'firestore' | 'local_demo';
}

/**
 * Parses HTTP error response safely into citizen-friendly message
 */
async function parseErrorResponse(response: Response, defaultMessage: string): Promise<string> {
  if (response.status === 429) {
    return 'Rate limit reached. Please wait a moment before trying again.';
  }
  if (response.status === 404) {
    return 'The requested civic report could not be found.';
  }
  if (response.status === 400) {
    try {
      const json = await response.json();
      return json.error || 'Invalid report data submitted. Please check your fields.';
    } catch {
      return 'Invalid request format.';
    }
  }
  if (response.status >= 500) {
    return 'Civic storage service temporarily unavailable. Please try again.';
  }
  try {
    const json = await response.json();
    return json.error || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

/**
 * Performs fetch with timeout guard
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out after 15 seconds. Please check your connection.');
    }
    throw new Error('Network error: Unable to reach CivicBridge service.');
  }
}

export async function fetchReports(filters?: {
  status?: string;
  search?: string;
}): Promise<GetReportsResponse> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'ALL') {
    const normalized = filters.status.replace(' ', '_');
    params.set('status', normalized);
  }
  if (filters?.search && filters.search.trim()) {
    params.set('search', filters.search.trim().slice(0, 100));
  }

  const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetchWithTimeout(url, {
    headers: getSessionHeaders(),
  });

  if (!response.ok) {
    const msg = await parseErrorResponse(response, 'Failed to fetch reports.');
    throw new Error(msg);
  }

  const data = await response.json();
  const mappedReports: CivicReport[] = (data.reports || []).map((r: any) => ({
    ...r,
    title: r.issueTitle || r.title,
    description: r.detailedDescription || r.description,
  }));

  return {
    reports: mappedReports,
    total: data.total || mappedReports.length,
    storageType: data.storageType || 'local_demo',
  };
}

export async function fetchReportById(id: string): Promise<CivicReport> {
  const response = await fetchWithTimeout(`${API_BASE}/${encodeURIComponent(id)}`, {
    headers: getSessionHeaders(),
  });

  if (!response.ok) {
    const msg = await parseErrorResponse(response, 'Report not found.');
    throw new Error(msg);
  }

  const r = await response.json();
  return {
    ...r,
    title: r.issueTitle || r.title,
    description: r.detailedDescription || r.description,
  };
}

export async function createReport(reportData: any): Promise<CivicReport> {
  const payload = {
    issueTitle: reportData.issueTitle || reportData.title,
    category: reportData.category,
    summary: reportData.summary || '',
    detailedDescription: reportData.detailedDescription || reportData.description,
    severity: reportData.severity,
    urgency: reportData.urgency,
    location:
      typeof reportData.location === 'string'
        ? { provided: Boolean(reportData.location), description: reportData.location }
        : reportData.location,
    evidence: reportData.evidence || [],
    detectedEntities: reportData.detectedEntities || [],
    recommendedDepartment: reportData.recommendedDepartment,
    recommendedAction: reportData.recommendedAction,
    nextSteps: reportData.nextSteps || [],
    reportDraft: reportData.reportDraft || reportData.detailedDescription || '',
    confidence: reportData.confidence || 85,
    uncertainties: reportData.uncertainties || [],
    missingInformation: reportData.missingInformation || [],
    analysisEngine: reportData.analysisEngine || 'diagnostic-fallback',
    initialStatus: 'ACTION_READY',
  };

  const response = await fetchWithTimeout(API_BASE, {
    method: 'POST',
    headers: getSessionHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const msg = await parseErrorResponse(response, 'Failed to save civic report.');
    throw new Error(msg);
  }

  const created = await response.json();
  return {
    ...created,
    title: created.issueTitle || created.title,
    description: created.detailedDescription || created.description,
  };
}

export async function updateReport(id: string, updates: any): Promise<CivicReport> {
  const payload: Record<string, any> = {};

  if (updates.issueTitle || updates.title) {
    payload.issueTitle = updates.issueTitle || updates.title;
  }
  if (updates.category) payload.category = updates.category;
  if (updates.detailedDescription || updates.description) {
    payload.detailedDescription = updates.detailedDescription || updates.description;
  }
  if (updates.severity) payload.severity = updates.severity;
  if (updates.urgency) payload.urgency = updates.urgency;
  if (updates.location) {
    payload.location =
      typeof updates.location === 'string'
        ? { provided: Boolean(updates.location), description: updates.location }
        : updates.location;
  }
  if (updates.recommendedDepartment) payload.recommendedDepartment = updates.recommendedDepartment;
  if (updates.recommendedAction) payload.recommendedAction = updates.recommendedAction;
  if (updates.reportDraft) payload.reportDraft = updates.reportDraft;
  if (updates.status) {
    payload.status = updates.status.replace(' ', '_');
  }

  const response = await fetchWithTimeout(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: getSessionHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const msg = await parseErrorResponse(response, 'Failed to update report.');
    throw new Error(msg);
  }

  const updated = await response.json();
  return {
    ...updated,
    title: updated.issueTitle || updated.title,
    description: updated.detailedDescription || updated.description,
  };
}

export async function deleteReport(id: string): Promise<boolean> {
  const response = await fetchWithTimeout(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getSessionHeaders(),
  });

  if (!response.ok) {
    const msg = await parseErrorResponse(response, 'Failed to delete report.');
    throw new Error(msg);
  }

  const data = await response.json();
  return Boolean(data.success);
}
