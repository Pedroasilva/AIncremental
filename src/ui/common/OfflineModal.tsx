import { useGame } from '@store/gameStore';
import { fmt } from '@lib/format';
import { useT } from '@i18n/useT';

export function OfflineModal() {
  const offlineGain = useGame((s) => s.offlineGain);
  const dismiss = useGame((s) => s.dismissOffline);
  const t = useT();

  if (offlineGain === null || offlineGain <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass w-full max-w-sm rounded-2xl p-5 text-center">
        <div className="mb-2 text-3xl">🤖</div>
        <h2 className="text-lg font-semibold">{t('offline.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('offline.body')}</p>
        <p className="my-3 font-mono text-2xl text-accent">◈ {fmt(offlineGain)}</p>
        <button
          onClick={dismiss}
          className="w-full rounded-lg border border-accent bg-accent/15 py-2 font-semibold transition hover:bg-accent/25"
        >
          {t('offline.continue')}
        </button>
      </div>
    </div>
  );
}
