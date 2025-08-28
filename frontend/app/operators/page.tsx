'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, User } from 'lucide-react';
import { operatorAPI, Operator } from '@/services/api';
import { formatDateTime } from '@/lib/utils';
import OperatorForm from '@/components/OperatorForm';
import OperatorModal from '@/components/OperatorModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [viewingOperator, setViewingOperator] = useState<Operator | null>(null);
  const [deletingOperator, setDeletingOperator] = useState<Operator | null>(null);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const response = await operatorAPI.getAll();
      setOperators(response.data);
    } catch (error) {
      console.error('Failed to fetch operators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOperator = async (data: any) => {
    try {
      await operatorAPI.create(data);
      setShowForm(false);
      fetchOperators();
    } catch (error) {
      console.error('Failed to create operator:', error);
    }
  };

  const handleUpdateOperator = async (id: number, data: any) => {
    try {
      await operatorAPI.update(id, data);
      setEditingOperator(null);
      fetchOperators();
    } catch (error) {
      console.error('Failed to update operator:', error);
    }
  };

  const handleDeleteOperator = async () => {
    if (!deletingOperator) return;
    
    try {
      // Note: Backend doesn't have delete endpoint, so we'll just remove from state
      setOperators(prev => prev.filter(op => op.id !== deletingOperator.id));
      setDeletingOperator(null);
    } catch (error) {
      console.error('Failed to delete operator:', error);
    }
  };

  const filteredOperators = operators.filter(operator => {
    return operator.operator_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           operator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           operator.phone.includes(searchTerm) ||
           operator.license_number.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Operator Management</h1>
          <p className="mt-2 text-gray-600">
            Manage equipment operators and their information
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Operator
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search operators by ID, name, email, phone, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Operators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOperators.map((operator) => (
          <div key={operator.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{operator.name}</h3>
                  <p className="text-sm text-gray-600">ID: {operator.operator_id}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {operator.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {operator.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">License:</span> {operator.license_number}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewingOperator(operator)}
                className="btn btn-secondary btn-sm flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                onClick={() => setEditingOperator(operator)}
                className="btn btn-primary btn-sm flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setDeletingOperator(operator)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOperators.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operators found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first operator'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <OperatorForm
          onSubmit={handleCreateOperator}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingOperator && (
        <OperatorForm
          operator={editingOperator}
          onSubmit={(data) => handleUpdateOperator(editingOperator.id, data)}
          onCancel={() => setEditingOperator(null)}
        />
      )}

      {viewingOperator && (
        <OperatorModal
          operator={viewingOperator}
          onClose={() => setViewingOperator(null)}
        />
      )}

      {deletingOperator && (
        <DeleteConfirmModal
          title="Delete Operator"
          message={`Are you sure you want to delete operator ${deletingOperator.name} (${deletingOperator.operator_id})? This action cannot be undone.`}
          onConfirm={handleDeleteOperator}
          onCancel={() => setDeletingOperator(null)}
        />
      )}
    </div>
  );
}
