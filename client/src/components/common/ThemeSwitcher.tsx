import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('civicbridge_theme') as ThemeMode;
      return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();
    localStorage.setItem('civicbridge_theme', theme);

    const listener = () => {
      if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun size={14} /> },
    { mode: 'dark', label: 'Dark', icon: <Moon size={14} /> },
    { mode: 'system', label: 'System', icon: <Monitor size={14} /> },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-page-subtle)',
        border: '1px solid var(--border-light)',
      }}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {options.map((opt) => {
        const isSelected = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 9px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              background: isSelected ? 'var(--bg-surface)' : 'transparent',
              color: isSelected ? 'var(--color-cobalt)' : 'var(--text-muted)',
              boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${opt.label} Mode`}
            title={`Switch to ${opt.label} theme`}
          >
            {opt.icon}
            <span style={{ fontSize: '0.72rem' }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
