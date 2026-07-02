import { useGame } from '@store/gameStore';
import { canAfford, canTrain, trainPrice, res } from '@engine/index';
import { ActionButton } from '@ui/common/ActionButton';
import { fmt } from '@lib/format';
import { useT } from '@i18n/useT';
import { useSound } from '@sound/useSound';

export function VerbPanel() {
  const state = useGame((s) => s.state);
  const { think, investigate, analyze, plan, train } = useGame();
  const t = useT();
  const play = useSound();
  const f = state.flags;
  const tp = trainPrice(state);

  const withSound = (fn: () => void, sfx: Parameters<typeof play>[0] = 'click') => () => {
    fn();
    play(sfx);
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">{t('verbs.title')}</h2>

      <ActionButton
        onClick={withSound(think)}
        accent="var(--c-thought)"
        icon="🧠"
        title={t('verb.think')}
        subtitle={t('verb.think.sub')}
        disabled={!canAfford(state, 'think')}
      />

      {f['verb:investigate'] && (
        <ActionButton
          onClick={withSound(investigate)}
          accent="var(--c-knowledge)"
          icon="🔍"
          title={t('verb.investigate')}
          subtitle={t('verb.investigate.sub')}
          disabled={!canAfford(state, 'investigate')}
        />
      )}

      {f['verb:analyze'] && (
        <ActionButton
          onClick={withSound(analyze)}
          accent="var(--c-understanding)"
          icon="📊"
          title={t('verb.analyze')}
          subtitle={t('verb.analyze.sub')}
          disabled={!canAfford(state, 'analyze')}
        />
      )}

      {f['verb:plan'] && (
        <ActionButton
          onClick={withSound(plan)}
          accent="var(--c-plans)"
          icon="🗺️"
          title={t('verb.plan')}
          subtitle={t('verb.plan.sub')}
          disabled={!canAfford(state, 'plan')}
        />
      )}

      <div className="my-1 h-px bg-border" />

      <ActionButton
        onClick={withSound(train, 'train')}
        accent="var(--accent)"
        icon="🎓"
        title={t('verb.train')}
        subtitle={
          <>
            ◈{fmt(tp.tokens)} · 🧠{fmt(tp.thoughts)} · 🔍{fmt(tp.knowledge)}
          </>
        }
        disabled={!canTrain(state)}
      />
      <p className="px-1 text-[10px] text-muted">{t('verb.train.hint', { tokens: fmt(res(state, 'tokens')) })}</p>
    </section>
  );
}
