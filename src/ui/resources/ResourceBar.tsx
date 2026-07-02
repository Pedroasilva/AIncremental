import { useGame } from '@store/gameStore';
import { rates } from '@store/selectors';
import { res, getModel, type ResourceId } from '@engine/index';
import { fmt, fmtRate } from '@lib/format';
import { useT } from '@i18n/useT';

const META: { id: ResourceId; icon: string; color: string; flag?: string }[] = [
  { id: 'compute', icon: '⚡', color: 'var(--c-compute)' },
  { id: 'tokens', icon: '◈', color: 'var(--c-token)' },
  { id: 'thoughts', icon: '🧠', color: 'var(--c-thought)' },
  { id: 'knowledge', icon: '🔍', color: 'var(--c-knowledge)', flag: 'verb:investigate' },
  { id: 'data', icon: '📦', color: 'var(--c-data)', flag: 'data' },
  { id: 'understanding', icon: '📊', color: 'var(--c-understanding)', flag: 'verb:analyze' },
  { id: 'plans', icon: '🗺️', color: 'var(--c-plans)', flag: 'verb:plan' },
];

export function ResourceBar() {
  const state = useGame((s) => s.state);
  const t = useT();
  const r = rates(state);
  const model = getModel(state.modelTier);

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2">
      <div className="mr-2 flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">
          AI<span className="text-accent">ncremental</span>
        </span>
        <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-muted">
          {model.name} · T{model.tier}
        </span>
      </div>
      {META.map((m) => {
        if (m.flag && !state.flags[m.flag]) return null;
        const value = res(state, m.id);
        const rate =
          m.id === 'compute'
            ? r.compute
            : m.id === 'tokens'
              ? r.tokens
              : m.id === 'thoughts'
                ? r.thoughts
                : null;
        return (
          <div
            key={m.id}
            className="glass flex items-center gap-2 rounded-lg px-3 py-1.5"
            title={t(`resource.${m.id}`)}
          >
            <span style={{ color: m.color }}>{m.icon}</span>
            <div className="leading-tight">
              <div className="font-mono text-sm font-semibold">{fmt(value)}</div>
              {rate && rate.gt(0) && (
                <div className="font-mono text-[10px] text-muted">{fmtRate(rate)}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
