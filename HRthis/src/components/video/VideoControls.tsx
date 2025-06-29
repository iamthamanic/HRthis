import React from 'react';
import { cn } from '../../utils/cn';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  showTranscript: boolean;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onChangeSpeed: () => void;
  onToggleTranscript: () => void;
  formatTime: (seconds: number) => string;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  showTranscript,
  onTogglePlay,
  onSkip,
  onChangeSpeed,
  onToggleTranscript,
  formatTime
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button
        onClick={onTogglePlay}
        className="text-white hover:text-blue-400 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <button
        onClick={() => onSkip(-10)}
        className="text-white hover:text-blue-400 transition-colors"
      >
        <span className="text-sm font-medium">-10s</span>
      </button>

      <button
        onClick={() => onSkip(10)}
        className="text-white hover:text-blue-400 transition-colors"
      >
        <span className="text-sm font-medium">+10s</span>
      </button>

      <div className="text-white text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={onChangeSpeed}
        className="text-white hover:text-blue-400 transition-colors text-sm font-medium"
      >
        {playbackSpeed}x
      </button>

      <button
        onClick={onToggleTranscript}
        className={cn(
          "text-white hover:text-blue-400 transition-colors",
          showTranscript && "text-blue-400"
        )}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>
  </div>
);