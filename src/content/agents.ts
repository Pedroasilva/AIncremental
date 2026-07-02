import type { AgentRole, VerbId } from '@engine/types';

export interface AgentRoleDef {
  role: AgentRole;
  name: string;
  icon: string;
  /** Verb this agent automates (collector produces data directly). */
  verb: Exclude<VerbId, 'train'> | 'collect';
  desc: string;
}

export const AGENT_ROLES: AgentRoleDef[] = [
  { role: 'thinker', name: 'Pensador', icon: '🧠', verb: 'think', desc: 'Gera Pensamentos automaticamente.' },
  { role: 'investigator', name: 'Investigador', icon: '🔍', verb: 'investigate', desc: 'Acumula Conhecimento.' },
  { role: 'collector', name: 'Coletor', icon: '📦', verb: 'collect', desc: 'Coleta Dados brutos.' },
  { role: 'analyst', name: 'Analista', icon: '📊', verb: 'analyze', desc: 'Destila Dados em Entendimento.' },
  { role: 'planner', name: 'Planejador', icon: '🗺️', verb: 'plan', desc: 'Elabora Planos estratégicos.' },
];

export const getRole = (role: AgentRole): AgentRoleDef =>
  AGENT_ROLES.find((r) => r.role === role)!;
