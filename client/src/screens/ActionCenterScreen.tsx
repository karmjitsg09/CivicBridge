import React, { useState } from 'react';
import { CivicAnalysisResult } from '../types/civic';
import { Card, ConfidenceMeter } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  FileText,
  Copy,
  Share2,
  Edit3,
  RotateCcw,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface ActionCenterScreenProps {
  analysis: CivicAnalysisResult;
  onGenerateReport: () => void;
  onEditReport: () => void;
  onStartOver: () => void;
}

export const ActionCenterScreen: React.FC<ActionCenterScreenProps> = ({
  analysis,
  onGenerateReport,
  onEditReport,
  onStartOver,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.reportDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Civic Report: ${analysis.issueTitle}`,
        text: analysis.reportDraft,
      }).catch(() => {});
    } else {
      handleCopy();
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '2rem auto 4rem auto' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-cobalt-light)',
            color: 'var(--color-cobalt)',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={16} />
          <span>Intelligent Civic Dispatch</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.2,
            marginBottom: '0.75rem',
          }}
        >
          YOUR NEXT BEST ACTION
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Gemini has translated human intent into a structured municipal complaint package.
          Choose your next action below.
        </p>
      </div>

      {/* Main Action Showcase Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Dominant Primary Action Card */}
        <Card
          elevated
          style={{
            padding: '2.25rem',
            background: 'linear-gradient(180deg, #ffffff 0%, var(--card-tint-blue-bg) 100%)',
            border: '2px solid var(--card-tint-blue-text)',
            boxShadow: '0 16px 40px -4px rgba(37, 99, 235, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span
                style={{
                  background: 'var(--card-tint-blue-text)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Recommended Path
              </span>
              <ConfidenceMeter confidence={analysis.confidence} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-on-card-primary)', marginBottom: '0.5rem' }}>
              Generate Civic Report
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-on-card-secondary)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Format this observation into an official municipal document pre-addressed to the <strong>{analysis.recommendedDepartment}</strong> with structured evidence.
            </p>

            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-card-subtle)',
                border: '1px solid var(--border-card-subtle)',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={18} color="var(--card-tint-emerald-text)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-on-card-primary)' }}>
                  Auto-Populated Details
                </span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-on-card-secondary)', lineHeight: 1.6 }}>
                <li>Severity: <strong style={{ color: 'var(--text-on-card-primary)' }}>{analysis.severity.toUpperCase()}</strong> ({analysis.category})</li>
                <li>Target Agency: <strong style={{ color: 'var(--text-on-card-primary)' }}>{analysis.recommendedDepartment}</strong></li>
                <li>Evidence Items: {analysis.evidence.length} recorded items</li>
              </ul>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onGenerateReport}
            icon={<FileText size={20} />}
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
          >
            Generate Civic Report Now
          </Button>
        </Card>

        {/* Secondary Actions Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Action 2: Edit Report */}
          <Card
            hoverable
            onClick={onEditReport}
            style={{
              padding: '1.5rem',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-card-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-tint-violet-bg)',
                color: 'var(--card-tint-violet-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Edit3 size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: '0 0 0.2rem 0' }}>
                Edit Report Draft
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-on-card-secondary)', margin: 0 }}>
                Adjust descriptions, attach missing cross streets, or calibrate severity before filing.
              </p>
            </div>
          </Card>

          {/* Action 3: Copy Text */}
          <Card
            hoverable
            onClick={handleCopy}
            style={{
              padding: '1.5rem',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-card-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-tint-cyan-bg)',
                color: 'var(--card-tint-cyan-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {copied ? <Check size={22} color="var(--card-tint-emerald-text)" /> : <Copy size={22} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: '0 0 0.2rem 0' }}>
                {copied ? 'Copied to Clipboard!' : 'Copy Formatted Report'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-on-card-secondary)', margin: 0 }}>
                Instant copy of the complete structured report text ready to paste into 311 or email.
              </p>
            </div>
          </Card>

          {/* Action 4: Share */}
          <Card
            hoverable
            onClick={handleShare}
            style={{
              padding: '1.5rem',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-card-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-tint-coral-bg)',
                color: 'var(--card-tint-coral-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Share2 size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: '0 0 0.2rem 0' }}>
                {shared ? 'Share Link Ready!' : 'Share with Neighbors'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-on-card-secondary)', margin: 0 }}>
                Share this incident with neighborhood groups or local representatives to coordinate response.
              </p>
            </div>
          </Card>

          {/* Action 5: Start Over */}
          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <Button variant="ghost" size="sm" onClick={onStartOver} icon={<RotateCcw size={16} />}>
              Start Over with Another Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCenterScreen;
