export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 py-8 sm:py-12 lg:py-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          YieldDash
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
            DEMO
          </span>
          <span className="block text-blue-200 mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl">Find the Best DeFi Yields in Seconds</span>
        </h1>
        <p className="text-blue-100 text-center mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl px-4">
          Real-time stablecoin yields across all major chains
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-blue-200 text-xs sm:text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live data updated every 30 seconds</span>
        </div>
      </div>
    </div>
  );
}
