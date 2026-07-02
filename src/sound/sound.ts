// Lightweight procedural SFX via the Web Audio API. No asset files: each sound
// is synthesized from oscillators + gain envelopes, so it stays dependency-free
// and instant to load. The AudioContext is created lazily on first playback
// (browsers require a user gesture before audio can start).

export type SoundName =
  | 'click'
  | 'buy'
  | 'unlock'
  | 'train'
  | 'prestige'
  | 'error';

interface Tone {
  freq: number;
  start: number; // seconds offset
  dur: number;
  type?: OscillatorType;
  gain?: number;
}

// Each sound is a small set of tones (notes/sweeps).
const RECIPES: Record<SoundName, Tone[]> = {
  click: [{ freq: 660, start: 0, dur: 0.06, type: 'triangle', gain: 0.5 }],
  buy: [
    { freq: 520, start: 0, dur: 0.08, type: 'triangle' },
    { freq: 780, start: 0.06, dur: 0.1, type: 'triangle' },
  ],
  unlock: [
    { freq: 523, start: 0, dur: 0.12, type: 'sine' },
    { freq: 659, start: 0.08, dur: 0.12, type: 'sine' },
    { freq: 784, start: 0.16, dur: 0.18, type: 'sine' },
  ],
  train: [
    { freq: 330, start: 0, dur: 0.18, type: 'sawtooth', gain: 0.4 },
    { freq: 494, start: 0.1, dur: 0.18, type: 'sawtooth', gain: 0.4 },
    { freq: 659, start: 0.22, dur: 0.26, type: 'sine' },
  ],
  prestige: [
    { freq: 523, start: 0, dur: 0.5, type: 'sine' },
    { freq: 659, start: 0, dur: 0.5, type: 'sine', gain: 0.35 },
    { freq: 988, start: 0.1, dur: 0.5, type: 'sine', gain: 0.3 },
  ],
  error: [{ freq: 160, start: 0, dur: 0.16, type: 'square', gain: 0.4 }],
};

class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private volume = 0.6;

  private ensure(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(v, 1));
    if (this.master) this.master.gain.value = this.volume;
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    if (!this.ensure() || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    for (const tone of RECIPES[name]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = tone.type ?? 'sine';
      osc.frequency.value = tone.freq;
      const peak = (tone.gain ?? 0.6) * 0.5;
      const t0 = now + tone.start;
      // quick attack, exponential-ish decay
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.dur);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + tone.dur + 0.02);
    }
  }
}

export const sound = new SoundManager();
