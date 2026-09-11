import React from 'react';
import { CivicAnalysisResult } from '../types/civic';
import { Card, Badge, ConfidenceMeter } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { IssueIllustration } from '../components/illustrations/IssueIllustration';
import {
  MapPin,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  FileCheck2,
} from 'lucide-react';

interface AnalysisResultScreenProps {
  analysis: CivicAnalysisResult;
  imagePreviewUrl?: string | null;
  onProceedToActionCenter: () => void;
  onStartOver: () => void;
}

export const AnalysisResultScreen: React.FC<AnalysisResultScreenProps> = ({
  analysis,
  imagePreviewUrl,
  onProceedToActionCenter,
  onStartOver,
}) => {
  return (
    <div style={{ maxWidth: '960px', margin: '1.5rem auto 4rem auto' }}>
      {/* Top Banner & Actions */}
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: analysis.analysisEngine === 'gemini-2.5-flash' ? 'var(--color-cobalt)' : 'var(--color-coral)',
              background: analysis.analysisEngine === 'gemini-2.5-flash' ? 'var(--color-cobalt-light)' : 'var(--color-coral-light)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${analysis.analysisEngine === 'gemini-2.5-flash' ? 'rgba(37, 99, 235, 0.25)' : 'rgba(234, 88, 12, 0.25)'}`,
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.35rem',
            }}
          >
            {analysis.analysisEngine === 'gemini-2.5-flash' ? (
              <>
                <Sparkles size={15} />
                <span>Live Gemini 2.5 Flash Reasoning</span>
              </>
            ) : (
              <>
                <HelpCircle size={15} />
                <span>Diagnostic Fallback Engine (Demo Mode)</span>
              </>
            )}
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-on-page)', margin: 0 }}>
            Structured Civic Intelligence
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="ghost" size="sm" onClick={onStartOver} icon={<RotateCcw size={16} />}>
            New Issue
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onProceedToActionCenter}
            icon={<ArrowRight size={18} />}
          >
            Go to Action Center
          </Button>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <Card
        elevated
        style={{
          padding: '2rem',
          marginBottom: '1.75rem',
          border: '1.5px solid var(--surface-card-border)',
          background: 'linear-gradient(180deg, var(--surface-card) 0%, var(--surface-card-subtle) 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
            <IssueIllustration category={analysis.category} size={64} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    background: 'var(--card-tint-blue-bg)',
                    color: 'var(--card-tint-blue-text)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--card-tint-blue-border)',
                  }}
                >
                  {analysis.category}
                </span>
                <Badge severity={analysis.severity} />
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-on-card-secondary)',
                    background: 'var(--bg-card-chip)',
                    border: '1px solid var(--border-card-chip)',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <Clock size={12} />
                  Urgency: {analysis.urgency.toUpperCase()}
                </span>
              </div>

              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-on-card-primary)', marginBottom: '0.5rem' }}>
                {analysis.issueTitle}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-on-card-secondary)', lineHeight: 1.55, margin: 0 }}>
                {analysis.summary}
              </p>
            </div>
          </div>

          <ConfidenceMeter confidence={analysis.confidence} />
        </div>

        {/* User-Provided Location Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1rem',
            background: 'var(--surface-card-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-card-border)',
          }}
        >
          <MapPin size={18} color="var(--card-tint-blue-text)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-on-card-label)' }}>
            Location:
          </span>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-on-card-secondary)' }}>
            {analysis.location.description || 'General public thoroughfare (exact coordinates requested)'}
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: analysis.location.provided ? 'var(--card-tint-emerald-bg)' : 'var(--card-tint-yellow-bg)',
              color: analysis.location.provided ? 'var(--card-tint-emerald-text)' : 'var(--card-tint-yellow-text)',
              border: `1px solid ${analysis.location.provided ? 'var(--card-tint-emerald-border)' : 'var(--card-tint-yellow-border)'}`,
            }}
          >
            {analysis.location.provided ? 'Reported by Citizen' : 'Estimated from Narrative'}
          </span>
        </div>
      </Card>

      {/* Grid: Recommended Municipal Action & Observed Evidence */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Recommended Department & Concrete Action */}
        <Card style={{ background: 'var(--surface-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Building2 size={20} color="var(--card-tint-blue-text)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: 0 }}>
              Recommended Department
            </h3>
          </div>

          <div
            style={{
              padding: '0.9rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--card-tint-cyan-bg)',
              border: '1px solid var(--card-tint-cyan-border)',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--card-tint-cyan-text)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Responsible Agency
            </span>
            <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-on-card-primary)', margin: '0.2rem 0 0 0' }}>
              {analysis.recommendedDepartment}
            </p>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-on-card-label)' }}>
              Target Municipal Action
            </span>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-on-card-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>
              {analysis.recommendedAction}
            </p>
          </div>

          {/* Sequential Next Steps */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-on-card-label)', display: 'block', marginBottom: '0.5rem' }}>
              Recommended Dispatch Protocol
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {analysis.nextSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--card-tint-blue-text)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ color: 'var(--text-on-card-secondary)', lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Evidence & Detected Entities */}
        <Card style={{ background: 'var(--surface-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle size={20} color="var(--card-tint-emerald-text)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: 0 }}>
              Evidence & Detected Features
            </h3>
          </div>

          {/* Evidence photo if present */}
          {imagePreviewUrl && (
            <div
              style={{
                marginBottom: '1rem',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--surface-card-border)',
                maxHeight: '140px',
              }}
            >
              <img
                src={imagePreviewUrl}
                alt="Attached photographic evidence"
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Evidence items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {analysis.evidence.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-card-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    background: item.type === 'image' ? 'var(--card-tint-magenta-text)' : 'var(--card-tint-blue-text)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0,
                  }}
                >
                  {item.type}
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-on-card-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Detected Entities Badges */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-on-card-label)', display: 'block', marginBottom: '0.5rem' }}>
              Detected Semantic Entities
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {analysis.detectedEntities.map((entity, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card-chip)',
                    color: 'var(--text-card-chip)',
                    border: '1px solid var(--border-card-chip)',
                  }}
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Provenance & Uncertainty Note (Crucial for AI Transparency) */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--card-tint-yellow-bg)',
          border: '1px solid var(--card-tint-yellow-border)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--card-tint-yellow-text)' }}>
          <HelpCircle size={18} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--card-tint-yellow-text)' }}>
            AI Transparency & Provenance Note
          </h4>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
          CivicBridge AI synthesizes citizen reports into municipal categories using Gemini. This analysis is an AI-assisted draft and does not constitute an official government verification until filed.
        </p>
        {analysis.analysisEngine === 'diagnostic-fallback' && (
          <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(234, 179, 8, 0.2)', fontSize: '0.84rem', color: '#92400e' }}>
            <strong>Demo Mode Notice:</strong> Generated by the local diagnostic fallback engine because GEMINI_API_KEY was not configured in the server environment. Add your Gemini API key to <code>server/.env</code> for live multimodal model output.
          </div>
        )}
        {analysis.uncertainties.length > 0 && (
          <div style={{ fontSize: '0.84rem', color: '#92400e', marginTop: '0.45rem' }}>
            <strong>Flagged Ambiguities:</strong> {analysis.uncertainties.join(' ')}
          </div>
        )}
      </div>

      {/* Action CTA Panel */}
      <div
        className="stitch-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--card-tint-blue-bg) 0%, var(--surface-card) 100%)',
          border: '1.5px solid var(--card-tint-blue-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--card-tint-blue-text)' }}>
            Next Phase
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: '0.2rem 0' }}>
            Ready to convert this into a formal Civic Report?
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-on-card-muted)', margin: 0 }}>
            Review the drafted complaint, modify details, and download or copy for official submission.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onProceedToActionCenter}
          icon={<FileCheck2 size={20} />}
        >
          Open Action Center
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResultScreen;
