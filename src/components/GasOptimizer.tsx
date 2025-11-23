import { useState, useEffect } from 'react';
import { fetchGasData, GasData } from '../utils/gasPrice';

export default function GasOptimizer() {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadGasData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGasData();
      setGasData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGasData();
    const interval = setInterval(loadGasData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const formatTimeAgo = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMins = Math.floor(diffSec / 60);
    return `${diffMins}m ago`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'low') return 'green';
    if (status === 'medium') return 'yellow';
    return 'red';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'low') return 'Low';
    if (status === 'medium') return 'Medium';
    return 'High';
  };

  const chainInfo = [
    { key: 'ethereum', name: 'Ethereum', icon: 'Ξ' },
    { key: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
    { key: 'base', name: 'Base', icon: '🔵' },
    { key: 'optimism', name: 'Optimism', icon: '🔴' },
    { key: 'bsc', name: 'BSC', icon: '💛' },
    { key: 'polygon', name: 'Polygon', icon: '🟣' },
    { key: 'solana', name: 'Solana', icon: '⚡' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
            Gas Optimizer
          </h2>
          <p className="text-sm lg:text-base text-zinc-400">
            Real-time gas prices across major chains
          </p>
        </div>

        {gasData && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>
              Live • Updated {formatTimeAgo(gasData.timestamp)}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            Failed to load gas data. Please try again.
          </p>
        </div>
      )}

      {isLoading && !gasData ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-gray-400">Loading gas prices...</p>
        </div>
      ) : gasData ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chainInfo.map((chain) => {
              const chainData = gasData.chains[chain.key];
              if (!chainData) return null;

              const statusColor = getStatusColor(chainData.status);
              const statusLabel = getStatusLabel(chainData.status);

              return (
                <div
                  key={chain.key}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{chain.icon}</span>
                    <span className="font-medium text-sm text-white">{chain.name}</span>
                  </div>
                  {chainData.gwei !== undefined ? (
                    <>
                      <div
                        className={`text-2xl font-bold ${
                          statusColor === 'green'
                            ? 'text-green-500'
                            : statusColor === 'yellow'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}
                      >
                        {chainData.gwei.toFixed(3)} gwei
                      </div>
                      <div className="text-sm text-gray-300">
                        ~${chainData.usdPerSwap} per swap
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-green-500">
                        ${chainData.usdPerSwap}
                      </div>
                      <div className="text-sm text-gray-300">per swap</div>
                    </>
                  )}
                  <div
                    className={`mt-2 text-xs px-2 py-1 rounded inline-block ${
                      statusColor === 'green'
                        ? 'bg-green-500/20 text-green-500'
                        : statusColor === 'yellow'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {statusLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🕐</span> Best Times to Transact (UTC)
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500 text-xl">🌙</span>
                  <span className="font-medium text-green-500">Cheapest Gas</span>
                </div>
                <p className="text-2xl font-bold text-white">02:00 - 06:00 UTC</p>
                <p className="text-sm text-gray-400 mt-1">
                  Weekends are 30-50% cheaper than weekdays
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500 text-xl">🌞</span>
                  <span className="font-medium text-red-500">Peak Gas (Avoid)</span>
                </div>
                <p className="text-2xl font-bold text-white">14:00 - 18:00 UTC</p>
                <p className="text-sm text-gray-400 mt-1">
                  US + Europe overlap = highest activity
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">💡 Gas Saving Tips</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">1.</span>
                <p className="text-gray-300 text-sm">
                  <strong>Use L2 networks</strong> - Arbitrum, Base, Optimism have
                  10-100x lower fees than Ethereum mainnet
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">2.</span>
                <p className="text-gray-300 text-sm">
                  <strong>Transact on weekends</strong> - Gas prices drop 30-50% on
                  Saturday/Sunday
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">3.</span>
                <p className="text-gray-300 text-sm">
                  <strong>Batch transactions</strong> - Some protocols let you
                  deposit + stake in one transaction
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">4.</span>
                <p className="text-gray-300 text-sm">
                  <strong>Set gas limits</strong> - Use "slow" gas option if you're
                  not in a hurry
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            Current time: {currentTime.toUTCString()} | Gas prices update every 30
            seconds
          </div>
        </>
      ) : null}
    </div>
  );
}
