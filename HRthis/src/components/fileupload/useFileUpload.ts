import { useState, useRef, useCallback } from 'react';
import { useDashboardInfoStore } from '../../state/dashboardInfo';

interface UseFileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export const useFileUpload = ({ onFileSelect, onFileRemove }: UseFileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateFile } = useDashboardInfoStore();

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      return;
    }

    if (validation.type === 'image') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleFileRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onFileRemove();
  }, [previewUrl, onFileRemove]);

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

  const handleClick = (isUploading: boolean) => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return {
    isDragOver,
    previewUrl,
    fileInputRef,
    handleFileSelect,
    handleFileRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
    handleInputChange
  };
};