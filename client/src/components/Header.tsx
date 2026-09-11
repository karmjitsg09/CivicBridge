import React from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

interface HeaderProps {
  serverConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ serverConnected = true }) => {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'var(--glass-blur)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem 0',
      }}
      role="banner"
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--civic-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
            aria-hidden="true"
          >
            <ShieldAlert size={24} color="#0a0f1d" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                }}
              >
                CivicBridge <span style={{ color: 'var(--civic-accent)' }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--civic-cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1px 6px',
                  textTransform: 'uppercase',
                }}
              >
                Gemini 2.5
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Human intent → Civic action
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              color: serverConnected ? 'var(--text-secondary)' : 'var(--severity-critical)',
              background: 'var(--bg-card)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
            title={serverConnected ? 'Connected to backend service' : 'Connecting to backend...'}
          >
            <Activity
              size={14}
              style={{
                color: serverConnected ? 'var(--severity-low)' : 'var(--severity-critical)',
                animation: serverConnected ? 'pulseGlow 2s infinite' : 'none',
              }}
            />
            <span>{serverConnected ? 'System Online' : 'Connecting...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
