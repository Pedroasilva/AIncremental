import { Decimal, D, ZERO, encode, decode } from './math/decimal';
import type { GameState, ResourceId, ResourceBag, ProducerId } from './types';
import { PRODUCERS } from '@content/producers';
import { getModel } from '@content/models';

export const RESOURCE_IDS: ResourceId[] = [
  'compute',
  'tokens',
  'thoughts',
  'knowledge',
  'data',
  'understanding',
  'plans',
];

export const SAVE_VERSION = 1;

export function initialState(): GameState {
  const resources = {} as Record<ResourceId, string>;
  for (const id of RESOURCE_IDS) resources[id] = encode(ZERO);
  resources.tokens = encode(D(25)); // small starting stipend

  const producers = {} as GameState['producers'];
  for (const p of PRODUCERS) producers[p.id] = { id: p.id, count: 0 };

  return {
    version: SAVE_VERSION,
    playtime: 0,
    lastTick: Date.now(),
    resources,
    producers,
    modelTier: 0,
    research: [],
    agents: [],
    agentSlots: 0,
    context: { load: 0, window: getModel(0).window, hallucination: 0 },
    lifetime: { knowledge: encode(ZERO), understanding: encode(ZERO) },
    prestige: { params: encode(ZERO), metaTree: {}, totalRuns: 0 },
    settings: { reducedMotion: false, theme: 'dark', locale: 'pt-BR', muted: false, volume: 0.6 },
    flags: { 'verb:think': true },
    log: [],
    seed: (Math.random() * 2 ** 31) | 0,
  };
}

// ---- Resource bag helpers (decoded working copy) ----

export function readBag(state: GameState): ResourceBag {
  const bag = {} as ResourceBag;
  for (const id of RESOURCE_IDS) bag[id] = decode(state.resources[id]);
  return bag;
}

export function writeBag(state: GameState, bag: ResourceBag): void {
  for (const id of RESOURCE_IDS) state.resources[id] = encode(bag[id]);
}

export function res(state: GameState, id: ResourceId): Decimal {
  return decode(state.resources[id]);
}

export function setRes(state: GameState, id: ResourceId, value: Decimal): void {
  state.resources[id] = encode(value);
}

export function addRes(state: GameState, id: ResourceId, delta: Decimal): void {
  setRes(state, id, res(state, id).add(delta));
}

export function producerCount(state: GameState, id: ProducerId): number {
  return state.producers[id].count;
}
