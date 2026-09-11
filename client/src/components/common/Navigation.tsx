import React, { useState } from 'react';
import { ShieldAlert, Activity, FileText, HelpCircle, PlusCircle, Menu, X } from 'lucide-react';
import { ScreenType } from '../../types/civic';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  serverConnected: boolean;
  ledgerCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  serverConnected,
  ledgerCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ScreenType, label: 'Report an Issue', icon: <PlusCircle size={18} /> },
    {
      id: 'ledger' as ScreenType,
      label: 'Civic Ledger',
      icon: <FileText size={18} />,
      badge: ledgerCount > 0 ? ledgerCount : undefined,
    },
    { id: 'how_it_works' as ScreenType, label: 'How It Works', icon: <HelpCircle size={18} /> },
  ];

  return (
    <header
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
      role="banner"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            textAlign: 'left',
          }}
          aria-label="CivicBridge AI Home"
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              color: '#ffffff',
            }}
          >
            <ShieldAlert size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.28rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--nav-text)',
                }}
              >
                CivicBridge <span style={{ color: 'var(--color-cobalt)' }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: '#ffffff',
                  background: 'var(--color-violet)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Stitch 2.5
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--nav-text-muted)', margin: 0, fontWeight: 500 }}>
              Turn messy intent into civic action
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="desktop-nav"
          role="navigation"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.id ||
              (item.id === 'home' &&
                ['processing', 'analysis', 'action_center', 'report_editor', 'report_ready'].includes(
                  currentScreen
                ));

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                  background: isActive ? 'var(--color-cobalt-light)' : 'transparent',
                  color: isActive ? 'var(--color-cobalt)' : 'var(--nav-text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    style={{
                      background: isActive ? 'var(--color-cobalt)' : '#cbd5e1',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-full)',
                      padding: '1px 7px',
                      marginLeft: '2px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Switcher & Status indicator & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ThemeSwitcher />

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.85rem',
              background: serverConnected ? 'var(--card-tint-emerald-bg)' : '#fef2f2',
              color: serverConnected ? 'var(--card-tint-emerald-text)' : '#dc2626',
              border: `1px solid ${serverConnected ? 'var(--card-tint-emerald-border)' : 'rgba(220, 38, 38, 0.2)'}`,
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            title={serverConnected ? 'Backend API connected' : 'Connecting to API...'}
          >
            <Activity
              size={14}
              style={{ animation: serverConnected ? 'pulseGlow 2s infinite' : 'none' }}
            />
            <span className="status-text">{serverConnected ? 'Online' : 'Offline'}</span>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--nav-text)',
              padding: '6px',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--nav-bg)',
            borderBottom: '1px solid var(--nav-border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
          className="mobile-drawer"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: currentScreen === item.id ? 'var(--color-cobalt-light)' : 'transparent',
                color: currentScreen === item.id ? 'var(--color-cobalt)' : 'var(--nav-text)',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '1rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  style={{
                    background: 'var(--color-cobalt)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .status-text { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navigation;
