import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Database,
  Edit3,
  Eye,
  FileText,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { CivicReport, ReportStatus, SeverityLevel, UrgencyLevel } from '../types/civic';
import { fetchReports, updateReport, deleteReport } from '../services/reportsApi';
import { Button } from '../components/common/Button';
import { StatusPill } from '../components/common/Card';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

type Dialog = 'view' | 'edit' | 'delete' | null;
type SortOrder = 'newest' | 'oldest';

const statuses: ReportStatus[] = ['DRAFT', 'ACTION READY', 'IN PROGRESS', 'RESOLVED'];
const severityOptions: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
const urgencyOptions: UrgencyLevel[] = ['low', 'medium', 'high', 'critical'];

const normalizeStatus = (status: string): ReportStatus => {
  const normalized = status.replace(/_/g, ' ').toUpperCase();
  return statuses.includes(normalized as ReportStatus) ? normalized as ReportStatus : 'DRAFT';
};

const reportTitle = (report: CivicReport) => report.issueTitle || report.title || 'Untitled civic issue';
const reportDescription = (report: CivicReport) => report.detailedDescription || report.description || report.summary || 'No description provided.';
const reportLocation = (report: CivicReport) => typeof report.location === 'string' ? report.location : report.location?.description || 'Location not provided';
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value.replace(' ', 'T'))) : 'Date unavailable';

