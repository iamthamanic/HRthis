import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface UploadAreaProps {
  isDragOver: boolean;
  isUploading: boolean;
  error?: string;
  placeholder: string;
  maxSize?: number;
  accept: string;
  formatFileSize: (size: number) => string;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  isDragOver,
  isUploading,
  error,
  placeholder,
  maxSize,
  accept,
  formatFileSize,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onInputChange,
  fileInputRef
}) => (
  <div
    className={`
      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
      ${isDragOver 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-300 hover:border-gray-400'
      }
      ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      ${error ? 'border-red-300 bg-red-50' : ''}
    `}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    onClick={onClick}
  >
    <input
      ref={fileInputRef}
      type="file"
      accept={accept}
      onChange={onInputChange}
      className="hidden"
      disabled={isUploading}
    />
    
    <div className="space-y-4">
      <div className="flex justify-center">
        {error ? (
          <AlertCircle className="w-12 h-12 text-red-400" />
        ) : (
          <Upload className={`w-12 h-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        )}
      </div>
      
      <div>
        <p className={`text-lg font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}>
          {error || placeholder}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          PNG, JPG, SVG oder PDF bis {maxSize ? formatFileSize(maxSize) : '10 MB'}
        </p>
      </div>
      
      {isUploading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  </div>
);