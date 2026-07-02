import type { GameState } from './types';
import { computeModifiers } from './modifiers';
import { produce } from './systems/production';
import { runAgents } from './systems/agents';
import { applyContext } from './systems/context';
import { checkUnlocks } from './systems/unlocks';

export const TICK_HZ = 20;
export const STEP = 1 / TICK_HZ; // seconds per fixed step
const MAX_OFFLINE = 12 * 3600; // cap idle catch-up at 12h

/**
 * Pure, deterministic simulation step. Mutates a working copy; callers pass a
 * clone (the store does). Same inputs -> same outputs.
 */
export function tick(state: GameState, dt: number): GameState {
  const mods = computeModifiers(state);
  produce(state, dt, mods);
  runAgents(state, dt, mods);
  applyContext(state, dt, mods);
  checkUnlocks(state);
  state.playtime += dt;
  return state;
}

/** Simulate elapsed offline time in coarse steps, returns tokens gained. */
export function catchUp(state: GameState, elapsedSeconds: number): number {
  const capped = Math.min(elapsedSeconds, MAX_OFFLINE);
  const before = Number(state.resources.tokens);
  let remaining = capped;
  const bigStep = 5; // 5s steps offline
  while (remaining > 0) {
    const step = Math.min(bigStep, remaining);
    tick(state, step);
    remaining -= step;
  }
  return Number(state.resources.tokens) - before;
}
