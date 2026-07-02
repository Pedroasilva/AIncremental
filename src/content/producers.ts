import type { ProducerId } from '@engine/types';

export interface ProducerDef {
  id: ProducerId;
  name: string;
  desc: string;
  baseCost: number; // in tokens
  growth: number;
  baseOutput: number; // compute/sec each
  unlockFlag?: string;
}

// Compute producers — the idle backbone. Costs paid in Tokens.
export const PRODUCERS: ProducerDef[] = [
  { id: 'cpu', name: 'Núcleo CPU', desc: 'Um humilde núcleo fazendo contas.', baseCost: 10, growth: 1.15, baseOutput: 2 },
  { id: 'gpu', name: 'GPU', desc: 'Paralelismo massivo para inferência.', baseCost: 120, growth: 1.16, baseOutput: 9 },
  { id: 'cluster', name: 'Cluster', desc: 'Muitas GPUs conversando.', baseCost: 2000, growth: 1.17, baseOutput: 75 },
  { id: 'datacenter', name: 'Data Center', desc: 'Um prédio inteiro pensando.', baseCost: 45000, growth: 1.18, baseOutput: 650 },
];

export const getProducer = (id: ProducerId): ProducerDef =>
  PRODUCERS.find((p) => p.id === id)!;
