import React from 'react';

interface IssueIllustrationProps {
  category: string;
  size?: number;
}

export const IssueIllustration: React.FC<IssueIllustrationProps> = ({ category, size = 64 }) => {
  const catLower = category.toLowerCase();

  // Road
  if (catLower.includes('road') || catLower.includes('pothole') || catLower.includes('infrastructure')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#fff1f2" />
        <path d="M 12 48 L 24 16 L 40 16 L 52 48 Z" fill="#f43f5e" opacity="0.15" />
        <path d="M 22 48 L 28 20 L 36 20 L 42 48" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="32" cy="40" rx="12" ry="5" fill="#9f1239" />
      </svg>
    );
  }

  // Sanitation / Waste
  if (catLower.includes('sanitation') || catLower.includes('waste') || catLower.includes('garbage')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#ecfdf5" />
        <rect x="20" y="24" width="24" height="26" rx="4" fill="#059669" />
        <rect x="16" y="18" width="32" height="5" rx="2.5" fill="#047857" />
        <line x1="26" y1="30" x2="26" y2="44" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="30" x2="32" y2="44" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="30" x2="38" y2="44" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Lighting
  if (catLower.includes('light') || catLower.includes('electric') || catLower.includes('dark')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#fefce8" />
        <path d="M 32 14 C 24 14 18 20 18 28 C 18 33 22 37 24 41 L 40 41 C 42 37 46 33 46 28 C 46 20 40 14 32 14 Z" fill="#eab308" />
        <rect x="25" y="44" width="14" height="6" rx="2" fill="#ca8a04" />
      </svg>
    );
  }

  // Water
  if (catLower.includes('water') || catLower.includes('leak') || catLower.includes('pipe')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#f0f9ff" />
        <path d="M 32 14 C 32 14 18 32 18 40 C 18 47.7 24.3 54 32 54 C 39.7 54 46 47.7 46 40 C 46 32 32 14 32 14 Z" fill="#0284c7" />
      </svg>
    );
  }

  // Traffic / Default
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#eff6ff" />
      <rect x="22" y="12" width="20" height="40" rx="6" fill="#1e293b" />
      <circle cx="32" cy="20" r="4.5" fill="#ef4444" />
      <circle cx="32" cy="32" r="4.5" fill="#f59e0b" />
      <circle cx="32" cy="44" r="4.5" fill="#10b981" />
    </svg>
  );
};

export const ReportReadyIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={className} style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}>
      <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        <circle cx="160" cy="130" r="115" fill="#ecfdf5" />
        {/* Document sheet */}
        <rect x="90" y="45" width="140" height="175" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.08))" />
        {/* Header bar on sheet */}
        <rect x="105" y="65" width="70" height="10" rx="5" fill="#2563eb" />
        {/* Text lines */}
        <rect x="105" y="90" width="110" height="6" rx="3" fill="#e2e8f0" />
        <rect x="105" y="106" width="95" height="6" rx="3" fill="#e2e8f0" />
        <rect x="105" y="122" width="105" height="6" rx="3" fill="#e2e8f0" />
        <rect x="105" y="138" width="80" height="6" rx="3" fill="#e2e8f0" />
        {/* Big verified green stamp */}
        <g transform="translate(195, 175)">
          <circle cx="0" cy="0" r="30" fill="#10b981" stroke="#ffffff" strokeWidth="4" />
          <path d="M -10 0 L -3 8 L 12 -7" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};

export const EmptyLedgerIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={className} style={{ width: '100%', maxWidth: '260px', margin: '0 auto' }}>
      <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        <circle cx="130" cy="100" r="85" fill="#f8fafc" />
        <rect x="65" y="45" width="130" height="110" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
        <rect x="80" y="70" width="70" height="8" rx="4" fill="#94a3b8" />
        <rect x="80" y="92" width="100" height="6" rx="3" fill="#e2e8f0" />
        <rect x="80" y="110" width="85" height="6" rx="3" fill="#e2e8f0" />
        {/* Magnifying glass */}
        <circle cx="170" cy="135" r="22" fill="#eff6ff" stroke="#3b82f6" strokeWidth="3" />
        <line x1="186" y1="151" x2="204" y2="169" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};
