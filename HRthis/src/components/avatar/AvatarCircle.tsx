import React from 'react';

interface AvatarCircleProps {
  showEditButton?: boolean;
  onEdit?: () => void;
}

export const AvatarCircle: React.FC<AvatarCircleProps> = ({
  showEditButton = false,
  onEdit
}) => (
  <div className="relative mb-6">
    <div className="w-40 h-40 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative z-10 w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
        <span className="text-white text-3xl">👤</span>
      </div>
    </div>

    {showEditButton && (
      <button
        onClick={onEdit}
        className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      >
        <span className="text-gray-600">✏️</span>
      </button>
    )}
  </div>
);