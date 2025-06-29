import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { DashboardInfoFileType } from '../../types/dashboardInfo';

interface NewsActionsProps {
  fileType: DashboardInfoFileType;
  fileSize: number;
  onDownload: () => void;
  onOpenPdf?: () => void;
  formatFileSize: (size: number) => string;
}

export const NewsActions: React.FC<NewsActionsProps> = ({
  fileType,
  fileSize,
  onDownload,
  onOpenPdf,
  formatFileSize
}) => (
  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
    <span className="text-xs text-gray-500">
      {formatFileSize(fileSize)}
    </span>
    
    <div className="flex gap-2">
      <button
        onClick={onDownload}
        className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
      >
        <Download className="w-3 h-3" />
        Download
      </button>
      
      {fileType === 'pdf' && onOpenPdf && (
        <button
          onClick={onOpenPdf}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Öffnen
        </button>
      )}
    </div>
  </div>
);