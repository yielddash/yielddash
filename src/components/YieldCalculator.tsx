import { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, TrendingUp } from 'lucide-react';
import { FilteredPool } from '../types/defi';
import { formatAPY, getProtocolUrl, getProtocolName } from '../utils/defiLlama';
import ProtocolLogo from './ProtocolLogo';

interface YieldCalculatorProps {
  pools: FilteredPool[];
  selectedPool?: FilteredPool;
}

export default function YieldCalculator({ pools, selectedPool }: YieldCalculatorProps) {
  const [amount, setAmount] = useState<string>('10000');
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    if (selectedPool) {
      setSelected(selectedPool.pool);
    } else if (pools.length > 0 && !selected) {
      setSelected(pools[0].pool);
    }
  }, [selectedPool, pools, selected]);

  const pool = pools.find((p) => p.pool === selected) || pools[0];
  const principal = parseFloat(amount || '0');
  const dailyEarnings = pool ? (principal * pool.apy) / 100 / 365 : 0;
  const monthlyEarnings = dailyEarnings * 30;
  const yearlyEarnings = pool ? (principal * pool.apy) / 100 : 0;

  return (
    <div className="bg-gradient-to-br from-[#111111] to-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <CalculatorIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Yield Calculator</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
            Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-zinc-500">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 lg:py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-lg sm:text-xl lg:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
            Select Protocol
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer touch-action-manipulation"
          >
            {pools.map((p) => (
              <option key={p.pool} value={p.pool}>
                {p.project.toUpperCase()} - {formatAPY(p.apy)} on {p.chain}
              </option>
            ))}
          </select>
        </div>

        {pool && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl">
              <ProtocolLogo project={pool.project} size="sm" />
              <div>
                <div className="text-sm text-zinc-400">Selected Pool</div>
                <div className="text-white font-semibold">
                  {pool.project.toUpperCase()} {pool.symbol}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                Estimated Earnings
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Daily</span>
                  <span className="text-white font-bold text-lg">
                    ${dailyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Monthly</span>
                  <span className="text-white font-bold text-lg">
                    ${monthlyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-500/20">
                  <span className="text-zinc-300 font-semibold">Yearly</span>
                  <span className="text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                    ${yearlyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 text-center pt-2">
                at {formatAPY(pool.apy)} APY
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (pool) {
              const url = getProtocolUrl(pool);
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }}
          title={pool ? `Opens ${getProtocolName(pool)} in new tab` : undefined}
          className="w-full py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base lg:text-lg font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          Open App →
        </button>

        <p className="text-gray-500 text-xs text-center mt-3">
          ⚠️ Always verify APY on the protocol's official website before depositing.
        </p>

        <div className="text-xs text-zinc-500 text-center leading-relaxed">
          Calculations are estimates. Actual yields may vary. Always DYOR before investing.
        </div>
      </div>
    </div>
  );
}
