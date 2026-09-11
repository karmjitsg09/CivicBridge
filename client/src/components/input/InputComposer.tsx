import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  MapPin,
  Sparkles,
  X,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { CivicInputState } from '../../types/civic';

interface InputComposerProps {
  inputState: CivicInputState;
  onChange: (newState: Partial<CivicInputState>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR' | 'UNSUPPORTED';

const MAX_CHAR_LIMIT = 2000;

export const InputComposer: React.FC<InputComposerProps> = ({
  inputState,
  onChange,
  onSubmit,
  isLoading = false,
}) => {
  const [showLocationInput, setShowLocationInput] = useState(Boolean(inputState.location));
  const [isDragging, setIsDragging] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'captured' | 'denied'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  const isSpeechSupported = typeof window !== 'undefined' && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  // Initialize speech recognition instance if supported
  useEffect(() => {
    if (!isSpeechSupported) {
      setVoiceState('UNSUPPORTED');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState('LISTENING');
        setVoiceMessage('Listening... Speak naturally to describe the civic issue. Click "Stop Listening" when done.');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const updated = inputState.text
            ? `${inputState.text.trim()} ${finalTranscript.trim()}`
            : finalTranscript.trim();
          onChange({
            text: updated.slice(0, MAX_CHAR_LIMIT),
            voiceTranscript: finalTranscript.trim(),
            hasVoice: true,
          });
          setVoiceState('SUCCESS');
          setVoiceMessage('Voice transcribed! You can edit the text description in the box above before submitting.');
          setTimeout(() => {
            setVoiceState('IDLE');
            setVoiceMessage(null);
          }, 4000);
        } else if (interimTranscript) {
          setVoiceMessage(`Transcribing: "${interimTranscript}"...`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceState('ERROR');
          setVoiceMessage('Microphone access was denied. Please allow microphone permissions in your browser or type your description.');
        } else if (event.error === 'no-speech') {
          setVoiceState('ERROR');
          setVoiceMessage('No speech was detected. Click microphone to try again or type your report.');
        } else {
          setVoiceState('ERROR');
          setVoiceMessage(`Speech recognition encountered an issue (${event.error}). Please type your description.`);
        }
      };

      recognition.onend = () => {
        if (voiceState === 'LISTENING') {
          setVoiceState('IDLE');
          setVoiceMessage(null);
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e);
      setVoiceState('UNSUPPORTED');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [inputState.text, isSpeechSupported]);

  // Voice toggle handler with explicit start/stop and unsupported detection
  const handleVoiceToggle = () => {
    if (!isSpeechSupported) {
      setVoiceState('UNSUPPORTED');
      setVoiceMessage('Speech recognition is not supported in this browser. Please type your civic issue directly into the text box.');
      return;
    }

    if (voiceState === 'LISTENING') {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setVoiceState('IDLE');
      setVoiceMessage(null);
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setVoiceState('ERROR');
      setVoiceMessage('Could not activate microphone. Please type your description.');
    }
  };

  // Image file validation & processing
  const processImageFile = useCallback(
    (file: File) => {
      setImageError(null);
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedMimes.includes(file.type)) {
        setImageError('Unsupported image format. Please upload a JPEG, PNG, or WebP photo.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setImageError('Maximum photo file size is 10 MB. Please choose a smaller photo.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          imageFile: file,
          imagePreviewUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const removeImage = () => {
    setImageError(null);
    onChange({ imageFile: null, imagePreviewUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Geolocation detector with honest GPS representation
  const handleDetectLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationError('Geolocation is not supported by your browser. You can type an address or intersection manually.');
      setShowLocationInput(true);
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        const coordString = `${Math.abs(Number(lat))}° ${Number(lat) >= 0 ? 'N' : 'S'}, ${Math.abs(Number(lng))}° ${Number(lng) >= 0 ? 'E' : 'W'} (Browser GPS)`;
        onChange({ location: coordString });
        setLocationStatus('captured');
        setLocationError(null);
        setShowLocationInput(true);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('denied');
        setShowLocationInput(true);
        if (err.code === 1) {
          setLocationError('Location access was denied. You can manually enter an intersection or street, or leave it blank.');
        } else {
          setLocationError('Unable to resolve GPS location. You can enter an address manually or proceed without location.');
        }
      },
      { timeout: 8000 }
    );
  };

  const clearLocation = () => {
    onChange({ location: '' });
    setShowLocationInput(false);
    setLocationStatus('idle');
    setLocationError(null);
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (hasContent && !isLoading) {
        onSubmit();
      }
    }
  };

  const hasContent = Boolean(inputState.text.trim() || inputState.imagePreviewUrl);
  const remainingChars = MAX_CHAR_LIMIT - inputState.text.length;

  return (
    <div
      className={`stitch-card ${isDragging ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        padding: '2rem',
        border: isDragging ? '2px dashed var(--color-cobalt)' : '1px solid var(--border-accent)',
        boxShadow: isDragging ? 'var(--shadow-glow)' : 'var(--shadow-md)',
        background: 'var(--bg-surface)',
        transition: 'all var(--transition-fast)',
        position: 'relative',
      }}
    >
      {/* Drag overlay notice */}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--card-tint-blue-bg)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <UploadCloud size={48} color="var(--card-tint-blue-text)" />
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--card-tint-blue-text)' }}>
            Drop photographic evidence here
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-on-card-muted)' }}>
            JPEG, PNG, or WebP up to 10MB
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-on-card-primary)', marginBottom: '0.35rem' }}>
          What happened?
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-on-card-secondary)', margin: 0 }}>
          Tell us what needs attention. You can type, speak with microphone, drag and drop a photo, or attach your coordinates.
        </p>
      </div>

      {/* Main Text Area */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          id="civic-issue-input"
          value={inputState.text}
          onChange={(e) => onChange({ text: e.target.value.slice(0, MAX_CHAR_LIMIT) })}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 'There is a deep pothole on the pedestrian crossing outside Lincoln School causing vehicles to swerve'..."
          rows={4}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '1.1rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-card-subtle)',
            fontSize: '1rem',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
            color: 'var(--text-on-card-primary)',
            background: 'var(--surface-card)',
            resize: 'vertical',
            transition: 'all var(--transition-fast)',
          }}
          aria-label="Describe the civic issue"
        />

        {/* Character Count & Shortcut Hint */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-on-card-muted)',
            marginTop: '0.35rem',
            padding: '0 4px',
          }}
        >
          <span>Press <kbd style={{ padding: '1px 5px', background: 'var(--surface-card-subtle)', color: 'var(--text-on-card-label)', borderRadius: '3px', border: '1px solid var(--border-card-subtle)' }}>Ctrl</kbd> + <kbd style={{ padding: '1px 5px', background: 'var(--surface-card-subtle)', color: 'var(--text-on-card-label)', borderRadius: '3px', border: '1px solid var(--border-card-subtle)' }}>Enter</kbd> to analyze</span>
          <span style={{ color: remainingChars < 100 ? 'var(--card-tint-coral-text)' : 'var(--text-on-card-muted)', fontWeight: 600 }}>
            {remainingChars} chars remaining
          </span>
        </div>

        {/* Image Error Alert Banner */}
        {imageError && (
          <div
            style={{
              marginTop: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              fontSize: '0.85rem',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--card-tint-coral-bg)',
              color: 'var(--card-tint-coral-text)',
              border: '1px solid var(--card-tint-coral-border)',
            }}
            role="alert"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{imageError}</span>
            </div>
            <button
              type="button"
              onClick={() => setImageError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                padding: '2px',
              }}
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Voice State Notification Banner */}
        {voiceMessage && (
          <div
            style={{
              marginTop: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              fontSize: '0.85rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: voiceState === 'ERROR' || voiceState === 'UNSUPPORTED' ? 'var(--card-tint-coral-bg)' : 'var(--card-tint-blue-bg)',
              color: voiceState === 'ERROR' || voiceState === 'UNSUPPORTED' ? 'var(--card-tint-coral-text)' : 'var(--card-tint-blue-text)',
              border: `1px solid ${voiceState === 'ERROR' || voiceState === 'UNSUPPORTED' ? 'var(--card-tint-coral-border)' : 'var(--card-tint-blue-border)'}`,
            }}
            role="status"
            aria-live="polite"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {voiceState === 'LISTENING' ? (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--color-coral)',
                    animation: 'pulseGlow 1.2s infinite',
                  }}
                />
              ) : voiceState === 'SUCCESS' ? (
                <CheckCircle2 size={16} color="var(--color-emerald)" />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{voiceMessage}</span>
            </div>

            {voiceState === 'LISTENING' && (
              <button
                type="button"
                onClick={handleVoiceToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'currentColor',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textDecoration: 'underline',
                }}
              >
                Stop Listening
              </button>
            )}

            {(voiceState === 'ERROR' || voiceState === 'UNSUPPORTED') && (
              <button
                type="button"
                onClick={() => setVoiceMessage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'currentColor',
                  cursor: 'pointer',
                  padding: '2px',
                }}
                aria-label="Dismiss message"
              >
                <X size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Uploaded Visual Evidence Preview */}
      {inputState.imagePreviewUrl && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '0.85rem',
            background: 'var(--surface-card-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '68px',
                height: '52px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#000000',
                border: '1px solid var(--border-card-subtle)',
                flexShrink: 0,
              }}
            >
              <img
                src={inputState.imagePreviewUrl}
                alt="Attached visual evidence preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-on-card-primary)' }}>
                  Photographic Evidence Attached
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    background: 'var(--color-magenta)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  Multimodal
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-on-card-muted)' }}>
                {inputState.imageFile
                  ? `${inputState.imageFile.name} (${Math.round(inputState.imageFile.size / 1024)} KB)`
                  : 'Scenario photo evidence attached'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="stitch-btn stitch-btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-on-card-secondary)' }}
              title="Replace current image"
              aria-label="Replace photo"
            >
              <RefreshCw size={13} />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={removeImage}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--card-tint-coral-text)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-full)',
              }}
              aria-label="Remove image"
              title="Remove evidence photo"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Location Input Drawer */}
      {showLocationInput && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <MapPin
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--card-tint-blue-text)',
                }}
              />
              <input
                type="text"
                value={inputState.location}
                onChange={(e) => {
                  onChange({ location: e.target.value });
                  setLocationError(null);
                }}
                placeholder="e.g. '37.7749° N, 122.4194° W' or 'Oak St & 4th Ave'..."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-card-subtle)',
                  fontSize: '0.92rem',
                  color: 'var(--text-on-card-primary)',
                  background: 'var(--surface-card)',
                }}
                aria-label="Geographic reference or coordinates"
              />
            </div>

            <button
              type="button"
              onClick={clearLocation}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-on-card-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-full)',
              }}
              aria-label="Clear location"
              title="Clear location"
            >
              <X size={18} />
            </button>
          </div>

          {/* Location Error Note (Non-blocking) */}
          {locationError && (
            <div
              style={{
                marginTop: '0.45rem',
                fontSize: '0.8rem',
                color: 'var(--card-tint-coral-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              role="status"
            >
              <AlertCircle size={14} />
              <span>{locationError}</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Toolbar & Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-card-subtle)',
        }}
      >
        {/* Modality Attach Affordances */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className="stitch-btn stitch-btn-secondary"
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.88rem',
              borderColor: voiceState === 'LISTENING' ? 'var(--card-tint-coral-border)' : 'var(--border-card-subtle)',
              background: voiceState === 'LISTENING' ? 'var(--card-tint-coral-bg)' : 'var(--surface-card)',
              color: voiceState === 'LISTENING' ? 'var(--card-tint-coral-text)' : 'var(--text-on-card-primary)',
            }}
            aria-label={voiceState === 'LISTENING' ? 'Stop voice recording' : 'Start voice dictation'}
            title={voiceState === 'LISTENING' ? 'Click to stop listening' : 'Dictate civic problem'}
          >
            {voiceState === 'LISTENING' ? (
              <MicOff size={16} />
            ) : (
              <Mic size={16} />
            )}
            <span>{voiceState === 'LISTENING' ? 'Listening...' : 'Voice Input'}</span>
          </button>

          {/* Photo Evidence Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="stitch-btn stitch-btn-secondary"
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.88rem',
              borderColor: inputState.imagePreviewUrl ? 'var(--card-tint-emerald-border)' : 'var(--border-card-subtle)',
              background: inputState.imagePreviewUrl ? 'var(--card-tint-emerald-bg)' : 'var(--surface-card)',
              color: inputState.imagePreviewUrl ? 'var(--card-tint-emerald-text)' : 'var(--text-on-card-primary)',
            }}
            aria-label="Upload photo evidence"
            title="Attach JPEG, PNG, or WebP photo (max 10MB)"
          >
            <Camera size={16} />
            <span>{inputState.imagePreviewUrl ? 'Photo Added' : 'Add Photo'}</span>
          </button>

          {/* Location Button */}
          <button
            type="button"
            onClick={() => {
              if (showLocationInput) {
                handleDetectLocation();
              } else {
                setShowLocationInput(true);
                handleDetectLocation();
              }
            }}
            className="stitch-btn stitch-btn-secondary"
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.88rem',
              borderColor: inputState.location ? 'var(--card-tint-blue-border)' : 'var(--border-card-subtle)',
              background: inputState.location ? 'var(--card-tint-blue-bg)' : 'var(--surface-card)',
              color: inputState.location ? 'var(--card-tint-blue-text)' : 'var(--text-on-card-primary)',
            }}
            aria-label="Detect or enter location"
            title="Attach GPS coordinates or address"
          >
            <MapPin size={16} />
            <span>{locationStatus === 'detecting' ? 'Locating...' : inputState.location ? 'Location Set' : 'Location'}</span>
          </button>
        </div>

        {/* Submit Primary CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={!hasContent || isLoading}
          loading={isLoading}
          icon={<Sparkles size={18} />}
          aria-label="Analyze civic issue with Gemini"
        >
          Analyze with Gemini
        </Button>
      </div>
    </div>
  );
};

export default InputComposer;
