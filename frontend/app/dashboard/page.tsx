'use client';

import { useState, useEffect } from 'react';
import { 
  Truck, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { dashboardAPI, DashboardSummary } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import RecentAlerts from '../../components/RecentAlerts';
import EquipmentStatusChart from '../../components/EquipmentStatusChart';
import RentalTrendsChart from '../../components/RentalTrendsChart';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getSummary();
        setSummary(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-danger-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const stats = [
    {
      title: 'Total Equipment',
      value: summary.equipment_summary.total,
      icon: Truck,
      color: 'bg-primary-500',
      change: '+2.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Available Equipment',
      value: summary.equipment_summary.available,
      icon: Truck,
      color: 'bg-success-500',
      change: '+5.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Rentals',
      value: summary.rental_summary.active,
      icon: Calendar,
      color: 'bg-warning-500',
      change: '+1.8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Overdue Rentals',
      value: summary.rental_summary.overdue,
      icon: AlertTriangle,
      color: 'bg-danger-500',
      change: '-0.5%',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your equipment rental operations and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Equipment Status Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status Distribution</h3>
          <EquipmentStatusChart 
            available={summary.equipment_summary.available}
            rented={summary.equipment_summary.rented}
            maintenance={summary.equipment_summary.maintenance}
          />
        </div>

        {/* Rental Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Overview</h3>
          <RentalTrendsChart 
            active={summary.rental_summary.active}
            overdue={summary.rental_summary.overdue}
            completed={summary.rental_summary.completed}
          />
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        <RecentAlerts alerts={summary.recent_alerts} />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="card p-4 hover:shadow-md transition-shadow cursor-pointer text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Add Equipment</h4>
              <p className="text-sm text-gray-600">Register new equipment</p>
            </div>
          </div>
        </button>

        <button className="card p-4 hover:shadow-md transition-shadow cursor-pointer text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Create Rental</h4>
              <p className="text-sm text-gray-600">Start new rental agreement</p>
            </div>
          </div>
        </button>

        <button className="card p-4 hover:shadow-md transition-shadow cursor-pointer text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Run Analytics</h4>
              <p className="text-sm text-gray-600">Detect anomalies</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
