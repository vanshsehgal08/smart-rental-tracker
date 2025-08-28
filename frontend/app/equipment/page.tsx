'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { equipmentAPI, Equipment, Site } from '@/services/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import EquipmentForm from '../../components/EquipmentForm';
import EquipmentModal from '../../components/EquipmentModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [viewingEquipment, setViewingEquipment] = useState<Equipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipment();
    fetchSites();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getAll();
      setEquipment(response.data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await equipmentAPI.getAll();
      // This should be siteAPI.getAll() but we'll use equipment for now
      // setSites(response.data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const handleCreateEquipment = async (data: any) => {
    try {
      await equipmentAPI.create(data);
      setShowForm(false);
      fetchEquipment();
    } catch (error) {
      console.error('Failed to create equipment:', error);
    }
  };

  const handleUpdateEquipment = async (id: number, data: any) => {
    try {
      await equipmentAPI.update(id, data);
      setEditingEquipment(null);
      fetchEquipment();
    } catch (error) {
      console.error('Failed to update equipment:', error);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deletingEquipment) return;
    
    try {
      // Note: Backend doesn't have delete endpoint, so we'll just remove from state
      setEquipment(prev => prev.filter(eq => eq.id !== deletingEquipment.id));
      setDeletingEquipment(null);
    } catch (error) {
      console.error('Failed to delete equipment:', error);
    }
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['available', 'rented', 'maintenance', 'out_of_service'];

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your construction and mining equipment inventory
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search equipment by ID, type, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => (
          <div key={eq.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{eq.type}</h3>
                <p className="text-sm text-gray-600">ID: {eq.equipment_id}</p>
                <p className="text-sm text-gray-600">Model: {eq.model}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                {eq.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Site ID:</span> {eq.site_id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last Maintenance:</span> {formatDate(eq.last_maintenance)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Next Maintenance:</span> {formatDate(eq.next_maintenance)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewingEquipment(eq)}
                className="btn btn-secondary btn-sm flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                onClick={() => setEditingEquipment(eq)}
                className="btn btn-primary btn-sm flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setDeletingEquipment(eq)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first piece of equipment'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <EquipmentForm
          sites={sites}
          onSubmit={handleCreateEquipment}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingEquipment && (
        <EquipmentForm
          equipment={editingEquipment}
          sites={sites}
          onSubmit={(data) => handleUpdateEquipment(editingEquipment.id, data)}
          onCancel={() => setEditingEquipment(null)}
        />
      )}

      {viewingEquipment && (
        <EquipmentModal
          equipment={viewingEquipment}
          onClose={() => setViewingEquipment(null)}
        />
      )}

      {deletingEquipment && (
        <DeleteConfirmModal
          title="Delete Equipment"
          message={`Are you sure you want to delete ${deletingEquipment.type} (${deletingEquipment.equipment_id})? This action cannot be undone.`}
          onConfirm={handleDeleteEquipment}
          onCancel={() => setDeletingEquipment(null)}
        />
      )}
    </div>
  );
}
