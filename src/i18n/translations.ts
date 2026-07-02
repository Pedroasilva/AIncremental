import type { Locale } from '@engine/types';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
];

type Dict = Record<string, string>;

const ptBR: Dict = {
  // chrome
  'app.loading': 'Inicializando a IA…',
  'tab.palco': 'palco',
  'tab.pesquisa': 'pesquisa',
  'tab.agentes': 'agentes',

  // resources
  'resource.compute': 'Compute',
  'resource.tokens': 'Tokens',
  'resource.thoughts': 'Pensamentos',
  'resource.knowledge': 'Conhecimento',
  'resource.data': 'Dados',
  'resource.understanding': 'Entendimento',
  'resource.plans': 'Planos',

  // verbs
  'verbs.title': 'Ações',
  'verb.think': 'Pensar',
  'verb.investigate': 'Investigar',
  'verb.analyze': 'Analisar',
  'verb.plan': 'Planejar',
  'verb.think.sub': 'custo ◈1 · +1 pensamento',
  'verb.investigate.sub': 'custo ◈10 + 🧠5 · +conhecimento',
  'verb.analyze.sub': 'custo ◈8 + 📦2 · +entendimento',
  'verb.plan.sub': 'custo 📊20 · +1% por plano',
  'verb.train': 'Treinar Modelo',
  'verb.train.hint': 'Tokens: {tokens} — o gargalo de tudo.',

  // producers
  'producers.title': 'Hardware (Compute)',
  'producer.sub': '◈{price} · +{output}/s compute',
  'producer.cpu.name': 'Núcleo CPU',
  'producer.cpu.desc': 'Um humilde núcleo fazendo contas.',
  'producer.gpu.name': 'GPU',
  'producer.gpu.desc': 'Paralelismo massivo para inferência.',
  'producer.cluster.name': 'Cluster',
  'producer.cluster.desc': 'Muitas GPUs conversando.',
  'producer.datacenter.name': 'Data Center',
  'producer.datacenter.desc': 'Um prédio inteiro pensando.',

  // research
  'research.title': 'Pesquisa',
  'research.locked': 'Desbloqueie Investigar (Modelo N-Gram) para abrir a árvore de pesquisa.',
  'research.requires': 'requer: {reqs}',
  'research.done': '✓ investigado',
  'branch.architecture': 'Arquitetura',
  'branch.optimization': 'Otimização',
  'branch.data': 'Dados',
  'branch.alignment': 'Alinhamento',
  'branch.tools': 'Ferramentas',
  'branch.meta': 'Meta',
  'research.basics.name': 'Fundamentos',
  'research.basics.desc': 'O básico da cognição.',
  'research.attention.name': 'Atenção',
  'research.attention.desc': 'Foco no que importa.',
  'research.parallel.name': 'Paralelismo',
  'research.parallel.desc': 'Pensar em paralelo.',
  'research.pruning.name': 'Poda',
  'research.pruning.desc': 'Cortar o supérfluo.',
  'research.quantize.name': 'Quantização',
  'research.quantize.desc': 'Mais barato por token.',
  'research.crawling.name': 'Coleta Web',
  'research.crawling.desc': 'Coletar dados passivamente.',
  'research.cleaning.name': 'Limpeza',
  'research.cleaning.desc': 'Dados melhores, análise melhor.',
  'research.rlhf.name': 'Alinhamento',
  'research.rlhf.desc': 'Reduz alucinação.',
  'research.oversight.name': 'Supervisão',
  'research.oversight.desc': 'Agentes mais seguros.',
  'research.search_tool.name': 'Ferramenta: Busca',
  'research.search_tool.desc': 'Uso de ferramentas externas.',
  'research.rag.name': 'Memória (RAG)',
  'research.rag.desc': 'Memória além da janela de contexto.',
  'research.self_train.name': 'Auto-treino',
  'research.self_train.desc': 'A IA melhora a si mesma.',

  // agents
  'agents.title': 'Agentes',
  'agents.locked': 'Treine o modelo Foundation (tier 4) para empregar Agentes que automatizam os verbos.',
  'agents.slots': '{used}/{slots} slots',
  'agents.hire': '+ {name}',
  'agents.fire': 'demitir',
  'agents.priority': 'prioridade',
  'agents.none': 'Nenhum agente empregado.',
  'agent.thinker.name': 'Pensador',
  'agent.thinker.desc': 'Gera Pensamentos automaticamente.',
  'agent.investigator.name': 'Investigador',
  'agent.investigator.desc': 'Acumula Conhecimento.',
  'agent.collector.name': 'Coletor',
  'agent.collector.desc': 'Coleta Dados brutos.',
  'agent.analyst.name': 'Analista',
  'agent.analyst.desc': 'Destila Dados em Entendimento.',
  'agent.planner.name': 'Planejador',
  'agent.planner.desc': 'Elabora Planos estratégicos.',

  // prestige
  'prestige.title': 'Retreinar (Prestígio)',
  'prestige.desc':
    'Destila esta run num checkpoint melhor. Reseta o progresso atual, mas concede Parâmetros (Θ) permanentes (+2% produção cada) e mais slots.',
  'prestige.button': 'Retreinar → +Θ {gain}',
  'prestige.footer': 'Run atual · Entendimento total {understanding} · {runs} retreinos',

  // log panel
  'log.title': 'Log de Raciocínio',
  'log.contextWindow': 'Janela de contexto',
  'log.hallucination': 'Alucinação {pct}% — produção reduzida',
  'log.empty': 'A IA aguarda o primeiro pensamento…',

  // log messages
  'log.unlock.verb:investigate': 'Nova capacidade desbloqueada: Investigar 🔍',
  'log.unlock.verb:analyze': 'Nova capacidade desbloqueada: Analisar 📊',
  'log.unlock.verb:plan': 'Nova capacidade desbloqueada: Planejar 🗺️',
  'log.unlock.data': 'Coleta de dados iniciada 📦',
  'log.unlock.agents': 'Você já pode empregar Agentes 🤖',
  'log.unlock.prestige': 'Retreinar (prestígio) está disponível ⚙️',
  'log.unlock.singularity': 'A Singularidade se aproxima ✦',
  'log.trained': 'Modelo treinado: {name} (tier {tier})',
  'log.investigated': 'Investigado: "{name}"',
  'log.hired': 'Agente empregado: {name} {icon}',
  'log.prestiged': 'Retreinado! +{gain} Parâmetros (Θ). Run #{run}',
  'log.importFailed': 'Falha ao importar save (formato inválido).',

  // offline
  'offline.title': 'Enquanto você esteve fora…',
  'offline.body': 'Sua IA continuou processando e acumulou',
  'offline.continue': 'Continuar',

  // settings
  'settings.saveNow': '💾 Salvar agora',
  'settings.export': '📤 Exportar save',
  'settings.import': '📥 Importar save',
  'settings.reducedMotion': '🎬 Reduzir animações: {state}',
  'settings.sound': '🔊 Som: {state}',
  'settings.reset': '🗑 Resetar tudo',
  'settings.language': 'Idioma',
  'state.on': 'ON',
  'state.off': 'OFF',
  'settings.exported': 'Save copiado para a área de transferência.',
  'settings.exportPrompt': 'Copie seu save:',
  'settings.importPrompt': 'Cole o código do save:',
  'settings.resetConfirm': 'Apagar TODO o progresso? Isto não pode ser desfeito.',
};

