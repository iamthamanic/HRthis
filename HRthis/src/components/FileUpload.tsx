/**
 * FileUpload Component
 * 
 * A comprehensive file upload component with drag & drop, preview,
 * and validation for dashboard info files (images and PDFs).
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { useDashboardInfoStore } from '../state/dashboardInfo';
import { DashboardInfoFileType } from '../types/dashboardInfo';

interface FileUploadProps {
  /** Callback when file is selected and validated */
  onFileSelect: (file: File) => void;
  /** Callback when file is removed */
  onFileRemove: () => void;
  /** Currently selected file */
  selectedFile?: File | null;
  /** Accept specific file types */
  accept?: string;
  /** Whether upload is in progress */
  isUploading?: boolean;
  /** Error message to display */
  error?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Custom placeholder text */
  placeholder?: string;
}

/**
 * FileUpload component for dashboard info system
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = '.png,.jpg,.jpeg,.svg,.pdf',
  isUploading = false,
  error,
  maxSize,
  placeholder = 'Datei hier ablegen oder klicken zum Auswählen'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateFile, formatFileSize } = useDashboardInfoStore();

  /**
   * Handle file selection and validation
   */
  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      return;
    }

    // Create preview for images
    if (validation.type === 'image') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  /**
   * Handle file removal
   */
  const handleFileRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onFileRemove();
  }, [previewUrl, onFileRemove]);

  /**
   * Handle drag events
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Handle click to open file picker
   */
  const handleClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Get file type icon
   */
  const getFileIcon = (file: File): React.ReactNode => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <File className="w-6 h-6 text-red-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  /**
   * Get file type from MIME type
   */
  const getFileType = (file: File): DashboardInfoFileType => {
    if (file.type.startsWith('image/')) return 'image';
    return 'pdf';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!selectedFile && (
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
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
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* File Icon or Image Preview */}
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
              
              {/* File Info */}
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
            
            {/* Remove Button */}
            <button
              onClick={handleFileRemove}
              disabled={isUploading}
              className="ml-4 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Datei entfernen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Upload Progress */}
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
        </div>
      )}

      {/* Error Message */}
      {error && selectedFile && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* File Type Help */}
      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Unterstützte Dateiformate:</p>
        <ul className="space-y-1">
          <li>• <strong>Bilder:</strong> PNG, JPG, JPEG, SVG</li>
          <li>• <strong>Dokumente:</strong> PDF</li>
          <li>• <strong>Maximale Größe:</strong> {maxSize ? formatFileSize(maxSize) : '10 MB'}</li>
        </ul>
      </div>
    </div>
  );
};