import { openDB, type IDBPDatabase } from 'idb';
import { initialState, SAVE_VERSION, type GameState } from '@engine/index';

const DB_NAME = 'aincremental';
const STORE = 'saves';
const KEY = 'main';

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE)) {
          database.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

/** Migrate an older save forward. Add cases as SAVE_VERSION grows. */
function migrate(raw: unknown): GameState {
  if (!raw || typeof raw !== 'object') return initialState();
  const state = raw as GameState;
  if (typeof state.version !== 'number') return initialState();
  // Future migrations: while (state.version < SAVE_VERSION) { ... }
  state.version = SAVE_VERSION;
  const base = initialState();
  // Shallow-merge top level, but deep-merge settings so new fields (locale,
  // muted, volume) survive on saves created before they existed.
  return { ...base, ...state, settings: { ...base.settings, ...state.settings } };
}

export async function loadGame(): Promise<GameState> {
  try {
    const raw = await (await db()).get(STORE, KEY);
    return migrate(raw);
  } catch {
    return initialState();
  }
}

export async function saveGame(state: GameState): Promise<void> {
  try {
    await (await db()).put(STORE, state, KEY);
  } catch {
    // Storage may be unavailable (private mode); fail silently.
  }
}

export function exportSave(state: GameState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

export function importSave(b64: string): GameState {
  const json = decodeURIComponent(escape(atob(b64)));
  return migrate(JSON.parse(json));
}
