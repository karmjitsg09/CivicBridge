import React, { useState } from 'react';
import { CivicReport, ReportStatus } from '../types/civic';
import { Card, Badge, StatusPill } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyLedgerIllustration } from '../components/illustrations/IssueIllustration';
import {
  Search,
  Filter,
  PlusCircle,
  Calendar,
  MapPin,
  Building,
  Eye,
  X,
  Copy,
  Check,
  Edit3,
  Trash2,
  Database,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface CivicLedgerScreenProps {
  reports: CivicReport[];
  storageType?: 'firestore' | 'local_demo';
  isLoading?: boolean;
  onRefresh?: () => void;
  onCreateNew: () => void;
  onEditReport?: (report: CivicReport) => void;
  onUpdateStatus?: (reportId: string, newStatus: ReportStatus) => Promise<void> | void;
  onDeleteReport?: (reportId: string) => Promise<void> | void;
}

export const CivicLedgerScreen: React.FC<CivicLedgerScreenProps> = ({
  reports,
  storageType = 'local_demo',
  isLoading = false,
  onRefresh,
  onCreateNew,
  onEditReport,
  onUpdateStatus,
  onDeleteReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<CivicReport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Normalizer for status display and matching
  const normalizeStatus = (status: string): ReportStatus => {
    const s = status.replace('_', ' ').toUpperCase();
    if (s === 'ACTION READY' || s === 'IN PROGRESS' || s === 'RESOLVED' || s === 'DRAFT') {
      return s as ReportStatus;
    }
    return 'ACTION READY';
  };

  // Filtering
  const filteredReports = reports.filter((r) => {
    const title = r.title || r.issueTitle || '';
    const loc = typeof r.location === 'string' ? r.location : r.location?.description || '';
    const cat = r.category || '';
    const id = r.id || '';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase());

    const reportNormStatus = normalizeStatus(r.status);
    const filterNormStatus = statusFilter === 'ALL' ? 'ALL' : normalizeStatus(statusFilter);

    const matchesStatus = filterNormStatus === 'ALL' || reportNormStatus === filterNormStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses: ('ALL' | ReportStatus)[] = ['ALL', 'DRAFT', 'ACTION READY', 'IN PROGRESS', 'RESOLVED'];

  const copyReportText = (report: CivicReport) => {
    const title = report.title || report.issueTitle || 'Civic Report';
    const loc = typeof report.location === 'string' ? report.location : report.location?.description || 'N/A';
    const text = `REPORT ${report.id}: ${title}\nStatus: ${report.status}\nCategory: ${report.category}\nLocation: ${loc}\nDepartment: ${report.recommendedDepartment}\nAction: ${report.requestedAction || report.recommendedAction}`;
    navigator.clipboard.writeText(text);
    setCopiedId(report.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    if (!onUpdateStatus) return;
    setStatusUpdatingId(reportId);
    try {
      await onUpdateStatus(reportId, newStatus);
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!reportToDelete || !onDeleteReport) return;
    setIsDeleting(true);
    try {
      await onDeleteReport(reportToDelete.id);
      if (selectedReport?.id === reportToDelete.id) {
        setSelectedReport(null);
      }
      setReportToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '2rem auto 4rem auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Civic Intelligence Ledger
            </h1>

            {/* Storage Mode Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: storageType === 'firestore' ? 'var(--color-cobalt-light)' : 'var(--bg-surface)',
                color: storageType === 'firestore' ? 'var(--color-cobalt)' : 'var(--text-muted)',
                border: '1px solid var(--border-light)',
              }}
              title={
                storageType === 'firestore'
                  ? 'Reports are persisted to Google Cloud Firestore with real-time cloud durability.'
                  : 'Operating in Local In-Memory Demo Storage. Seamless local persistence during testing.'
              }
            >
              <Database size={13} />
              <span>{storageType === 'firestore' ? 'Cloud Firestore' : 'Local Demo Storage'}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', margin: 0 }}>
            Structured, auditable log of action-ready municipal reports and community interventions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
              title="Refresh ledger reports"
            >
              <RefreshCw size={15} className={isLoading ? 'spin-animation' : ''} />
              <span>Refresh</span>
            </button>
          )}

          <Button variant="primary" size="md" onClick={onCreateNew} icon={<PlusCircle size={18} />}>
            Report New Issue
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="stitch-card"
        style={{
          padding: '1.25rem',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-card-subtle)',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-on-card-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by title, location, category, or ID..."
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-card-subtle)',
              fontSize: '0.92rem',
              color: 'var(--text-on-card-primary)',
              background: 'var(--surface-card)',
            }}
            aria-label="Search civic reports"
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={16} color="var(--text-on-card-muted)" style={{ marginRight: '4px' }} />
          {statuses.map((status) => {
            const isSelected =
              status === 'ALL'
                ? statusFilter === 'ALL'
                : normalizeStatus(statusFilter) === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  background: isSelected ? 'var(--color-cobalt)' : 'var(--surface-card-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-on-card-secondary)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-cobalt)' : 'var(--border-card-subtle)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-card-subtle)',
          }}
        >
          <EmptyLedgerIllustration />
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-on-card-primary)',
              marginTop: '1rem',
              marginBottom: '0.35rem',
            }}
          >
            {reports.length === 0 ? 'No civic reports yet' : 'No matching civic reports found'}
          </h3>
          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-on-card-secondary)',
              maxWidth: '420px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {reports.length === 0
              ? 'Turn your first civic observation into an action-ready report.'
              : 'Try clearing your search filters to find existing municipal records.'}
          </p>
          <Button variant="primary" size="md" onClick={onCreateNew} icon={<PlusCircle size={18} />}>
            {reports.length === 0 ? 'Create a Report' : 'Create New Report'}
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReports.map((report) => {
            const title = report.title || report.issueTitle || 'Civic Report';
            const loc =
              typeof report.location === 'string'
                ? report.location
                : report.location?.description || 'Municipal Area';
            const normStatus = normalizeStatus(report.status);
            const isResolved = normStatus === 'RESOLVED';

            return (
              <Card
                key={report.id}
                hoverable
                style={{
                  padding: '1.5rem',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-card-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Left Details */}
                <div style={{ flex: '1 1 340px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: 'var(--card-tint-blue-text)',
                      }}
                    >
                      {report.id}
                    </span>
                    <StatusPill status={normStatus} />
                    <Badge severity={report.severity} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-on-card-muted)', fontWeight: 600 }}>
                      {report.category}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: 'var(--text-on-card-primary)',
                      margin: '0 0 0.35rem 0',
                    }}
                  >
                    {title}
                  </h3>

                  {/* Honesty Note for RESOLVED */}
                  {isResolved && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginBottom: '0.5rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--card-tint-emerald-bg)',
                        border: '1px solid var(--card-tint-emerald-border)',
                        color: 'var(--card-tint-emerald-text)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{report.statusNote || 'Marked resolved by you'}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      flexWrap: 'wrap',
                      fontSize: '0.82rem',
                      color: 'var(--text-on-card-secondary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--card-tint-blue-text)" />
                      <span>{loc}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} />
                      <span>{report.createdAt}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building size={14} />
                      <span>{report.recommendedDepartment}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {/* Inline Status Selector */}
                  <select
                    value={normStatus}
                    disabled={statusUpdatingId === report.id}
                    onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                    aria-label={`Change status for report ${report.id}`}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-card-subtle)',
                      background: 'var(--surface-card-subtle)',
                      color: 'var(--text-on-card-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="ACTION READY">Action Ready</option>
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved (By You)</option>
                  </select>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyReportText(report)}
                    className="stitch-btn stitch-btn-secondary"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-on-card-secondary)' }}
                    title="Copy report text"
                  >
                    {copiedId === report.id ? <Check size={14} color="var(--card-tint-emerald-text)" /> : <Copy size={14} />}
                    <span>{copiedId === report.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* Edit Button */}
                  {onEditReport && (
                    <button
                      onClick={() => onEditReport(report)}
                      className="stitch-btn stitch-btn-secondary"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.82rem',
                        color: 'var(--card-tint-blue-text)',
                        borderColor: 'var(--card-tint-blue-border)',
                      }}
                      title="Edit report details"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                  )}

                  {/* View Details Button */}
                  <Button
                    variant="cobalt"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                    icon={<Eye size={15} />}
                  >
                    Details
                  </Button>

                  {/* Delete Button */}
                  {onDeleteReport && (
                    <button
                      onClick={() => setReportToDelete(report)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--card-tint-coral-text)',
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Delete report"
                      aria-label="Delete report"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 21, 37, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-report-title"
        >
          <div
            className="stitch-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-card-subtle)',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            }}
          >
            <button
              onClick={() => setSelectedReport(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'var(--surface-card-subtle)',
                border: '1px solid var(--border-card-subtle)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-on-card-primary)',
              }}
              aria-label="Close details modal"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: 'var(--card-tint-blue-text)',
                  fontSize: '0.85rem',
                }}
              >
                {selectedReport.id}
              </span>
              <StatusPill status={normalizeStatus(selectedReport.status)} />
              <Badge severity={selectedReport.severity} />
            </div>

            <h2
              id="modal-report-title"
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--text-on-card-primary)',
                marginBottom: '1rem',
                paddingRight: '2rem',
              }}
            >
              {selectedReport.title || selectedReport.issueTitle}
            </h2>

            {/* Resolved honesty notice */}
            {normalizeStatus(selectedReport.status) === 'RESOLVED' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--card-tint-emerald-bg)',
                  border: '1px solid var(--card-tint-emerald-border)',
                  color: 'var(--card-tint-emerald-text)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                <CheckCircle2 size={16} />
                <span>
                  {selectedReport.statusNote ||
                    'Marked resolved by you · Citizen recorded resolution'}
                </span>
              </div>
            )}

            {/* Metadata Box */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--surface-card-subtle)',
                border: '1px solid var(--border-card-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                color: 'var(--text-on-card-secondary)',
              }}
            >
              <div style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-on-card-primary)' }}>Location:</strong>{' '}
                {typeof selectedReport.location === 'string'
                  ? selectedReport.location
                  : selectedReport.location?.description || 'N/A'}
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-on-card-primary)' }}>Department:</strong>{' '}
                {selectedReport.recommendedDepartment}
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-on-card-primary)' }}>Filed Date:</strong>{' '}
                {selectedReport.createdAt}
              </div>
              {selectedReport.updatedAt && (
                <div>
                  <strong style={{ color: 'var(--text-on-card-primary)' }}>Last Updated:</strong>{' '}
                  {selectedReport.updatedAt}
                </div>
              )}
            </div>

            {/* Observed Narrative */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: 'var(--text-on-card-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Observed Narrative
              </h4>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-on-card-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {selectedReport.description || selectedReport.detailedDescription}
              </p>
            </div>

            {/* Requested Municipal Action */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--card-tint-blue-bg)',
                border: '1px solid var(--card-tint-blue-border)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--card-tint-blue-text)',
                }}
              >
                Municipal Action Requested
              </span>
              <p
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--card-tint-blue-text)',
                  margin: '4px 0 0 0',
                }}
              >
                {selectedReport.requestedAction || selectedReport.recommendedAction}
              </p>
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-card-subtle)',
              }}
            >
              {/* Left action: delete */}
              <div>
                {onDeleteReport && (
                  <button
                    onClick={() => {
                      setReportToDelete(selectedReport);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--card-tint-coral-text)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Trash2 size={15} />
                    <span>Delete Record</span>
                  </button>
                )}
              </div>

              {/* Right actions: copy, edit, close */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Button variant="secondary" size="md" onClick={() => copyReportText(selectedReport)}>
                  Copy Text
                </Button>
                {onEditReport && (
                  <Button
                    variant="cobalt"
                    size="md"
                    onClick={() => {
                      const rep = selectedReport;
                      setSelectedReport(null);
                      onEditReport(rep);
                    }}
                    icon={<Edit3 size={16} />}
                  >
                    Edit
                  </Button>
                )}
                <Button variant="primary" size="md" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Stitch Delete Confirmation Modal */}
      {reportToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 21, 37, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: '1.5rem',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
        >
          <div
            className="stitch-card"
            style={{
              width: '100%',
              maxWidth: '460px',
              background: 'var(--surface-card)',
              border: '1px solid var(--card-tint-coral-border)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--card-tint-coral-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: 'var(--card-tint-coral-text)',
              }}
            >
              <AlertTriangle size={26} />
            </div>

            <h3
              id="modal-delete-title"
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--text-on-card-primary)',
                margin: '0 0 0.5rem 0',
              }}
            >
              Delete Civic Report?
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-on-card-secondary)',
                lineHeight: 1.5,
                margin: '0 0 1.5rem 0',
              }}
            >
              Are you sure you want to permanently delete report{' '}
              <strong style={{ color: 'var(--card-tint-coral-text)', fontFamily: 'var(--font-mono)' }}>
                {reportToDelete.id}
              </strong>
              ? This action will remove it from the Civic Ledger and cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button
                variant="ghost"
                size="md"
                disabled={isDeleting}
                onClick={() => setReportToDelete(null)}
              >
                Cancel
              </Button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{
                  background: 'var(--color-coral)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'opacity 0.2s ease',
                }}
              >
                {isDeleting ? (
                  <>
                    <RefreshCw size={16} className="spin-animation" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CivicLedgerScreen;
