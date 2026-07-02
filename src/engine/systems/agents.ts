import { D } from '../math/decimal';
import { addRes } from '../state';
import type { GameState } from '../types';
import { applyVerb } from './verbs';
import type { Modifiers } from '../modifiers';
import { getRole } from '@content/agents';

/**
 * Agents automate verbs. Each agent gets a slice of throughput proportional to
 * its priority. Throughput scales with model quality; the token budget acts as a
 * shared cap (agents simply stop when a verb is unaffordable).
 */
export function runAgents(state: GameState, dt: number, mods: Modifiers): void {
  if (state.agents.length === 0) return;

  const totalPriority = state.agents.reduce((s, a) => s + Math.max(a.priority, 0.01), 0);

  for (const agent of state.agents) {
    const share = Math.max(agent.priority, 0.01) / totalPriority;
    const speed = mods.quality * 0.5 * share; // actions per second contribution
    const power = speed * dt;
    if (power <= 0) continue;

    const def = getRole(agent.role);
    if (def.verb === 'collect') {
      addRes(state, 'data', D(power * mods.verbMult));
      continue;
    }
    applyVerb(state, def.verb, mods, power);
  }
}
