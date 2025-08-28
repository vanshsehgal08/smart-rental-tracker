'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Equipment, Site } from '@/services/api';

interface EquipmentFormProps {
  equipment?: Equipment;
  sites: Site[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipment,
  sites,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    equipment_id: '',
    type: '',
    model: '',
    site_id: '',
    status: 'available',
    last_maintenance: '',
    next_maintenance: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (equipment) {
      setFormData({
        equipment_id: equipment.equipment_id,
        type: equipment.type,
        model: equipment.model,
        site_id: equipment.site_id.toString(),
        status: equipment.status,
        last_maintenance: equipment.last_maintenance.split('T')[0],
        next_maintenance: equipment.next_maintenance.split('T')[0],
      });
    }
  }, [equipment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.equipment_id.trim()) {
      newErrors.equipment_id = 'Equipment ID is required';
    }
    if (!formData.type.trim()) {
      newErrors.type = 'Type is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.site_id) {
      newErrors.site_id = 'Site is required';
    }
    if (!formData.last_maintenance) {
      newErrors.last_maintenance = 'Last maintenance date is required';
    }
    if (!formData.next_maintenance) {
      newErrors.next_maintenance = 'Next maintenance date is required';
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
      site_id: parseInt(formData.site_id),
      last_maintenance: new Date(formData.last_maintenance).toISOString(),
      next_maintenance: new Date(formData.next_maintenance).toISOString(),
    };

    onSubmit(submitData);
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
            {equipment ? 'Edit Equipment' : 'Add New Equipment'}
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
            {/* Equipment ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment ID *
              </label>
              <input
                type="text"
                value={formData.equipment_id}
                onChange={(e) => handleChange('equipment_id', e.target.value)}
                className={`input ${errors.equipment_id ? 'border-danger-500' : ''}`}
                placeholder="Enter equipment ID"
                disabled={!!equipment} // Can't change ID when editing
              />
              {errors.equipment_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.equipment_id}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`input ${errors.type ? 'border-danger-500' : ''}`}
                placeholder="e.g., Excavator, Bulldozer"
              />
              {errors.type && (
                <p className="mt-1 text-sm text-danger-600">{errors.type}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className={`input ${errors.model ? 'border-danger-500' : ''}`}
                placeholder="e.g., CAT 320, Komatsu PC200"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-danger-600">{errors.model}</p>
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
                <option value="">Select a site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.location}
                  </option>
                ))}
              </select>
              {errors.site_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.site_id}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="select"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>

            {/* Last Maintenance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Maintenance *
              </label>
              <input
                type="date"
                value={formData.last_maintenance}
                onChange={(e) => handleChange('last_maintenance', e.target.value)}
                className={`input ${errors.last_maintenance ? 'border-danger-500' : ''}`}
              />
              {errors.last_maintenance && (
                <p className="mt-1 text-sm text-danger-600">{errors.last_maintenance}</p>
              )}
            </div>

            {/* Next Maintenance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Maintenance *
              </label>
              <input
                type="date"
                value={formData.next_maintenance}
                onChange={(e) => handleChange('next_maintenance', e.target.value)}
                className={`input ${errors.next_maintenance ? 'border-danger-500' : ''}`}
              />
              {errors.next_maintenance && (
                <p className="mt-1 text-sm text-danger-600">{errors.next_maintenance}</p>
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
              {equipment ? 'Update Equipment' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;
