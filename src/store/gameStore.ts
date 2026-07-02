import { create } from 'zustand';
import {
  initialState,
  tick,
  catchUp,
  doVerb as engineDoVerb,
  buyProducer as engineBuy,
  trainModel as engineTrain,
  openNode as engineOpenNode,
  hireAgent as engineHire,
  fireAgent as engineFire,
  setAgentPriority as engineSetPriority,
  prestige as enginePrestige,
  type GameState,
  type ProducerId,
  type AgentRole,
} from '@engine/index';
import { loadGame, saveGame, exportSave, importSave } from './persistence';
import { pushLog } from '@engine/log';

interface GameStore {
  state: GameState;
  ready: boolean;
  offlineGain: number | null;

  // lifecycle
  init: () => Promise<void>;
  advance: (dt: number) => void;
  save: () => void;
  dismissOffline: () => void;

  // intents
  think: () => void;
  investigate: () => void;
  analyze: () => void;
  plan: () => void;
  buy: (id: ProducerId) => void;
  train: () => void;
  research: (id: string) => void;
  hire: (role: AgentRole) => void;
  fire: (id: string) => void;
  setPriority: (id: string, p: number) => void;
  doPrestige: () => void;
  toggleReducedMotion: () => void;
  exportSave: () => string;
  importSave: (b64: string) => void;
  hardReset: () => void;
}

// Cheap structured clone so each mutation produces a fresh object for React.
const clone = (s: GameState): GameState => structuredClone(s);

// Mutate helper: apply an engine action to a cloned state and commit it.
function mutate(get: () => GameStore, set: (p: Partial<GameStore>) => void, fn: (s: GameState) => void) {
  const next = clone(get().state);
  fn(next);
  set({ state: next });
}

export const useGame = create<GameStore>((set, get) => ({
  state: initialState(),
  ready: false,
  offlineGain: null,

  async init() {
    const loaded = await loadGame();
    const now = Date.now();
    const elapsed = Math.max(0, (now - loaded.lastTick) / 1000);
    let offlineGain: number | null = null;
    if (elapsed > 30) {
      offlineGain = catchUp(loaded, elapsed);
    }
    loaded.lastTick = now;
    set({ state: loaded, ready: true, offlineGain });
  },

  advance(dt) {
    const next = clone(get().state);
    tick(next, dt);
    next.lastTick = Date.now();
    set({ state: next });
  },

  save() {
    void saveGame(get().state);
  },

  dismissOffline() {
    set({ offlineGain: null });
  },

  think() {
    mutate(get, set, (s) => engineDoVerb(s, 'think'));
  },
  investigate() {
    mutate(get, set, (s) => engineDoVerb(s, 'investigate'));
  },
  analyze() {
    mutate(get, set, (s) => engineDoVerb(s, 'analyze'));
  },
  plan() {
    mutate(get, set, (s) => engineDoVerb(s, 'plan'));
  },
  buy(id) {
    mutate(get, set, (s) => engineBuy(s, id));
  },
  train() {
    mutate(get, set, (s) => engineTrain(s));
  },
  research(id) {
    mutate(get, set, (s) => engineOpenNode(s, id));
  },
  hire(role) {
    mutate(get, set, (s) => engineHire(s, role));
  },
  fire(id) {
    mutate(get, set, (s) => engineFire(s, id));
  },
  setPriority(id, p) {
    mutate(get, set, (s) => engineSetPriority(s, id, p));
  },
  doPrestige() {
    set({ state: enginePrestige(clone(get().state)) });
  },
  toggleReducedMotion() {
    mutate(get, set, (s) => {
      s.settings.reducedMotion = !s.settings.reducedMotion;
    });
  },

  exportSave() {
    return exportSave(get().state);
  },
  importSave(b64) {
    try {
      const s = importSave(b64);
      s.lastTick = Date.now();
      set({ state: s });
    } catch {
      const s = clone(get().state);
      pushLog(s, 'warn', 'Falha ao importar save (formato inválido).');
      set({ state: s });
    }
  },
  hardReset() {
    set({ state: initialState(), offlineGain: null });
  },
}));
