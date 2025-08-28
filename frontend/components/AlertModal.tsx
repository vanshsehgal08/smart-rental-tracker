'use client';

import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Alert } from '@/services/api';
import { formatDateTime, getSeverityColor } from '@/lib/utils';

interface AlertModalProps {
  alert: Alert;
  onClose: () => void;
  onResolve?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ alert, onClose, onResolve }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-danger-500" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6 text-warning-500" />;
      case 'low':
        return <Info className="w-6 h-6 text-info-500" />;
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getSeverityIcon(alert.severity)}
            <h2 className="text-xl font-semibold text-gray-900">Alert Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Alert Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Alert Type</label>
                    <p className="text-sm text-gray-900">{alert.alert_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Severity</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Equipment ID</label>
                    <p className="text-sm text-gray-900">{alert.equipment_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.is_resolved 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {alert.is_resolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message and Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Message</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {alert.message}
                </p>
              </div>
              
              {alert.is_resolved && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Resolution Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Resolved By</label>
                      <p className="text-sm text-gray-900">{alert.resolved_by}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Resolved At</label>
                      <p className="text-sm text-gray-900">{formatDateTime(alert.resolved_at!)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDateTime(alert.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDateTime(alert.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
              {!alert.is_resolved && onResolve && (
                <button
                  onClick={onResolve}
                  className="btn btn-success"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve Alert
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
