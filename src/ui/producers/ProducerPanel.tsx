import { useGame } from '@store/gameStore';
import { PRODUCERS, producerPrice, res } from '@engine/index';
import { ActionButton } from '@ui/common/ActionButton';
import { fmt } from '@lib/format';

export function ProducerPanel() {
  const state = useGame((s) => s.state);
  const buy = useGame((s) => s.buy);
  const tokens = res(state, 'tokens');

  // Reveal a producer once you can nearly afford the previous one.
  let revealed = true;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Hardware (Compute)</h2>
      {PRODUCERS.map((p, i) => {
        const price = producerPrice(state, p.id);
        const owned = state.producers[p.id].count;
        const show = revealed;
        revealed = owned > 0 || tokens.gte(price.mul(0.4));
        if (!show && i > 0) return null;
        return (
          <ActionButton
            key={p.id}
            onClick={() => buy(p.id)}
            accent="var(--c-compute)"
            icon="⚡"
            title={`${p.name}  ×${owned}`}
            subtitle={`◈${fmt(price)} · +${p.baseOutput}/s compute`}
            disabled={tokens.lt(price)}
          />
        );
      })}
    </section>
  );
}
