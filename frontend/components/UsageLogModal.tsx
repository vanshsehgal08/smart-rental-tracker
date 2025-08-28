'use client';

import { X, Fuel, Wrench, Calendar } from 'lucide-react';
import { UsageLog } from '@/services/api';
import { formatDateTime } from '@/lib/utils';

interface UsageLogModalProps {
  usageLog: UsageLog;
  isOpen: boolean;
  onClose: () => void;
}

export default function UsageLogModal({ usageLog, isOpen, onClose }: UsageLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Usage Log Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Rental ID</h3>
              <p className="text-lg text-gray-900">{usageLog.rental_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Equipment ID</h3>
              <p className="text-lg text-gray-900">{usageLog.equipment_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Operator ID</h3>
              <p className="text-lg text-gray-900">{usageLog.operator_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Site ID</h3>
              <p className="text-lg text-gray-900">{usageLog.site_id}</p>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Fuel size={20} className="mr-2 text-green-500" />
              Usage Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Hours Used</h4>
                <p className="text-2xl font-semibold text-gray-900">{usageLog.usage_hours} hrs</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Fuel Consumed</h4>
                <p className="text-2xl font-semibold text-gray-900">{usageLog.fuel_consumption} L</p>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-blue-500" />
              Created Date
            </h3>
            <div className="text-gray-900">
              {formatDateTime(usageLog.created_at)}
            </div>
          </div>

          {/* Maintenance Notes */}
          {usageLog.maintenance_notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Wrench size={20} className="mr-2 text-orange-500" />
                Maintenance Notes
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{usageLog.maintenance_notes}</p>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end pt-6 border-t">
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
  );
}
