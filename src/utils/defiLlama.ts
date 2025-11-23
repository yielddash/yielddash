import { Pool, FilteredPool } from '../types/defi';

const DEFILLAMA_API = 'https://yields.llama.fi/pools';
const PROTOCOL_API = 'https://api.llama.fi/protocol';
const CACHE_DURATION = 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: {
  pools?: CacheEntry<FilteredPool[]>;
  protocolUrls: Map<string, CacheEntry<string>>;
} = {
  protocolUrls: new Map(),
};

const getChainIcon = (chain: string): string => {
  const chainIcons: Record<string, string> = {
    ethereum: 'Ξ',
    arbitrum: '🔷',
    base: '🔵',
    bsc: '💛',
    solana: '⚡',
    polygon: '🟣',
    optimism: '🔴',
    avalanche: '🔺',
  };
  return chainIcons[chain.toLowerCase()] || '⛓️';
};


const getApyColor = (apy: number): string => {
  if (apy > 10) return '#22c55e';
  if (apy > 5) return '#eab308';
  return '#9ca3af';
};

export const filterPools = (data: Pool[]): FilteredPool[] => {
  return data
    .filter(pool =>
      pool.stablecoin === true &&
      pool.tvlUsd > 10_000_000 &&
      pool.apy > 1 &&
      pool.apy < 50 &&
      !pool.pool?.includes('outdated') &&
      !pool.project?.includes('test')
    )
    .map(pool => ({
      ...pool,
      chainIcon: getChainIcon(pool.chain),
      apyColor: getApyColor(pool.apy),
    }))
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 25);
};

const fetchProtocolUrlFromAPI = async (projectName: string): Promise<string> => {
  try {
    const response = await fetch(`${PROTOCOL_API}/${projectName}`);
    if (response.ok) {
      const data = await response.json();
      return data.url || `https://defillama.com/protocol/${projectName}`;
    }
  } catch (error) {
    console.error(`Failed to fetch protocol URL for ${projectName}:`, error);
  }
  return `https://defillama.com/protocol/${projectName}`;
};

const getCachedProtocolUrl = async (projectName: string): Promise<string> => {
  const cached = cache.protocolUrls.get(projectName);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION * 24) {
    return cached.data;
  }

  const url = await fetchProtocolUrlFromAPI(projectName);
  cache.protocolUrls.set(projectName, {
    data: url,
    timestamp: now,
  });

  return url;
};

