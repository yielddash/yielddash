export interface Pool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  stablecoin: boolean;
  ilRisk?: string;
  exposure?: string;
  predictions?: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
  poolMeta?: string;
  url?: string;
}

export interface FilteredPool extends Pool {
  chainIcon: string;
  apyColor: string;
  protocolUrl?: string;
}

export type SortField = 'apy' | 'tvlUsd' | 'project' | 'chain';
export type SortDirection = 'asc' | 'desc';
