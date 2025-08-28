'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface EquipmentStatsProps {
  showDetailed?: boolean
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function EquipmentStats({ showDetailed = false }: EquipmentStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use the dashboard endpoint instead of ML API
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setStats(data.equipment_stats)
      } catch (error) {
        console.error('Error fetching equipment stats:', error)
        // Fallback to mock data
        setStats({
          overall: {
            total_equipment: 24,
            average_utilization: 78,
            average_rental_duration: 12.5,
            total_engine_hours: 4560
          },
          by_equipment_type: {
            excavator: { count: 8, avg_utilization: 82, avg_efficiency: 0.85 },
            bulldozer: { count: 6, avg_utilization: 75, avg_efficiency: 0.78 },
            crane: { count: 4, avg_utilization: 88, avg_efficiency: 0.92 },
            loader: { count: 6, avg_utilization: 71, avg_efficiency: 0.76 }
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-8">
        No equipment statistics available
      </div>
    )
  }

  // Prepare data for charts
  const equipmentTypeData = Object.entries(stats.by_equipment_type || {}).map(([type, data]: [string, any]) => ({
    type,
    count: data.count,
    avgUtilization: data.avg_utilization,
    avgEfficiency: data.avg_efficiency,
  }))

  const utilizationData = equipmentTypeData.map(item => ({
    name: item.type,
    utilization: item.avgUtilization,
    efficiency: item.avgEfficiency,
  }))

  const pieData = equipmentTypeData.map(item => ({
    name: item.type,
    value: item.count,
  }))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">
            {stats.overall?.total_equipment || 0}
          </p>
          <p className="text-sm text-gray-600">Total Equipment</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {stats.overall?.average_utilization?.toFixed(1) || 0}%
          </p>
          <p className="text-sm text-gray-600">Avg Utilization</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {stats.overall?.average_rental_duration?.toFixed(1) || 0}
          </p>
          <p className="text-sm text-gray-600">Avg Rental Days</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.overall?.total_engine_hours?.toFixed(0) || 0}
          </p>
          <p className="text-sm text-gray-600">Total Engine Hours</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Distribution */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Equipment Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization by Equipment Type */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Utilization by Equipment Type</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#3B82F6" name="Utilization %" />
              <Bar dataKey="efficiency" fill="#10B981" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Equipment Table */}
      {showDetailed && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Detailed Equipment Statistics</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Engine Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Idle Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipmentTypeData.map((item) => (
                  <tr key={item.type}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stats.by_equipment_type[item.type]?.avg_engine_hours?.toFixed(1) || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stats.by_equipment_type[item.type]?.avg_idle_hours?.toFixed(1) || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.avgUtilization?.toFixed(1) || 0}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.avgEfficiency?.toFixed(1) || 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
