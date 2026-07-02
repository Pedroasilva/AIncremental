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

function announce(state: GameState, flag: string): void {
  const messages: Record<string, string> = {
    'verb:investigate': 'Nova capacidade desbloqueada: Investigar 🔍',
    'verb:analyze': 'Nova capacidade desbloqueada: Analisar 📊',
    'verb:plan': 'Nova capacidade desbloqueada: Planejar 🗺️',
    data: 'Coleta de dados iniciada 📦',
    agents: 'Você já pode empregar Agentes 🤖',
    prestige: 'Retreinar (prestígio) está disponível ⚙️',
    singularity: 'A Singularidade se aproxima ✦',
  };
  const msg = messages[flag];
  if (msg) pushLog(state, 'emergence', msg);
}
