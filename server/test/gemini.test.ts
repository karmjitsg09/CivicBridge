import { afterEach, describe, expect, it, vi } from 'vitest';

const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

import { analyzeCivicIssue } from '../src/services/gemini.js';

afterEach(() => {
  vi.unstubAllEnvs();
  generateContent.mockReset();
});

const validGeminiResponse = {
  issueTitle: 'Damaged sidewalk',
  category: 'Road Infrastructure',
  summary: 'A sidewalk section is damaged.',
  detailedDescription: 'A cracked sidewalk creates a trip hazard near a bus stop.',
  severity: 'medium',
  urgency: 'medium',
  location: { provided: true, description: 'Central bus stop' },
  evidence: [{ type: 'text', description: 'Citizen described visible cracks.' }],
  detectedEntities: ['Sidewalk'],
  recommendedDepartment: 'Public Works',
  recommendedAction: 'Inspect and repair the sidewalk.',
  nextSteps: ['Verify the bus stop location'],
  reportDraft: 'Municipal sidewalk repair request.',
  confidence: 86,
  uncertainties: ['Exact crack dimensions require inspection.'],
  missingInformation: [],
};

describe('Gemini service boundary', () => {
  it('validates successful Gemini JSON and marks its provenance', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    generateContent.mockResolvedValue({ text: JSON.stringify(validGeminiResponse) });

    const result = await analyzeCivicIssue({ text: 'There is a cracked sidewalk near the bus stop.' });

    expect(generateContent).toHaveBeenCalledOnce();
    expect(result.analysisEngine).toBe('gemini-2.5-flash');
    expect(result.issueTitle).toBe('Damaged sidewalk');
  });

  it('falls back to deterministic analysis when Gemini returns invalid output', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    generateContent.mockResolvedValue({ text: '{invalid json' });

    const result = await analyzeCivicIssue({ text: 'A large pothole is forcing cars to swerve.' });

    expect(result.analysisEngine).toBe('diagnostic-fallback');
    expect(result.category).toBe('Road Infrastructure');
    expect(result.uncertainties.length).toBeGreaterThan(0);
  });
});
