import type { GameState } from '../types';
import { getModel } from '@content/models';
import { pushLog } from '../log';

/** Apply the unlock flags for every model tier up to the current one. */
export function checkUnlocks(state: GameState): void {
  for (let t = 0; t <= state.modelTier; t++) {
    for (const flag of getModel(t).unlocks) {
      if (!state.flags[flag]) {
        state.flags[flag] = true;
        announce(state, flag);
      }
    }
  }
}

const ANNOUNCED_FLAGS = new Set([
  'verb:investigate',
  'verb:analyze',
  'verb:plan',
  'data',
  'agents',
  'prestige',
  'singularity',
]);

function announce(state: GameState, flag: string): void {
  if (ANNOUNCED_FLAGS.has(flag)) {
    pushLog(state, 'emergence', `log.unlock.${flag}`);
  }
}
