/**
 * DashboardNews Component
 * 
 * Displays dashboard info items (news) in the user dashboard.
 * Shows images, PDFs, and other files uploaded by admins in a
 * card-based layout with responsive design.
 */

import React, { useEffect } from 'react';
import { Info } from 'lucide-react';
import { useDashboardInfoStore } from '../state/dashboardInfo';
import { NewsCard } from './news/NewsCard';

/**
 * News Header Component
 */
const NewsHeader: React.FC = () => (
  <div className="flex items-center space-x-2 mb-6">
    <Info className="w-5 h-5 text-blue-500" />
    <h2 className="text-lg font-semibold text-gray-900">Neuigkeiten</h2>
  </div>
);

/**
 * Loading State Component
 */
const NewsLoading: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <NewsHeader />
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>
  </div>
);

/**
 * Empty State Component
 */
const NewsEmpty: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <NewsHeader />
    <div className="text-center py-8">
      <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500">Keine aktuellen Neuigkeiten verfügbar</p>
    </div>
  </div>
);

/**
 * News Grid Component
 */
const NewsGrid: React.FC<{ items: any[]; totalItems: number; maxItems: number }> = ({ 
  items, 
  totalItems, 
  maxItems 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <NewsHeader />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
    
    {totalItems > maxItems && (
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {totalItems - maxItems} weitere Neuigkeiten verfügbar
        </p>
      </div>
    )}
  </div>
);

/**
 * Main Dashboard News Component
 */
export const DashboardNews: React.FC = () => {
  const { getActiveItems, loadItems, isLoading, displayConfig } = useDashboardInfoStore();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const activeItems = getActiveItems();
  const displayItems = activeItems.slice(0, displayConfig.maxItems);

  if (isLoading) return <NewsLoading />;
  if (displayItems.length === 0) return <NewsEmpty />;

  return (
    <NewsGrid 
      items={displayItems} 
      totalItems={activeItems.length} 
      maxItems={displayConfig.maxItems} 
    />
  );
};