export interface YieldProtocol {
  id: string;
  name: string;
  logo: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  tvl: string;
  asset: string;
}

export type SortField = 'name' | 'apy' | 'risk' | 'tvl' | 'asset';
export type SortDirection = 'asc' | 'desc';
