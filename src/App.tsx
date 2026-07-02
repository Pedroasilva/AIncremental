import { useEffect, useState } from 'react';
import { useGame } from '@store/gameStore';
import { useGameLoop } from '@hooks/useGameLoop';
import { ResourceBar } from '@ui/resources/ResourceBar';
import { VerbPanel } from '@ui/verbs/VerbPanel';
import { ProducerPanel } from '@ui/producers/ProducerPanel';
import { ResearchPanel } from '@ui/research/ResearchPanel';
import { AgentPanel } from '@ui/agents/AgentPanel';
import { PrestigePanel } from '@ui/prestige/PrestigePanel';
import { LogPanel } from '@ui/log/LogPanel';
import { CoreCanvas } from '@render/CoreCanvas';
import { OfflineModal } from '@ui/common/OfflineModal';
import { SettingsMenu } from '@ui/layout/SettingsMenu';

type Tab = 'palco' | 'pesquisa' | 'agentes';

export default function App() {
  const init = useGame((s) => s.init);
  const ready = useGame((s) => s.ready);
  const reducedMotion = useGame((s) => s.state.settings.reducedMotion);
  const [tab, setTab] = useState<Tab>('palco');

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
  }, [reducedMotion]);

  useGameLoop();

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        <span className="animate-breathe text-lg">Inicializando a IA…</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* top bar */}
      <header className="glass z-20 flex items-center justify-between border-b border-border">
        <ResourceBar />
        <div className="px-3">
          <SettingsMenu />
        </div>
      </header>

      {/* main grid */}
      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[300px_1fr_320px]">
        {/* left: actions + hardware */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-surface/60 p-3">
          <VerbPanel />
          <ProducerPanel />
          <PrestigePanel />
        </div>

        {/* center: stage with tabs */}
        <div className="flex min-h-0 flex-col rounded-xl border border-border bg-surface/40">
          <div className="flex gap-1 border-b border-border p-2">
            {(['palco', 'pesquisa', 'agentes'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize transition ${
                  tab === t ? 'bg-surface-2 text-text' : 'text-muted hover:text-text'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {tab === 'palco' && (
              <div className="h-full min-h-[320px]">
                <CoreCanvas />
              </div>
            )}
            {tab === 'pesquisa' && <ResearchPanel />}
            {tab === 'agentes' && <AgentPanel />}
          </div>
        </div>

        {/* right: reasoning log */}
        <div className="flex min-h-0 flex-col rounded-xl border border-border bg-surface/60 p-3">
          <LogPanel />
        </div>
      </main>

      <OfflineModal />
    </div>
  );
}
