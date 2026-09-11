import React from 'react';
import { DEMO_SCENARIOS, DemoScenario } from '../../data/demoData';
import { IssueIllustration } from '../illustrations/IssueIllustration';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ExampleScenariosProps {
  onSelectScenario: (scenario: DemoScenario) => void;
}

export const ExampleScenarios: React.FC<ExampleScenariosProps> = ({ onSelectScenario }) => {
  return (
    <section style={{ marginTop: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-cobalt)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            <Sparkles size={15} />
            <span>Interactive Demo Situations</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Try a real-world civic situation in one click
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Launches full Gemini intent extraction pipeline
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {DEMO_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className="stitch-card stitch-card-hover"
            style={{
              padding: '1.25rem',
              border: '1px solid var(--border-card-subtle)',
              background: 'var(--surface-card)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
            aria-label={`Load demo scenario: ${scenario.title}`}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <IssueIllustration category={scenario.category} size={42} />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--card-tint-blue-text)',
                    background: 'var(--card-tint-blue-bg)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {scenario.category}
                </span>
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-on-card-primary)', marginBottom: '0.35rem' }}>
                {scenario.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-on-card-secondary)', lineHeight: 1.45, margin: 0 }}>
                {scenario.shortDesc}
              </p>
            </div>

            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--card-tint-blue-text)',
              }}
            >
              <span>Test this scenario</span>
              <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ExampleScenarios;