const enUS: Dict = {
  // chrome
  'app.loading': 'Booting the AI…',
  'tab.palco': 'stage',
  'tab.pesquisa': 'research',
  'tab.agentes': 'agents',

  // resources
  'resource.compute': 'Compute',
  'resource.tokens': 'Tokens',
  'resource.thoughts': 'Thoughts',
  'resource.knowledge': 'Knowledge',
  'resource.data': 'Data',
  'resource.understanding': 'Understanding',
  'resource.plans': 'Plans',

  // verbs
  'verbs.title': 'Actions',
  'verb.think': 'Think',
  'verb.investigate': 'Investigate',
  'verb.analyze': 'Analyze',
  'verb.plan': 'Plan',
  'verb.think.sub': 'cost ◈1 · +1 thought',
  'verb.investigate.sub': 'cost ◈10 + 🧠5 · +knowledge',
  'verb.analyze.sub': 'cost ◈8 + 📦2 · +understanding',
  'verb.plan.sub': 'cost 📊20 · +1% per plan',
  'verb.train': 'Train Model',
  'verb.train.hint': 'Tokens: {tokens} — the bottleneck for everything.',

  // producers
  'producers.title': 'Hardware (Compute)',
  'producer.sub': '◈{price} · +{output}/s compute',
  'producer.cpu.name': 'CPU Core',
  'producer.cpu.desc': 'A humble core crunching numbers.',
  'producer.gpu.name': 'GPU',
  'producer.gpu.desc': 'Massive parallelism for inference.',
  'producer.cluster.name': 'Cluster',
  'producer.cluster.desc': 'Many GPUs talking to each other.',
  'producer.datacenter.name': 'Data Center',
  'producer.datacenter.desc': 'A whole building thinking.',

  // research
  'research.title': 'Research',
  'research.locked': 'Unlock Investigate (N-Gram model) to open the research tree.',
  'research.requires': 'requires: {reqs}',
  'research.done': '✓ researched',
  'branch.architecture': 'Architecture',
  'branch.optimization': 'Optimization',
  'branch.data': 'Data',
  'branch.alignment': 'Alignment',
  'branch.tools': 'Tools',
  'branch.meta': 'Meta',
  'research.basics.name': 'Fundamentals',
  'research.basics.desc': 'The basics of cognition.',
  'research.attention.name': 'Attention',
  'research.attention.desc': 'Focus on what matters.',
  'research.parallel.name': 'Parallelism',
  'research.parallel.desc': 'Think in parallel.',
  'research.pruning.name': 'Pruning',
  'research.pruning.desc': 'Cut the superfluous.',
  'research.quantize.name': 'Quantization',
  'research.quantize.desc': 'Cheaper per token.',
  'research.crawling.name': 'Web Crawling',
  'research.crawling.desc': 'Collect data passively.',
  'research.cleaning.name': 'Cleaning',
  'research.cleaning.desc': 'Better data, better analysis.',
  'research.rlhf.name': 'Alignment',
  'research.rlhf.desc': 'Reduces hallucination.',
  'research.oversight.name': 'Oversight',
  'research.oversight.desc': 'Safer agents.',
  'research.search_tool.name': 'Tool: Search',
  'research.search_tool.desc': 'Use of external tools.',
  'research.rag.name': 'Memory (RAG)',
  'research.rag.desc': 'Memory beyond the context window.',
  'research.self_train.name': 'Self-Training',
  'research.self_train.desc': 'The AI improves itself.',

  // agents
  'agents.title': 'Agents',
  'agents.locked': 'Train the Foundation model (tier 4) to employ Agents that automate the verbs.',
  'agents.slots': '{used}/{slots} slots',
  'agents.hire': '+ {name}',
  'agents.fire': 'dismiss',
  'agents.priority': 'priority',
  'agents.none': 'No agents employed.',
  'agent.thinker.name': 'Thinker',
  'agent.thinker.desc': 'Generates Thoughts automatically.',
  'agent.investigator.name': 'Investigator',
  'agent.investigator.desc': 'Accumulates Knowledge.',
  'agent.collector.name': 'Collector',
  'agent.collector.desc': 'Collects raw Data.',
  'agent.analyst.name': 'Analyst',
  'agent.analyst.desc': 'Distills Data into Understanding.',
  'agent.planner.name': 'Planner',
  'agent.planner.desc': 'Devises strategic Plans.',

  // prestige
  'prestige.title': 'Retrain (Prestige)',
  'prestige.desc':
    'Distill this run into a better checkpoint. Resets current progress but grants permanent Parameters (Θ) (+2% production each) and more slots.',
  'prestige.button': 'Retrain → +Θ {gain}',
  'prestige.footer': 'Current run · Total understanding {understanding} · {runs} retrains',

  // log panel
  'log.title': 'Reasoning Log',
  'log.contextWindow': 'Context window',
  'log.hallucination': 'Hallucination {pct}% — reduced output',
  'log.empty': 'The AI awaits its first thought…',

  // log messages
  'log.unlock.verb:investigate': 'New capability unlocked: Investigate 🔍',
  'log.unlock.verb:analyze': 'New capability unlocked: Analyze 📊',
  'log.unlock.verb:plan': 'New capability unlocked: Plan 🗺️',
  'log.unlock.data': 'Data collection started 📦',
  'log.unlock.agents': 'You can now employ Agents 🤖',
  'log.unlock.prestige': 'Retraining (prestige) is available ⚙️',
  'log.unlock.singularity': 'The Singularity approaches ✦',
  'log.trained': 'Model trained: {name} (tier {tier})',
  'log.investigated': 'Researched: "{name}"',
  'log.hired': 'Agent employed: {name} {icon}',
  'log.prestiged': 'Retrained! +{gain} Parameters (Θ). Run #{run}',
  'log.importFailed': 'Failed to import save (invalid format).',

  // offline
  'offline.title': 'While you were away…',
  'offline.body': 'Your AI kept processing and accumulated',
  'offline.continue': 'Continue',

  // settings
  'settings.saveNow': '💾 Save now',
  'settings.export': '📤 Export save',
  'settings.import': '📥 Import save',
  'settings.reducedMotion': '🎬 Reduce motion: {state}',
  'settings.sound': '🔊 Sound: {state}',
  'settings.reset': '🗑 Reset everything',
  'settings.language': 'Language',
  'state.on': 'ON',
  'state.off': 'OFF',
  'settings.exported': 'Save copied to clipboard.',
  'settings.exportPrompt': 'Copy your save:',
  'settings.importPrompt': 'Paste the save code:',
  'settings.resetConfirm': 'Erase ALL progress? This cannot be undone.',
};

export const DICTS: Record<Locale, Dict> = { 'pt-BR': ptBR, 'en-US': enUS };

/** Translate a key for a locale, interpolating {vars}. Falls back to pt-BR then the key. */
export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const template = DICTS[locale]?.[key] ?? DICTS['pt-BR'][key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
  );
}
