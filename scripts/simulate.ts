/**
 * Headless balance simulation. Runs the pure engine for N simulated hours with a
 * naive "buy cheapest / think" policy and prints milestone timings. No UI.
 *
 *   npm run sim
 */
import { initialState, tick, doVerb, buyProducer, producerPrice, trainModel, canTrain, canAfford, res } from '../src/engine/index';
import { PRODUCERS } from '../src/content/producers';

const HOURS = Number(process.argv[2] ?? 2);
const STEP = 1; // 1s coarse steps for speed
const total = HOURS * 3600;

const state = initialState();
let lastTier = 0;

for (let t = 0; t < total; t += STEP) {
  // policy: reinvest in the cheapest producer first (build income), then think,
  // investigate only with surplus tokens+thoughts, and train whenever able.
  for (const p of PRODUCERS) {
    if (res(state, 'tokens').gte(producerPrice(state, p.id).mul(2))) {
      buyProducer(state, p.id);
      break;
    }
  }
  if (canAfford(state, 'think')) doVerb(state, 'think');
  if (canAfford(state, 'investigate') && res(state, 'thoughts').gt(5000) && res(state, 'tokens').gt(1000)) {
    doVerb(state, 'investigate');
  }
  if (canAfford(state, 'analyze') && res(state, 'data').gt(50)) doVerb(state, 'analyze');
  if (canTrain(state)) trainModel(state);

  tick(state, STEP);

  if (state.modelTier !== lastTier) {
    lastTier = state.modelTier;
    console.log(`t=${fmtTime(t)}  ->  Model tier ${state.modelTier}`);
  }
}

console.log('--- final ---');
console.log('tokens:', res(state, 'tokens').toString());
console.log('thoughts:', res(state, 'thoughts').toString());
console.log('model tier:', state.modelTier);

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h${m.toString().padStart(2, '0')}m`;
}
