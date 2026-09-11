import React, { useEffect, useState } from 'react';
import { AIBridgeIllustration } from '../components/illustrations/AIBridgeIllustration';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AIProcessingScreenProps {
  onComplete: () => void;
  inputText?: string;
  hasImage?: boolean;
  hasLocation?: boolean;
  hasVoice?: boolean;
}

export const AIProcessingScreen: React.FC<AIProcessingScreenProps> = ({
  onComplete,
  inputText: _inputText = '',
  hasImage = false,
  hasLocation = false,
  hasVoice = false,
}) => {
  // Dynamically assemble pipeline stages matching the supplied modalities
  const stages = [
    {
      id: 1,
      title: 'Understanding Your Description',
      desc: hasVoice
        ? 'Processing transcribed audio statement and citizen narrative...'
        : 'Ingesting natural language citizen narrative and urgency tokens...',
      tag: hasVoice ? 'Voice & Text Intake' : 'Text Intake',
    },
    ...(hasImage
      ? [
          {
            id: 2,
            title: 'Analyzing Visual Evidence',
            desc: 'Interpreting photographic pixels, physical pavement/structural degradation, and environmental boundaries...',
            tag: 'Gemini Vision Multimodal',
          },
        ]
      : []),
    ...(hasLocation
      ? [
          {
            id: hasImage ? 3 : 2,
            title: 'Considering Location Coordinates',
            desc: 'Cross-referencing reported geographic context and municipal asset jurisdiction...',
            tag: 'Spatial Grounding',
          },
        ]
      : []),
    {
      id: hasImage && hasLocation ? 4 : hasImage || hasLocation ? 3 : 2,
      title: 'Structuring Action-Ready Civic Report',
      desc: 'Formulating formal complaint draft, severity classification, and dispatch protocols...',
      tag: 'Structured Synthesis',
    },
  ];

  const totalStages = stages.length;
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const stepDuration = 2600 / totalStages;
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < totalStages - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimeout);
    };
  }, [onComplete, totalStages]);

  const activeStage = stages[currentStageIdx] || stages[0];
  const progressPercent = Math.round(((currentStageIdx + 1) / totalStages) * 100);

  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '2rem auto 4rem auto',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-violet-light)',
          color: 'var(--color-violet)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        <Sparkles size={16} />
        <span>Gemini Multimodal Reasoning Active</span>
      </div>

      <h2
        style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
          fontWeight: 800,
          marginBottom: '0.85rem',
          color: 'var(--text-main)',
        }}
      >
        Bridging Human Intent to{' '}
        <span
          style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Civic Action
        </span>
      </h2>

      <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 2.5rem auto' }}>
        Gemini is evaluating your observation to generate a structured, reviewable municipal outcome.
      </p>

      {/* Dynamic Animated Bridge Canvas */}
      <div
        className="stitch-card"
        style={{
          padding: '2rem 1.5rem',
          marginBottom: '2.5rem',
          background: 'var(--surface-card)',
          boxShadow: 'var(--shadow-lg)',
          border: '1.5px solid var(--border-card-subtle)',
        }}
      >
        <AIBridgeIllustration activeStep={Math.min(4, currentStageIdx + 1)} />
      </div>

      {/* Stage Progress Card */}
      <div
        className="stitch-card"
        style={{
          padding: '1.5rem 2rem',
          textAlign: 'left',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-card-subtle)',
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--card-tint-blue-text)' }}>
            Processing Pipeline: Stage {currentStageIdx + 1} of {totalStages}
          </span>
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-on-card-muted)' }}>
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: '8px', background: 'var(--surface-card-subtle)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border-card-subtle)' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--gradient-bridge)',
              transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Active Stage Details */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--card-tint-blue-bg)',
              color: 'var(--card-tint-blue-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-on-card-primary)', margin: 0 }}>
                {activeStage.title}
              </h4>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--card-tint-blue-text)',
                  background: 'var(--card-tint-blue-bg)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {activeStage.tag}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-on-card-secondary)', margin: 0, lineHeight: 1.5 }}>
              {activeStage.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIProcessingScreen;
