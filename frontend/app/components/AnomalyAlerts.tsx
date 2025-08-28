'use client'

import { useState, useEffect } from 'react'

interface AnomalyAlertsProps {
  showAll?: boolean
}

const severityColors = {
  high: 'border-red-500 bg-red-50',
  medium: 'border-yellow-500 bg-yellow-50',
  low: 'border-blue-500 bg-blue-50',
}

const severityIndicators = {
  high: '🔴',
  medium: '🟡',
  low: '🔵',
}

export default function AnomalyAlerts({ showAll = false }: AnomalyAlertsProps) {
  const [anomalies, setAnomalies] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        // Use the dashboard endpoint instead of ML API
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setAnomalies(data.anomalies)
      } catch (error) {
        console.error('Error fetching anomalies:', error)
        // Fallback to mock data
        setAnomalies({
          summary: {
            total_anomalies: 3,
            total_records: 24,
            anomaly_types: {
              high_idle_time: 2,
              low_utilization: 1
            }
          },
          anomalies: [
            {
              equipment_id: "EXC-001",
              type: "Excavator",
              anomaly_type: "high_idle_time",
              severity: "high",
              anomaly_score: 0.89,
              site_id: "Site A",
              engine_hours_per_day: 4.2,
              idle_hours_per_day: 3.8,
              utilization_ratio: 0.52,
              check_out_date: "2025-08-25",
              check_in_date: "2025-08-28"
            },
            {
              equipment_id: "BUL-003",
              type: "Bulldozer",
              anomaly_type: "high_idle_time",
              severity: "medium",
              anomaly_score: 0.72,
              site_id: "Site B",
              engine_hours_per_day: 5.1,
              idle_hours_per_day: 2.9,
              utilization_ratio: 0.64,
              check_out_date: "2025-08-26",
              check_in_date: "2025-08-28"
            },
            {
              equipment_id: "CRN-002",
              type: "Crane",
              anomaly_type: "low_utilization",
              severity: "low",
              anomaly_score: 0.45,
              site_id: "Site C",
              engine_hours_per_day: 6.8,
              idle_hours_per_day: 1.2,
              utilization_ratio: 0.85,
              check_out_date: "2025-08-27",
              check_in_date: "2025-08-28"
            }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalies()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!anomalies || !anomalies.anomalies) {
    return (
      <div className="text-center text-gray-500 py-8">
        No anomalies detected
      </div>
    )
  }

  const anomalyList = showAll ? anomalies.anomalies : anomalies.anomalies.slice(0, 5)
  const totalAnomalies = anomalies.summary?.total_anomalies || 0

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              Anomaly Detection Summary
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {totalAnomalies} anomalies detected out of {anomalies.summary?.total_records || 0} records
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">{totalAnomalies}</p>
            <p className="text-xs text-gray-500">Total Anomalies</p>
          </div>
        </div>
      </div>

      {/* Anomaly Types Summary */}
      {anomalies.summary?.anomaly_types && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(anomalies.summary.anomaly_types).map(([type, count]) => (
            <div key={type} className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm font-medium text-gray-900 capitalize">
                {type.replace(/_/g, ' ')}
              </p>
              <p className="text-2xl font-bold text-primary-600">{count as number}</p>
            </div>
          ))}
        </div>
      )}

      {/* Anomaly List */}
      <div className="space-y-3">
        {anomalyList.map((anomaly: any, index: number) => {
          const indicator = severityIndicators[anomaly.severity as keyof typeof severityIndicators]
          const colorClass = severityColors[anomaly.severity as keyof typeof severityColors]
          
          return (
            <div
              key={index}
              className={`border-l-4 p-4 rounded-r-lg ${colorClass}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">{indicator}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-sm font-medium text-gray-900">
                        {anomaly.equipment_id} - {anomaly.type}
                      </h5>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                        anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 capitalize">
                      {anomaly.anomaly_type.replace(/_/g, ' ')}
                    </p>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Site:</span> {anomaly.site_id || 'Unassigned'}
                      </div>
                      <div>
                        <span className="font-medium">Engine Hours:</span> {anomaly.engine_hours_per_day}
                      </div>
                      <div>
                        <span className="font-medium">Idle Hours:</span> {anomaly.idle_hours_per_day}
                      </div>
                      <div>
                        <span className="font-medium">Utilization:</span> {(anomaly.utilization_ratio * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-medium">Dates:</span> {anomaly.check_out_date} to {anomaly.check_in_date}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Score: {anomaly.anomaly_score}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Show More Button */}
      {!showAll && totalAnomalies > 5 && (
        <div className="text-center">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all {totalAnomalies} anomalies →
          </button>
        </div>
      )}

      {/* Recommendations */}
      {anomalies.summary?.anomaly_types && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Recommendations
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {Object.keys(anomalies.summary.anomaly_types).length > 0 && (
              <li>• Review equipment with high idle time for potential reallocation</li>
            )}
            {anomalies.summary.anomaly_types.high_idle_time && (
              <li>• Schedule maintenance for equipment with low utilization</li>
            )}
            {anomalies.summary.anomaly_types.unused_equipment && (
              <li>• Consider returning unused equipment to reduce costs</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
