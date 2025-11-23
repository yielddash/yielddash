interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="bg-gradient-to-b from-blue-600 to-purple-700 py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-yellow-500/20 text-yellow-500 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-full mb-4 sm:mb-6">
            Free & Open Access
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 px-2">
            Find the Best
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              DeFi Yields
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Compare yields, gas prices, and bridge fees across all major chains.
            All in one simple dashboard.
          </p>

          <button
            onClick={onEnterApp}
            className="bg-white text-blue-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 text-base sm:text-lg shadow-lg touch-action-manipulation"
          >
            Launch Dashboard
          </button>
        </div>
      </div>

      <div className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12 px-2">
            Everything you need for DeFi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💰</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Yield Comparison
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Compare APYs across 50+ protocols and 10+ chains. Find the best
                yields instantly with real-time data.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⛽</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Gas Optimizer
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Real-time gas prices across all chains. Know the cheapest time to
                transact and save money on fees.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🌉</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Bridge Aggregator
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Compare routes from multiple providers. Find the best price,
                fastest route, or lowest fees for cross-chain swaps.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-2">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-400 text-lg">Dashboard Preview</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Real-time data • Clean interface • Easy to use
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-6">Supported Chains</p>
          <div className="flex flex-wrap justify-center gap-6 text-3xl">
            <span title="Ethereum" className="hover:scale-110 transition-transform">
              Ξ
            </span>
            <span
              title="Arbitrum"
              className="hover:scale-110 transition-transform"
            >
              🔷
            </span>
            <span title="Base" className="hover:scale-110 transition-transform">
              🔵
            </span>
            <span
              title="Optimism"
              className="hover:scale-110 transition-transform"
            >
              🔴
            </span>
            <span
              title="Polygon"
              className="hover:scale-110 transition-transform"
            >
              🟣
            </span>
            <span title="BSC" className="hover:scale-110 transition-transform">
              💛
            </span>
            <span title="Solana" className="hover:scale-110 transition-transform">
              ⚡
            </span>
            <span
              title="Avalanche"
              className="hover:scale-110 transition-transform"
            >
              🔺
            </span>
          </div>
        </div>
      </div>

      <div className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
            Ready to maximize your DeFi returns?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 px-4">
            Start comparing yields and finding the best opportunities today.
          </p>
          <button
            onClick={onEnterApp}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all hover:scale-105 touch-action-manipulation"
          >
            Launch Dashboard
          </button>
        </div>
      </div>

      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 DeFi Yields. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Discord
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
