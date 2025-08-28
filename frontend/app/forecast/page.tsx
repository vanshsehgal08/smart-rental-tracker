'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, Activity, Target, TrendingDown } from 'lucide-react';

export default function ForecastPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('rentals');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Forecasting & Analytics</h1>
        <p className="mt-2 text-gray-600">
          Predictive analytics and forecasting for equipment rental operations
        </p>
      </div>

      {/* Controls */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecast Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="select"
            >
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
              <option value="90">Next 90 days</option>
              <option value="180">Next 6 months</option>
              <option value="365">Next year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="select"
            >
              <option value="rentals">Rental Volume</option>
              <option value="revenue">Revenue</option>
              <option value="utilization">Equipment Utilization</option>
              <option value="maintenance">Maintenance Schedule</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Predicted Rentals</p>
              <p className="text-3xl font-bold text-gray-900">127</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Forecast</p>
              <p className="text-3xl font-bold text-gray-900">$89.2K</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">+8.3%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
              <p className="text-3xl font-bold text-gray-900">78%</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-danger-600 font-medium">-2.1%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance Events</p>
              <p className="text-3xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-info-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">+5.2%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Volume Forecast</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">Showing predicted rentals over the next {selectedPeriod} days</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">Revenue projection with confidence intervals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Analysis */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-semibold text-lg">Q1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Winter (Jan-Mar)</h4>
            <p className="text-sm text-gray-600">
              Lower demand due to weather conditions
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Avg: 85 rentals/month
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-semibold text-lg">Q2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Spring (Apr-Jun)</h4>
            <p className="text-sm text-gray-600">
              Increasing demand as construction season begins
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Avg: 120 rentals/month
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 font-semibold text-lg">Q3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Summer (Jul-Sep)</h4>
            <p className="text-sm text-gray-600">
              Peak season with highest demand
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Avg: 145 rentals/month
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-semibold text-lg">Q4</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Fall (Oct-Dec)</h4>
            <p className="text-sm text-gray-600">
              Gradual decline as weather worsens
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Avg: 95 rentals/month
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center mt-1">
                <TrendingUp className="w-3 h-3 text-success-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Increase Marketing in Q2</h4>
                <p className="text-sm text-gray-600">
                  Historical data shows 15% higher conversion rates during spring months.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center mt-1">
                <Calendar className="w-3 h-3 text-warning-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Schedule Maintenance in Q1</h4>
                <p className="text-sm text-gray-600">
                  Lower demand period is ideal for preventive maintenance activities.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-info-100 rounded-full flex items-center justify-center mt-1">
                <Target className="w-3 h-3 text-info-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Optimize Pricing in Q3</h4>
                <p className="text-sm text-gray-600">
                  Peak season allows for 8-12% price increases without affecting demand.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-danger-100 rounded-full flex items-center justify-center mt-1">
                <TrendingDown className="w-3 h-3 text-danger-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Reduce Inventory in Q4</h4>
                <p className="text-sm text-gray-600">
                  Consider reducing equipment purchases as demand decreases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
