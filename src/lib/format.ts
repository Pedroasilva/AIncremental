import { Decimal } from '@engine/index';

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/** Human-friendly abbreviation for large numbers (1.23K, 4.5M, 1.2e18). */
export function fmt(value: Decimal | number, decimals = 2): string {
  const d = value instanceof Decimal ? value : new Decimal(value);
  if (d.lt(1000)) {
    const n = d.toNumber();
    return Number.isInteger(n) ? n.toString() : n.toFixed(decimals);
  }
  const exp = Math.floor(d.log10());
  const group = Math.floor(exp / 3);
  if (group < SUFFIXES.length) {
    const scaled = d.div(Decimal.pow(10, group * 3)).toNumber();
    return `${scaled.toFixed(decimals)}${SUFFIXES[group]}`;
  }
  // fall back to scientific notation
  const mantissa = d.div(Decimal.pow(10, exp)).toNumber();
  return `${mantissa.toFixed(2)}e${exp}`;
}

/** Format a per-second rate. */
export function fmtRate(value: Decimal | number): string {
  return `${fmt(value)}/s`;
}

export function fmtTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
