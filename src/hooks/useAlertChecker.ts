import { useEffect, useRef } from 'react';
import { FilteredPool } from '../types/defi';
import { Alert } from '../types/alerts';

export function useAlertChecker(pools: FilteredPool[]) {
  const notifiedAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (pools.length === 0) return;
    if (typeof window === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    const savedAlerts = localStorage.getItem('yieldAlerts');
    if (!savedAlerts) return;

    const alerts: Alert[] = JSON.parse(savedAlerts);
    const activeAlerts = alerts.filter((alert) => alert.active);

    activeAlerts.forEach((alert) => {
      const matchingPools = pools.filter((pool) => {
        const matchProtocol =
          !alert.protocol ||
          pool.project.toLowerCase().includes(alert.protocol.toLowerCase());
        const matchChain = !alert.chain || pool.chain === alert.chain;
        return matchProtocol && matchChain;
      });

      matchingPools.forEach((pool) => {
        const triggered =
          alert.condition === 'above'
            ? pool.apy > alert.targetApy
            : pool.apy < alert.targetApy;

        const alertKey = `${alert.id}-${pool.pool}`;

        if (triggered && !notifiedAlertsRef.current.has(alertKey)) {
          notifiedAlertsRef.current.add(alertKey);

          new Notification(`🔔 APY Alert: ${pool.project}`, {
            body: `${pool.symbol} on ${pool.chain}: ${pool.apy.toFixed(2)}% APY (target: ${alert.condition} ${alert.targetApy}%)`,
            icon: '/favicon.ico',
            tag: alertKey,
          });

          setTimeout(() => {
            notifiedAlertsRef.current.delete(alertKey);
          }, 60000);
        }
      });
    });
  }, [pools]);
}
