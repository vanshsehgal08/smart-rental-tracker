'use client';

import { X } from 'lucide-react';
import { Rental } from '@/services/api';
import { formatDate, formatDateTime, formatCurrency, isOverdue } from '@/lib/utils';

interface RentalModalProps {
  rental: Rental;
  onClose: () => void;
}

const RentalModal: React.FC<RentalModalProps> = ({ rental, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary-100 text-primary-800';
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'overdue':
        return 'bg-danger-100 text-danger-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Rental Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Rental Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Rental ID</label>
                    <p className="text-sm text-gray-900">#{rental.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Equipment ID</label>
                    <p className="text-sm text-gray-900">{rental.equipment_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Operator ID</label>
                    <p className="text-sm text-gray-900">{rental.operator_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Site ID</label>
                    <p className="text-sm text-gray-900">{rental.site_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates and Status */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Dates & Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Start Date</label>
                    <p className="text-sm text-gray-900">{formatDate(rental.start_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">End Date</label>
                    <p className="text-sm text-gray-900">{formatDate(rental.end_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Current Status</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                        {rental.status}
                      </span>
                      {isOverdue(rental.end_date) && rental.status === 'active' && (
                        <span className="text-xs text-danger-600 font-medium">(Overdue)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Daily Rate</label>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(rental.daily_rate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Cost</label>
                <p className="text-lg font-semibold text-primary-600">{formatCurrency(rental.total_cost)}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDateTime(rental.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDateTime(rental.updated_at)}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;
