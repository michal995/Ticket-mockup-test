/* Placeholder API layer that will be replaced with Google Apps Script endpoints. */

type SessionPayload = Record<string, unknown>;

type HighScoreResponse = Promise<{ ok: true }>;

type DefaultResponse = Promise<{ ok: true }>;

export function upsertUser(name: string): DefaultResponse {
  console.info('[api] upsertUser', { name });
  return Promise.resolve({ ok: true });
}

export function startSession(payload: SessionPayload): DefaultResponse {
  console.info('[api] startSession', payload);
  return Promise.resolve({ ok: true });
}

export function finishRound(payload: SessionPayload): DefaultResponse {
  console.info('[api] finishRound', payload);
  return Promise.resolve({ ok: true });
}

export function finishSession(payload: SessionPayload): DefaultResponse {
  console.info('[api] finishSession', payload);
  return Promise.resolve({ ok: true });
}

export function getHighScores(mode: string): HighScoreResponse {
  console.info('[api] getHighScores', { mode });
  return Promise.resolve({ ok: true });
}
