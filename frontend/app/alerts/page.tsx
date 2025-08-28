'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, AlertTriangle, Info, Eye, X } from 'lucide-react';
import { alertAPI, Alert } from '@/services/api';
import { formatDateTime, getSeverityColor } from '@/lib/utils';
import AlertModal from '@/components/AlertModal';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [viewingAlert, setViewingAlert] = useState<Alert | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertAPI.getAll();
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      await alertAPI.resolve(alertId, 'System User'); // In a real app, this would be the current user
      fetchAlerts(); // Refresh the list
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.equipment_id.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'resolved' ? alert.is_resolved : !alert.is_resolved);
    const matchesSeverity = !severityFilter || alert.severity.toLowerCase() === severityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-info-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
        <p className="mt-2 text-gray-600">
          Monitor and manage system alerts and notifications
        </p>
      </div>

      {/* Filters and Search */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search alerts by type, message, or equipment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="select"
            >
              <option value="">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setSeverityFilter('');
              }}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`card p-6 border-l-4 ${
              alert.is_resolved 
                ? 'border-gray-300 bg-gray-50' 
                : alert.severity === 'high' 
                  ? 'border-danger-500' 
                  : alert.severity === 'medium' 
                    ? 'border-warning-500' 
                    : 'border-info-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {alert.alert_type}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    {alert.is_resolved && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Resolved
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{alert.message}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Equipment ID: {alert.equipment_id}</span>
                    <span>Created: {formatDateTime(alert.created_at)}</span>
                    {alert.is_resolved && (
                      <>
                        <span>Resolved by: {alert.resolved_by}</span>
                        <span>Resolved: {formatDateTime(alert.resolved_at!)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewingAlert(alert)}
                  className="btn btn-secondary btn-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                {!alert.is_resolved && (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter || severityFilter
              ? 'Try adjusting your search or filters'
              : 'All systems are running smoothly - no active alerts'
            }
          </p>
        </div>
      )}

      {/* Alert Modal */}
      {viewingAlert && (
        <AlertModal
          alert={viewingAlert}
          onClose={() => setViewingAlert(null)}
          onResolve={() => {
            handleResolveAlert(viewingAlert.id);
            setViewingAlert(null);
          }}
        />
      )}
    </div>
  );
}
