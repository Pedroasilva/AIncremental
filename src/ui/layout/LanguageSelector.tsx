import { useGame } from '@store/gameStore';
import { LOCALES } from '@i18n/translations';

/** Compact segmented control to switch between pt-BR and en-US. */
export function LanguageSelector() {
  const locale = useGame((s) => s.state.settings.locale);
  const setLocale = useGame((s) => s.setLocale);

  return (
    <div className="flex overflow-hidden rounded-lg border border-border bg-surface-2">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          title={l.label}
          className={`flex items-center gap-1 px-2 py-1.5 text-xs transition ${
            locale === l.code ? 'bg-accent/20 text-text' : 'text-muted hover:text-text'
          }`}
        >
          <span>{l.flag}</span>
          <span className="hidden sm:inline">{l.code === 'pt-BR' ? 'PT' : 'EN'}</span>
        </button>
      ))}
    </div>
  );
}
