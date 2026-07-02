import { useEffect, useRef } from 'react';
import { useGame } from '@store/gameStore';
import { STEP } from '@engine/index';

const AUTOSAVE_MS = 15000;

/**
 * Drives the fixed-step simulation from requestAnimationFrame, accumulating
 * real elapsed time and running deterministic STEP-sized ticks. Also autosaves.
 */
export function useGameLoop() {
  const advance = useGame((s) => s.advance);
  const save = useGame((s) => s.save);
  const ready = useGame((s) => s.ready);
  const acc = useRef(0);
  const last = useRef(performance.now());
  const lastSave = useRef(performance.now());

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min((now - last.current) / 1000, 1); // clamp tab-switch spikes
      last.current = now;
      acc.current += dt;
      let steps = 0;
      while (acc.current >= STEP && steps < 240) {
        advance(STEP);
        acc.current -= STEP;
        steps++;
      }
      if (now - lastSave.current >= AUTOSAVE_MS) {
        save();
        lastSave.current = now;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onHide = () => save();
    window.addEventListener('beforeunload', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('beforeunload', onHide);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [ready, advance, save]);
}
