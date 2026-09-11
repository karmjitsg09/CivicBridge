import { Card } from '../components/common/Card';
import { AIBridgeIllustration } from '../components/illustrations/AIBridgeIllustration';
import { CivicPersonIllustration } from '../components/illustrations/CitySceneIllustration';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  Workflow,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksScreen: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '01',
      title: 'Messy Human Input',
      desc: 'Citizens simply describe what is wrong using natural spoken language, rough typed thoughts, or a smartphone photo. No municipal knowledge required.',
      badge: 'Multimodal Input',
    },
    {
      num: '02',
      title: 'Gemini Intent & Evidence Analysis',
      desc: 'Gemini separates emotional intent from objective physical facts, identifies the public hazard, measures urgency, and extracts visual evidence.',
      badge: 'Reasoning Engine',
    },
    {
      num: '03',
      title: 'Strict Schema Structuring',
      desc: 'The backend maps the observation to official municipal departments, determines severity codes, and calculates a calibrated confidence rating.',
      badge: 'Validated Schema',
    },
    {
      num: '04',
      title: 'Actionable Civic Outcome',
      desc: 'The citizen receives an editable, pre-drafted formal municipal work order ready to file or share with zero bureaucratic friction.',
      badge: 'Action Center',
    },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto 4rem auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-cobalt-light)',
            color: 'var(--color-cobalt)',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}
        >
          <Workflow size={16} />
          <span>System Architecture</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          How CivicBridge AI Works
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto' }}>
          Bridging the gap between messy citizen observations and structured municipal systems.
        </p>
      </div>

      {/* Hero Interactive Bridge Diagram */}
      <Card
        elevated
        style={{
          padding: '2.5rem 1.5rem',
          marginBottom: '3rem',
          background: 'var(--surface-card)',
          border: '1.5px solid var(--border-card-subtle)',
        }}
      >
        <AIBridgeIllustration activeStep={3} />
      </Card>

      {/* 4 Pillars Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem',
        }}
      >
        {steps.map((step) => (
          <Card key={step.num} hoverable style={{ padding: '1.75rem', background: 'var(--surface-card)', border: '1px solid var(--border-card-subtle)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--card-tint-blue-text)',
                background: 'var(--card-tint-blue-bg)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              STEP {step.num} • {step.badge}
            </span>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-on-card-primary)', marginBottom: '0.5rem' }}>
              {step.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-on-card-secondary)', lineHeight: 1.55, margin: 0 }}>
              {step.desc}
            </p>
          </Card>
        ))}
      </div>

      {/* Core Principles Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
          marginBottom: '3.5rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-on-page)', marginBottom: '1rem' }}>
            Built on Core Civic Trust Principles
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <ShieldCheck size={22} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-on-page)' }}>
                  Not a Chatbot — An Intent Engine
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-on-page-muted)' }}>
                  Conversational chat is tedious for civic emergencies. CivicBridge executes a focused, one-shot transformation directly into an action plan.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lock size={22} color="var(--color-cobalt)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-on-page)' }}>
                  Strict Data Provenance & Safety
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-on-page-muted)' }}>
                  AI guesses are never disguised as verified official statements. Credentials stay strictly server-side.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <FileCheck2 size={22} color="var(--color-violet)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-on-page)' }}>
                  Human-in-the-Loop Control
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-on-page-muted)' }}>
                  Citizens always retain full power to edit, review, and confirm municipal complaints before filing or sharing.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CivicPersonIllustration />
        </div>
      </div>

      {/* CTA Box */}
      <div
        className="stitch-card"
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          background: 'var(--gradient-brand)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          Ready to empower your community?
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
          Report a neighborhood hazard in seconds with Gemini multimodal reasoning.
        </p>
        <button
          onClick={onGetStarted}
          className="stitch-btn"
          style={{
            background: '#ffffff',
            color: 'var(--color-cobalt)',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '0.85rem 1.85rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          }}
        >
          <span>Start a Civic Report</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default HowItWorksScreen;
