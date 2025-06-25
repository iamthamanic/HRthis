/**
 * DashboardInfoAdminScreen Component
 * 
 * Admin interface for managing dashboard info items that will be displayed
 * in the user dashboard news section. Allows uploading, editing, and managing
 * images and PDF files with titles and descriptions.
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Download, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Search,
  Save,
  X,
  Info
} from 'lucide-react';
import { useDashboardInfoStore } from '../state/dashboardInfo';
import { FileUpload } from '../components/FileUpload';
import { 
  DashboardInfo, 
  CreateDashboardInfoForm, 
  UpdateDashboardInfoForm,
  DashboardInfoSortOption 
} from '../types/dashboardInfo';

/**
 * Modal for creating/editing dashboard info items
 */
const DashboardInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  editItem?: DashboardInfo | null;
}> = ({ isOpen, onClose, editItem }) => {
  const { createItem, updateItem, isLoading } = useDashboardInfoStore();
  const [formData, setFormData] = useState<CreateDashboardInfoForm>({
    title: '',
    description: '',
    file: null,
    expiresAt: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title,
        description: editItem.description || '',
        file: null, // File replacement is optional
        expiresAt: editItem.expiresAt || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        file: null,
        expiresAt: ''
      });
    }
    setError(null);
  }, [editItem, isOpen]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Titel ist erforderlich');
      return;
    }

    if (!editItem && !formData.file) {
      setError('Datei ist erforderlich');
      return;
    }

    try {
      if (editItem) {
        // Update existing item
        const updateData: UpdateDashboardInfoForm = {
          title: formData.title,
          description: formData.description,
          expiresAt: formData.expiresAt || undefined
        };
        
        if (formData.file) {
          updateData.file = formData.file;
        }

        await updateItem(editItem.id, updateData);
      } else {
        // Create new item
        await createItem(formData);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editItem ? 'Info bearbeiten' : 'Neue Info erstellen'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titel der Nachricht eingeben..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optionale Beschreibung..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datei {!editItem && '*'}
              </label>
              <FileUpload
                onFileSelect={(file) => setFormData({ ...formData, file })}
                onFileRemove={() => setFormData({ ...formData, file: null })}
                selectedFile={formData.file}
                isUploading={isLoading}
                placeholder={editItem ? 'Neue Datei auswählen (optional)' : 'Datei auswählen'}
              />
              {editItem && !formData.file && (
                <p className="text-sm text-gray-500 mt-2">
                  Aktuelle Datei: {editItem.file.filename}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ablaufdatum (optional)
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">
                Info wird automatisch nach diesem Datum ausgeblendet
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <Save className="w-4 h-4" />
                <span>{editItem ? 'Aktualisieren' : 'Erstellen'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Item card component for displaying dashboard info items
 */
const DashboardInfoCard: React.FC<{
  item: DashboardInfo;
  onEdit: (item: DashboardInfo) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}> = ({ item, onEdit, onDelete, onToggleActive }) => {
  const { formatFileSize } = useDashboardInfoStore();

  const handleDownload = () => {
    // Create download link for the file
    const link = document.createElement('a');
    link.href = item.file.data;
    link.download = item.file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${!item.isActive ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={() => onToggleActive(item.id)}
            className={`p-1 rounded ${item.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
            title={item.isActive ? 'Deaktivieren' : 'Aktivieren'}
          >
            {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Bearbeiten"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Info */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
        <div className="flex-shrink-0">
          {item.file.type === 'image' ? (
            <img 
              src={item.file.data} 
              alt={item.file.filename}
              className="w-12 h-12 object-cover rounded border"
            />
          ) : (
            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.file.filename}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(item.file.size)} • {item.file.type.toUpperCase()}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="p-1 text-gray-600 hover:bg-gray-200 rounded"
          title="Herunterladen"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>Erstellt: {new Date(item.createdAt).toLocaleDateString('de-DE')}</span>
        {item.expiresAt && (
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Läuft ab: {new Date(item.expiresAt).toLocaleDateString('de-DE')}</span>
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Main Dashboard Info Admin Screen Component
 */
export const DashboardInfoAdminScreen: React.FC = () => {
  const { 
    items, 
    isLoading, 
    loadItems, 
    deleteItem, 
    toggleActive, 
    getStats,
    setSortBy,
    sortBy
  } = useDashboardInfoStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DashboardInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [_showFilters, _setShowFilters] = useState(false);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /**
   * Filter items based on search term
   */
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /**
   * Handle item deletion
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Info löschen möchten?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        alert('Fehler beim Löschen der Info');
      }
    }
  };

  /**
   * Handle edit modal
   */
  const handleEdit = (item: DashboardInfo) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Info</h1>
                <p className="text-gray-600">Verwalten Sie Nachrichten und Dateien für das Nutzer-Dashboard</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Neue Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Gesamt</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Aktiv</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeItems}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Bilder</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.imageCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">PDFs</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pdfCount}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nach Titel oder Beschreibung suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sortieren:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as DashboardInfoSortOption)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Neueste zuerst</option>
                  <option value="oldest">Älteste zuerst</option>
                  <option value="title-asc">Titel A-Z</option>
                  <option value="title-desc">Titel Z-A</option>
                  <option value="size-asc">Größe aufsteigend</option>
                  <option value="size-desc">Größe absteigend</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Keine Suchergebnisse' : 'Noch keine Infos erstellt'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Versuchen Sie andere Suchbegriffe' 
                : 'Erstellen Sie Ihre erste Dashboard-Info'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Neue Info erstellen
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <DashboardInfoCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <DashboardInfoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editItem={editItem}
      />
    </div>
  );
};