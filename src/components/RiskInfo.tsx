import { Shield } from 'lucide-react';

export default function RiskInfo() {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
          <Shield className="w-6 h-6 text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Risk Levels Explained</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
          <span className="text-3xl">🟢</span>
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-1">Low Risk</h3>
            <p className="text-zinc-400 leading-relaxed">
              Major protocols with proven track records, extensive audits, and TVL over $1B.
              These are considered the safest options in DeFi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
          <span className="text-3xl">🟡</span>
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Medium Risk</h3>
            <p className="text-zinc-400 leading-relaxed">
              Established protocols with good reputation but smaller TVL under $1B.
              Audited but with shorter track records.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
          <span className="text-3xl">🔴</span>
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-1">High Risk</h3>
            <p className="text-zinc-400 leading-relaxed">
              New or unaudited protocols with limited history. Higher yields come with
              significantly increased risk. Only invest what you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
