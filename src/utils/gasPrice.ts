interface GasData {
  timestamp: string;
  chains: {
    [key: string]: {
      gwei?: number;
      usdPerSwap: string;
      status: 'low' | 'medium' | 'high';
    };
  };
}

const ETH_PRICE = 3500;
const BNB_PRICE = 600;
const SWAP_GAS_UNITS = 150000;

async function fetchBscGas(): Promise<number> {
  const rpcs = [
    'https://bsc-dataseed.binance.org/',
    'https://bsc.rpc.blxrbdn.com',
    'https://rpc.ankr.com/bsc',
  ];

  for (const rpc of rpcs) {
    try {
      console.log(`Trying BSC RPC: ${rpc}`);
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1,
        }),
      });

      console.log(`Response status from BSC ${rpc}:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`Data from BSC ${rpc}:`, data);

        if (data.result) {
          const gweiPrice = parseInt(data.result, 16) / 1e9;
          if (gweiPrice > 0 && gweiPrice < 10000) {
            console.log(`Success! Got ${gweiPrice} gwei from BSC ${rpc}`);
            return Number(gweiPrice.toFixed(3));
          }
        } else {
          console.warn(`No result in response from BSC ${rpc}`, data);
        }
      } else {
        console.warn(`Non-OK response from BSC ${rpc}:`, response.status);
      }
    } catch (error) {
      console.error(`Failed to fetch from BSC ${rpc}:`, error);
      continue;
    }
  }

  console.warn('All BSC RPCs failed, using fallback of 3 gwei');
  return 3;
}

async function fetchEthGas(): Promise<number> {
  const rpcs = [
    'https://eth.llamarpc.com',
    'https://rpc.ankr.com/eth',
    'https://ethereum.publicnode.com',
  ];

  for (const rpc of rpcs) {
    try {
      console.log(`Trying RPC: ${rpc}`);
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1,
        }),
      });

      console.log(`Response status from ${rpc}:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`Data from ${rpc}:`, data);

        if (data.result) {
          const gweiPrice = parseInt(data.result, 16) / 1e9;
          if (gweiPrice > 0 && gweiPrice < 10000) {
            console.log(`Success! Got ${gweiPrice} gwei from ${rpc}`);
            return Number(gweiPrice.toFixed(3));
          }
        } else {
          console.warn(`No result in response from ${rpc}`, data);
        }
      } else {
        console.warn(`Non-OK response from ${rpc}:`, response.status);
      }
    } catch (error) {
      console.error(`Failed to fetch from ${rpc}:`, error);
      continue;
    }
  }

  console.warn('All RPCs failed, using fallback of 18 gwei');
  return 18;
}

export async function fetchGasData(): Promise<GasData> {
  const [ethGas, bscGas] = await Promise.all([
    fetchEthGas(),
    fetchBscGas()
  ]);

  const ethCost = (ethGas * SWAP_GAS_UNITS) / 1e9;
  const ethUsdCost = ethCost * ETH_PRICE;

  const bscCost = (bscGas * SWAP_GAS_UNITS) / 1e9;
  const bscUsdCost = bscCost * BNB_PRICE;

  return {
    timestamp: new Date().toISOString(),
    chains: {
      ethereum: {
        gwei: ethGas,
        usdPerSwap: ethUsdCost.toFixed(2),
        status: ethGas < 20 ? 'low' : ethGas < 50 ? 'medium' : 'high',
      },
      arbitrum: {
        usdPerSwap: '0.10',
        status: 'low',
      },
      base: {
        usdPerSwap: '0.05',
        status: 'low',
      },
      optimism: {
        usdPerSwap: '0.08',
        status: 'low',
      },
      bsc: {
        gwei: bscGas,
        usdPerSwap: bscUsdCost.toFixed(2),
        status: bscGas < 5 ? 'low' : bscGas < 10 ? 'medium' : 'high',
      },
      polygon: {
        usdPerSwap: '0.02',
        status: 'low',
      },
      solana: {
        usdPerSwap: '0.001',
        status: 'low',
      },
    },
  };
}

export type { GasData };