const initialForm = (report: CivicReport) => ({
  issueTitle: reportTitle(report),
  category: report.category || '',
  detailedDescription: reportDescription(report),
  status: normalizeStatus(report.status),
  severity: report.severity || 'medium',
  urgency: report.urgency || 'medium',
  location: reportLocation(report) === 'Location not provided' ? '' : reportLocation(report),
  recommendedAction: report.recommendedAction || report.requestedAction || '',
});

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onBack }) => {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [storageType, setStorageType] = useState<'firestore' | 'local_demo'>('local_demo');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReportStatus>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [dialog, setDialog] = useState<Dialog>(null);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [form, setForm] = useState<ReturnType<typeof initialForm> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchReports();
      setReports(response.reports);
      setStorageType(response.storageType);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load civic issues. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadReports(); }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!dialog) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) closeDialog();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog, isSubmitting]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...reports]
      .filter((report) => {
        const matchesSearch = !query || [report.id, reportTitle(report), reportDescription(report), report.category, reportLocation(report)]
          .some((field) => field.toLowerCase().includes(query));
        const matchesStatus = statusFilter === 'ALL' || normalizeStatus(report.status) === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const difference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? -difference : difference;
      });
  }, [reports, searchQuery, statusFilter, sortOrder]);

  const counts = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((report) => normalizeStatus(report.status) === 'ACTION READY' || normalizeStatus(report.status) === 'DRAFT').length,
    inProgress: reports.filter((report) => normalizeStatus(report.status) === 'IN PROGRESS').length,
    resolved: reports.filter((report) => normalizeStatus(report.status) === 'RESOLVED').length,
  }), [reports]);

  const openDialog = (nextDialog: Exclude<Dialog, null>, report: CivicReport) => {
    setSelectedReport(report);
    setActionError(null);
    setForm(nextDialog === 'edit' ? initialForm(report) : null);
    setDialog(nextDialog);
  };

  const closeDialog = (force = false) => {
    if (force || !isSubmitting) {
      setDialog(null);
      setSelectedReport(null);
      setActionError(null);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedReport || !form) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const updated = await updateReport(selectedReport.id, {
        ...form,
        location: form.location,
        status: form.status.replace(/ /g, '_'),
      });
      setReports((current) => current.map((report) => report.id === updated.id ? updated : report));
      closeDialog(true);
      setToast('Report updated successfully.');
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to update this issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      await deleteReport(selectedReport.id);
      setReports((current) => current.filter((report) => report.id !== selectedReport.id));
      closeDialog(true);
      setToast('Issue deleted successfully.');
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <button className="admin-back-link" onClick={onBack}><ArrowLeft size={16} /> Back to CivicBridge</button>
            <div className="admin-kicker"><span className="admin-kicker-mark"><ClipboardList size={15} /></span> Operations console</div>
            <h1>Admin Dashboard</h1>
            <p>Manage and review submitted civic issues.</p>
          </div>
          <div className="admin-storage-badge"><Database size={15} /> {storageType === 'firestore' ? 'Cloud Firestore' : 'Local Demo Storage'}</div>
        </header>

        <section className="admin-summary-grid" aria-label="Issue summary">
          <SummaryCard label="Total Issues" value={counts.total} icon={<ClipboardList size={20} />} tone="blue" />
          <SummaryCard label="Pending" value={counts.pending} icon={<Clock3 size={20} />} tone="orange" />
          <SummaryCard label="In Progress" value={counts.inProgress} icon={<RefreshCw size={20} />} tone="violet" />
          <SummaryCard label="Resolved" value={counts.resolved} icon={<CheckCircle2 size={20} />} tone="green" />
        </section>

        <section className="admin-issues-section" aria-labelledby="civic-issues-heading">
          <div className="admin-section-heading">
            <div><h2 id="civic-issues-heading">Civic Issues</h2><p>Review, update, or remove submitted reports.</p></div>
            <Button variant="secondary" size="sm" onClick={() => void loadReports()} loading={isLoading} icon={<RefreshCw size={15} />}>Refresh</Button>
          </div>
          <div className="admin-toolbar">
            <label className="admin-search"><Search size={18} /><span className="sr-only">Search civic issues</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by ID, title, category, or location" />{searchQuery && <button aria-label="Clear search" onClick={() => setSearchQuery('')}><X size={16} /></button>}</label>
            <label className="admin-select-label"><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'ALL' | ReportStatus)}><option value="ALL">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>
            <label className="admin-select-label"><span className="sr-only">Sort issues</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
          </div>

          {error && <div className="admin-alert admin-alert-error" role="alert"><AlertTriangle size={18} /><span>{error}</span><button onClick={() => void loadReports()}>Retry</button></div>}
          {isLoading && <LoadingState />}
          {!isLoading && !error && reports.length === 0 && <EmptyState />}
          {!isLoading && !error && reports.length > 0 && filteredReports.length === 0 && <div className="admin-no-match"><Search size={24} /><strong>No issues match your search.</strong><button onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}>Clear filters</button></div>}
          {!isLoading && !error && filteredReports.length > 0 && <IssueList reports={filteredReports} onView={(report) => openDialog('view', report)} onEdit={(report) => openDialog('edit', report)} onDelete={(report) => openDialog('delete', report)} />}
        </section>
      </div>

      {dialog && selectedReport && <DialogOverlay onClose={closeDialog} title={dialog === 'view' ? 'Issue details' : dialog === 'edit' ? 'Edit issue' : 'Delete this issue?'}>
        {dialog === 'view' && <ViewDialog report={selectedReport} />}
        {dialog === 'edit' && form && <form onSubmit={handleSave} className="admin-edit-form"><div className="admin-form-grid"><Field label="Issue title" value={form.issueTitle} onChange={(value) => setForm({ ...form, issueTitle: value })} required /><Field label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} required /><SelectField label="Status" value={form.status} options={statuses} onChange={(value) => setForm({ ...form, status: value as ReportStatus })} /><SelectField label="Severity" value={form.severity} options={severityOptions} onChange={(value) => setForm({ ...form, severity: value as SeverityLevel })} /><SelectField label="Urgency" value={form.urgency} options={urgencyOptions} onChange={(value) => setForm({ ...form, urgency: value as UrgencyLevel })} /><Field label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} /></div><TextArea label="Description" value={form.detailedDescription} onChange={(value) => setForm({ ...form, detailedDescription: value })} required /><TextArea label="Recommended action" value={form.recommendedAction} onChange={(value) => setForm({ ...form, recommendedAction: value })} required /><DialogError message={actionError} /><div className="admin-dialog-actions"><Button type="button" variant="ghost" onClick={() => closeDialog()}>Cancel</Button><Button type="submit" variant="cobalt" loading={isSubmitting} icon={<CheckCircle2 size={17} />}>Save Changes</Button></div></form>}
        {dialog === 'delete' && <div className="admin-delete-dialog"><div className="admin-delete-icon"><Trash2 size={24} /></div><p>You are about to permanently remove <strong>{selectedReport.id}</strong> from the Civic Ledger.</p><DialogError message={actionError} /><div className="admin-dialog-actions"><Button type="button" variant="ghost" onClick={() => closeDialog()}>Cancel</Button><Button type="button" variant="coral" onClick={() => void handleDelete()} loading={isSubmitting} icon={<Trash2 size={17} />}>Delete Issue</Button></div></div>}
      </DialogOverlay>}
      {toast && <div className="admin-toast" role="status"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: number; icon: React.ReactNode; tone: string }> = ({ label, value, icon, tone }) => <div className={`admin-summary-card admin-tone-${tone}`}><div className="admin-summary-icon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div></div>;

