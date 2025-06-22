import React, { useEffect, useRef, useState } from 'react';
import { useLearningStore } from '../state/learning';
import { VideoContent } from '../types/learning';
import { cn } from '../utils/cn';

interface VideoPlayerProps {
  video: VideoContent;
  onComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onComplete }) => {
  const { updateProgress, completeVideo } = useLearningStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<number | undefined>(undefined);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      
      // Update progress every 5 seconds
      if (Math.floor(videoElement.currentTime) % 5 === 0) {
        updateProgress(video.id, Math.floor(videoElement.currentTime));
      }
    };

    const handleEnded = () => {
      completeVideo(video.id);
      if (onComplete) onComplete();
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', () => setIsPlaying(true));
    videoElement.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', () => setIsPlaying(true));
      videoElement.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [video.id, updateProgress, completeVideo, onComplete]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getActiveTranscriptSegment = () => {
    if (!video.transcription) return null;
    
    return video.transcription.segments.find(
      segment => currentTime >= segment.start && currentTime <= segment.end
    );
  };

  const activeSegment = getActiveTranscriptSegment();

  // For YouTube videos
  const isYouTube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
  const youtubeId = isYouTube ? video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] : null;

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {isYouTube && youtubeId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full"
            src={video.url}
            poster={video.thumbnail}
          />
        )}

        {/* Custom Controls Overlay */}
        {!isYouTube && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="bg-gray-600 h-1 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  if (videoRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    videoRef.current.currentTime = percent * video.duration;
                  }
                }}
              >
                <div 
                  className="bg-blue-500 h-full"
                  style={{ width: `${(currentTime / video.duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
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
                  onClick={() => skipTime(-10)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-sm font-medium">-10s</span>
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-sm font-medium">+10s</span>
                </button>

                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(video.duration)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={changeSpeed}
                  className="text-white hover:text-blue-400 transition-colors text-sm font-medium"
                >
                  {playbackSpeed}x
                </button>

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
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
          </div>
        )}
      </div>

      {/* Transcript Panel */}
      {showTranscript && video.transcription && (
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
      )}

      {/* Active Subtitle */}
      {activeSegment && !showTranscript && (
        <div className="absolute bottom-20 left-0 right-0 text-center px-4">
          <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg">
            <p className="text-lg">{activeSegment.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};