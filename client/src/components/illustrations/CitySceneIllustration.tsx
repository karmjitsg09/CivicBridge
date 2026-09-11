import React from 'react';

export const CitySceneIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={className} style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 360 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="City municipal skyline"
      >
        <rect width="360" height="220" rx="20" fill="#f0fdf4" />
        <circle cx="280" cy="60" r="32" fill="#fef08a" opacity="0.8" />
        {/* Buildings */}
        <rect x="40" y="90" width="55" height="110" rx="6" fill="#3b82f6" />
        <rect x="105" y="60" width="70" height="140" rx="8" fill="#1d4ed8" />
        <rect x="185" y="80" width="60" height="120" rx="6" fill="#059669" />
        <rect x="255" y="110" width="65" height="90" rx="6" fill="#0ea5e9" />
        {/* Park tree */}
        <circle cx="80" cy="170" r="22" fill="#10b981" />
        <rect x="76" y="170" width="8" height="28" fill="#065f46" rx="2" />
        {/* Street */}
        <rect x="20" y="195" width="320" height="16" rx="8" fill="#475569" />
      </svg>
    </div>
  );
};

export const CivicPersonIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={className} style={{ width: '100%', maxWidth: '240px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="Civic reporter empowering community"
      >
        <circle cx="120" cy="120" r="105" fill="#eff6ff" />
        {/* Person */}
        <circle cx="120" cy="70" r="30" fill="#f97316" />
        <path d="M 85 115 Q 120 100 155 115 L 170 190 L 70 190 Z" fill="#2563eb" />
        {/* Verified badge */}
        <circle cx="165" cy="140" r="22" fill="#10b981" stroke="#ffffff" strokeWidth="4" />
        <path d="M 157 140 L 163 146 L 174 134" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
