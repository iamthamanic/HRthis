import React from 'react';
import { X, File, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { DashboardInfoFileType } from '../../types/dashboardInfo';

interface FilePreviewProps {
  selectedFile: File;
  previewUrl: string | null;
  isUploading: boolean;
  error?: string;
  formatFileSize: (size: number) => string;
  onFileRemove: () => void;
}

const getFileIcon = (file: File): React.ReactNode => {
  if (file.type.startsWith('image/')) {
    return <Image className="w-6 h-6 text-blue-500" />;
  } else if (file.type === 'application/pdf') {
    return <File className="w-6 h-6 text-red-500" />;
  }
  return <File className="w-6 h-6 text-gray-500" />;
};

const getFileType = (file: File): DashboardInfoFileType => {
  if (file.type.startsWith('image/')) return 'image';
  return 'pdf';
};

export const FilePreview: React.FC<FilePreviewProps> = ({
  selectedFile,
  previewUrl,
  isUploading,
  error,
  formatFileSize,
  onFileRemove
}) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 flex-1">
        <div className="flex-shrink-0">
          {getFileType(selectedFile) === 'image' && previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-16 h-16 object-cover rounded border"
            />
          ) : (
            <div className="w-16 h-16 bg-white border rounded flex items-center justify-center">
              {getFileIcon(selectedFile)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {selectedFile.name}
          </p>
          <p className="text-sm text-gray-500">
            {formatFileSize(selectedFile.size)}
          </p>
          <div className="flex items-center mt-1">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-xs text-green-600">Datei bereit zum Upload</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onFileRemove}
        disabled={isUploading}
        className="ml-4 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        title="Datei entfernen"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
    
    {isUploading && (
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Uploading...</span>
          <span>0%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '30%' }}></div>
        </div>
      </div>
    )}

    {error && (
      <div className="flex items-center space-x-2 text-red-600 text-sm mt-3">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);