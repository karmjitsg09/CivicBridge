import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CivicBridge Error Boundary Caught Error]:', error.message, errorInfo.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-main)',
            padding: '2rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div
            className="stitch-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-card-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
            }}
            role="alert"
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--card-tint-coral-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--card-tint-coral-text)',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--text-on-card-primary)',
                margin: '0 0 0.6rem 0',
              }}
            >
              Something went wrong.
            </h1>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-on-card-secondary)',
                lineHeight: 1.6,
                margin: '0 0 2rem 0',
              }}
            >
              CivicBridge encountered an unexpected rendering error. Your report data in the Civic Ledger remains preserved.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                className="stitch-btn stitch-btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} />
                <span>Reload CivicBridge</span>
              </button>

              <button
                onClick={this.handleReset}
                className="stitch-btn stitch-btn-secondary"
                style={{
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'var(--text-on-card-primary)',
                }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
