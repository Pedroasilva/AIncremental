import Decimal from 'break_infinity.js';

// Central re-export so the rest of the engine depends on one wrapper.
export { Decimal };
export type { Decimal as DecimalType };

export type DecimalSource = number | string | Decimal;

export const D = (v: DecimalSource): Decimal => new Decimal(v);
export const ZERO = new Decimal(0);
export const ONE = new Decimal(1);

/** Serialize a Decimal to a compact string for saving. */
export const encode = (d: Decimal): string => d.toString();
/** Parse a saved string back into a Decimal. */
export const decode = (s: string): Decimal => new Decimal(s);
