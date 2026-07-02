import { useGame } from '@store/gameStore';
import { RESEARCH, canOpenNode, res } from '@engine/index';
import { fmt } from '@lib/format';
import type { ResearchBranch } from '@content/research';

const BRANCH_LABEL: Record<ResearchBranch, string> = {
  architecture: 'Arquitetura',
  optimization: 'Otimização',
  data: 'Dados',
  alignment: 'Alinhamento',
  tools: 'Ferramentas',
  meta: 'Meta',
};

export function ResearchPanel() {
  const state = useGame((s) => s.state);
  const research = useGame((s) => s.research);
  const knowledge = res(state, 'knowledge');

  if (!state.flags['verb:investigate']) {
    return (
      <p className="rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted">
        Desbloqueie <b>Investigar</b> (Modelo N-Gram) para abrir a árvore de pesquisa.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Pesquisa</h2>
        <span className="font-mono text-xs text-muted">🔍 {fmt(knowledge)}</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {RESEARCH.map((node) => {
          const unlocked = state.research.includes(node.id);
          const available = canOpenNode(state, node.id);
          const missingReq = !node.requires.every((r) => state.research.includes(r));
          return (
            <button
              key={node.id}
              disabled={unlocked || !available}
              onClick={() => research(node.id)}
              className={`rounded-lg border p-2 text-left transition ${
                unlocked
                  ? 'border-success/40 bg-success/5'
                  : available
                    ? 'border-border bg-surface-2 hover:border-accent'
                    : 'border-border bg-surface-2 opacity-45'
              }`}
              title={node.desc}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{node.name}</span>
                <span className="text-[9px] uppercase text-muted">{BRANCH_LABEL[node.branch]}</span>
              </div>
              <div className="text-[11px] text-muted">{node.desc}</div>
              <div className="mt-1 font-mono text-[11px]">
                {unlocked ? (
                  <span className="text-success">✓ investigado</span>
                ) : missingReq ? (
                  <span className="text-muted">requer: {node.requires.join(', ')}</span>
                ) : (
                  <span>🔍 {fmt(node.cost)}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
