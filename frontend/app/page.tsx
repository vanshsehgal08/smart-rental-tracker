'use client'

import { useState, useEffect } from 'react'
import DashboardCard from './components/DashboardCard'
import EquipmentTable from './components/EquipmentTable'
import AnomalyAlerts from './components/AnomalyAlerts'
import DemandForecast from './components/DemandForecast'
import EquipmentStats from './components/EquipmentStats'
import { fetchDashboardData } from './lib/api'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Smart Rental Tracker...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'equipment', name: 'Equipment', icon: '⚙️' },
    { id: 'anomalies', name: 'Anomalies', icon: '⚠️' },
    { id: 'forecasting', name: 'Demand Forecast', icon: '📈' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Smart Rental Tracking System
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                AI-powered equipment rental management with real-time monitoring
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="inline-block w-5 h-5 mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Equipment"
                value={dashboardData?.overview?.total_equipment || 0}
                icon="⚙️"
                trend="+12%"
                trendDirection="up"
                color="blue"
              />
              <DashboardCard
                title="Active Rentals"
                value={dashboardData?.overview?.active_rentals || 0}
                icon="⏰"
                trend="+5%"
                trendDirection="up"
                color="green"
              />
              <DashboardCard
                title="Anomalies Detected"
                value={dashboardData?.overview?.anomalies || 0}
                icon="⚠️"
                trend="-8%"
                trendDirection="down"
                color="red"
              />
              <DashboardCard
                title="Utilization Rate"
                value={`${dashboardData?.overview?.utilization_rate || 0}%`}
                icon="📊"
                trend="+3%"
                trendDirection="up"
                color="yellow"
              />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Equipment Performance
                </h3>
                <EquipmentStats />
              </div>
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Anomalies
                </h3>
                <AnomalyAlerts />
              </div>
            </div>

            {/* Demand Forecast Preview */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Demand Forecast (Next 7 Days)
              </h3>
              <DemandForecast daysAhead={7} />
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Equipment Management
            </h2>
            <EquipmentTable />
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Anomaly Detection & Alerts
              </h2>
              <AnomalyAlerts showAll={true} />
            </div>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Demand Forecasting
              </h2>
              <DemandForecast daysAhead={30} />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Equipment Analytics
              </h2>
              <EquipmentStats showDetailed={true} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
