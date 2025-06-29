/**
 * FileUpload Component
 * 
 * A comprehensive file upload component with drag & drop, preview,
 * and validation for dashboard info files (images and PDFs).
 */

import React from 'react';
import { useDashboardInfoStore } from '../state/dashboardInfo';
import { UploadArea } from './fileupload/UploadArea';
import { FilePreview } from './fileupload/FilePreview';
import { FileTypeHelp } from './fileupload/FileTypeHelp';
import { useFileUpload } from './fileupload/useFileUpload';

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

const UploadAreaSection: React.FC<{
  uploadHandlers: any;
  isUploading: boolean;
  error?: string;
  placeholder: string;
  maxSize?: number;
  accept: string;
  formatFileSize: (size: number) => string;
}> = ({ uploadHandlers, isUploading, error, placeholder, maxSize, accept, formatFileSize }) => (
  <UploadArea
    isDragOver={uploadHandlers.isDragOver}
    isUploading={isUploading}
    error={error}
    placeholder={placeholder}
    maxSize={maxSize}
    accept={accept}
    formatFileSize={formatFileSize}
    onDragOver={uploadHandlers.handleDragOver}
    onDragLeave={uploadHandlers.handleDragLeave}
    onDrop={uploadHandlers.handleDrop}
    onClick={() => uploadHandlers.handleClick(isUploading)}
    onInputChange={uploadHandlers.handleInputChange}
    fileInputRef={uploadHandlers.fileInputRef}
  />
);

const FilePreviewSection: React.FC<{
  selectedFile: File;
  previewUrl: string | null;
  isUploading: boolean;
  error?: string;
  formatFileSize: (size: number) => string;
  onFileRemove: () => void;
}> = ({ selectedFile, previewUrl, isUploading, error, formatFileSize, onFileRemove }) => (
  <FilePreview
    selectedFile={selectedFile}
    previewUrl={previewUrl}
    isUploading={isUploading}
    error={error}
    formatFileSize={formatFileSize}
    onFileRemove={onFileRemove}
  />
);

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
  const { formatFileSize } = useDashboardInfoStore();
  const uploadHandlers = useFileUpload({ onFileSelect, onFileRemove });

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <UploadAreaSection
          uploadHandlers={uploadHandlers}
          isUploading={isUploading}
          error={error}
          placeholder={placeholder}
          maxSize={maxSize}
          accept={accept}
          formatFileSize={formatFileSize}
        />
      ) : (
        <FilePreviewSection
          selectedFile={selectedFile}
          previewUrl={uploadHandlers.previewUrl}
          isUploading={isUploading}
          error={error}
          formatFileSize={formatFileSize}
          onFileRemove={uploadHandlers.handleFileRemove}
        />
      )}

      <FileTypeHelp maxSize={maxSize} formatFileSize={formatFileSize} />
    </div>
  );
};