export const fetchYieldPools = async (): Promise<FilteredPool[]> => {
  const now = Date.now();

  if (cache.pools && now - cache.pools.timestamp < CACHE_DURATION) {
    console.log('Returning cached pools data');
    return cache.pools.data;
  }

  try {
    const response = await fetch(DEFILLAMA_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const filteredPools = filterPools(data.data || data);

    const poolsWithUrls = await Promise.all(
      filteredPools.map(async (pool) => {
        const staticUrl = protocolUrls[pool.project?.toLowerCase() || ''];
        if (staticUrl) {
          return { ...pool, protocolUrl: staticUrl };
        }

        const apiUrl = await getCachedProtocolUrl(pool.project);
        return { ...pool, protocolUrl: apiUrl };
      })
    );

    cache.pools = {
      data: poolsWithUrls,
      timestamp: now,
    };

    return poolsWithUrls;
  } catch (error) {
    console.error('Error fetching yield pools:', error);

    if (cache.pools) {
      console.log('Returning stale cached data due to error');
      return cache.pools.data;
    }

    throw error;
  }
};

export const getCacheInfo = () => {
  if (!cache.pools) {
    return {
      isCached: false,
      lastUpdated: null,
      nextUpdate: null,
    };
  }

  const now = Date.now();
  const age = now - cache.pools.timestamp;
  const nextUpdate = cache.pools.timestamp + CACHE_DURATION;

  return {
    isCached: age > 0,
    lastUpdated: new Date(cache.pools.timestamp).toISOString(),
    nextUpdate: new Date(nextUpdate).toISOString(),
    ageMinutes: Math.floor(age / 60000),
  };
};

export const formatTVL = (tvl: number): string => {
  if (tvl >= 1_000_000_000) {
    return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  }
  if (tvl >= 1_000_000) {
    return `$${(tvl / 1_000_000).toFixed(0)}M`;
  }
  return `$${(tvl / 1_000).toFixed(0)}K`;
};

export const formatAPY = (apy: number): string => {
  return `${apy.toFixed(2)}%`;
};

const protocolUrls: Record<string, string> = {
  'aave': 'https://app.aave.com',
  'aave-v2': 'https://app.aave.com',
  'aave-v3': 'https://app.aave.com',
  'compound': 'https://app.compound.finance',
  'compound-v3': 'https://app.compound.finance',
  'morpho': 'https://app.morpho.org',
  'morpho-blue': 'https://app.morpho.org',
  'spark': 'https://app.spark.fi',
  'maker': 'https://app.sky.money',
  'sky': 'https://app.sky.money',
  'sky-lending': 'https://app.sky.money',
  'ethena': 'https://app.ethena.fi',
  'ethena-usde': 'https://app.ethena.fi',
  'maple': 'https://app.maple.finance',
  'frax': 'https://app.frax.finance',
  'frax-lend': 'https://app.frax.finance',
  'ondo': 'https://ondo.finance',
  'ondo-finance': 'https://ondo.finance',
  'mountain': 'https://mountainprotocol.com',
  'curve': 'https://curve.fi',
  'curve-dex': 'https://curve.fi',
  'convex': 'https://www.convexfinance.com',
  'convex-finance': 'https://www.convexfinance.com',
  'uniswap': 'https://app.uniswap.org',
  'uniswap-v3': 'https://app.uniswap.org',
  'pancakeswap': 'https://pancakeswap.finance',
  'sushiswap': 'https://www.sushi.com',
  'balancer': 'https://app.balancer.fi',
  'velodrome': 'https://velodrome.finance',
  'aerodrome': 'https://aerodrome.finance',
  'yearn': 'https://yearn.fi',
  'yearn-finance': 'https://yearn.fi',
  'beefy': 'https://app.beefy.com',
  'harvest': 'https://app.harvest.finance',
  'sommelier': 'https://app.sommelier.finance',
  'venus': 'https://app.venus.io',
  'alpaca': 'https://app.alpacafinance.org',
  'radiant': 'https://app.radiant.capital',
  'radiant-v2': 'https://app.radiant.capital',
  'gmx': 'https://app.gmx.io',
  'pendle': 'https://app.pendle.finance',
  'camelot': 'https://app.camelot.exchange',
  'jones': 'https://app.jonesdao.io',
  'moonwell': 'https://moonwell.fi',
  'seamless': 'https://app.seamlessprotocol.com',
  'extra': 'https://app.extrafi.io',
  'exactly': 'https://app.exact.ly',
  'sonne': 'https://sonne.finance',
  'benqi': 'https://app.benqi.fi',
  'trader-joe': 'https://traderjoexyz.com',
  'kamino': 'https://app.kamino.finance',
  'marginfi': 'https://app.marginfi.com',
  'drift': 'https://app.drift.trade',
  'solend': 'https://solend.fi',
  'meteora': 'https://app.meteora.ag',
  'raydium': 'https://raydium.io',
  'orca': 'https://www.orca.so',
  'jito': 'https://www.jito.network',
  'hyperion': 'https://app.hyperion.xyz',
  'liquidswap': 'https://liquidswap.com',
  'thala': 'https://app.thala.fi',
  'aptin': 'https://aptin.io',
  'quickswap': 'https://quickswap.exchange',
  'strata': 'https://strataprotocol.com',
  'strata-finance': 'https://strataprotocol.com',
  'fluid': 'https://fluid.instadapp.io',
  'instadapp': 'https://instadapp.io',
  'gearbox': 'https://app.gearbox.fi',
  'euler': 'https://app.euler.finance',
  'notional': 'https://notional.finance',
  'clearpool': 'https://clearpool.finance',
  'goldfinch': 'https://app.goldfinch.finance',
  'centrifuge': 'https://app.centrifuge.io',
  'truefi': 'https://app.truefi.io',
  'hyperliquid': 'https://app.hyperliquid.xyz',
  'justlend': 'https://justlend.org',
  'resolv': 'https://app.resolv.xyz',
  'level': 'https://app.level.finance',
  'ringfi': 'https://ring.fi',
};

export const getProtocolUrl = (pool: FilteredPool | Pool): string => {
  if ('protocolUrl' in pool && pool.protocolUrl) {
    return pool.protocolUrl;
  }

  const project = pool.project?.toLowerCase() || '';

  if (protocolUrls[project]) {
    return protocolUrls[project];
  }

  for (const [key, url] of Object.entries(protocolUrls)) {
    if (project.includes(key) || key.includes(project)) {
      return url;
    }
  }

  return `https://defillama.com/yields/pool/${pool.pool}`;
};

export const isDirectProtocolLink = (url: string): boolean => {
  return !url.includes('defillama.com');
};

export const getProtocolName = (pool: Pool): string => {
  const project = pool.project || 'Protocol';
  return project
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
