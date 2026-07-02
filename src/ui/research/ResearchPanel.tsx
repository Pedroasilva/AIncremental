import { useGame } from '@store/gameStore';
import { RESEARCH, canOpenNode, res } from '@engine/index';
import { fmt } from '@lib/format';
import { useT, type TFn } from '@i18n/useT';
import { useSound } from '@sound/useSound';
import type { ResearchNode } from '@content/research';

/** Human-readable, localized list of a node's concrete effects. */
function effectBadges(node: ResearchNode, t: TFn): string[] {
  const e = node.effect;
  const pct = (m: number) => Math.round((m - 1) * 100);
  const out: string[] = [];
  if (e.computeMult) out.push(t('effect.compute', { pct: pct(e.computeMult) }));
  if (e.tokenMult) out.push(t('effect.token', { pct: pct(e.tokenMult) }));
  if (e.verbMult) out.push(t('effect.verbs', { pct: pct(e.verbMult) }));
  if (e.windowAdd) out.push(t('effect.window', { n: e.windowAdd }));
  if (e.hallucinationReduce) out.push(t('effect.halluc', { pct: Math.round(e.hallucinationReduce * 100) }));
  if (e.slotsAdd) out.push(t('effect.slots', { n: e.slotsAdd }));
  if (node.id === 'crawling') out.push(t('effect.data'));
  return out;
}

export function ResearchPanel() {
  const state = useGame((s) => s.state);
  const research = useGame((s) => s.research);
  const t = useT();
  const play = useSound();
  const knowledge = res(state, 'knowledge');

  if (!state.flags['verb:investigate']) {
    return (
      <p className="rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted">
        {t('research.locked')}
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{t('research.title')}</h2>
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
              onClick={() => {
                research(node.id);
                play('unlock');
              }}
              className={`rounded-lg border p-2 text-left transition ${
                unlocked
                  ? 'border-success/40 bg-success/5'
                  : available
                    ? 'border-border bg-surface-2 hover:border-accent'
                    : 'border-border bg-surface-2 opacity-45'
              }`}
              title={t(`research.${node.id}.desc`)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{t(`research.${node.id}.name`)}</span>
                <span className="text-[9px] uppercase text-muted">{t(`branch.${node.branch}`)}</span>
              </div>
              <div className="text-[11px] text-muted">{t(`research.${node.id}.desc`)}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {effectBadges(node, t).map((badge, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-1 font-mono text-[11px]">
                {unlocked ? (
                  <span className="text-success">{t('research.done')}</span>
                ) : missingReq ? (
                  <span className="text-muted">
                    {t('research.requires', {
                      reqs: node.requires.map((r) => t(`research.${r}.name`)).join(', '),
                    })}
                  </span>
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
