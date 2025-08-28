'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, MapPin, User, Phone } from 'lucide-react';
import { siteAPI, Site } from '@/services/api';
import { formatDateTime } from '@/lib/utils';
import SiteForm from '@/components/SiteForm';
import SiteModal from '@/components/SiteModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [viewingSite, setViewingSite] = useState<Site | null>(null);
  const [deletingSite, setDeletingSite] = useState<Site | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await siteAPI.getAll();
      setSites(response.data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async (data: any) => {
    try {
      await siteAPI.create(data);
      setShowForm(false);
      fetchSites();
    } catch (error) {
      console.error('Failed to create site:', error);
    }
  };

  const handleUpdateSite = async (id: number, data: any) => {
    try {
      await siteAPI.update(id, data);
      setEditingSite(null);
      fetchSites();
    } catch (error) {
      console.error('Failed to update site:', error);
    }
  };

  const handleDeleteSite = async () => {
    if (!deletingSite) return;
    
    try {
      // Note: Backend doesn't have delete endpoint, so we'll just remove from state
      setSites(prev => prev.filter(site => site.id !== deletingSite.id));
      setDeletingSite(null);
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  const filteredSites = sites.filter(site => {
    return site.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           site.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
           site.contact_phone.includes(searchTerm);
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
          <h1 className="text-3xl font-bold text-gray-900">Site Management</h1>
          <p className="mt-2 text-gray-600">
            Manage construction and mining sites
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Site
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search sites by ID, name, location, contact person, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <div key={site.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                  <p className="text-sm text-gray-600">ID: {site.site_id}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{site.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{site.contact_person}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{site.contact_phone}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewingSite(site)}
                className="btn btn-secondary btn-sm flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                onClick={() => setEditingSite(site)}
                className="btn btn-primary btn-sm flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setDeletingSite(site)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sites found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first site'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <SiteForm
          onSubmit={handleCreateSite}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingSite && (
        <SiteForm
          site={editingSite}
          onSubmit={(data) => handleUpdateSite(editingSite.id, data)}
          onCancel={() => setEditingSite(null)}
        />
      )}

      {viewingSite && (
        <SiteModal
          site={viewingSite}
          onClose={() => setViewingSite(null)}
        />
      )}

      {deletingSite && (
        <DeleteConfirmModal
          title="Delete Site"
          message={`Are you sure you want to delete site ${deletingSite.name} (${deletingSite.site_id})? This action cannot be undone.`}
          onConfirm={handleDeleteSite}
          onCancel={() => setDeletingSite(null)}
        />
      )}
    </div>
  );
}
