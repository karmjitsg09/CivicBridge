import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean; elevated?: boolean }> = ({
  children,
  hoverable = false,
  elevated = false,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`stitch-card ${hoverable ? 'stitch-card-hover' : ''} ${className}`}
      style={{
        padding: '1.5rem',
        boxShadow: elevated ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge: React.FC<{
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}> = ({ severity, className = '' }) => {
  const labels: Record<string, string> = {
    low: 'Low Impact',
    medium: 'Medium Severity',
    high: 'High Severity',
    critical: 'Critical Emergency',
  };

  return (
    <span className={`severity-badge severity-${severity} ${className}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
      {labels[severity] || severity}
    </span>
  );
};

export const StatusPill: React.FC<{
  status: 'DRAFT' | 'ACTION READY' | 'ACTION_READY' | 'IN PROGRESS' | 'IN_PROGRESS' | 'RESOLVED';
  className?: string;
}> = ({ status, className = '' }) => {
  const normalized = status.replace('_', ' ');
  const classKey: Record<string, string> = {
    'DRAFT': 'draft',
    'ACTION READY': 'ready',
    'IN PROGRESS': 'progress',
    'RESOLVED': 'resolved',
  };

  return (
    <span className={`status-pill status-pill-${classKey[normalized] || 'draft'} ${className}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
      {normalized}
    </span>
  );
};

export const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
  const score = Math.max(0, Math.min(100, confidence));
  let color = 'var(--card-tint-emerald-text)';
  let bg = 'var(--card-tint-emerald-bg)';
  let tier = 'High AI Confidence';

  if (score < 65) {
    color = 'var(--card-tint-coral-text)';
    bg = 'var(--card-tint-coral-bg)';
    tier = 'Low / Needs Review';
  } else if (score < 85) {
    color = 'var(--card-tint-yellow-text)';
    bg = 'var(--card-tint-yellow-bg)';
    tier = 'Moderate AI Confidence';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.45rem 0.9rem',
        background: bg,
        borderRadius: 'var(--radius-full)',
        border: `1.5px solid ${color}40`,
      }}
    >
      <div style={{ position: 'relative', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="38" height="38" viewBox="0 0 38 38">
          <circle cx="19" cy="19" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle
            cx="19"
            cy="19"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={94.2}
            strokeDashoffset={94.2 - (94.2 * score) / 100}
            strokeLinecap="round"
            transform="rotate(-90 19 19)"
          />
        </svg>
        <span style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: 800, color }}>
          {score}%
        </span>
      </div>
      <div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-on-card-subtle)', fontWeight: 700 }}>
          AI Confidence Assessment
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color }}>
          {tier}
        </div>
      </div>
    </div>
  );
};
