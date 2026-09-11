import React, { useState } from 'react';
import { CivicAnalysisResult, CivicReport, SeverityLevel, UrgencyLevel } from '../types/civic';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  AlertCircle,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface ReportEditorScreenProps {
  analysis?: CivicAnalysisResult | null;
  existingReport?: CivicReport | null;
  imagePreviewUrl?: string | null;
  onSaveReport: (report: CivicReport) => Promise<void> | void;
  onCancel: () => void;
}

export const ReportEditorScreen: React.FC<ReportEditorScreenProps> = ({
  analysis,
  existingReport,
  imagePreviewUrl,
  onSaveReport,
  onCancel,
}) => {
  const isEditingExisting = Boolean(existingReport);

  // Initial state derived from existingReport or analysis
  const [title, setTitle] = useState(
    existingReport?.title || existingReport?.issueTitle || analysis?.issueTitle || 'Civic Issue'
  );
  const [category, setCategory] = useState(
    existingReport?.category || analysis?.category || 'Public Works'
  );
  const [severity, setSeverity] = useState<SeverityLevel>(
    existingReport?.severity || analysis?.severity || 'medium'
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(
    existingReport?.urgency || analysis?.urgency || 'medium'
  );
  const [location, setLocation] = useState(
    typeof existingReport?.location === 'string'
      ? existingReport.location
      : existingReport?.location?.description ||
        analysis?.location?.description ||
        'Public Roadway'
  );
  const [description, setDescription] = useState(
    existingReport?.description ||
      existingReport?.detailedDescription ||
      analysis?.detailedDescription ||
      ''
  );
  const [department, setDepartment] = useState(
    existingReport?.recommendedDepartment || analysis?.recommendedDepartment || 'Department of Public Works'
  );
  const [requestedAction, setRequestedAction] = useState(
    existingReport?.requestedAction || analysis?.recommendedAction || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide both a report title and a description.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const finalReport: CivicReport = {
        id: existingReport?.id || `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: existingReport?.createdAt || nowFormatted,
        updatedAt: isEditingExisting ? nowFormatted : undefined,
        status: existingReport?.status || 'ACTION READY',
        title,
        issueTitle: title,
        category,
        severity,
        urgency,
        location,
        description,
        detailedDescription: description,
        recommendedDepartment: department,
        requestedAction,
        evidenceCount: existingReport?.evidenceCount ?? (analysis?.evidence?.length || 1),
        imagePreviewUrl: existingReport?.imagePreviewUrl || imagePreviewUrl || null,
        confidence: existingReport?.confidence ?? (analysis?.confidence || 88),
        statusNote: existingReport?.statusNote,
      };

      await onSaveReport(finalReport);
      setSaveSuccess(true);
    } catch (err: any) {
      console.error('Failed to save report:', err);
      setErrorMessage(err.message || 'Could not save report. Please check connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '2rem auto 4rem auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <button
            onClick={onCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-cobalt)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>{isEditingExisting ? 'Back to Civic Ledger' : 'Back to Action Center'}</span>
          </button>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {isEditingExisting ? `Edit Civic Report (${existingReport?.id})` : 'Civic Report Editor'}
          </h1>
          {isEditingExisting && existingReport?.status && (
            <div style={{ marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Current Status:{' '}
              <strong style={{ color: 'var(--color-cobalt)' }}>
                {existingReport.status.replace('_', ' ')}
              </strong>
              {existingReport.updatedAt && (
                <span> · Last updated: {existingReport.updatedAt}</span>
              )}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={isSaving}
          icon={
            isSaving ? (
              <Loader2 size={18} className="spin-animation" />
            ) : saveSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )
          }
        >
          {isSaving
            ? 'Saving to Ledger...'
            : isEditingExisting
            ? 'Save Updates'
            : 'Confirm & Finalize Report'}
        </Button>
      </div>

      {/* Error Banner */}
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
            marginBottom: '1.5rem',
            color: 'var(--card-tint-coral-text)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
          role="alert"
        >
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editorial Guidance Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--card-tint-coral-bg)',
          border: '1px solid var(--card-tint-coral-border)',
          marginBottom: '2rem',
        }}
        role="alert"
      >
        <AlertCircle size={22} color="var(--card-tint-coral-text)" style={{ flexShrink: 0 }} />
        <div>
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: 'var(--card-tint-coral-text)',
              display: 'block',
            }}
          >
            {isEditingExisting
              ? 'Human editorial control over stored civic record'
              : 'AI-assisted draft — review before sharing'}
          </span>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-on-card-secondary)', margin: 0 }}>
            {isEditingExisting
              ? 'You can update factual details, corrected locations, or municipal departments. All updates are synchronized to the Civic Ledger.'
              : 'Review all facts, locations, and descriptions. You have full editorial control before this report is finalized.'}
          </p>
        </div>
      </div>

      {/* Editable Document Sheet */}
      <Card
        elevated
        style={{
          padding: '2.5rem',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-card-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Report Title */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-on-card-label)',
              marginBottom: '0.4rem',
            }}
          >
            Report Title / Headline
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hazardous Roadway Pothole Near 4th & Main"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-card-subtle)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-on-card-primary)',
              background: 'var(--surface-card)',
            }}
          />
        </div>

        {/* Category & Department */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--text-on-card-label)',
                marginBottom: '0.4rem',
              }}
            >
              Civic Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Public Works & Infrastructure"
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-card-subtle)',
                fontSize: '0.92rem',
                color: 'var(--text-on-card-primary)',
                background: 'var(--surface-card)',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--text-on-card-label)',
                marginBottom: '0.4rem',
              }}
            >
              Target Municipal Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Department of Transportation"
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-card-subtle)',
                fontSize: '0.92rem',
                color: 'var(--text-on-card-primary)',
                background: 'var(--surface-card)',
              }}
            />
          </div>
        </div>

        {/* Severity & Urgency Selectors */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--text-on-card-label)',
                marginBottom: '0.4rem',
              }}
            >
              Impact Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-card-subtle)',
                fontSize: '0.92rem',
                color: 'var(--text-on-card-primary)',
                background: 'var(--surface-card)',
              }}
            >
              <option value="low">Low Impact</option>
              <option value="medium">Medium Severity</option>
              <option value="high">High Severity</option>
              <option value="critical">Critical Emergency</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--text-on-card-label)',
                marginBottom: '0.4rem',
              }}
            >
              Action Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-card-subtle)',
                fontSize: '0.92rem',
                color: 'var(--text-on-card-primary)',
                background: 'var(--surface-card)',
              }}
            >
              <option value="low">Low (Routine maintenance)</option>
              <option value="medium">Medium (Standard 48-72 hr SLA)</option>
              <option value="high">High (24 hr dispatch)</option>
              <option value="critical">Critical (Immediate safety hazard)</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-on-card-label)',
              marginBottom: '0.4rem',
            }}
          >
            Location / Geographic Reference
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Street address, intersection, or coordinates"
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-card-subtle)',
              fontSize: '0.95rem',
              color: 'var(--text-on-card-primary)',
              background: 'var(--surface-card)',
            }}
          />
        </div>

        {/* Detailed Narrative */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-on-card-label)',
              marginBottom: '0.4rem',
            }}
          >
            Factual Description & Observed Hazards
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Detailed narrative describing the observed issue..."
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-card-subtle)',
              fontSize: '0.95rem',
              color: 'var(--text-on-card-primary)',
              background: 'var(--surface-card)',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.55,
            }}
          />
        </div>

        {/* Requested Action */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-on-card-label)',
              marginBottom: '0.4rem',
            }}
          >
            Requested Municipal Action
          </label>
          <textarea
            value={requestedAction}
            onChange={(e) => setRequestedAction(e.target.value)}
            rows={2}
            placeholder="Specific action requested from municipal crew..."
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-card-subtle)',
              fontSize: '0.95rem',
              color: 'var(--text-on-card-primary)',
              background: 'var(--surface-card)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="ghost" size="md" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
            icon={isSaving ? <Loader2 size={18} className="spin-animation" /> : <Save size={18} />}
          >
            {isSaving
              ? 'Saving...'
              : isEditingExisting
              ? 'Save Updates'
              : 'Save & Finalize Report'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportEditorScreen;
