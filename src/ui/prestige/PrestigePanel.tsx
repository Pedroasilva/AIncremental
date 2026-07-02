import { useGame } from '@store/gameStore';
import { canPrestige, pendingParams, res, Decimal } from '@engine/index';
import { fmt } from '@lib/format';
import { useT } from '@i18n/useT';
import { useSound } from '@sound/useSound';

export function PrestigePanel() {
  const state = useGame((s) => s.state);
  const doPrestige = useGame((s) => s.doPrestige);
  const t = useT();
  const play = useSound();

  if (!state.flags['prestige']) return null;

  const gain = pendingParams(state);
  const params = new Decimal(state.prestige.params);

  return (
    <section className="rounded-lg border border-accent-2/40 bg-accent-2/5 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{t('prestige.title')}</h2>
        <span className="font-mono text-xs">Θ {fmt(params)}</span>
      </div>
      <p className="mt-1 text-[11px] text-muted">{t('prestige.desc')}</p>
      <button
        onClick={() => {
          doPrestige();
          play('prestige');
        }}
        disabled={!canPrestige(state)}
        className="mt-2 w-full rounded-lg border border-accent-2 bg-accent-2/20 py-2 text-sm font-semibold transition enabled:hover:bg-accent-2/30 disabled:opacity-40"
      >
        {t('prestige.button', { gain: fmt(gain) })}
      </button>
      <p className="mt-1 text-center text-[10px] text-muted">
        {t('prestige.footer', {
          understanding: fmt(res(state, 'understanding')),
          runs: state.prestige.totalRuns,
        })}
      </p>
    </section>
  );
}
