'use client';

import { X } from 'lucide-react';
import { Equipment } from '@/services/api';
import { formatDate, formatDateTime } from '@/lib/utils';

interface EquipmentModalProps {
  equipment: Equipment;
  onClose: () => void;
}

const EquipmentModal: React.FC<EquipmentModalProps> = ({ equipment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Equipment Details</h2>
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
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Equipment ID</label>
                    <p className="text-sm text-gray-900">{equipment.equipment_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Type</label>
                    <p className="text-sm text-gray-900">{equipment.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Model</label>
                    <p className="text-sm text-gray-900">{equipment.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Site ID</label>
                    <p className="text-sm text-gray-900">{equipment.site_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Maintenance */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status & Maintenance</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Current Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      equipment.status === 'available' ? 'bg-success-100 text-success-800' :
                      equipment.status === 'rented' ? 'bg-primary-100 text-primary-800' :
                      equipment.status === 'maintenance' ? 'bg-warning-100 text-warning-800' :
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {equipment.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Maintenance</label>
                    <p className="text-sm text-gray-900">{formatDate(equipment.last_maintenance)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Next Maintenance</label>
                    <p className="text-sm text-gray-900">{formatDate(equipment.next_maintenance)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDateTime(equipment.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDateTime(equipment.updated_at)}</p>
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

export default EquipmentModal;
