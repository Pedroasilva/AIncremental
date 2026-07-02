import { useState } from 'react';
import { useGame } from '@store/gameStore';
import { useT } from '@i18n/useT';
import { LanguageSelector } from './LanguageSelector';

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const state = useGame((s) => s.state);
  const { save, exportSave, importSave, hardReset, toggleReducedMotion, toggleMute } = useGame();
  const t = useT();

  const onState = (v: boolean) => (v ? t('state.on') : t('state.off'));

  const doExport = async () => {
    const code = exportSave();
    try {
      await navigator.clipboard.writeText(code);
      alert(t('settings.exported'));
    } catch {
      prompt(t('settings.exportPrompt'), code);
    }
  };
  const doImport = () => {
    const code = prompt(t('settings.importPrompt'));
    if (code) importSave(code.trim());
  };
  const doReset = () => {
    if (confirm(t('settings.resetConfirm'))) hardReset();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm transition hover:border-accent"
        aria-label="settings"
      >
        ⚙︎
      </button>
      {open && (
        <div className="glass absolute right-0 top-10 z-40 w-56 rounded-xl p-2 text-sm">
          <div className="px-2 pb-1 text-[10px] uppercase tracking-wide text-muted">{t('settings.language')}</div>
          <div className="px-2 pb-2">
            <LanguageSelector />
          </div>
          <div className="my-1 h-px bg-border" />
          <MenuItem label={t('settings.saveNow')} onClick={save} />
          <MenuItem label={t('settings.export')} onClick={doExport} />
          <MenuItem label={t('settings.import')} onClick={doImport} />
          <MenuItem label={t('settings.sound', { state: onState(!state.settings.muted) })} onClick={toggleMute} />
          <MenuItem
            label={t('settings.reducedMotion', { state: onState(state.settings.reducedMotion) })}
            onClick={toggleReducedMotion}
          />
          <div className="my-1 h-px bg-border" />
          <MenuItem label={t('settings.reset')} onClick={doReset} danger />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-md px-2 py-1.5 text-left transition hover:bg-surface-2 ${
        danger ? 'text-danger' : ''
      }`}
    >
      {label}
    </button>
  );
}
