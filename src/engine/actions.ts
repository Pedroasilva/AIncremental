import { Decimal, D, encode } from './math/decimal';
import type { GameState, ProducerId, AgentRole } from './types';
import { res, addRes, setRes, initialState } from './state';
import { producerCost, trainCost, prestigeGain } from './formulas/cost';
import { computeModifiers } from './modifiers';
import { applyVerb } from './systems/verbs';
import { checkUnlocks } from './systems/unlocks';
import { pushLog } from './log';
import { getProducer } from '@content/producers';
import { getModel, maxTier } from '@content/models';
import { getNode } from '@content/research';
import { getRole } from '@content/agents';

/** Perform one manual verb click. Returns whether it succeeded. */
export function doVerb(state: GameState, verb: 'think' | 'investigate' | 'analyze' | 'plan'): boolean {
  const mods = computeModifiers(state);
  const ok = applyVerb(state, verb, mods, 1);
  return ok;
}

// ---- Producers ----

export function producerPrice(state: GameState, id: ProducerId): Decimal {
  const def = getProducer(id);
  return producerCost(def.baseCost, def.growth, state.producers[id].count);
}

export function buyProducer(state: GameState, id: ProducerId): boolean {
  const price = producerPrice(state, id);
  if (res(state, 'tokens').lt(price)) return false;
  addRes(state, 'tokens', price.neg());
  state.producers[id].count += 1;
  return true;
}

// ---- Model training ----

export function trainPrice(state: GameState): { tokens: Decimal; thoughts: Decimal; knowledge: Decimal } {
  const next = state.modelTier + 1;
  const base = trainCost(15, next);
  return {
    tokens: base,
    thoughts: base.mul(0.5),
    // Knowledge only required once Investigate exists (tier 1+), avoiding a
    // progression deadlock on the very first training.
    knowledge: next >= 2 ? base.mul(0.1) : D(0),
  };
}

export function canTrain(state: GameState): boolean {
  if (state.modelTier >= maxTier) return false;
  const p = trainPrice(state);
  return (
    res(state, 'tokens').gte(p.tokens) &&
    res(state, 'thoughts').gte(p.thoughts) &&
    res(state, 'knowledge').gte(p.knowledge)
  );
}

export function trainModel(state: GameState): boolean {
  if (!canTrain(state)) return false;
  const p = trainPrice(state);
  addRes(state, 'tokens', p.tokens.neg());
  addRes(state, 'thoughts', p.thoughts.neg());
  addRes(state, 'knowledge', p.knowledge.neg());
  state.modelTier += 1;
  checkUnlocks(state);
  pushLog(state, 'emergence', 'log.trained', { name: getModel(state.modelTier).name, tier: state.modelTier });
  return true;
}

// ---- Research ----

export function canOpenNode(state: GameState, id: string): boolean {
  const node = getNode(id);
  if (!node || state.research.includes(id)) return false;
  if (!node.requires.every((r) => state.research.includes(r))) return false;
  return res(state, 'knowledge').gte(node.cost);
}

export function openNode(state: GameState, id: string): boolean {
  const node = getNode(id);
  if (!node || !canOpenNode(state, id)) return false;
  addRes(state, 'knowledge', D(node.cost).neg());
  state.research = [...state.research, id];
  pushLog(state, 'gain', 'log.investigated', { id });
  return true;
}

// ---- Agents ----

export function maxSlots(state: GameState): number {
  const mods = computeModifiers(state);
  const base = state.flags['agents'] ? 1 : 0;
  const fromParams = Math.floor(new Decimal(state.prestige.params).toNumber() / 25);
  return base + state.agentSlots + mods.extraSlots + fromParams;
}

export function hireAgent(state: GameState, role: AgentRole): boolean {
  if (!state.flags['agents']) return false;
  if (state.agents.length >= maxSlots(state)) return false;
  const def = getRole(role);
  const agent = { id: `${role}-${Date.now()}-${state.agents.length}`, role, priority: 0.5 };
  state.agents = [...state.agents, agent];
  pushLog(state, 'info', 'log.hired', { role, icon: def.icon });
  return true;
}

export function fireAgent(state: GameState, id: string): void {
  state.agents = state.agents.filter((a) => a.id !== id);
}

export function setAgentPriority(state: GameState, id: string, priority: number): void {
  const agent = state.agents.find((a) => a.id === id);
  if (agent) agent.priority = Math.max(0, Math.min(priority, 1));
}

// ---- Prestige ----

export function pendingParams(state: GameState): Decimal {
  return prestigeGain(new Decimal(state.lifetime.understanding), new Decimal(state.lifetime.knowledge));
}

export function canPrestige(state: GameState): boolean {
  return !!state.flags['prestige'] && pendingParams(state).gt(0);
}

/** Retrain: reset the run, keep prestige params + meta progress. */
export function prestige(state: GameState): GameState {
  if (!canPrestige(state)) return state;
  const gain = pendingParams(state);
  const keptParams = new Decimal(state.prestige.params).add(gain);
  const fresh = initialState();
  fresh.prestige = {
    params: encode(keptParams),
    metaTree: state.prestige.metaTree,
    totalRuns: state.prestige.totalRuns + 1,
  };
  fresh.settings = state.settings;
  // Keep the game feeling faster: prestige flag stays available after first unlock.
  fresh.flags['prestige'] = true;
  pushLog(fresh, 'emergence', 'log.prestiged', { gain: gain.toString(), run: fresh.prestige.totalRuns });
  setRes(fresh, 'tokens', D(15).add(keptParams.mul(5)));
  return fresh;
}
