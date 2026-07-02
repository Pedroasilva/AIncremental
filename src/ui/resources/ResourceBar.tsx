import { useGame } from '@store/gameStore';
import { rates } from '@store/selectors';
import { res, getModel, type ResourceId } from '@engine/index';
import { fmt, fmtRate } from '@lib/format';

const META: { id: ResourceId; icon: string; label: string; color: string; flag?: string }[] = [
  { id: 'compute', icon: '⚡', label: 'Compute', color: 'var(--c-compute)' },
  { id: 'tokens', icon: '◈', label: 'Tokens', color: 'var(--c-token)' },
  { id: 'thoughts', icon: '🧠', label: 'Pensamentos', color: 'var(--c-thought)' },
  { id: 'knowledge', icon: '🔍', label: 'Conhecimento', color: 'var(--c-knowledge)', flag: 'verb:investigate' },
  { id: 'data', icon: '📦', label: 'Dados', color: 'var(--c-data)', flag: 'data' },
  { id: 'understanding', icon: '📊', label: 'Entendimento', color: 'var(--c-understanding)', flag: 'verb:analyze' },
  { id: 'plans', icon: '🗺️', label: 'Planos', color: 'var(--c-plans)', flag: 'verb:plan' },
];

export function ResourceBar() {
  const state = useGame((s) => s.state);
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
        const rate = m.id === 'compute' ? r.compute : m.id === 'tokens' ? r.tokens : null;
        return (
          <div
            key={m.id}
            className="glass flex items-center gap-2 rounded-lg px-3 py-1.5"
            title={m.label}
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