const IssueList: React.FC<{ reports: CivicReport[]; onView: (report: CivicReport) => void; onEdit: (report: CivicReport) => void; onDelete: (report: CivicReport) => void }> = ({ reports, onView, onEdit, onDelete }) => <div className="admin-issue-list">{reports.map((report) => <article className="admin-issue-row" key={report.id}><div className="admin-issue-main"><span className="admin-report-id">{report.id}</span><h3>{reportTitle(report)}</h3><p>{reportDescription(report)}</p></div><div className="admin-issue-meta"><span className="admin-meta-label">Category</span><strong>{report.category}</strong></div><div className="admin-issue-meta"><span className="admin-meta-label">Status</span><StatusPill status={normalizeStatus(report.status)} /></div><div className="admin-issue-meta"><span className="admin-meta-label">Location</span><strong className="admin-location"><MapPin size={14} /> {reportLocation(report)}</strong></div><div className="admin-issue-meta"><span className="admin-meta-label">Created</span><strong>{formatDate(report.createdAt)}</strong></div><div className="admin-issue-actions"><button onClick={() => onView(report)} aria-label={`View ${report.id}`}><Eye size={16} /> View</button><button onClick={() => onEdit(report)} aria-label={`Edit ${report.id}`}><Edit3 size={16} /> Edit</button><button className="admin-danger-action" onClick={() => onDelete(report)} aria-label={`Delete ${report.id}`}><Trash2 size={16} /> Delete</button></div></article>)}</div>;

const ViewDialog: React.FC<{ report: CivicReport }> = ({ report }) => <div className="admin-view-dialog"><div className="admin-view-heading"><span className="admin-report-id">{report.id}</span><StatusPill status={normalizeStatus(report.status)} /></div><h3>{reportTitle(report)}</h3><div className="admin-detail-grid"><Detail label="Category" value={report.category} /><Detail label="Severity" value={report.severity} /><Detail label="Urgency" value={report.urgency} /><Detail label="Location" value={reportLocation(report)} /><Detail label="Created" value={formatDate(report.createdAt)} /><Detail label="Updated" value={formatDate(report.updatedAt)} /></div><Provenance title="User-provided facts" icon={<FileText size={16} />}><p>{reportDescription(report)}</p>{report.evidence?.filter((item) => item.type !== 'image').map((item, index) => <p key={index}>{item.description}</p>)}</Provenance><Provenance title="Visually observed information" icon={<Eye size={16} />}><p>{report.evidence?.filter((item) => item.type === 'image').map((item) => item.description).join(' ') || 'No visual observations recorded.'}</p></Provenance><Provenance title="AI inferences and recommended action" icon={<ClipboardList size={16} />}><p>{report.recommendedAction || 'No recommended action recorded.'}</p><small>Analysis engine: {report.analysisEngine || 'Not specified'}{report.confidence !== undefined ? ` · Confidence ${report.confidence}%` : ''}</small></Provenance>{(report.uncertainties?.length || report.missingInformation?.length) ? <Provenance title="Uncertainties" icon={<AlertTriangle size={16} />}><p>{[...(report.uncertainties || []), ...(report.missingInformation || [])].join(' ')}</p></Provenance> : null}</div>;

const Provenance: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => <section className="admin-provenance"><h4>{icon}{title}</h4>{children}</section>;
const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => <div><span className="admin-meta-label">{label}</span><strong>{value}</strong></div>;
const DialogError: React.FC<{ message: string | null }> = ({ message }) => message ? <div className="admin-alert admin-alert-error" role="alert"><AlertTriangle size={16} />{message}</div> : null;

const DialogOverlay: React.FC<{ onClose: () => void; title: string; children: React.ReactNode }> = ({ onClose, title, children }) => <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="admin-dialog" role="dialog" aria-modal="true" aria-label={title}><div className="admin-dialog-header"><h2>{title}</h2><button onClick={onClose} aria-label="Close dialog"><X size={20} /></button></div>{children}</div></div>;

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; required?: boolean }> = ({ label, value, onChange, required }) => <label className="admin-field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
const TextArea: React.FC<{ label: string; value: string; onChange: (value: string) => void; required?: boolean }> = ({ label, value, onChange, required }) => <label className="admin-field"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={4} /></label>;
const SelectField: React.FC<{ label: string; value: string; options: readonly string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => <label className="admin-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}</select></label>;
const LoadingState: React.FC = () => <div className="admin-loading" aria-label="Loading civic issues"><div className="admin-loading-title" /><div className="admin-loading-row" /><div className="admin-loading-row" /><div className="admin-loading-row" /></div>;
const EmptyState: React.FC = () => <div className="admin-empty"><ClipboardList size={34} /><h3>No civic issues yet.</h3><p>Submitted reports will appear here.</p></div>;

export default AdminDashboardScreen;
