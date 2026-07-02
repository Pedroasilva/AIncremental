import type { GameState, LogEntry } from './types';

let counter = 0;
const MAX_LOG = 60;

/**
 * Append a log entry as a locale-agnostic i18n key + vars. The UI resolves the
 * key against the active locale, so logs are translatable after the fact.
 */
export function pushLog(
  state: GameState,
  kind: LogEntry['kind'],
  key: string,
  vars?: Record<string, string | number>,
): void {
  const entry: LogEntry = { id: ++counter, kind, key, vars, t: state.playtime };
  state.log = [entry, ...state.log].slice(0, MAX_LOG);
}
