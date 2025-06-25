/**
 * DashboardNews Component
 * 
 * Displays dashboard info items (news) in the user dashboard.
 * Shows images, PDFs, and other files uploaded by admins in a
 * card-based layout with responsive design.
 */

import React, { useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  ExternalLink,
  Download,
  Clock,
  Info
} from 'lucide-react';
import { useDashboardInfoStore } from '../state/dashboardInfo';
import { DashboardInfo } from '../types/dashboardInfo';

/**
 * Individual news card component
 */
const NewsCard: React.FC<{ item: DashboardInfo }> = ({ item }) => {
  const { formatFileSize } = useDashboardInfoStore();

  /**
   * Handle file download
   */
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.file.data;
    link.download = item.file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handle PDF opening in new tab
   */
  const handleOpenPdf = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${item.file.filename}</title>
            <style>
              body { margin: 0; padding: 0; background: #f5f5f5; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${item.file.data}"></iframe>
          </body>
        </html>
      `);
    }
  };

  /**
   * Format relative time
   */
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Gerade eben';
    if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Min.`;
    if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Std.`;
    if (diffInSeconds < 604800) return `vor ${Math.floor(diffInSeconds / 86400)} Tag(en)`;
    
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 pb-3">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* File Display */}
      <div className="px-4 pb-4">
        {item.file.type === 'image' ? (
          /* Image Display */
          <div className="relative group">
            <img 
              src={item.file.data}
              alt={item.title}
              className="w-full h-48 sm:h-56 object-cover rounded-lg border border-gray-200"
            />
            {/* Image Overlay with Download */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <button
                onClick={handleDownload}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                title="Bild herunterladen"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          /* PDF Display */
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-orange-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {item.file.filename}
                </p>
                <p className="text-sm text-gray-500">
                  PDF • {formatFileSize(item.file.size)}
                </p>
              </div>
            </div>
            
            {/* PDF Actions */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleOpenPdf}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Öffnen</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
                title="Herunterladen"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{getRelativeTime(item.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            {item.file.type === 'image' ? (
              <ImageIcon className="w-3 h-3" />
            ) : (
              <FileText className="w-3 h-3" />
            )}
            <span className="capitalize">{item.file.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Dashboard News Component
 */
export const DashboardNews: React.FC = () => {
  const { getActiveItems, loadItems, isLoading, displayConfig } = useDashboardInfoStore();

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const activeItems = getActiveItems();
  const displayItems = activeItems.slice(0, displayConfig.maxItems);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Neuigkeiten</h2>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Neuigkeiten</h2>
        </div>
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Keine aktuellen Neuigkeiten verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Neuigkeiten</h2>
        </div>
        {activeItems.length > displayConfig.maxItems && (
          <span className="text-sm text-gray-500">
            {displayItems.length} von {activeItems.length}
          </span>
        )}
      </div>

      {/* News Grid */}
      <div className="space-y-6">
        {displayItems.map((item, index) => (
          <div key={item.id}>
            <NewsCard item={item} />
            {/* Separator between items (except last) */}
            {index < displayItems.length - 1 && (
              <div className="my-6 border-t border-gray-100"></div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Link */}
      {activeItems.length > displayConfig.maxItems && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Alle {activeItems.length} Neuigkeiten anzeigen →
          </button>
        </div>
      )}

      {/* Last Updated Info */}
      {displayItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Zuletzt aktualisiert: {new Date().toLocaleString('de-DE')}
          </p>
        </div>
      )}
    </div>
  );
};