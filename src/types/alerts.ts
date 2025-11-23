export interface Alert {
  id: string;
  protocol: string;
  chain: string;
  condition: 'above' | 'below';
  targetApy: number;
  active: boolean;
  createdAt: number;
}

export interface AlertFormData {
  protocol: string;
  chain: string;
  condition: 'above' | 'below';
  targetApy: string;
}
