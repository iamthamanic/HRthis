import { useEffect, useRef, useState } from 'react';
import { useLearningStore } from '../../state/learning';
import { VideoContent } from '../../types/learning';

interface UseVideoPlayerProps {
  video: VideoContent;
  onComplete?: () => void;
}

export const useVideoPlayer = ({ video, onComplete }: UseVideoPlayerProps) => {
  const { updateProgress, completeVideo } = useLearningStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      
      if (Math.floor(videoElement.currentTime) % 5 === 0) {
        updateProgress(video.id, Math.floor(videoElement.currentTime));
      }
    };

    const handleEnded = () => {
      completeVideo(video.id);
      if (onComplete) onComplete();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
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

  return {
    videoRef,
    isPlaying,
    currentTime,
    showTranscript,
    playbackSpeed,
    setShowTranscript,
    togglePlayPause,
    skipTime,
    changeSpeed,
    formatTime,
    getActiveTranscriptSegment
  };
};