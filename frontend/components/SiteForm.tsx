'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Site } from '@/services/api';

interface SiteFormProps {
  site?: Site;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SiteForm: React.FC<SiteFormProps> = ({
  site,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    site_id: '',
    name: '',
    location: '',
    contact_person: '',
    contact_phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (site) {
      setFormData({
        site_id: site.site_id,
        name: site.name,
        location: site.location,
        contact_person: site.contact_person,
        contact_phone: site.contact_phone,
      });
    }
  }, [site]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.site_id.trim()) {
      newErrors.site_id = 'Site ID is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Site name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact phone is required';
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
            {site ? 'Edit Site' : 'Add New Site'}
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
            {/* Site ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site ID *
              </label>
              <input
                type="text"
                value={formData.site_id}
                onChange={(e) => handleChange('site_id', e.target.value)}
                className={`input ${errors.site_id ? 'border-danger-500' : ''}`}
                placeholder="Enter site ID"
                disabled={!!site} // Can't change ID when editing
              />
              {errors.site_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.site_id}</p>
              )}
            </div>

            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input ${errors.name ? 'border-danger-500' : ''}`}
                placeholder="Enter site name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
              )}
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`input ${errors.location ? 'border-danger-500' : ''}`}
                placeholder="Enter site location (address, city, state)"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-danger-600">{errors.location}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                className={`input ${errors.contact_person ? 'border-danger-500' : ''}`}
                placeholder="Enter contact person name"
              />
              {errors.contact_person && (
                <p className="mt-1 text-sm text-danger-600">{errors.contact_person}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className={`input ${errors.contact_phone ? 'border-danger-500' : ''}`}
                placeholder="Enter contact phone number"
              />
              {errors.contact_phone && (
                <p className="mt-1 text-sm text-danger-600">{errors.contact_phone}</p>
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
              {site ? 'Update Site' : 'Add Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteForm;
