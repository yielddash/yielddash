import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { YieldProtocol, SortField, SortDirection } from '../types';
import RiskBadge from './RiskBadge';

interface YieldTableProps {
  protocols: YieldProtocol[];
}

export default function YieldTable({ protocols }: YieldTableProps) {
  const [sortField, setSortField] = useState<SortField>('apy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProtocols = [...protocols].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'tvl') {
      const parseTV = (tvl: string) => {
        const num = parseFloat(tvl.replace(/[$BM]/g, ''));
        return tvl.includes('B') ? num * 1000 : num;
      };
      aValue = parseTV(a.tvl);
      bValue = parseTV(b.tvl);
    }

    if (sortField === 'risk') {
      const riskOrder = { low: 1, medium: 2, high: 3 };
      aValue = riskOrder[a.risk];
      bValue = riskOrder[b.risk];
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

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Protocol
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('apy')}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  APY
                  <SortIcon field="apy" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('risk')}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Risk
                  <SortIcon field="risk" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('tvl')}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  TVL
                  <SortIcon field="tvl" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('asset')}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Asset
                  <SortIcon field="asset" />
                </button>
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {sortedProtocols.map((protocol) => (
              <tr
                key={protocol.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {protocol.logo}
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {protocol.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-2xl font-bold text-green-400">
                    {protocol.apy}%
                  </span>
                </td>
                <td className="px-6 py-5">
                  <RiskBadge risk={protocol.risk} />
                </td>
                <td className="px-6 py-5">
                  <span className="text-lg font-medium text-zinc-300">
                    {protocol.tvl}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-medium">
                    {protocol.asset}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                    View
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
