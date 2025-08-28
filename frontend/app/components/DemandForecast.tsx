'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface DemandForecastProps {
  daysAhead: number
}

export default function DemandForecast({ daysAhead }: DemandForecastProps) {
  const [forecast, setForecast] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all')

  useEffect(() => {
    const generateMockForecast = () => {
      // Generate mock forecast data
      const mockForecast = {
        forecasts: selectedEquipment === 'all' ? [
          { equipment_type: 'Excavator', predicted_demand: 8, average_daily_demand: 6.2, trend: 'increasing' },
          { equipment_type: 'Bulldozer', predicted_demand: 6, average_daily_demand: 4.8, trend: 'stable' },
          { equipment_type: 'Crane', predicted_demand: 4, average_daily_demand: 3.1, trend: 'increasing' },
          { equipment_type: 'Loader', predicted_demand: 5, average_daily_demand: 4.2, trend: 'decreasing' }
        ] : Array.from({ length: daysAhead }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          predicted_demand: Math.floor(Math.random() * 8) + 2,
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
          day_of_week: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })
        })),
        // Add summary data for single equipment forecasts
        total_predicted_demand: selectedEquipment === 'all' ? undefined : Array.from({ length: daysAhead }, (_, i) => Math.floor(Math.random() * 8) + 2).reduce((sum, val) => sum + val, 0),
        average_daily_demand: selectedEquipment === 'all' ? undefined : Array.from({ length: daysAhead }, (_, i) => Math.floor(Math.random() * 8) + 2).reduce((sum, val) => sum + val, 0) / daysAhead,
        trend: selectedEquipment === 'all' ? undefined : ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)]
      }
      
      console.log('Generated mock forecast:', mockForecast)
      console.log('Selected equipment:', selectedEquipment)
      console.log('Days ahead:', daysAhead)
      
      setForecast(mockForecast)
      setLoading(false)
    }

    // Simulate API delay
    setTimeout(generateMockForecast, 1000)
  }, [selectedEquipment, daysAhead])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!forecast) {
    return (
      <div className="text-center text-gray-500 py-8">
        No demand forecast available
      </div>
    )
  }

  // Prepare data for charts
  const prepareChartData = () => {
    if (selectedEquipment === 'all' && forecast.forecasts) {
      // For bulk forecast, show equipment type comparison
      return forecast.forecasts.map((item: any) => ({
        name: item.equipment_type,
        demand: item.predicted_demand,
        avgDaily: item.average_daily_demand,
        trend: item.trend === 'increasing' ? 1 : item.trend === 'decreasing' ? -1 : 0,
      }))
    } else if (forecast.forecasts) {
      // For single equipment forecast, show daily breakdown
      return forecast.forecasts.map((day: any) => ({
        name: day.date,
        demand: day.predicted_demand,
        confidence: day.confidence,
        dayOfWeek: day.day_of_week,
      }))
    }
    return []
  }

  const chartData = prepareChartData()

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Equipment Type:</label>
        <select
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="all">All Equipment Types</option>
          <option value="Excavator">Excavator</option>
          <option value="Bulldozer">Bulldozer</option>
          <option value="Crane">Crane</option>
          <option value="Grader">Grader</option>
        </select>
      </div>

      {/* Forecast Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {(() => {
                const total = selectedEquipment === 'all' 
                  ? forecast.forecasts?.reduce((sum: number, item: any) => sum + (item.predicted_demand || 0), 0) || 0
                  : forecast.total_predicted_demand || 0
                console.log('Total Predicted Demand calculation:', { selectedEquipment, total, forecasts: forecast.forecasts })
                return total
              })()}
            </p>
            <p className="text-sm text-gray-600">Total Predicted Demand</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {(() => {
                const avg = selectedEquipment === 'all' 
                  ? forecast.forecasts?.length > 0 
                    ? (forecast.forecasts.reduce((sum: number, item: any) => sum + (item.predicted_demand || 0), 0) / forecast.forecasts.length).toFixed(1)
                    : '0.0'
                  : forecast.average_daily_demand || 0
                console.log('Average Daily Demand calculation:', { selectedEquipment, avg, forecasts: forecast.forecasts })
                return avg
              })()}
            </p>
            <p className="text-sm text-gray-600">Average Daily Demand</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {selectedEquipment === 'all' ? 'N/A' : forecast.trend || 'stable'}
            </p>
            <p className="text-sm text-gray-600">Demand Trend</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedEquipment === 'all' ? (
          // Equipment type comparison chart
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Demand by Equipment Type</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#3B82F6" name="Predicted Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          // Daily forecast chart
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Daily Demand Forecast</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="demand" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Confidence and Trend Analysis */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {selectedEquipment === 'all' ? 'Equipment Performance' : 'Forecast Confidence'}
          </h4>
          {selectedEquipment === 'all' ? (
            <div className="space-y-4">
              {chartData.map((item: any) => (
                <div key={item.name} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      item.trend === 1 ? 'bg-green-100 text-green-800' :
                      item.trend === -1 ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.trend === 1 ? '↗ Increasing' : item.trend === -1 ? '↘ Decreasing' : '→ Stable'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Daily Average:</span> {item.avgDaily?.toFixed(1) || 0} units
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {chartData.slice(0, 7).map((day: any) => (
                <div key={day.name} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{day.name}</span>
                      <p className="text-sm text-gray-500">{day.dayOfWeek}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">{day.demand}</span>
                      <p className="text-xs text-gray-500">Confidence: {(day.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Forecast Details Table */}
      {selectedEquipment !== 'all' && forecast.forecasts && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Detailed Forecast</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted Demand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecast.forecasts.map((day: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.day_of_week}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.predicted_demand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(day.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">
          Forecast Insights
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Forecast period: {daysAhead} days</li>
          <li>• Based on historical usage patterns and seasonal trends</li>
          <li>• Confidence levels indicate prediction reliability</li>
          {forecast.trend && forecast.trend !== 'stable' && (
            <li>• Demand trend: {forecast.trend} - consider adjusting inventory accordingly</li>
          )}
        </ul>
      </div>
    </div>
  )
}
