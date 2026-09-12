import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminDashboardScreen } from '../src/screens/AdminDashboardScreen';
import { CivicReport } from '../src/types/civic';
import { deleteReport, fetchReports, updateReport } from '../src/services/reportsApi';

vi.mock('../src/services/reportsApi', () => ({ fetchReports: vi.fn(), updateReport: vi.fn(), deleteReport: vi.fn() }));

const report: CivicReport = {
  id: 'REP-2026-5001', createdAt: '2026-09-11T10:00:00.000Z', updatedAt: '2026-09-11T10:00:00.000Z',
  status: 'ACTION_READY', category: 'Road Infrastructure', issueTitle: 'Pothole near school',
  detailedDescription: 'A deep pothole is affecting the school crossing.', summary: 'School crossing hazard',
  severity: 'high', urgency: 'high', location: { provided: true, description: 'Lincoln Avenue' },
  evidence: [{ type: 'text', description: 'Citizen observation' }], recommendedDepartment: 'Public Works',
  recommendedAction: 'Patch the pothole.', confidence: 88, uncertainties: ['Exact depth needs inspection'],
  missingInformation: [], analysisEngine: 'diagnostic-fallback',
};
const secondReport: CivicReport = { ...report, id: 'REP-2026-5002', issueTitle: 'Overflowing waste bin', category: 'Sanitation & Waste', status: 'RESOLVED', location: { provided: true, description: 'Market Road' } };

describe('AdminDashboardScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchReports).mockResolvedValue({ reports: [report, secondReport], total: 2, storageType: 'local_demo' });
    vi.mocked(updateReport).mockResolvedValue({ ...report, issueTitle: 'Repaired pothole' });
    vi.mocked(deleteReport).mockResolvedValue(true);
  });

  it('shows loading then calculates summaries from loaded reports', async () => {
    render(<AdminDashboardScreen onBack={vi.fn()} />);
    expect(screen.getByLabelText('Loading civic issues')).toBeInTheDocument();
    expect(await screen.findByText('Pothole near school')).toBeInTheDocument();
    expect(screen.getByText('2', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('filters issues by search and status', async () => {
    render(<AdminDashboardScreen onBack={vi.fn()} />);
    await screen.findByText('Pothole near school');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search civic issues' }), { target: { value: 'waste' } });
    expect(screen.queryByText('Pothole near school')).not.toBeInTheDocument();
    expect(screen.getByText('Overflowing waste bin')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by status' }), { target: { value: 'RESOLVED' } });
    expect(screen.getByText('Overflowing waste bin')).toBeInTheDocument();
  });

  it('opens view, saves edits, and deletes only after confirmation', async () => {
    render(<AdminDashboardScreen onBack={vi.fn()} />);
    await screen.findByText('Pothole near school');
    fireEvent.click(screen.getByRole('button', { name: 'View REP-2026-5001' }));
    expect(screen.getByRole('dialog', { name: 'Issue details' })).toHaveTextContent('User-provided facts');
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit REP-2026-5001' }));
    fireEvent.change(screen.getByLabelText('Issue title'), { target: { value: 'Repaired pothole' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(updateReport).toHaveBeenCalledWith('REP-2026-5001', expect.objectContaining({ issueTitle: 'Repaired pothole' })));
    expect(await screen.findByText('Report updated successfully.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete REP-2026-5001' }));
    expect(deleteReport).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(deleteReport).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Delete REP-2026-5001' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete Issue' }));
    await waitFor(() => expect(deleteReport).toHaveBeenCalledWith('REP-2026-5001'));
    expect(await screen.findByText('Issue deleted successfully.')).toBeInTheDocument();
  });
});
