import { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2 } from 'lucide-react';
import { Alert, AlertFormData } from '../types/alerts';

interface AlertsProps {
  onQuickAlert?: (protocol: string, chain: string, currentApy: number) => void;
}

export default function Alerts({ onQuickAlert }: AlertsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof window !== 'undefined' && Notification.permission === 'granted'
  );
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yieldAlerts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState<AlertFormData>({
    protocol: '',
    chain: '',
    condition: 'above',
    targetApy: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yieldAlerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Alerts Enabled! 🔔', {
          body: 'You will now receive yield alerts',
        });
      }
    }
  };

  const createAlert = () => {
    if (!formData.targetApy || parseFloat(formData.targetApy) <= 0) {
      alert('Please enter a valid target APY');
      return;
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      protocol: formData.protocol,
      chain: formData.chain,
      condition: formData.condition,
      targetApy: parseFloat(formData.targetApy),
      active: true,
      createdAt: Date.now(),
    };

    setAlerts([...alerts, newAlert]);
    setFormData({
      protocol: '',
      chain: '',
      condition: 'above',
      targetApy: '',
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const protocols = [
    'Aave',
    'Compound',
    'Curve',
    'Morpho',
    'Maple',
    'Pendle',
    'Yearn',
    'Convex',
  ];

  const chains = ['Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'BSC'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
          APY Alerts
        </h2>
        <p className="text-sm lg:text-base text-zinc-400">
          Get notified when yields hit your targets
        </p>
      </div>

      {!notificationsEnabled && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-1 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Enable Browser Notifications
              </h3>
              <p className="text-gray-400 text-sm">
                Get notified when yields reach your target APY
              </p>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Enable Alerts
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>➕</span> Create New Alert
        </h3>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Protocol
            </label>
            <select
              value={formData.protocol}
              onChange={(e) =>
                setFormData({ ...formData, protocol: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Protocol</option>
              {protocols.map((protocol) => (
                <option key={protocol} value={protocol}>
                  {protocol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Chain</label>
            <select
              value={formData.chain}
              onChange={(e) =>
                setFormData({ ...formData, chain: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Chain</option>
              {chains.map((chain) => (
                <option key={chain} value={chain}>
                  {chain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              When APY
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: e.target.value as 'above' | 'below',
                })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="above">Goes above</option>
              <option value="below">Goes below</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Target APY %
            </label>
            <input
              type="number"
              placeholder="e.g., 10"
              value={formData.targetApy}
              onChange={(e) =>
                setFormData({ ...formData, targetApy: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={createAlert}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Create Alert
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📋</span> Your Active Alerts ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No alerts yet. Create your first alert above!
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between bg-gray-800 rounded-lg p-4 flex-wrap gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    {alert.active ? (
                      <Bell className="w-5 h-5 text-white" />
                    ) : (
                      <BellOff className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {alert.protocol || 'Any Protocol'} on{' '}
                      {alert.chain || 'Any Chain'}
                    </p>
                    <p className="text-sm text-gray-400">
                      Alert when APY {alert.condition} {alert.targetApy}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                      alert.active
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-500 text-sm">
          💡 <strong>Pro Tip:</strong> Alerts check your conditions every time
          yield data refreshes. You can create alerts for specific protocols or
          set general conditions for any protocol on a chain.
        </p>
      </div>
    </div>
  );
}
