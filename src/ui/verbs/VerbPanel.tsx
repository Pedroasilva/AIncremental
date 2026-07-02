import { useGame } from '@store/gameStore';
import { canAfford, canTrain, trainPrice, res } from '@engine/index';
import { ActionButton } from '@ui/common/ActionButton';
import { fmt } from '@lib/format';

export function VerbPanel() {
  const state = useGame((s) => s.state);
  const { think, investigate, analyze, plan, train } = useGame();
  const f = state.flags;
  const tp = trainPrice(state);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Ações</h2>

      <ActionButton
        onClick={think}
        accent="var(--c-thought)"
        icon="🧠"
        title="Pensar"
        subtitle={`custo ◈1 · +${fmt(1)} pensamento`}
        disabled={!canAfford(state, 'think')}
      />

      {f['verb:investigate'] && (
        <ActionButton
          onClick={investigate}
          accent="var(--c-knowledge)"
          icon="🔍"
          title="Investigar"
          subtitle="custo ◈10 + 🧠5 · +conhecimento"
          disabled={!canAfford(state, 'investigate')}
        />
      )}

      {f['verb:analyze'] && (
        <ActionButton
          onClick={analyze}
          accent="var(--c-understanding)"
          icon="📊"
          title="Analisar"
          subtitle="custo ◈8 + 📦2 · +entendimento"
          disabled={!canAfford(state, 'analyze')}
        />
      )}

      {f['verb:plan'] && (
        <ActionButton
          onClick={plan}
          accent="var(--c-plans)"
          icon="🗺️"
          title="Planejar"
          subtitle="custo 📊20 · +1% por plano"
          disabled={!canAfford(state, 'plan')}
        />
      )}

      <div className="my-1 h-px bg-border" />

      <ActionButton
        onClick={train}
        accent="var(--accent)"
        icon="🎓"
        title="Treinar Modelo"
        subtitle={
          <>
            ◈{fmt(tp.tokens)} · 🧠{fmt(tp.thoughts)} · 🔍{fmt(tp.knowledge)}
          </>
        }
        disabled={!canTrain(state)}
      />
      <p className="px-1 text-[10px] text-muted">
        Tokens: {fmt(res(state, 'tokens'))} — o gargalo de tudo.
      </p>
    </section>
  );
}
