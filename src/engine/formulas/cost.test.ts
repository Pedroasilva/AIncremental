import { describe, it, expect } from 'vitest';
import { producerCost, trainCost, understandingDiscount, prestigeGain } from './cost';
import { D } from '../math/decimal';

describe('producerCost', () => {
  it('scales geometrically with count', () => {
    expect(producerCost(10, 1.15, 0).toNumber()).toBeCloseTo(10);
    expect(producerCost(10, 1.15, 1).toNumber()).toBeCloseTo(11.5);
    expect(producerCost(10, 1.15, 2).toNumber()).toBeCloseTo(13.225);
  });
});

describe('trainCost', () => {
  it('grows 12x per tier', () => {
    expect(trainCost(50, 1).toNumber()).toBe(600);
    expect(trainCost(50, 2).toNumber()).toBe(7200);
  });
});

describe('understandingDiscount', () => {
  it('is 0 at no understanding and asymptotic below 0.9', () => {
    expect(understandingDiscount(D(0))).toBe(0);
    expect(understandingDiscount(D(1_000_000))).toBeLessThanOrEqual(0.9);
    expect(understandingDiscount(D(20))).toBeGreaterThan(0);
  });
});

describe('prestigeGain', () => {
  it('follows a sqrt curve', () => {
    expect(prestigeGain(D(0), D(0)).toNumber()).toBe(0);
    expect(prestigeGain(D(10000), D(0)).toNumber()).toBe(10); // 0.1*sqrt(10000)=10
  });
});
