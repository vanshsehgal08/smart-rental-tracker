'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Play, RefreshCw, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { dashboardAPI } from '@/services/api';

export default function AnomalyDetectionPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [results, setResults] = useState<{
    idle_alerts_created: number;
    overdue_alerts_created: number;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnomalyDetection = async () => {
    try {
      setLoading(true);
      setIsRunning(true);
      const response = await dashboardAPI.detectAnomalies();
      setResults(response.data);
      setLastRun(new Date());
    } catch (error) {
      console.error('Failed to run anomaly detection:', error);
    } finally {
      setLoading(false);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection</h1>
        <p className="mt-2 text-gray-600">
          Automatically detect and flag equipment anomalies and rental issues
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="card p-8 mb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-primary-600" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Equipment Anomaly Detection
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Run automated anomaly detection to identify idle equipment, overdue rentals, 
            and other potential issues that require attention.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={runAnomalyDetection}
              disabled={isRunning || loading}
              className="btn btn-primary btn-lg"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Run Detection'}
            </button>
          </div>

          {lastRun && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last run: {lastRun.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Idle Equipment Alerts</h3>
            </div>
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {results.idle_alerts_created}
            </div>
            <p className="text-sm text-gray-600">
              Equipment detected as idle for extended periods
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-danger-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overdue Rental Alerts</h3>
            </div>
            <div className="text-3xl font-bold text-danger-600 mb-2">
              {results.overdue_alerts_created}
            </div>
            <p className="text-sm text-gray-600">
              Rentals that have exceeded their end date
            </p>
          </div>
        </div>
      )}

      {/* What Gets Detected */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What Gets Detected</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center mt-1">
                <AlertTriangle className="w-3 h-3 text-warning-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Idle Equipment</h4>
                <p className="text-sm text-gray-600">
                  Equipment that hasn't been used for extended periods, indicating potential 
                  underutilization or maintenance issues.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-danger-100 rounded-full flex items-center justify-center mt-1">
                <Clock className="w-3 h-3 text-danger-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Overdue Rentals</h4>
                <p className="text-sm text-gray-600">
                  Rentals that have exceeded their scheduled end date, requiring immediate 
                  attention and follow-up.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-info-100 rounded-full flex items-center justify-center mt-1">
                <TrendingUp className="w-3 h-3 text-info-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Usage Patterns</h4>
                <p className="text-sm text-gray-600">
                  Analysis of equipment usage patterns to identify unusual activity or 
                  potential efficiency improvements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center mt-1">
                <CheckCircle className="w-3 h-3 text-success-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Maintenance Alerts</h4>
                <p className="text-sm text-gray-600">
                  Equipment approaching maintenance schedules or showing signs of wear 
                  that require attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-semibold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Run Regularly</h4>
            <p className="text-sm text-gray-600">
              Schedule anomaly detection to run daily or weekly to catch issues early.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-semibold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Review Results</h4>
            <p className="text-sm text-gray-600">
              Always review detected anomalies and take appropriate action based on context.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-semibold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Update Thresholds</h4>
            <p className="text-sm text-gray-600">
              Adjust detection parameters based on your business needs and equipment patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
