import React, { useState } from 'react';
import { CivicReport } from '../types/civic';
import { Card, Badge, StatusPill } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ReportReadyIllustration } from '../components/illustrations/IssueIllustration';
import {
  Copy,
  FileText,
  PlusCircle,
  Calendar,
  Check,
  Download,
  Database,
  Sparkles,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { createReport } from '../services/reportsApi';

interface ReportReadyScreenProps {
  report: CivicReport;
  onViewLedger: () => void;
  onCreateAnother: () => void;
  onReportSaved?: (savedReport: CivicReport) => void;
}

export const ReportReadyScreen: React.FC<ReportReadyScreenProps> = ({
  report,
  onViewLedger,
  onCreateAnother,
  onReportSaved,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPersisted, setIsPersisted] = useState(Boolean(report.storageType || report.sessionId));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title = report.title || report.issueTitle || 'Civic Report';
  const description = report.description || report.detailedDescription || '';
  const locationStr =
    typeof report.location === 'string'
      ? report.location
      : report.location?.description || 'Municipal Area';
  const requestedAction = report.requestedAction || report.recommendedAction || 'Action pending review';

  const formattedReportText = `================================================
CIVIC REPORT: ${title.toUpperCase()}
Reference ID: ${report.id}
Created: ${report.createdAt}
Status: ${report.status}
${report.storageType ? `Ledger Storage: ${report.storageType === 'firestore' ? 'Cloud Firestore' : 'Local Demo Storage'}\n` : ''}================================================

MUNICIPAL CATEGORY: ${report.category}
TARGET AGENCY: ${report.recommendedDepartment}
SEVERITY: ${report.severity.toUpperCase()} | URGENCY: ${report.urgency.toUpperCase()}
LOCATION: ${locationStr}

DESCRIPTION & OBSERVED CONDITIONS:
${description}

REQUESTED MUNICIPAL INTERVENTION:
${requestedAction}

VERIFICATION & EVIDENCE:
- Formulated with Gemini Multimodal Civic Intelligence
- Verification Confidence: ${report.confidence || 88}%
- Attached Evidence Records: ${report.evidenceCount || 1}
================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedReportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.id}-civic-report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToLedger = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const saved = await createReport(report);
      setIsPersisted(true);
      setSaveSuccess(true);
      if (onReportSaved) {
        onReportSaved(saved);
      }
      setTimeout(() => {
        onViewLedger();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to save report to Firestore/Ledger:', err);
      setErrorMessage("Couldn't save this report.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '2rem auto 4rem auto' }}>
      {/* Transformation Pipeline Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          padding: '0.75rem 1.25rem',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          width: 'fit-content',
          margin: '0 auto 2rem auto',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)' }}>DRAFT</span>
        <span style={{ color: 'var(--border-strong)' }}>→</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-violet)' }}>AI STRUCTURED</span>
        <span style={{ color: 'var(--border-strong)' }}>→</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cobalt)' }}>ACTION READY</span>
        <span style={{ color: 'var(--border-strong)' }}>→</span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: isPersisted ? 'var(--color-emerald)' : 'var(--color-cobalt)',
            background: isPersisted ? 'var(--color-emerald-light)' : 'var(--color-cobalt-light)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {isPersisted ? '✓ PERSISTED IN LEDGER' : 'REPORT READY'}
        </span>
      </div>

      {/* Main Success Hero */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <ReportReadyIllustration />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Civic Report is Action-Ready!
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1rem auto' }}>
          Your input has been structured into an official municipal report ready to be stored in the Civic Ledger.
        </p>

        {/* Persistence Status Badge */}
        {isPersisted && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'var(--color-emerald-light)',
              border: '1px solid var(--color-emerald)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-emerald)',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Database size={14} />
            <span>
              {report.storageType === 'firestore'
                ? 'Stored securely in Google Cloud Firestore'
                : 'Stored in Local Civic Ledger'}
            </span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{report.id}</span>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--card-tint-emerald-bg)',
            border: '1px solid var(--card-tint-emerald-border)',
            color: 'var(--card-tint-emerald-text)',
            fontSize: '0.92rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={20} />
          <span>Report successfully saved to the Civic Ledger.</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--card-tint-coral-bg)',
            border: '1px solid var(--card-tint-coral-border)',
            color: 'var(--card-tint-coral-text)',
            fontSize: '0.92rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Structured Document Preview */}
      <Card
        elevated
        style={{
          padding: '2.5rem',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-card-subtle)',
          marginBottom: '2rem',
        }}
      >
        {/* Document Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid var(--border-card-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--card-tint-blue-text)' }}>
                {report.id}
              </span>
              <StatusPill status={report.status} />
              <Badge severity={report.severity} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: 0 }}>
              {title}
            </h2>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-on-card-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
              <Calendar size={14} />
              <span>{report.createdAt}</span>
            </div>
            <span style={{ color: 'var(--card-tint-emerald-text)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              {report.confidence || 88}% Gemini Confidence
            </span>
          </div>
        </div>

        {/* Metadata grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'var(--surface-card-subtle)',
            border: '1px solid var(--border-card-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-on-card-label)' }}>
              Category
            </span>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-on-card-primary)', margin: '2px 0 0 0' }}>
              {report.category}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-on-card-label)' }}>
              Addressed Department
            </span>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--card-tint-blue-text)', margin: '2px 0 0 0' }}>
              {report.recommendedDepartment}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-on-card-label)' }}>
              Location Reference
            </span>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-on-card-primary)', margin: '2px 0 0 0' }}>
              {locationStr}
            </p>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-on-card-primary)', marginBottom: '0.4rem' }}>
            Executive Narrative
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-on-card-secondary)', lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>
        </div>

        {/* Requested Action */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--card-tint-blue-bg)',
            border: '1px solid var(--card-tint-blue-border)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--card-tint-blue-text)' }}>
            Specific Municipal Intervention
          </span>
          <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--card-tint-blue-text)', margin: '4px 0 0 0' }}>
            {requestedAction}
          </p>
        </div>
      </Card>

      {/* Action Buttons Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Primary CTA: SAVE TO CIVIC LEDGER */}
          {!isPersisted ? (
            <Button
              variant="primary"
              size="md"
              disabled={isSaving}
              onClick={handleSaveToLedger}
              icon={isSaving ? <Loader2 size={18} className="spin-animation" /> : <Save size={18} />}
            >
              {isSaving ? 'Saving to Firestore...' : 'SAVE TO CIVIC LEDGER'}
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={onViewLedger} icon={<FileText size={18} />}>
              View in Civic Ledger
            </Button>
          )}

          <Button variant="secondary" size="md" onClick={handleCopy} icon={copied ? <Check size={18} /> : <Copy size={18} />}>
            {copied ? 'Copied to Clipboard!' : 'Copy Formatted Report'}
          </Button>
          <Button variant="secondary" size="md" onClick={handleDownload} icon={<Download size={18} />}>
            Download .TXT
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="cobalt" size="md" onClick={onCreateAnother} icon={<PlusCircle size={18} />}>
            Report Another Issue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportReadyScreen;
