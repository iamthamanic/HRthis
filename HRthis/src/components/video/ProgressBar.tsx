import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  videoRef
}) => (
  <div className="mb-3">
    <div 
      className="bg-gray-600 h-1 rounded-full overflow-hidden cursor-pointer"
      onClick={(e) => {
        if (videoRef.current) {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          videoRef.current.currentTime = percent * duration;
        }
      }}
    >
      <div 
        className="bg-blue-500 h-full"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      />
    </div>
  </div>
);