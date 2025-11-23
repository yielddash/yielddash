import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import HeroSection from './components/HeroSection';
import DefiYieldTable from './components/DefiYieldTable';
import YieldCalculator from './components/YieldCalculator';
import GasOptimizer from './components/GasOptimizer';
import Bridges from './components/Bridges';
import Alerts from './components/Alerts';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { FilteredPool } from './types/defi';
import { fetchYieldPools, getCacheInfo } from './utils/defiLlama';
import { useAlertChecker } from './hooks/useAlertChecker';

type TabType = 'yields' | 'gas' | 'bridges' | 'alerts';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('yields');
  const [pools, setPools] = useState<FilteredPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPool, setSelectedPool] = useState<FilteredPool | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof window !== 'undefined' && Notification.permission === 'granted'
  );
  const [cacheInfo, setCacheInfo] = useState(getCacheInfo());

  useAlertChecker(pools);

  useEffect(() => {
    const handlePermissionChange = () => {
      setNotificationsEnabled(Notification.permission === 'granted');
    };
    if (typeof window !== 'undefined' && 'Notification' in window) {
      navigator.permissions?.query({ name: 'notifications' as PermissionName }).then((permission) => {
        permission.addEventListener('change', handlePermissionChange);
      });
    }
  }, []);

  const loadPools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchYieldPools();
      setPools(data);
      setCacheInfo(getCacheInfo());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch yield data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (isoDate: string | null) => {
    if (!isoDate) return 'Unknown';
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    if (activeTab === 'yields') {
      loadPools();
      const interval = setInterval(loadPools, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleQuickAlert = (pool: FilteredPool) => {
    if (Notification.permission !== 'granted') {
      alert('Please enable notifications in the Alerts tab first');
      setActiveTab('alerts');
      return;
    }

    const targetApy = Math.floor(pool.apy * 1.05);
    const confirmed = window.confirm(
      `Create alert for ${pool.project} on ${pool.chain}?\n\nYou'll be notified when APY goes above ${targetApy}%\n(Currently at ${pool.apy.toFixed(2)}%)`
    );

    if (confirmed) {
      const savedAlerts = localStorage.getItem('yieldAlerts');
      const alerts = savedAlerts ? JSON.parse(savedAlerts) : [];

      const newAlert = {
        id: Date.now().toString(),
        protocol: pool.project,
        chain: pool.chain,
        condition: 'above' as const,
        targetApy: targetApy,
        active: true,
        createdAt: Date.now(),
      };

      localStorage.setItem('yieldAlerts', JSON.stringify([...alerts, newAlert]));
      alert('Alert created! You will be notified when the target is reached.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <HeroSection />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <nav className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-1 bg-gray-900 p-1 rounded-lg min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('yields')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-action-manipulation ${
                  activeTab === 'yields'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                💰 Yields
              </button>
              <button
                onClick={() => setActiveTab('gas')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-action-manipulation ${
                  activeTab === 'gas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                ⛽ Gas
              </button>
              <button
                onClick={() => setActiveTab('bridges')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-action-manipulation ${
                  activeTab === 'bridges'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                🌉 Bridges
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-action-manipulation ${
                  activeTab === 'alerts'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                🔔 Alerts
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            {notificationsEnabled ? (
              <span className="flex items-center gap-1 text-green-500">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts On</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-500">
                <BellOff className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts Off</span>
              </span>
            )}
          </div>
        </div>

        {activeTab === 'yields' ? (
          loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadPools} />
          ) : (
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[65%_35%] lg:gap-6 xl:gap-8">
              <div className="space-y-4 min-w-0">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                        Top 25 Stablecoin Yields
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-zinc-400">
                        Sorted by highest APY - Click any row for details
                      </p>
                    </div>
                  </div>
                  {cacheInfo.isCached && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          cacheInfo.ageMinutes && cacheInfo.ageMinutes < 30
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span>
                        {cacheInfo.ageMinutes && cacheInfo.ageMinutes < 5
                          ? 'Fresh data'
                          : 'Cached data'}{' '}
                        • Updated {formatTimeAgo(cacheInfo.lastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
                <DefiYieldTable
                  pools={pools}
                  onSelectPool={setSelectedPool}
                  onQuickAlert={handleQuickAlert}
                />
              </div>

              <div className="min-w-0">
                <YieldCalculator pools={pools} selectedPool={selectedPool} />
              </div>
            </div>
          )
        ) : activeTab === 'gas' ? (
          <GasOptimizer />
        ) : activeTab === 'bridges' ? (
          <Bridges />
        ) : (
          <Alerts />
        )}
      </div>

      <footer className="border-t border-zinc-800 mt-8 sm:mt-12 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start md:items-center">
            <div>
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">🤝 Partnership & Sponsorship</h4>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">
                Want to partner, sponsor, or list your protocol? Let's talk!
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4">
                <a
                  href="https://x.com/Yielddash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors touch-action-manipulation"
                >
                  𝕏 @Yielddash
                </a>
                <a
                  href="mailto:yielddash@gmail.com"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors touch-action-manipulation"
                >
                  📧 yielddash@gmail.com
                </a>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-gray-500 text-xs sm:text-sm">
                ⚠️ Data for informational purposes only. DYOR before investing.
              </p>
              <p className="text-gray-600 text-xs mt-2">
                © 2025 YieldDash. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
