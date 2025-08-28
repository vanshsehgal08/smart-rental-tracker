'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { UsageLog, usageLogAPI } from '@/services/api';
import { formatDateTime } from '@/lib/utils';
import UsageLogForm from '@/components/UsageLogForm';
import UsageLogModal from '@/components/UsageLogModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function UsageLogsPage() {
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<UsageLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<UsageLog | null>(null);
  const [editingLog, setEditingLog] = useState<UsageLog | null>(null);

  useEffect(() => {
    fetchUsageLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [usageLogs, searchTerm]);

  const fetchUsageLogs = async () => {
    try {
      setIsLoading(true);
      // Note: Backend doesn't have getAll endpoint yet, using empty array
      const data: UsageLog[] = [];
      setUsageLogs(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch usage logs');
      console.error('Error fetching usage logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    if (!searchTerm.trim()) {
      setFilteredLogs(usageLogs);
      return;
    }

    const filtered = usageLogs.filter(log => 
      log.equipment_id.toString().includes(searchTerm.toLowerCase()) ||
      log.operator_id.toString().includes(searchTerm.toLowerCase()) ||
      log.site_id.toString().includes(searchTerm.toLowerCase()) ||
      log.maintenance_notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  const handleCreateLog = async (data: Partial<UsageLog>) => {
    try {
      // Note: Backend doesn't have create endpoint yet
      const newLog: UsageLog = {
        id: Date.now(),
        rental_id: 1, // Default rental ID
        equipment_id: Number(data.equipment_id) || 0,
        operator_id: Number(data.operator_id) || 0,
        site_id: Number(data.site_id) || 0,
        usage_hours: Number(data.usage_hours) || 0,
        fuel_consumption: Number(data.fuel_consumption) || 0,
        maintenance_notes: data.maintenance_notes || '',
        created_at: new Date().toISOString()
      };
      
      setUsageLogs(prev => [newLog, ...prev]);
      setIsFormOpen(false);
      setEditingLog(null);
    } catch (err) {
      console.error('Error creating usage log:', err);
    }
  };

  const handleUpdateLog = async (data: Partial<UsageLog>) => {
    if (!editingLog) return;
    
    try {
      // Note: Backend doesn't have update endpoint yet
      const updatedLogs = usageLogs.map(log => 
        log.id === editingLog.id 
          ? { ...log, ...data, updated_at: new Date().toISOString() }
          : log
      );
      
      setUsageLogs(updatedLogs);
      setIsFormOpen(false);
      setEditingLog(null);
    } catch (err) {
      console.error('Error updating usage log:', err);
    }
  };

  const handleDeleteLog = async () => {
    if (!selectedLog) return;
    
    try {
      // Note: Backend doesn't have delete endpoint yet
      setUsageLogs(prev => prev.filter(log => log.id !== selectedLog.id));
      setIsDeleteModalOpen(false);
      setSelectedLog(null);
    } catch (err) {
      console.error('Error deleting usage log:', err);
    }
  };

  const openEditForm = (log: UsageLog) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const openDeleteModal = (log: UsageLog) => {
    setSelectedLog(log);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchUsageLogs}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Usage Logs</h1>
          <p className="text-gray-600">Track equipment usage, fuel consumption, and maintenance</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Usage Log</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by equipment, operator, site, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filters</span>
          </div>
        </div>
      </div>

      {/* Usage Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No usage logs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first usage log'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary"
              >
                Create Usage Log
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Created
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Hours
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Fuel
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Notes
                   </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.equipment_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.operator_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.site_id}</div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">
                         {formatDateTime(log.created_at)}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">{log.usage_hours} hrs</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">{log.fuel_consumption} L</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">-</div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditForm(log)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(log)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <UsageLogForm
          usageLog={editingLog || undefined}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingLog(null);
          }}
          onSubmit={editingLog ? handleUpdateLog : handleCreateLog}
        />
      )}

      {selectedLog && isModalOpen && (
        <UsageLogModal
          usageLog={selectedLog}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLog(null);
          }}
        />
      )}

      <DeleteConfirmModal
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedLog(null);
        }}
        onConfirm={handleDeleteLog}
        title="Delete Usage Log"
        message={`Are you sure you want to delete this usage log for equipment ${selectedLog?.equipment_id}? This action cannot be undone.`}
      />
    </div>
  );
}

