import React from 'react';
import { Clock } from 'lucide-react';
import { DashboardInfo } from '../../types/dashboardInfo';
import { useDashboardInfoStore } from '../../state/dashboardInfo';
import { FileViewer } from './FileViewer';
import { NewsActions } from './NewsActions';
import { useNewsCard } from './useNewsCard';

interface NewsCardProps {
  item: DashboardInfo;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const { formatFileSize } = useDashboardInfoStore();
  const { handleDownload, handleOpenPdf, formatDate } = useNewsCard(item);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <FileViewer
        fileType={item.file.type}
        fileData={item.file.data}
        filename={item.file.filename}
        onOpenPdf={handleOpenPdf}
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Clock className="w-3 h-3" />
          <span>Erstellt: {formatDate(item.createdAt)}</span>
        </div>
        
        <NewsActions
          fileType={item.file.type}
          fileSize={item.file.size}
          onDownload={handleDownload}
          onOpenPdf={item.file.type === 'pdf' ? handleOpenPdf : undefined}
          formatFileSize={formatFileSize}
        />
      </div>
    </div>
  );
};