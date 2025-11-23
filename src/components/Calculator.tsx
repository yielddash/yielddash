import { useState } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { YieldProtocol } from '../types';

interface CalculatorProps {
  protocols: YieldProtocol[];
}

export default function Calculator({ protocols }: CalculatorProps) {
  const [amount, setAmount] = useState<string>('10000');
  const [selectedProtocol, setSelectedProtocol] = useState<string>(protocols[0]?.id || '');

  const protocol = protocols.find((p) => p.id === selectedProtocol);
  const earnings = protocol
    ? (parseFloat(amount || '0') * protocol.apy) / 100
    : 0;

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <CalculatorIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Calculate Your Earnings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
            Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-500">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
            Select Protocol
          </label>
          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            {protocols.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.apy}% APY
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
          <p className="text-sm font-semibold text-zinc-400 mb-2">
            Estimated Earnings (1 Year)
          </p>
          <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-1">
            ${earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {protocol && (
            <p className="text-sm text-zinc-400">
              at {protocol.apy}% APY on {protocol.name}
            </p>
          )}
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
          Start Earning
        </button>
      </div>
    </div>
  );
}
