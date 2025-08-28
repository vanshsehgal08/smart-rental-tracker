'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { UsageLog } from '@/services/api';

interface UsageLogFormProps {
  usageLog?: UsageLog;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UsageLog>) => void;
  isLoading?: boolean;
}

export default function UsageLogForm({ 
  usageLog, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: UsageLogFormProps) {
  const [formData, setFormData] = useState<Partial<UsageLog>>({
    rental_id: 0,
    equipment_id: 0,
    operator_id: 0,
    site_id: 0,
    usage_hours: 0,
    fuel_consumption: 0,
    maintenance_notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (usageLog) {
      setFormData({
        rental_id: usageLog.rental_id || 0,
        equipment_id: usageLog.equipment_id || 0,
        operator_id: usageLog.operator_id || 0,
        site_id: usageLog.site_id || 0,
        usage_hours: usageLog.usage_hours || 0,
        fuel_consumption: usageLog.fuel_consumption || 0,
        maintenance_notes: usageLog.maintenance_notes || ''
      });
    } else {
      setFormData({
        rental_id: 0,
        equipment_id: 0,
        operator_id: 0,
        site_id: 0,
        usage_hours: 0,
        fuel_consumption: 0,
        maintenance_notes: ''
      });
    }
    setErrors({});
  }, [usageLog, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.equipment_id) {
      newErrors.equipment_id = 'Equipment is required';
    }
    if (!formData.operator_id) {
      newErrors.operator_id = 'Operator is required';
    }
    if (!formData.site_id) {
      newErrors.site_id = 'Site is required';
    }
    if (!formData.rental_id) {
      newErrors.rental_id = 'Rental is required';
    }
    if ((formData.usage_hours || 0) < 0) {
      newErrors.usage_hours = 'Hours used cannot be negative';
    }
    if ((formData.fuel_consumption || 0) < 0) {
      newErrors.fuel_consumption = 'Fuel consumed cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {usageLog ? 'Edit Usage Log' : 'Create Usage Log'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rental ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental ID *
              </label>
              <input
                type="number"
                value={formData.rental_id}
                onChange={(e) => handleInputChange('rental_id', parseInt(e.target.value) || 0)}
                className={`input w-full ${errors.rental_id ? 'border-red-500' : ''}`}
                placeholder="Enter rental ID"
              />
              {errors.rental_id && (
                <p className="text-red-500 text-sm mt-1">{errors.rental_id}</p>
              )}
            </div>

            {/* Equipment ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment ID *
              </label>
              <input
                type="number"
                value={formData.equipment_id}
                onChange={(e) => handleInputChange('equipment_id', parseInt(e.target.value) || 0)}
                className={`input w-full ${errors.equipment_id ? 'border-red-500' : ''}`}
                placeholder="Enter equipment ID"
              />
              {errors.equipment_id && (
                <p className="text-red-500 text-sm mt-1">{errors.equipment_id}</p>
              )}
            </div>

            {/* Operator ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operator ID *
              </label>
              <input
                type="number"
                value={formData.operator_id}
                onChange={(e) => handleInputChange('operator_id', parseInt(e.target.value) || 0)}
                className={`input w-full ${errors.operator_id ? 'border-red-500' : ''}`}
                placeholder="Enter operator ID"
              />
              {errors.operator_id && (
                <p className="text-red-500 text-sm mt-1">{errors.operator_id}</p>
              )}
            </div>

            {/* Site ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site ID *
              </label>
              <input
                type="number"
                value={formData.site_id}
                onChange={(e) => handleInputChange('site_id', parseInt(e.target.value) || 0)}
                className={`input w-full ${errors.site_id ? 'border-red-500' : ''}`}
                placeholder="Enter site ID"
              />
              {errors.site_id && (
                <p className="text-red-500 text-sm mt-1">{errors.site_id}</p>
              )}
            </div>

            {/* Usage Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours Used
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.usage_hours}
                onChange={(e) => handleInputChange('usage_hours', parseFloat(e.target.value) || 0)}
                className={`input w-full ${errors.usage_hours ? 'border-red-500' : ''}`}
                placeholder="0.0"
              />
              {errors.usage_hours && (
                <p className="text-red-500 text-sm mt-1">{errors.usage_hours}</p>
              )}
            </div>

            {/* Fuel Consumption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Consumed (L)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.fuel_consumption}
                onChange={(e) => handleInputChange('fuel_consumption', parseFloat(e.target.value) || 0)}
                className={`input w-full ${errors.fuel_consumption ? 'border-red-500' : ''}`}
                placeholder="0.0"
              />
              {errors.fuel_consumption && (
                <p className="text-red-500 text-sm mt-1">{errors.fuel_consumption}</p>
              )}
            </div>
          </div>

          {/* Maintenance Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Notes
            </label>
            <textarea
              value={formData.maintenance_notes}
              onChange={(e) => handleInputChange('maintenance_notes', e.target.value)}
              rows={4}
              className="input w-full resize-none"
              placeholder="Enter any maintenance notes or observations..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{usageLog ? 'Update' : 'Create'} Usage Log</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
