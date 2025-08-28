'use client';

import { X, User, Mail, Phone, FileText } from 'lucide-react';
import { Operator } from '@/services/api';
import { formatDateTime } from '@/lib/utils';

interface OperatorModalProps {
  operator: Operator;
  onClose: () => void;
}

const OperatorModal: React.FC<OperatorModalProps> = ({ operator, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Operator Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{operator.name}</h3>
              <p className="text-lg text-gray-600">ID: {operator.operator_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{operator.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{operator.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">License Number</label>
                    <p className="text-sm text-gray-900">{operator.license_number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Operator ID</label>
                  <p className="text-sm text-gray-900">{operator.operator_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Internal ID</label>
                  <p className="text-sm text-gray-900">{operator.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Timestamps</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDateTime(operator.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDateTime(operator.updated_at)}</p>
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

export default OperatorModal;
