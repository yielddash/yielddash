interface RiskBadgeProps {
  risk: 'low' | 'medium' | 'high';
}

export default function RiskBadge({ risk }: RiskBadgeProps) {
  const config = {
    low: {
      emoji: '🟢',
      label: 'Low',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
    medium: {
      emoji: '🟡',
      label: 'Medium',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/20',
    },
    high: {
      emoji: '🔴',
      label: 'High',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
    },
  };

  const style = config[risk];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="text-base">{style.emoji}</span>
      {style.label}
    </span>
  );
}
