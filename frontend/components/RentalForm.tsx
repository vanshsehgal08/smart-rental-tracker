'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Rental, Equipment, Operator, Site } from '@/services/api';

interface RentalFormProps {
  rental?: Rental;
  equipment: Equipment[];
  operators: Operator[];
  sites: Site[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({
  rental,
  equipment,
  operators,
  sites,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    equipment_id: '',
    operator_id: '',
    site_id: '',
    start_date: '',
    end_date: '',
    daily_rate: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rental) {
      setFormData({
        equipment_id: rental.equipment_id.toString(),
        operator_id: rental.operator_id.toString(),
        site_id: rental.site_id.toString(),
        start_date: rental.start_date.split('T')[0],
        end_date: rental.end_date.split('T')[0],
        daily_rate: rental.daily_rate.toString(),
        status: rental.status,
      });
    } else {
      // Set default dates for new rental
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setFormData(prev => ({
        ...prev,
        start_date: today.toISOString().split('T')[0],
        end_date: tomorrow.toISOString().split('T')[0],
      }));
    }
  }, [rental]);

  const validateForm = () => {
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
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (!formData.daily_rate || parseFloat(formData.daily_rate) <= 0) {
      newErrors.daily_rate = 'Daily rate must be greater than 0';
    }

    // Validate dates
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (startDate >= endDate) {
        newErrors.end_date = 'End date must be after start date';
      }
      
      if (startDate < new Date()) {
        newErrors.start_date = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      equipment_id: parseInt(formData.equipment_id),
      operator_id: parseInt(formData.operator_id),
      site_id: parseInt(formData.site_id),
      daily_rate: parseFloat(formData.daily_rate),
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateTotalCost = () => {
    if (!formData.start_date || !formData.end_date || !formData.daily_rate) {
      return 0;
    }
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = parseFloat(formData.daily_rate);
    
    return days * dailyRate;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {rental ? 'Edit Rental' : 'Create New Rental'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment *
              </label>
              <select
                value={formData.equipment_id}
                onChange={(e) => handleChange('equipment_id', e.target.value)}
                className={`select ${errors.equipment_id ? 'border-danger-500' : ''}`}
              >
                <option value="">Select equipment</option>
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.equipment_id} - {eq.type} ({eq.model})
                  </option>
                ))}
              </select>
              {errors.equipment_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.equipment_id}</p>
              )}
            </div>

            {/* Operator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operator *
              </label>
              <select
                value={formData.operator_id}
                onChange={(e) => handleChange('operator_id', e.target.value)}
                className={`select ${errors.operator_id ? 'border-danger-500' : ''}`}
              >
                <option value="">Select operator</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.operator_id} - {op.name}
                  </option>
                ))}
              </select>
              {errors.operator_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.operator_id}</p>
              )}
            </div>

            {/* Site */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site *
              </label>
              <select
                value={formData.site_id}
                onChange={(e) => handleChange('site_id', e.target.value)}
                className={`select ${errors.site_id ? 'border-danger-500' : ''}`}
              >
                <option value="">Select site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.site_id} - {site.name}
                  </option>
                ))}
              </select>
              {errors.site_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.site_id}</p>
              )}
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rate *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.daily_rate}
                  onChange={(e) => handleChange('daily_rate', e.target.value)}
                  className={`input pl-8 ${errors.daily_rate ? 'border-danger-500' : ''}`}
                  placeholder="0.00"
                />
              </div>
              {errors.daily_rate && (
                <p className="mt-1 text-sm text-danger-600">{errors.daily_rate}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className={`input ${errors.start_date ? 'border-danger-500' : ''}`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-danger-600">{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className={`input ${errors.end_date ? 'border-danger-500' : ''}`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-danger-600">{errors.end_date}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="select"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Cost Calculation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Cost Calculation</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Daily Rate:</span>
                <span className="ml-2 font-medium">${formData.daily_rate || '0.00'}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Cost:</span>
                <span className="ml-2 font-medium text-lg text-primary-600">
                  ${calculateTotalCost().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {rental ? 'Update Rental' : 'Create Rental'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalForm;
