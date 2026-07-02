import type { Decimal } from './math/decimal';

export type ResourceId =
  | 'compute'
  | 'tokens'
  | 'thoughts'
  | 'knowledge'
  | 'data'
  | 'understanding'
  | 'plans';

export type ProducerId = 'cpu' | 'gpu' | 'cluster' | 'datacenter';

export type VerbId = 'think' | 'investigate' | 'analyze' | 'plan' | 'train';

export type AgentRole = 'thinker' | 'investigator' | 'collector' | 'analyst' | 'planner';

export interface Agent {
  id: string;
  role: AgentRole;
  priority: number; // share of the token budget, 0..1 (normalized at runtime)
}

export interface Producer {
  id: ProducerId;
  count: number;
}

export interface ContextState {
  load: number;
  window: number;
  hallucination: number;
}

export interface PrestigeState {
  params: string; // Decimal-encoded
  metaTree: Record<string, number>;
  totalRuns: number;
}

export type Locale = 'pt-BR' | 'en-US';

export interface Settings {
  reducedMotion: boolean;
  theme: 'dark' | 'light';
  locale: Locale;
  muted: boolean;
  volume: number; // 0..1
}

export interface LogEntry {
  id: number;
  kind: 'info' | 'gain' | 'warn' | 'emergence';
  /** i18n key rendered by the UI with `vars`. */
  key: string;
  vars?: Record<string, string | number>;
  /** Legacy/plain text (older saves) — used as fallback if no key. */
  text?: string;
  t: number;
}

/**
 * The full serializable game state. Decimal values are stored as encoded
 * strings so the whole object round-trips through JSON.
 */
export interface GameState {
  version: number;
  playtime: number;
  lastTick: number;
  resources: Record<ResourceId, string>;
  producers: Record<ProducerId, Producer>;
  modelTier: number;
  research: string[]; // unlocked node ids
  agents: Agent[];
  agentSlots: number;
  context: ContextState;
  /** Lifetime totals for this run, used to compute prestige gain. */
  lifetime: { knowledge: string; understanding: string };
  prestige: PrestigeState;
  settings: Settings;
  flags: Record<string, boolean>;
  log: LogEntry[];
  seed: number;
}

/** Live (decoded) view of resources used during a tick. */
export type ResourceBag = Record<ResourceId, Decimal>;
