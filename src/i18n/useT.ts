import { useCallback } from 'react';
import { useGame } from '@store/gameStore';
import { translate } from './translations';
import type { Locale } from '@engine/types';

export type TFn = (key: string, vars?: Record<string, string | number>) => string;

/** Returns a `t` bound to the active locale from the game settings. */
export function useT(): TFn {
  const locale = useGame((s) => s.state.settings.locale);
  return useCallback<TFn>((key, vars) => translate(locale, key, vars), [locale]);
}

export function useLocale(): Locale {
  return useGame((s) => s.state.settings.locale);
}
