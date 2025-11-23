interface SwapRoute {
  provider: string;
  amountOut: string;
  fee: string;
  time: number;
  link: string;
}

interface SwapParams {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
}

interface SwapQuotes {
  params: SwapParams;
  routes: SwapRoute[];
  bestPrice: SwapRoute | null;
  fastest: SwapRoute | null;
  cheapest: SwapRoute | null;
  timestamp: string;
}

const chainMap: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  optimism: 10,
  polygon: 137,
  bsc: 56,
};

const chainNameMap: Record<string, string> = {
  ethereum: 'ETH',
  arbitrum: 'ARB',
  base: 'BASE',
  optimism: 'OPT',
  polygon: 'POL',
  bsc: 'BSC',
};

async function fetchLiFiQuote(params: SwapParams): Promise<SwapRoute | null> {
  try {
    const url = new URL('https://li.quest/v1/quote');
    url.searchParams.set('fromChain', chainMap[params.fromChain]?.toString() || '1');
    url.searchParams.set('toChain', chainMap[params.toChain]?.toString() || '42161');
    url.searchParams.set('fromToken', params.fromToken);
    url.searchParams.set('toToken', params.toToken);
    url.searchParams.set('fromAmount', params.amount);
    url.searchParams.set(
      'fromAddress',
      '0x0000000000000000000000000000000000000000'
    );

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      provider: 'LI.FI (Jumper)',
      amountOut: data.estimate?.toAmount || '0',
      fee: data.estimate?.feeCosts?.[0]?.amountUSD || '0.50',
      time: data.estimate?.executionDuration || 180,
      link: `https://jumper.exchange/?fromChain=${chainMap[params.fromChain]}&toChain=${chainMap[params.toChain]}&fromToken=${params.fromToken}&toToken=${params.toToken}`,
    };
  } catch (error) {
    console.error('LI.FI fetch error:', error);
    return null;
  }
}

async function fetchSocketQuote(params: SwapParams): Promise<SwapRoute | null> {
  try {
    const url = new URL('https://api.socket.tech/v2/quote');
    url.searchParams.set(
      'fromChainId',
      chainMap[params.fromChain]?.toString() || '1'
    );
    url.searchParams.set(
      'toChainId',
      chainMap[params.toChain]?.toString() || '42161'
    );
    url.searchParams.set('fromTokenAddress', params.fromToken);
    url.searchParams.set('toTokenAddress', params.toToken);
    url.searchParams.set('fromAmount', params.amount);
    url.searchParams.set(
      'userAddress',
      '0x0000000000000000000000000000000000000000'
    );
    url.searchParams.set('uniqueRoutesPerBridge', 'true');
    url.searchParams.set('sort', 'output');

    const response = await fetch(url.toString(), {
      headers: {
        'API-KEY': '72a5b4b0-e727-48be-8aa1-5da9d62fe635',
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const route = data.result?.routes?.[0];
    if (!route) return null;

    return {
      provider: 'Socket',
      amountOut: route.toAmount || '0',
      fee: route.totalGasFeesInUsd?.toFixed(2) || '0.50',
      time: route.serviceTime || 60,
      link: 'https://bungee.exchange',
    };
  } catch (error) {
    console.error('Socket fetch error:', error);
    return null;
  }
}

export async function fetchSwapQuotes(params: SwapParams): Promise<SwapQuotes> {
  const results = await Promise.allSettled([
    fetchLiFiQuote(params),
    fetchSocketQuote(params),
  ]);

  const routes = results
    .filter((result): result is PromiseFulfilledResult<SwapRoute> =>
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);

  const bestPrice = routes.reduce<SwapRoute | null>(
    (best, r) =>
      !best || parseFloat(r.amountOut) > parseFloat(best.amountOut) ? r : best,
    null
  );

  const fastest = routes.reduce<SwapRoute | null>(
    (best, r) => (!best || r.time < best.time ? r : best),
    null
  );

  const cheapest = routes.reduce<SwapRoute | null>(
    (best, r) => (!best || parseFloat(r.fee) < parseFloat(best.fee) ? r : best),
    null
  );

  return {
    params,
    routes,
    bestPrice,
    fastest,
    cheapest,
    timestamp: new Date().toISOString(),
  };
}

export type { SwapRoute, SwapParams, SwapQuotes };
