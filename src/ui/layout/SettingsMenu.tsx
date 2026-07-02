import { useState } from 'react';
import { useGame } from '@store/gameStore';

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const state = useGame((s) => s.state);
  const { save, exportSave, importSave, hardReset, toggleReducedMotion } = useGame();

  const doExport = async () => {
    const code = exportSave();
    try {
      await navigator.clipboard.writeText(code);
      alert('Save copiado para a área de transferência.');
    } catch {
      prompt('Copie seu save:', code);
    }
  };
  const doImport = () => {
    const code = prompt('Cole o código do save:');
    if (code) importSave(code.trim());
  };
  const doReset = () => {
    if (confirm('Apagar TODO o progresso? Isto não pode ser desfeito.')) hardReset();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm transition hover:border-accent"
      >
        ⚙︎
      </button>
      {open && (
        <div className="glass absolute right-0 top-10 z-40 w-52 rounded-xl p-2 text-sm">
          <MenuItem label="💾 Salvar agora" onClick={save} />
          <MenuItem label="📤 Exportar save" onClick={doExport} />
          <MenuItem label="📥 Importar save" onClick={doImport} />
          <MenuItem
            label={`🎬 Reduzir animações: ${state.settings.reducedMotion ? 'ON' : 'OFF'}`}
            onClick={toggleReducedMotion}
          />
          <div className="my-1 h-px bg-border" />
          <MenuItem label="🗑 Resetar tudo" onClick={doReset} danger />
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
