// Public API of the pure simulation engine. Nothing here touches React/DOM.
export * from './types';
export { Decimal, D } from './math/decimal';
export { initialState, res, RESOURCE_IDS, SAVE_VERSION } from './state';
export { tick, catchUp, TICK_HZ, STEP } from './tick';
export { computeModifiers } from './modifiers';
export type { Modifiers } from './modifiers';
export { computePerSecond, tokensPerSecond } from './systems/production';
export { VERB_COST } from './systems/verbs';
export { getModel, maxTier } from '@content/models';
export { PRODUCERS, getProducer } from '@content/producers';
export { RESEARCH, getNode } from '@content/research';
export { AGENT_ROLES, getRole } from '@content/agents';
export {
  doVerb,
  buyProducer,
  producerPrice,
  trainModel,
  trainPrice,
  canTrain,
  openNode,
  canOpenNode,
  hireAgent,
  fireAgent,
  setAgentPriority,
  maxSlots,
  prestige,
  canPrestige,
  pendingParams,
} from './actions';
export { canAfford } from './systems/verbs';
export { hallucinationMult } from './systems/context';
