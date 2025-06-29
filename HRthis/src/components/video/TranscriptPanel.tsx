import React from 'react';
import { cn } from '../../utils/cn';
import { VideoContent } from '../../types/learning';

interface TranscriptPanelProps {
  video: VideoContent;
  currentTime: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  formatTime: (seconds: number) => string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  video,
  currentTime,
  videoRef,
  formatTime
}) => {
  if (!video.transcription) return null;

  const activeSegment = video.transcription.segments.find(
    segment => currentTime >= segment.start && currentTime <= segment.end
  );

  return (
    <div className="bg-gray-900 p-4 max-h-48 overflow-y-auto">
      <h3 className="text-white font-semibold mb-3">Transkript</h3>
      <div className="space-y-2">
        {video.transcription.segments.map((segment, index) => (
          <div
            key={index}
            className={cn(
              "p-2 rounded cursor-pointer transition-colors",
              activeSegment === segment
                ? "bg-blue-600/20 text-blue-300"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = segment.start;
              }
            }}
          >
            <div className="text-xs text-gray-500 mb-1">
              {formatTime(segment.start)} - {formatTime(segment.end)}
            </div>
            <div className="text-sm">{segment.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};