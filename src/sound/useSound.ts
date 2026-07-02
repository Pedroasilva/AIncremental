import { useCallback, useEffect } from 'react';
import { useGame } from '@store/gameStore';
import { sound, type SoundName } from './sound';

/**
 * Keeps the sound manager in sync with settings (mute/volume) and returns a
 * `play` bound to the current state. Sound is disabled when muted.
 */
export function useSound() {
  const muted = useGame((s) => s.state.settings.muted);
  const volume = useGame((s) => s.state.settings.volume);

  useEffect(() => {
    sound.setEnabled(!muted);
  }, [muted]);

  useEffect(() => {
    sound.setVolume(volume);
  }, [volume]);

  return useCallback((name: SoundName) => sound.play(name), []);
}
