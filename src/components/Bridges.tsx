import { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { fetchAllQuotes, BridgeQuote } from '../utils/bridgeApi';

export default function Bridges() {
  const [fromChain, setFromChain] = useState('ethereum');
  const [toChain, setToChain] = useState('arbitrum');
  const [amount, setAmount] = useState('1000');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [quotes, setQuotes] = useState<BridgeQuote[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const chains = ['Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'BSC'];

  const handleFindRoutes = async () => {
    if (fromChain === toChain) {
      setError('Please select different chains');
      return;
    }

    setHasSearched(true);
    setIsSearching(true);
    setError(null);
    setQuotes([]);

    try {
      console.log('Fetching quotes for:', { fromChain, toChain, selectedToken, amount });
      const results = await fetchAllQuotes(fromChain, toChain, selectedToken, amount);
      console.log('Quotes received:', results);
      setQuotes(results);
      if (results.length === 0) {
        setError('No routes found. Try different amount or route.');
      }
    } catch (err) {
      setError('Failed to fetch quotes. Please try again.');
      console.error('Bridge quotes error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
          Cross-Chain Bridges & Swaps
        </h2>
        <p className="text-sm lg:text-base text-zinc-400">
          Compare routes and find the best deals for cross-chain transfers
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🔄</span> Find Best Bridge Route
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm text-gray-400 mb-1 block">Token</label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm text-gray-400 mb-1 block">From</label>
            <select
              value={fromChain}
              onChange={(e) => setFromChain(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
            >
              <option value="ethereum">Ethereum</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="base">Base</option>
              <option value="optimism">Optimism</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
            </select>
          </div>

          <div className="hidden lg:flex items-end justify-center pb-3">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm text-gray-400 mb-1 block">To</label>
            <select
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
            >
              <option value="arbitrum">Arbitrum</option>
              <option value="base">Base</option>
              <option value="ethereum">Ethereum</option>
              <option value="optimism">Optimism</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm text-gray-400 mb-1 block">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1000"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1 lg:flex lg:items-end">
            <button
              onClick={handleFindRoutes}
              disabled={isSearching}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white p-2.5 sm:p-3 rounded-lg text-sm sm:text-base font-medium transition-colors touch-action-manipulation"
            >
              {isSearching ? 'Searching...' : 'Find Routes'}
            </button>
          </div>
        </div>

        {error && hasSearched && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isSearching && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-zinc-400">Finding best routes...</p>
          </div>
        )}

        {!isSearching && quotes.length === 0 && hasSearched && !error && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
            <p className="text-zinc-400">No routes found. Try a different amount or route.</p>
          </div>
        )}
      </div>

      {quotes.length > 0 && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            🔍 Found {quotes.length} routes
          </h3>
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className={`bg-zinc-800 rounded-lg p-4 border ${
                  index === 0 ? 'border-green-500' : 'border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{quote.aggregator}</span>
                    <span className="text-zinc-400 text-sm">via {quote.bridgeName}</span>
                    {index === 0 && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                        Best Price
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-zinc-400 block">You receive</span>
                    <p className="text-white font-bold text-sm sm:text-base">{quote.estimatedOutput} {selectedToken}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Fee</span>
                    <p className="text-yellow-400 text-sm sm:text-base">${quote.fee}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Time</span>
                    <p className="text-white text-sm sm:text-base">{quote.estimatedTime}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Gas</span>
                    <p className="text-white text-sm sm:text-base">${quote.gasCost}</p>
                  </div>
                </div>
                <a
                  href={quote.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors touch-action-manipulation"
                >
                  Bridge with {quote.aggregator} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Popular Bridge Aggregators</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <a
            href="https://jumper.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">🦘</div>
            <div className="font-medium text-white text-sm">Jumper</div>
            <div className="text-xs text-gray-400">Best aggregator</div>
          </a>

          <a
            href="https://www.orbiter.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">🛸</div>
            <div className="font-medium text-white text-sm">Orbiter</div>
            <div className="text-xs text-gray-400">Cheapest L2↔L2</div>
          </a>

          <a
            href="https://stargate.finance/transfer"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">⭐</div>
            <div className="font-medium text-white text-sm">Stargate</div>
            <div className="text-xs text-gray-400">Most liquidity</div>
          </a>

          <a
            href="https://across.to/bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">🌊</div>
            <div className="font-medium text-white text-sm">Across</div>
            <div className="text-xs text-gray-400">Fast & cheap</div>
          </a>

          <a
            href="https://app.hop.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">🐰</div>
            <div className="font-medium text-white text-sm">Hop</div>
            <div className="text-xs text-gray-400">Reliable</div>
          </a>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-500 text-sm">
          ⚠️ Bridge fees change constantly based on liquidity and network conditions.
          Always verify current fees on the bridge website before transacting.
          Data shown is approximate and updated weekly.
        </p>
      </div>
    </div>
  );
}
