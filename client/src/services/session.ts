const SESSION_KEY = 'civicbridge_session_id';

/**
 * Retrieve or generate an anonymous, privacy-preserving client session identifier.
 * No personally identifiable information (PII) is ever collected or required.
 */
export function getSessionId(): string {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId || !sessionId.trim()) {
      sessionId = `session_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return 'fallback_ephemeral_session';
  }
}

/**
 * Common headers for backend API requests to maintain session isolation.
 */
export function getSessionHeaders(): Record<string, string> {
  return {
    'x-session-id': getSessionId(),
    'Content-Type': 'application/json',
  };
}
