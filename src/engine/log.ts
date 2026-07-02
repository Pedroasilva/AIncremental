import type { GameState, LogEntry } from './types';

let counter = 0;
const MAX_LOG = 60;

export function pushLog(state: GameState, kind: LogEntry['kind'], text: string): void {
  const entry: LogEntry = { id: ++counter, kind, text, t: state.playtime };
  state.log = [entry, ...state.log].slice(0, MAX_LOG);
}
