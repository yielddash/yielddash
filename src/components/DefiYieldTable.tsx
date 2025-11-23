import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Search, Bell } from 'lucide-react';
import { FilteredPool, SortField, SortDirection } from '../types/defi';
import { formatTVL, formatAPY, getProtocolUrl, getProtocolName, isDirectProtocolLink } from '../utils/defiLlama';
import ProtocolLogo from './ProtocolLogo';

interface DefiYieldTableProps {
  pools: FilteredPool[];
  onSelectPool?: (pool: FilteredPool) => void;
  onQuickAlert?: (pool: FilteredPool) => void;
}

export default function DefiYieldTable({ pools, onSelectPool, onQuickAlert }: DefiYieldTableProps) {
  const [sortField, setSortField] = useState<SortField>('apy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [chainFilter, setChainFilter] = useState<string>('all');
  const [minTvl, setMinTvl] = useState<number>(1_000_000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredPools = useMemo(() => {
    return pools.filter(pool => {
      const matchesChain = chainFilter === 'all' || pool.chain.toLowerCase() === chainFilter.toLowerCase();
      const matchesTvl = pool.tvlUsd >= minTvl;
      const matchesSearch = searchQuery === '' ||
        pool.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChain && matchesTvl && matchesSearch;
    });
  }, [pools, chainFilter, minTvl, searchQuery]);

  const sortedPools = [...filteredPools].sort((a, b) => {
    let aValue: string | number = a[sortField as keyof FilteredPool] as string | number;
    let bValue: string | number = b[sortField as keyof FilteredPool] as string | number;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const handleOpenApp = (pool: FilteredPool) => {
    const url = getProtocolUrl(pool);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQuickAlert = (pool: FilteredPool, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onQuickAlert) {
      onQuickAlert(pool);
    }
  };

  const uniqueChains = useMemo(() => {
    return Array.from(new Set(pools.map(p => p.chain)));
  }, [pools]);

  const stats = useMemo(() => {
    return {
      totalPools: filteredPools.length,
      maxApy: filteredPools.length > 0 ? Math.max(...filteredPools.map(p => p.apy)) : 0,
      uniqueChains: uniqueChains.length,
    };
  }, [filteredPools, uniqueChains]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Pools</div>
          <div className="text-2xl font-bold text-white">{stats.totalPools}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Highest APY</div>
          <div className="text-2xl font-bold text-green-500">{stats.maxApy.toFixed(2)}%</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Chains</div>
          <div className="text-2xl font-bold text-white">{stats.uniqueChains}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Last Updated</div>
          <div className="text-lg font-medium text-white">Just now</div>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search protocol or asset..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setChainFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            chainFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All Chains
        </button>
        {uniqueChains.map((chain) => (
          <button
            key={chain}
            onClick={() => setChainFilter(chain)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              chainFilter === chain
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {pools.find(p => p.chain === chain)?.chainIcon} {chain}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-400">Min TVL:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMinTvl(0)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              minTvl === 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMinTvl(10_000_000)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              minTvl === 10_000_000
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            $10M+
          </button>
          <button
            onClick={() => setMinTvl(50_000_000)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              minTvl === 50_000_000
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            $50M+
          </button>
          <button
            onClick={() => setMinTvl(100_000_000)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              minTvl === 100_000_000
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            $100M+
          </button>
          <button
            onClick={() => setMinTvl(500_000_000)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              minTvl === 500_000_000
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            $500M+
          </button>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="text-yellow-500 font-semibold">DYOR - Do Your Own Research</p>
          <p className="text-gray-400 text-sm">
            High APY = Higher risk. Always research protocols before depositing. This is not financial advice. Some protocols may be temporarily unavailable. Always verify the protocol is active before depositing.
          </p>
        </div>
      </div>
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <table className="w-full table-fixed lg:table-auto min-w-[600px] lg:min-w-0">
          <thead className="sticky top-0 bg-[#111111] z-10">
            <tr className="border-b border-zinc-800">
              <th className="px-2 py-3 text-left w-32 lg:w-auto">
                <button
                  onClick={() => handleSort('project')}
                  className={`flex items-center gap-1 text-xs lg:text-sm font-semibold transition-colors ${
                    sortField === 'project' ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Protocol
                  <SortIcon field="project" />
                </button>
              </th>
              <th className="px-2 py-3 text-left w-24 lg:w-auto">
                <button
                  onClick={() => handleSort('chain')}
                  className={`flex items-center gap-1 text-xs lg:text-sm font-semibold transition-colors ${
                    sortField === 'chain' ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Chain
                  <SortIcon field="chain" />
                </button>
              </th>
              <th className="px-2 py-3 text-left w-24 lg:w-auto">
                <span className="text-xs lg:text-sm font-semibold text-zinc-400">Asset</span>
              </th>
              <th className="px-2 py-3 text-left w-20 lg:w-auto">
                <button
                  onClick={() => handleSort('apy')}
                  className={`flex items-center gap-1 text-xs lg:text-sm font-semibold transition-colors ${
                    sortField === 'apy' ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  APY
                  <SortIcon field="apy" />
                </button>
              </th>
              <th className="px-2 py-3 text-left w-20 lg:w-auto">
                <button
                  onClick={() => handleSort('tvlUsd')}
                  className={`flex items-center gap-1 text-xs lg:text-sm font-semibold transition-colors ${
                    sortField === 'tvlUsd' ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  TVL
                  <SortIcon field="tvlUsd" />
                </button>
              </th>
              <th className="px-2 py-3 w-24 lg:w-auto"></th>
            </tr>
          </thead>
          <tbody>
            {sortedPools.map((pool) => (
              <tr
                key={pool.pool}
                className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => onSelectPool?.(pool)}
              >
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <ProtocolLogo project={pool.project} size="sm" />
                    <span className="text-xs lg:text-sm font-semibold text-white truncate" title={pool.project.toUpperCase()}>
                      {pool.project.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-base lg:text-lg">{pool.chainIcon}</span>
                    <span className="text-xs text-zinc-300 capitalize hidden lg:inline">{pool.chain}</span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-zinc-800 text-zinc-300 font-medium text-xs">
                    {pool.symbol}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span
                    className="text-base lg:text-xl font-bold"
                    style={{ color: pool.apyColor }}
                  >
                    {formatAPY(pool.apy)}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="text-xs lg:text-sm font-medium text-zinc-300">
                    {formatTVL(pool.tvlUsd)}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const url = getProtocolUrl(pool);
                      const isDirect = isDirectProtocolLink(url);
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenApp(pool);
                          }}
                          title="Opens protocol website - verify it's active before using"
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                            isDirect
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                              : 'bg-transparent border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white'
                          }`}
                        >
                          {isDirect ? 'Open App' : 'View Details'}
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      );
                    })()}
                    {onQuickAlert && (
                      <button
                        onClick={(e) => handleQuickAlert(pool, e)}
                        className="text-gray-500 hover:text-yellow-500 transition-colors p-2"
                        title="Create alert for this pool"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
