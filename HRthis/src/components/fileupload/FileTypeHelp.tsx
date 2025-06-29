import React from 'react';

interface FileTypeHelpProps {
  maxSize?: number;
  formatFileSize: (size: number) => string;
}

export const FileTypeHelp: React.FC<FileTypeHelpProps> = ({
  maxSize,
  formatFileSize
}) => (
  <div className="text-xs text-gray-500">
    <p className="font-medium mb-1">Unterstützte Dateiformate:</p>
    <ul className="space-y-1">
      <li>• <strong>Bilder:</strong> PNG, JPG, JPEG, SVG</li>
      <li>• <strong>Dokumente:</strong> PDF</li>
      <li>• <strong>Maximale Größe:</strong> {maxSize ? formatFileSize(maxSize) : '10 MB'}</li>
    </ul>
  </div>
);