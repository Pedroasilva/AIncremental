import { useGame } from '@store/gameStore';
import { rates } from '@store/selectors';
import { fmt } from '@lib/format';
import { useT, type TFn } from '@i18n/useT';
import type { LogEntry } from '@engine/index';

const KIND_COLOR: Record<string, string> = {
  info: 'var(--text-muted)',
  gain: 'var(--success)',
  warn: 'var(--warn)',
  emergence: 'var(--accent)',
};
const KIND_PREFIX: Record<string, string> = {
  info: '›',
  gain: '›',
  warn: '⚠',
  emergence: '✦',
};

/** Resolve an entry to display text, translating content names inside vars. */
function renderEntry(entry: LogEntry, t: TFn): string {
  if (!entry.key) return entry.text ?? '';
  const vars = { ...entry.vars };
  // Content names must be re-translated from their ids for the active locale.
  if (entry.key === 'log.investigated' && vars.id) vars.name = t(`research.${vars.id}.name`);
  if (entry.key === 'log.hired' && vars.role) vars.name = t(`agent.${vars.role}.name`);
  return t(entry.key, vars);
}

export function LogPanel() {
  const state = useGame((s) => s.state);
  const t = useT();
  const r = rates(state);
  const ctx = state.context;
  const ctxPct = ctx.window > 0 ? Math.min((ctx.load / ctx.window) * 100, 100) : 0;

  return (
    <section className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{t('log.title')}</h2>
        <span className="font-mono text-[10px] text-muted">◈{fmt(r.tokens)}/s</span>
      </div>

      {/* context window / hallucination gauge */}
      <div className="mb-2 rounded-lg border border-border bg-surface-2 p-2">
        <div className="mb-1 flex justify-between text-[10px] text-muted">
          <span>{t('log.contextWindow')}</span>
          <span>
            {Math.round(ctx.load)}/{ctx.window}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-bg">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${ctxPct}%`,
              background:
                ctx.hallucination > 0.3
                  ? 'var(--danger)'
                  : ctx.hallucination > 0.05
                    ? 'var(--warn)'
                    : 'var(--accent)',
            }}
          />
        </div>
        {ctx.hallucination > 0.05 && (
          <div className="mt-1 text-[10px] text-warn">
            {t('log.hallucination', { pct: Math.round(ctx.hallucination * 100) })}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-bg/40 p-2 font-mono text-xs">
        {state.log.length === 0 && <p className="text-muted">{t('log.empty')}</p>}
        {state.log.map((e) => (
          <div key={e.id} className="animate-fade-up py-0.5" style={{ color: KIND_COLOR[e.kind] }}>
            <span className="mr-1 opacity-70">{KIND_PREFIX[e.kind]}</span>
            {renderEntry(e, t)}
          </div>
        ))}
      </div>
    </section>
  );
}
