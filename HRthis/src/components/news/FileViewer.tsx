import React from 'react';
import { DashboardInfoFileType } from '../../types/dashboardInfo';

interface FileViewerProps {
  fileType: DashboardInfoFileType;
  fileData: string;
  filename: string;
  onOpenPdf: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  fileType,
  fileData,
  filename,
  onOpenPdf
}) => {
  if (fileType === 'image') {
    return (
      <div className="mb-4">
        <img 
          src={fileData}
          alt={filename}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
        />
      </div>
    );
  }

  if (fileType === 'pdf') {
    return (
      <div className="mb-4 bg-gray-100 rounded-lg p-6 text-center">
        <FileText className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">PDF-Dokument</p>
        <button
          onClick={onOpenPdf}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
        >
          PDF öffnen
        </button>
      </div>
    );
  }

  return null;
};

const FileText = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);