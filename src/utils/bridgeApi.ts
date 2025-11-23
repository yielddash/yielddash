const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  optimism: 10,
  polygon: 137,
  bsc: 56
};

const TOKEN_ADDRESSES: Record<string, Record<number, string>> = {
  USDC: {
    1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
  },
  USDT: {
    1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    56: '0x55d398326f99059fF775485246999027B3197955'
  }
};

export interface BridgeQuote {
  aggregator: string;
  bridgeName: string;
  estimatedOutput: string;
  fee: string;
  estimatedTime: string;
  gasCost: string;
  link: string;
}

export async function fetchLiFiQuote(fromChain: string, toChain: string, token: string, amount: string): Promise<BridgeQuote | null> {
  try {
    const fromChainId = CHAIN_IDS[fromChain.toLowerCase()];
    const toChainId = CHAIN_IDS[toChain.toLowerCase()];
    const fromToken = TOKEN_ADDRESSES[token][fromChainId];
    const toToken = TOKEN_ADDRESSES[token][toChainId];
    const amountWei = (parseFloat(amount) * 1e6).toString();

    const params = new URLSearchParams({
      fromChain: fromChainId.toString(),
      toChain: toChainId.toString(),
      fromToken,
      toToken,
      fromAmount: amountWei,
      fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
      slippage: '0.03'
    });

    console.log('LI.FI request:', `https://li.quest/v1/quote?${params}`);
    const response = await fetch(`https://li.quest/v1/quote?${params}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LI.FI API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('LI.FI response:', data);

    if (!data.estimate) return null;

    const rawOutput = data.estimate.toAmount;
    const outputAmount = parseFloat(rawOutput) / 1e6;
    const inputAmount = parseFloat(amount);

    console.log('LI.FI amounts:', {
      rawOutput,
      outputAmount,
      inputAmount,
      outputFormatted: outputAmount.toFixed(2)
    });

    if (outputAmount > inputAmount * 1000) {
      console.warn('LI.FI output amount seems too large, might be wrong decimals');
      return null;
    }

    const feeAmount = inputAmount - outputAmount;
    const gasCostUSD = data.estimate.gasCosts?.[0]?.amountUSD
      ? parseFloat(data.estimate.gasCosts[0].amountUSD).toFixed(2)
      : '0.50';

    return {
      aggregator: 'LI.FI',
      bridgeName: data.toolDetails?.name || 'LI.FI',
      estimatedOutput: outputAmount.toFixed(2),
      fee: feeAmount > 0 ? feeAmount.toFixed(2) : '0.00',
      estimatedTime: `${Math.round((data.estimate.executionDuration || 120) / 60)} min`,
      gasCost: gasCostUSD,
      link: 'https://jumper.exchange'
    };
  } catch (error) {
    console.error('LI.FI error:', error);
    return null;
  }
}

export async function fetchSocketQuote(fromChain: string, toChain: string, token: string, amount: string): Promise<BridgeQuote | null> {
  try {
    const fromChainId = CHAIN_IDS[fromChain.toLowerCase()];
    const toChainId = CHAIN_IDS[toChain.toLowerCase()];
    const fromToken = TOKEN_ADDRESSES[token][fromChainId];
    const toToken = TOKEN_ADDRESSES[token][toChainId];
    const amountWei = (parseFloat(amount) * 1e6).toString();

    const params = new URLSearchParams({
      fromChainId: fromChainId.toString(),
      toChainId: toChainId.toString(),
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      fromAmount: amountWei,
      userAddress: '0x0000000000000000000000000000000000000000',
      singleTxOnly: 'true',
      sort: 'output'
    });

    const response = await fetch(`https://api.socket.tech/v2/quote?${params}`, {
      headers: { 'API-KEY': '72a5b4b0-e727-48be-8aa1-5da9d62fe635' }
    });
    if (!response.ok) return null;

    const data = await response.json();
    console.log('Socket response:', data);

    if (!data.result?.routes?.[0]) return null;

    const route = data.result.routes[0];
    const rawOutput = route.toAmount;
    const outputAmount = parseFloat(rawOutput) / 1e6;
    const inputAmount = parseFloat(amount);

    console.log('Socket amounts:', {
      rawOutput,
      outputAmount,
      inputAmount,
      outputFormatted: outputAmount.toFixed(2)
    });

    if (outputAmount > inputAmount * 1000) {
      console.warn('Socket output amount seems too large, might be wrong decimals');
      return null;
    }

    const feeAmount = inputAmount - outputAmount;
    const gasCostUSD = route.totalGasFeesInUsd
      ? parseFloat(route.totalGasFeesInUsd.toString()).toFixed(2)
      : '0.50';

    return {
      aggregator: 'Socket',
      bridgeName: route.usedBridgeNames?.[0] || 'Socket',
      estimatedOutput: outputAmount.toFixed(2),
      fee: feeAmount > 0 ? feeAmount.toFixed(2) : '0.00',
      estimatedTime: `${Math.round((route.serviceTime || 120) / 60)} min`,
      gasCost: gasCostUSD,
      link: 'https://bungee.exchange'
    };
  } catch (error) {
    console.error('Socket error:', error);
    return null;
  }
}

export async function fetchAllQuotes(fromChain: string, toChain: string, token: string, amount: string): Promise<BridgeQuote[]> {
  const [lifiQuote, socketQuote] = await Promise.all([
    fetchLiFiQuote(fromChain, toChain, token, amount),
    fetchSocketQuote(fromChain, toChain, token, amount)
  ]);

  const quotes: BridgeQuote[] = [];
  if (lifiQuote) quotes.push(lifiQuote);
  if (socketQuote) quotes.push(socketQuote);

  return quotes.sort((a, b) => parseFloat(b.estimatedOutput) - parseFloat(a.estimatedOutput));
}
