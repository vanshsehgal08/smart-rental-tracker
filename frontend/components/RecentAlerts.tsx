'use client';

import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Alert } from '@/services/api';
import { formatDateTime, getSeverityColor } from '@/lib/utils';

interface RecentAlertsProps {
  alerts: Alert[];
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-danger-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-warning-500" />;
      case 'low':
        return <Info className="w-4 h-4 text-info-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No active alerts</p>
        <p className="text-sm">All systems are running smoothly</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.slice(0, 5).map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start space-x-3 p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex-shrink-0 mt-1">
            {getSeverityIcon(alert.severity)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {alert.alert_type}
              </p>
              <span className="text-xs text-gray-500">
                {formatDateTime(alert.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {alert.message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                Equipment ID: {alert.equipment_id}
              </span>
              {alert.is_resolved && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Resolved
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {alerts.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing 5 of {alerts.length} alerts
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
