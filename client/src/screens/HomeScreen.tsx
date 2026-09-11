import React from 'react';
import { CivicHeroIllustration } from '../components/illustrations/CivicHeroIllustration';
import { InputComposer } from '../components/input/InputComposer';
import { ExampleScenarios } from '../components/input/ExampleScenarios';
import { CivicInputState } from '../types/civic';
import { DemoScenario } from '../data/demoData';
import { ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

interface HomeScreenProps {
  inputState: CivicInputState;
  onChangeInput: (newState: Partial<CivicInputState>) => void;
  onSubmitInput: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
  isLoading?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  inputState,
  onChangeInput,
  onSubmitInput,
  onSelectScenario,
  isLoading = false,
}) => {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '3rem 0 2rem 0',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Left Hero Content */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-cobalt-light)',
                border: '1px solid rgba(29, 78, 216, 0.25)',
                color: 'var(--color-cobalt)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
              }}
            >
              <Zap size={15} />
              <span>Human Intent → Civic Action</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.14,
                marginBottom: '1.25rem',
                color: 'var(--text-main)',
              }}
            >
              Turn real-world problems into{' '}
              <span
                style={{
                  background: 'var(--gradient-brand)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                actionable civic reports
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: '520px',
                marginBottom: '1.75rem',
              }}
            >
              Civic systems are complex. Citizens shouldn’t need to know municipal codes or department hierarchies.
              Just describe what happened with voice, photo, or natural language.
            </p>

            {/* Value Props */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <ShieldCheck size={18} color="var(--color-emerald)" />
                <span>Zero Fake Chatbots</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <HeartHandshake size={18} color="var(--color-cobalt)" />
                <span>Actionable Citizen Report</span>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CivicHeroIllustration />
          </div>
        </div>

        {/* Center Input Composer */}
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <InputComposer
            inputState={inputState}
            onChange={onChangeInput}
            onSubmit={onSubmitInput}
            isLoading={isLoading}
          />
        </div>

        {/* Demo Scenarios */}
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <ExampleScenarios onSelectScenario={onSelectScenario} />
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
