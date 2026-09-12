import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../src/index.js';
import { reportStorage } from '../src/services/firestore.js';

const sessionId = 'test_session_001';

const validReport = {
  issueTitle: 'Overflowing public bin',
  category: 'Sanitation & Waste',
  summary: 'Waste is blocking the footpath.',
  detailedDescription: 'A public bin has overflowed beside the community center.',
  severity: 'medium',
  urgency: 'high',
  location: { provided: true, description: 'Community Center, Main Street' },
  evidence: [{ type: 'text', description: 'Citizen observed the overflowing bin.' }],
  detectedEntities: ['Waste bin'],
  recommendedDepartment: 'Department of Public Works',
  recommendedAction: 'Dispatch a sanitation crew.',
  nextSteps: ['Verify the location'],
  reportDraft: 'Municipal sanitation complaint draft.',
  confidence: 88,
  uncertainties: [],
  missingInformation: [],
  analysisEngine: 'diagnostic-fallback',
};

describe('CivicBridge API', () => {
  beforeEach(() => {
    reportStorage.resetForTests();
  });

  it('returns a stable health response without secrets and security headers', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'civicbridge-backend' });
    expect(response.body).not.toHaveProperty('apiKey');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('requires a valid session header for report operations', async () => {
    const missing = await request(app).get('/api/reports');
    const malformed = await request(app).get('/api/reports').set('x-session-id', 'bad');

    expect(missing.status).toBe(400);
    expect(malformed.status).toBe(400);
    expect(malformed.body.error).toContain('Malformed');
  });

  it('creates, lists, retrieves, updates, and deletes a report', async () => {
    const created = await request(app)
      .post('/api/reports')
      .set('x-session-id', sessionId)
      .send(validReport);

    expect(created.status).toBe(201);
    expect(created.body.id).toMatch(/^REP-\d{4}-\d{4}$/);
    expect(created.body.issueTitle).toBe(validReport.issueTitle);
    expect(created.body.sessionId).toBe(sessionId);

    const listed = await request(app).get('/api/reports').set('x-session-id', sessionId);
    expect(listed.status).toBe(200);
    expect(listed.body.reports.some((report: { id: string }) => report.id === created.body.id)).toBe(true);

    const retrieved = await request(app)
      .get(`/api/reports/${created.body.id}`)
      .set('x-session-id', sessionId);
    expect(retrieved.status).toBe(200);
    expect(retrieved.body.id).toBe(created.body.id);

    const updated = await request(app)
      .patch(`/api/reports/${created.body.id}`)
      .set('x-session-id', sessionId)
      .send({ issueTitle: 'Updated public bin', status: 'RESOLVED', unknownField: 'discard me' });
    expect(updated.status).toBe(200);
    expect(updated.body.issueTitle).toBe('Updated public bin');
    expect(updated.body.status).toBe('RESOLVED');
    expect(updated.body).not.toHaveProperty('unknownField');

    const deleted = await request(app)
      .delete(`/api/reports/${created.body.id}`)
      .set('x-session-id', sessionId);
    expect(deleted.status).toBe(200);
    expect(deleted.body).toMatchObject({ success: true, deletedId: created.body.id });

    const afterDelete = await request(app)
      .get(`/api/reports/${created.body.id}`)
      .set('x-session-id', sessionId);
    expect(afterDelete.status).toBe(404);
  });

  it('rejects invalid report payloads and inaccessible reports', async () => {
    const invalid = await request(app)
      .post('/api/reports')
      .set('x-session-id', sessionId)
      .send({ ...validReport, severity: 'urgent', detailedDescription: 42 });
    expect(invalid.status).toBe(400);

    const unknown = await request(app)
      .get('/api/reports/does-not-exist')
      .set('x-session-id', sessionId);
    expect(unknown.status).toBe(404);

    const created = await request(app)
      .post('/api/reports')
      .set('x-session-id', sessionId)
      .send(validReport);
    expect(created.status).toBe(201);

    const otherSession = await request(app)
      .get(`/api/reports/${created.body.id}`)
      .set('x-session-id', 'another_session_002');
    expect(otherSession.status).toBe(404);
  });

  it('uses the deterministic analysis fallback without calling Gemini', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .field('text', 'There is a dangerous pothole near the school crossing.')
      .field('location', 'Lincoln Avenue');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.analysisEngine).toBe('diagnostic-fallback');
    expect(response.body.data.category).toBe('Road Infrastructure');
    expect(response.body.data.evidence[0].type).toBe('text');
    expect(response.body.data.meta).toBeUndefined();
    expect(response.body.meta.isFallback).toBe(true);
  });

  it('rejects empty, unsupported, and spoofed image inputs', async () => {
    const empty = await request(app).post('/api/analyze');
    expect(empty.status).toBe(400);

    const unsupported = await request(app)
      .post('/api/analyze')
      .attach('image', Buffer.from('not an image'), { filename: 'notes.txt', contentType: 'text/plain' });
    expect(unsupported.status).toBe(400);
    expect(unsupported.body.error).toContain('Unsupported file type');

    const spoofed = await request(app)
      .post('/api/analyze')
      .attach('image', Buffer.from('not a real png'), { filename: 'evidence.png', contentType: 'image/png' });
    expect(spoofed.status).toBe(400);
    expect(spoofed.body.error).toContain('valid image signature');
  });

  it('sanitizes unexpected routes and server errors', async () => {
    const response = await request(app).get('/api/not-a-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Endpoint not found.' });
    expect(JSON.stringify(response.body)).not.toContain('at ');
  });
});
