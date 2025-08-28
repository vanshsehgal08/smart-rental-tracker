'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, Truck, User, MapPin } from 'lucide-react';
import { rentalAPI, Rental } from '@/services/api';
import { formatDate, formatCurrency, isOverdue } from '@/lib/utils';

export default function CheckInPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalAPI.getActive();
      setRentals(response.data);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (rentalId: number) => {
    try {
      await rentalAPI.checkIn(rentalId);
      fetchRentals(); // Refresh the list
    } catch (error) {
      console.error('Failed to check in rental:', error);
    }
  };

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = rental.id.toString().includes(searchTerm) ||
                         rental.equipment_id.toString().includes(searchTerm) ||
                         rental.operator_id.toString().includes(searchTerm);
    const matchesStatus = !filterStatus || rental.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Check-In/Check-Out Management</h1>
        <p className="mt-2 text-gray-600">
          Manage equipment returns and track rental status
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
                placeholder="Search rentals by ID, equipment, or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
              }}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Active</p>
              <p className="text-3xl font-bold text-primary-600">
                {rentals.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-danger-600">
                {rentals.filter(r => isOverdue(r.end_date) && r.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-3xl font-bold text-warning-600">
                {rentals.filter(r => {
                  const today = new Date();
                  const endDate = new Date(r.end_date);
                  return endDate.toDateString() === today.toDateString() && r.status === 'active';
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-success-600">
                {rentals.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {filteredRentals.map((rental) => (
          <div
            key={rental.id}
            className={`card p-6 border-l-4 ${
              isOverdue(rental.end_date) && rental.status === 'active'
                ? 'border-danger-500 bg-danger-50'
                : rental.status === 'active'
                  ? 'border-primary-500'
                  : 'border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rental #{rental.id}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rental.status === 'active' ? 'bg-primary-100 text-primary-800' :
                    rental.status === 'completed' ? 'bg-success-100 text-success-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {rental.status}
                    {isOverdue(rental.end_date) && rental.status === 'active' && (
                      <span className="ml-1 text-xs">(Overdue)</span>
                    )}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Equipment ID: {rental.equipment_id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Operator ID: {rental.operator_id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Site ID: {rental.site_id}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <span className="ml-2 text-gray-600">{formatDate(rental.start_date)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End Date:</span>
                    <span className="ml-2 text-gray-600">{formatDate(rental.end_date)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Daily Rate:</span>
                    <span className="ml-2 text-gray-600">{formatCurrency(rental.daily_rate)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Cost:</span>
                    <span className="ml-2 text-gray-600">{formatCurrency(rental.total_cost)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-6">
                {rental.status === 'active' && (
                  <button
                    onClick={() => handleCheckIn(rental.id)}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Check In
                  </button>
                )}
                
                {isOverdue(rental.end_date) && rental.status === 'active' && (
                  <div className="text-xs text-danger-600 font-medium text-center">
                    Overdue by {Math.ceil((new Date().getTime() - new Date(rental.end_date).getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus 
              ? 'Try adjusting your search or filters'
              : 'No active rentals to display'
            }
          </p>
        </div>
      )}
    </div>
  );
}
