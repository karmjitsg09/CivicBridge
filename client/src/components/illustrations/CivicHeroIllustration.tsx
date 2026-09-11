import React from 'react';

export const CivicHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`civic-hero-illustration ${className}`} style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 500 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 14px 28px rgba(37, 99, 235, 0.12))' }}
        role="img"
        aria-label="Civic community with smart civic bridge connectivity"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#fdf4ff" />
          </linearGradient>
          <linearGradient id="heroSun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="bldgCobalt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="bldgViolet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="bldgCyan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="bridgeBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Soft Backdrop Pill */}
        <rect x="20" y="20" width="460" height="340" rx="40" fill="url(#skyGrad)" />

        {/* Sunny Glow */}
        <circle cx="120" cy="90" r="48" fill="url(#heroSun)" opacity="0.85" />
        <circle cx="120" cy="90" r="64" stroke="#fef08a" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />

        {/* Urban Skyline Silhouette */}
        <rect x="70" y="140" width="60" height="150" rx="8" fill="url(#bldgCyan)" opacity="0.9" />
        <rect x="145" y="110" width="75" height="180" rx="10" fill="url(#bldgCobalt)" />
        <rect x="235" y="130" width="65" height="160" rx="8" fill="url(#bldgViolet)" />
        <rect x="315" y="160" width="55" height="130" rx="8" fill="#60a5fa" opacity="0.8" />
        <rect x="385" y="125" width="60" height="165" rx="10" fill="url(#bldgCobalt)" opacity="0.85" />

        {/* Windows */}
        <g fill="#ffffff" opacity="0.85">
          <rect x="85" y="160" width="12" height="16" rx="2" />
          <rect x="105" y="160" width="12" height="16" rx="2" />
          <rect x="85" y="190" width="12" height="16" rx="2" />
          <rect x="105" y="190" width="12" height="16" rx="2" />

          <rect x="160" y="130" width="16" height="20" rx="3" />
          <rect x="185" y="130" width="16" height="20" rx="3" />
          <rect x="160" y="165" width="16" height="20" rx="3" />
          <rect x="185" y="165" width="16" height="20" rx="3" />
          <rect x="160" y="200" width="16" height="20" rx="3" />
          <rect x="185" y="200" width="16" height="20" rx="3" />

          <rect x="250" y="150" width="14" height="18" rx="2" />
          <rect x="272" y="150" width="14" height="18" rx="2" />
          <rect x="250" y="180" width="14" height="18" rx="2" />
          <rect x="272" y="180" width="14" height="18" rx="2" />
        </g>

        {/* Smart Energy Arch / Bridge */}
        <path
          d="M 60 280 C 180 210, 320 210, 440 280"
          stroke="url(#bridgeBeam)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 80 290 C 190 230, 310 230, 420 290"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="8 6"
          fill="none"
        />

        {/* Tree & Greenery */}
        <circle cx="105" cy="275" r="24" fill="#10b981" />
        <circle cx="125" cy="265" r="18" fill="#34d399" />
        <rect x="110" y="275" width="8" height="25" fill="#065f46" rx="2" />

        {/* Streetlight with Civic Beam */}
        <line x1="380" y1="230" x2="380" y2="300" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <path d="M 380 230 Q 360 220 350 232" stroke="#475569" strokeWidth="4" fill="none" />
        <circle cx="350" cy="235" r="7" fill="#facc15" />
        <path d="M 335 242 L 320 280 L 370 280 Z" fill="#fef08a" opacity="0.3" />

        {/* Ground Road */}
        <rect x="40" y="295" width="420" height="40" rx="14" fill="#334155" />
        <line x1="70" y1="315" x2="430" y2="315" stroke="#facc15" strokeWidth="3" strokeDasharray="20 16" />

        {/* Citizen Character with Phone */}
        <g transform="translate(210, 240)">
          {/* Head */}
          <circle cx="30" cy="15" r="12" fill="#ea580c" />
          {/* Torso with vibrant hoodie */}
          <path d="M 18 30 Q 30 26 42 30 L 45 60 L 15 60 Z" fill="#2563eb" />
          {/* Arms holding reporting device */}
          <path d="M 17 38 L 8 48 L 18 52" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
          <path d="M 43 38 L 50 48 L 38 52" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
          {/* Smartphone device with cyan ping */}
          <rect x="22" y="44" width="16" height="22" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="30" cy="53" r="3" fill="#06b6d4" />
          {/* Signal beam from phone */}
          <path d="M 30 40 Q 30 15 60 5" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          {/* Legs */}
          <line x1="22" y1="60" x2="22" y2="82" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          <line x1="38" y1="60" x2="38" y2="82" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          {/* Shoes */}
          <rect x="16" y="80" width="12" height="6" rx="3" fill="#ffffff" />
          <rect x="34" y="80" width="12" height="6" rx="3" fill="#ffffff" />
        </g>

        {/* Floating Civic Badge Elements */}
        <g className="animate-float">
          {/* Pothole / Road icon badge */}
          <g transform="translate(60, 105)">
            <rect width="42" height="42" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="21" cy="21" r="14" fill="#fee2e2" />
            <path d="M 14 24 L 28 24 L 25 18 L 17 18 Z" fill="#dc2626" />
          </g>

          {/* AI Check badge */}
          <g transform="translate(370, 70)">
            <rect width="44" height="44" rx="14" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
            <circle cx="22" cy="22" r="14" fill="#ede9fe" />
            <path d="M 16 22 L 20 26 L 28 18" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

          {/* Location Pin badge */}
          <g transform="translate(290, 45)">
            <rect width="38" height="38" rx="12" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="19" cy="19" r="6" fill="#0284c7" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CivicHeroIllustration;
