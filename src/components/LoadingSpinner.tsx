export default function LoadingSpinner() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-gray-800 rounded w-full"></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-zinc-400 text-lg font-medium">Loading yields...</div>
        <div className="text-zinc-500 text-sm">This may take a few seconds</div>
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/3"></div>
              </div>
              <div className="h-8 w-20 bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
