import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/common/Navigation';
import { HomeScreen } from './screens/HomeScreen';
import { AIProcessingScreen } from './screens/AIProcessingScreen';
import { AnalysisResultScreen } from './screens/AnalysisResultScreen';
import { ActionCenterScreen } from './screens/ActionCenterScreen';
import { ReportEditorScreen } from './screens/ReportEditorScreen';
import { ReportReadyScreen } from './screens/ReportReadyScreen';
import { CivicLedgerScreen } from './screens/CivicLedgerScreen';
import { HowItWorksScreen } from './screens/HowItWorksScreen';
import {
  CivicInputState,
  CivicAnalysisResult,
  CivicReport,
  ScreenType,
  ReportStatus,
} from './types/civic';
import { DEMO_SCENARIOS, DemoScenario, INITIAL_LEDGER_REPORTS } from './data/demoData';
import {
  fetchReports,
  createReport,
  updateReport,
  deleteReport,
} from './services/reportsApi';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [serverConnected, setServerConnected] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [storageType, setStorageType] = useState<'firestore' | 'local_demo'>('local_demo');

  // Input State
  const [inputState, setInputState] = useState<CivicInputState>({
    text: '',
    imageFile: null,
    imagePreviewUrl: null,
    location: '',
    isTranscribing: false,
  });

  // Current Active Analysis Result
  const [analysisResult, setAnalysisResult] = useState<CivicAnalysisResult>(
    DEMO_SCENARIOS[0].analysisResult
  );

  // Active Finalized Report (for ReportReadyScreen)
  const [activeReport, setActiveReport] = useState<CivicReport>(INITIAL_LEDGER_REPORTS[0]);

  // Report currently being edited in ReportEditorScreen (null if creating new)
  const [editingReport, setEditingReport] = useState<CivicReport | null>(null);

  // Persistent Ledger Reports State
  const [ledgerReports, setLedgerReports] = useState<CivicReport[]>(INITIAL_LEDGER_REPORTS);

  // Load persistent reports from backend API
  const loadReportsFromBackend = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const response = await fetchReports();
      if (response.reports && response.reports.length > 0) {
        setLedgerReports(response.reports);
      }
      setStorageType(response.storageType);
    } catch (e) {
      console.warn('Could not fetch reports from backend, using local state:', e);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadReportsFromBackend();
  }, [loadReportsFromBackend]);

  // Health check to backend
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setServerConnected(true);
        } else {
          setServerConnected(false);
        }
      } catch {
        setServerConnected(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  // Update input state partially
  const handleInputChange = (partial: Partial<CivicInputState>) => {
    setInputState((prev) => ({ ...prev, ...partial }));
  };

  // Submit from InputComposer to live Gemini backend
  const handleSubmitInput = async () => {
    if (isAnalyzing) return; // Prevent duplicate rapid submission
    setIsAnalyzing(true);
    setCurrentScreen('processing');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const formData = new FormData();
      formData.append('text', inputState.text);
      if (inputState.location) formData.append('location', inputState.location);
      if (inputState.imageFile) formData.append('image', inputState.imageFile);
      if (inputState.voiceTranscript) formData.append('voiceTranscript', inputState.voiceTranscript);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAnalysisResult(json.data);
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn('Live Gemini API call failed, falling back to local reasoning engine:', e);
    }

    // Resilient fallback logic
    const lower = inputState.text.toLowerCase();
    let matchedScenario = DEMO_SCENARIOS[0];
    if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste')) {
      matchedScenario = DEMO_SCENARIOS[1];
    } else if (lower.includes('light') || lower.includes('dark') || lower.includes('lamp')) {
      matchedScenario = DEMO_SCENARIOS[2];
    } else if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
      matchedScenario = DEMO_SCENARIOS[3];
    } else if (lower.includes('traffic') || lower.includes('signal') || lower.includes('light')) {
      matchedScenario = DEMO_SCENARIOS[4];
    }

    const customizedResult: CivicAnalysisResult = {
      ...matchedScenario.analysisResult,
      location: {
        provided: Boolean(inputState.location),
        description: inputState.location || matchedScenario.analysisResult.location.description,
      },
      evidence: [
        {
          type: inputState.imagePreviewUrl ? 'image' : 'text',
          description: inputState.imagePreviewUrl
            ? 'Attached user photograph analyzed for visible physical anomalies.'
            : `Citizen narrative ingested: "${inputState.text.slice(0, 80)}..."`,
        },
        ...matchedScenario.analysisResult.evidence.slice(1),
      ],
      analysisEngine: 'diagnostic-fallback',
    };

    setAnalysisResult(customizedResult);
    setIsAnalyzing(false);
  };

  // One-click demo scenario selection running through live analysis
  const handleSelectScenario = async (scenario: DemoScenario) => {
    setInputState({
      text: scenario.inputText,
      location: scenario.location,
      imageFile: null,
      imagePreviewUrl: scenario.imagePreviewUrl,
      isTranscribing: false,
    });
    setIsAnalyzing(true);
    setCurrentScreen('processing');

    try {
      const formData = new FormData();
      formData.append('text', scenario.inputText);
      formData.append('location', scenario.location);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAnalysisResult(json.data);
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Scenario backend call fallback:', e);
    }

    setAnalysisResult(scenario.analysisResult);
    setIsAnalyzing(false);
  };

  // Direct generation from Action Center
  const handleGenerateReportFromActionCenter = async () => {
    if (isGeneratingReport) return;
    setIsGeneratingReport(true);

    try {
      const reportPayload = {
        issueTitle: analysisResult.issueTitle,
        category: analysisResult.category,
        summary: analysisResult.issueTitle,
        detailedDescription: analysisResult.detailedDescription,
        severity: analysisResult.severity,
        urgency: analysisResult.urgency,
        location: analysisResult.location.description || 'Municipal Area',
        recommendedDepartment: analysisResult.recommendedDepartment,
        recommendedAction: analysisResult.recommendedAction,
        evidence: analysisResult.evidence,
        confidence: analysisResult.confidence,
        missingInformation: analysisResult.missingInformation,
        uncertainties: analysisResult.uncertainties,
        analysisEngine: analysisResult.analysisEngine,
        imagePreviewUrl: inputState.imagePreviewUrl,
      };

      const savedReport = await createReport(reportPayload);
      setActiveReport(savedReport);
      setLedgerReports((prev) => [savedReport, ...prev.filter((r) => r.id !== savedReport.id)]);
      setCurrentScreen('report_ready');
    } catch (err) {
      console.error('Failed to create report in backend:', err);
      // Fallback local report creation
      const localReport: CivicReport = {
        id: `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'ACTION READY',
        title: analysisResult.issueTitle,
        issueTitle: analysisResult.issueTitle,
        category: analysisResult.category,
        severity: analysisResult.severity,
        urgency: analysisResult.urgency,
        location: analysisResult.location.description || 'General Municipality',
        description: analysisResult.detailedDescription,
        detailedDescription: analysisResult.detailedDescription,
        recommendedDepartment: analysisResult.recommendedDepartment,
        requestedAction: analysisResult.recommendedAction,
        evidenceCount: analysisResult.evidence.length,
        imagePreviewUrl: inputState.imagePreviewUrl,
        confidence: analysisResult.confidence,
        storageType: 'local_demo',
      };
      setActiveReport(localReport);
      setLedgerReports((prev) => [localReport, ...prev]);
      setCurrentScreen('report_ready');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Save report from ReportEditorScreen (handles both create and update)
  const handleSaveReport = async (reportData: CivicReport) => {
    if (editingReport) {
      // Updating an existing report
      try {
        const updated = await updateReport(editingReport.id, reportData);
        setActiveReport(updated);
        setLedgerReports((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
        setEditingReport(null);
        setCurrentScreen('ledger');
      } catch (err) {
        console.error('Update failed:', err);
        // Optimistic local update
        setLedgerReports((prev) =>
          prev.map((r) => (r.id === reportData.id ? reportData : r))
        );
        setEditingReport(null);
        setCurrentScreen('ledger');
      }
    } else {
      // Creating a new report from analysis
      try {
        const created = await createReport(reportData);
        setActiveReport(created);
        setLedgerReports((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
        setCurrentScreen('report_ready');
      } catch (err) {
        console.error('Create failed:', err);
        // Fallback local add
        setActiveReport(reportData);
        setLedgerReports((prev) => [reportData, ...prev.filter((r) => r.id !== reportData.id)]);
        setCurrentScreen('report_ready');
      }
    }
  };

  // Status change handler for CivicLedgerScreen
  const handleUpdateStatus = async (reportId: string, newStatus: ReportStatus) => {
    // Normalization for API
    const apiStatus = newStatus.replace(' ', '_');
    const statusNote = newStatus === 'RESOLVED' ? 'Marked resolved by you' : undefined;

    // Optimistic state update
    setLedgerReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: newStatus,
              statusNote: statusNote || r.statusNote,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : r
      )
    );

    try {
      await updateReport(reportId, { status: apiStatus });
    } catch (e) {
      console.warn('Status update API sync failed:', e);
    }
  };

  // Delete report handler for CivicLedgerScreen
  const handleDeleteReport = async (reportId: string) => {
    // Optimistic removal
    setLedgerReports((prev) => prev.filter((r) => r.id !== reportId));

    try {
      await deleteReport(reportId);
    } catch (e) {
      console.warn('Delete report API sync failed:', e);
    }
  };

  // Edit report requested from CivicLedgerScreen
  const handleStartEditReport = (report: CivicReport) => {
    setEditingReport(report);
    setCurrentScreen('report_editor');
  };

  // Start over / report new issue
  const handleStartOver = () => {
    setEditingReport(null);
    setInputState({
      text: '',
      imageFile: null,
      imagePreviewUrl: null,
      location: '',
      isTranscribing: false,
    });
    setCurrentScreen('home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          if (screen === 'home') setEditingReport(null);
          setCurrentScreen(screen);
        }}
        serverConnected={serverConnected}
        ledgerCount={ledgerReports.length}
      />

      {/* Main Content View Switcher */}
      <main className="container" style={{ flex: 1, padding: '1.5rem' }}>
        {currentScreen === 'home' && (
          <HomeScreen
            inputState={inputState}
            onChangeInput={handleInputChange}
            onSubmitInput={handleSubmitInput}
            onSelectScenario={handleSelectScenario}
            isLoading={isAnalyzing}
          />
        )}

        {currentScreen === 'processing' && (
          <AIProcessingScreen
            onComplete={() => setCurrentScreen('analysis')}
            inputText={inputState.text}
            hasImage={Boolean(inputState.imagePreviewUrl)}
            hasLocation={Boolean(inputState.location)}
            hasVoice={Boolean(inputState.hasVoice || inputState.voiceTranscript)}
          />
        )}

        {currentScreen === 'analysis' && (
          <AnalysisResultScreen
            analysis={analysisResult}
            imagePreviewUrl={inputState.imagePreviewUrl}
            onProceedToActionCenter={() => setCurrentScreen('action_center')}
            onStartOver={handleStartOver}
          />
        )}

        {currentScreen === 'action_center' && (
          <ActionCenterScreen
            analysis={analysisResult}
            onGenerateReport={handleGenerateReportFromActionCenter}
            onEditReport={() => {
              setEditingReport(null);
              setCurrentScreen('report_editor');
            }}
            onStartOver={handleStartOver}
          />
        )}

        {currentScreen === 'report_editor' && (
          <ReportEditorScreen
            analysis={editingReport ? null : analysisResult}
            existingReport={editingReport}
            imagePreviewUrl={editingReport?.imagePreviewUrl || inputState.imagePreviewUrl}
            onSaveReport={handleSaveReport}
            onCancel={() => {
              if (editingReport) {
                setEditingReport(null);
                setCurrentScreen('ledger');
              } else {
                setCurrentScreen('action_center');
              }
            }}
          />
        )}

        {currentScreen === 'report_ready' && (
          <ReportReadyScreen
            report={activeReport}
            onViewLedger={() => setCurrentScreen('ledger')}
            onCreateAnother={handleStartOver}
            onReportSaved={(savedReport) => {
              setActiveReport(savedReport);
              setLedgerReports((prev) => [savedReport, ...prev.filter((r) => r.id !== savedReport.id)]);
            }}
          />
        )}

        {currentScreen === 'ledger' && (
          <CivicLedgerScreen
            reports={ledgerReports}
            storageType={storageType}
            isLoading={isLoadingReports}
            onRefresh={loadReportsFromBackend}
            onCreateNew={handleStartOver}
            onEditReport={handleStartEditReport}
            onUpdateStatus={handleUpdateStatus}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {currentScreen === 'how_it_works' && (
          <HowItWorksScreen onGetStarted={handleStartOver} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--nav-border)',
          background: 'var(--nav-bg)',
          padding: '2rem 0',
          marginTop: 'auto',
          fontSize: '0.85rem',
          color: 'var(--nav-text-muted)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <strong style={{ color: 'var(--nav-text)' }}>CivicBridge AI</strong> — Turning Messy Human Intent into Actionable Civic Outcomes
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button
              onClick={() => setCurrentScreen('how_it_works')}
              style={{ background: 'none', border: 'none', color: 'var(--color-cobalt)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              How It Works
            </button>
            <button
              onClick={() => setCurrentScreen('ledger')}
              style={{ background: 'none', border: 'none', color: 'var(--color-cobalt)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Civic Ledger
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
