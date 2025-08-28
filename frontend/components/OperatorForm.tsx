'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Operator } from '@/services/api';

interface OperatorFormProps {
  operator?: Operator;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const OperatorForm: React.FC<OperatorFormProps> = ({
  operator,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    operator_id: '',
    name: '',
    phone: '',
    email: '',
    license_number: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (operator) {
      setFormData({
        operator_id: operator.operator_id,
        name: operator.name,
        phone: operator.phone,
        email: operator.email,
        license_number: operator.license_number,
      });
    }
  }, [operator]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.operator_id.trim()) {
      newErrors.operator_id = 'Operator ID is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.license_number.trim()) {
      newErrors.license_number = 'License number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {operator ? 'Edit Operator' : 'Add New Operator'}
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
            {/* Operator ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operator ID *
              </label>
              <input
                type="text"
                value={formData.operator_id}
                onChange={(e) => handleChange('operator_id', e.target.value)}
                className={`input ${errors.operator_id ? 'border-danger-500' : ''}`}
                placeholder="Enter operator ID"
                disabled={!!operator} // Can't change ID when editing
              />
              {errors.operator_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.operator_id}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input ${errors.name ? 'border-danger-500' : ''}`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`input ${errors.phone ? 'border-danger-500' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-danger-600">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`input ${errors.email ? 'border-danger-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
              )}
            </div>

            {/* License Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number *
              </label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => handleChange('license_number', e.target.value)}
                className={`input ${errors.license_number ? 'border-danger-500' : ''}`}
                placeholder="Enter license number"
              />
              {errors.license_number && (
                <p className="mt-1 text-sm text-danger-600">{errors.license_number}</p>
              )}
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
              {operator ? 'Update Operator' : 'Add Operator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperatorForm;
