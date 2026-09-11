import React from 'react';

export const AIBridgeIllustration: React.FC<{ activeStep?: number }> = ({ activeStep = 2 }) => {
  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
      <svg
        viewBox="0 0 700 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="Gemini Civic Bridge processing pipeline"
      >
        <defs>
          <linearGradient id="bridgeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="35%" stopColor="#8b5cf6" />
            <stop offset="70%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background path */}
        <path
          d="M 80 120 C 220 50, 480 50, 620 120"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Active Animated Bridge Beam */}
        <path
          d="M 80 120 C 220 50, 480 50, 620 120"
          stroke="url(#bridgeFlow)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="18 12"
          style={{
            animation: 'bridgeBeam 8s linear infinite',
          }}
        />

        {/* Floating particles along the arc */}
        <circle cx="200" cy="85" r="5" fill="#3b82f6" opacity="0.9">
          <animate attributeName="cx" values="120;300;500;600" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cy" values="105;65;75;115" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;1;1;0.2" dur="3s" repeatCount="indefinite" />
        </circle>

        <circle cx="340" cy="65" r="7" fill="#8b5cf6" opacity="0.95" filter="url(#glowFilter)">
          <animate attributeName="cx" values="240;420;600" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="cy" values="70;65;115" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* Node 1: Messy Input */}
        <g transform="translate(80, 120)">
          <circle cx="0" cy="0" r="32" fill="#eff6ff" stroke="#3b82f6" strokeWidth={activeStep >= 1 ? 4 : 2} />
          <circle cx="0" cy="0" r="18" fill="#3b82f6" />
          <text x="0" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="sans-serif">
            MESSY INPUT
          </text>
          <text x="0" y="72" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="sans-serif">
            Voice • Photo • Text
          </text>
        </g>

        {/* Node 2: Gemini Intent Engine */}
        <g transform="translate(260, 78)">
          <circle cx="0" cy="0" r="36" fill="#fdf4ff" stroke="#a855f7" strokeWidth={activeStep >= 2 ? 5 : 2} />
          <circle cx="0" cy="0" r="22" fill="#a855f7" />
          {/* Sparkle icon */}
          <path d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z" fill="#ffffff" />
          <text x="0" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="sans-serif">
            GEMINI ENGINE
          </text>
          <text x="0" y="75" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="sans-serif">
            Intent & Evidence
          </text>
        </g>

        {/* Node 3: Structured Civic Issue */}
        <g transform="translate(440, 78)">
          <circle cx="0" cy="0" r="36" fill="#fdf2f8" stroke="#ec4899" strokeWidth={activeStep >= 3 ? 5 : 2} />
          <circle cx="0" cy="0" r="22" fill="#ec4899" />
          <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#ffffff" />
          <text x="0" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="sans-serif">
            STRUCTURED DATA
          </text>
          <text x="0" y="75" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="sans-serif">
            Dept • Severity • Steps
          </text>
        </g>

        {/* Node 4: Actionable Outcome */}
        <g transform="translate(620, 120)">
          <circle cx="0" cy="0" r="32" fill="#ecfeff" stroke="#06b6d4" strokeWidth={activeStep >= 4 ? 4 : 2} />
          <circle cx="0" cy="0" r="18" fill="#06b6d4" />
          <path d="M -6 0 L -2 4 L 6 -4" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="0" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="sans-serif">
            CIVIC ACTION
          </text>
          <text x="0" y="72" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="sans-serif">
            Formal Report Ready
          </text>
        </g>
      </svg>
    </div>
  );
};

export default AIBridgeIllustration;
