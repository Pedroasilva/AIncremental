export type ResearchBranch = 'architecture' | 'optimization' | 'data' | 'alignment' | 'tools' | 'meta';

export interface ResearchNode {
  id: string;
  name: string;
  branch: ResearchBranch;
  cost: number; // in knowledge
  requires: string[]; // prerequisite node ids
  desc: string;
  effect: ResearchEffect;
}

export interface ResearchEffect {
  computeMult?: number;
  tokenMult?: number;
  verbMult?: number;
  windowAdd?: number;
  hallucinationReduce?: number;
  slotsAdd?: number;
}

// A small but branching knowledge graph. Costs in Knowledge.
export const RESEARCH: ResearchNode[] = [
  { id: 'basics', name: 'Fundamentos', branch: 'architecture', cost: 5, requires: [], desc: 'O básico da cognição.', effect: { computeMult: 1.25 } },
  { id: 'attention', name: 'Atenção', branch: 'architecture', cost: 25, requires: ['basics'], desc: 'Foco no que importa.', effect: { windowAdd: 32, verbMult: 1.2 } },
  { id: 'parallel', name: 'Paralelismo', branch: 'architecture', cost: 90, requires: ['attention'], desc: 'Pensar em paralelo.', effect: { computeMult: 1.6 } },

  { id: 'pruning', name: 'Poda', branch: 'optimization', cost: 20, requires: ['basics'], desc: 'Cortar o supérfluo.', effect: { verbMult: 1.3 } },
  { id: 'quantize', name: 'Quantização', branch: 'optimization', cost: 80, requires: ['pruning'], desc: 'Mais barato por token.', effect: { tokenMult: 1.5 } },

  { id: 'crawling', name: 'Coleta Web', branch: 'data', cost: 40, requires: ['basics'], desc: 'Coletar dados passivamente.', effect: { tokenMult: 1.2 } },
  { id: 'cleaning', name: 'Limpeza', branch: 'data', cost: 120, requires: ['crawling'], desc: 'Dados melhores, análise melhor.', effect: { verbMult: 1.4 } },

  { id: 'rlhf', name: 'Alinhamento', branch: 'alignment', cost: 60, requires: ['attention'], desc: 'Reduz alucinação.', effect: { hallucinationReduce: 0.4 } },
  { id: 'oversight', name: 'Supervisão', branch: 'alignment', cost: 200, requires: ['rlhf'], desc: 'Agentes mais seguros.', effect: { slotsAdd: 1 } },

  { id: 'search_tool', name: 'Ferramenta: Busca', branch: 'tools', cost: 150, requires: ['parallel'], desc: 'Uso de ferramentas externas.', effect: { verbMult: 1.5 } },
  { id: 'rag', name: 'Memória (RAG)', branch: 'tools', cost: 350, requires: ['search_tool', 'cleaning'], desc: 'Memória além da janela de contexto.', effect: { windowAdd: 256, hallucinationReduce: 0.5 } },

  { id: 'self_train', name: 'Auto-treino', branch: 'meta', cost: 500, requires: ['rag', 'oversight'], desc: 'A IA melhora a si mesma.', effect: { computeMult: 2, slotsAdd: 2 } },
];

export const getNode = (id: string): ResearchNode | undefined =>
  RESEARCH.find((n) => n.id === id);
