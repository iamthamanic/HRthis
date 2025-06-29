import React from 'react';
import { VideoContent } from '../types/learning';
import { VideoContainer } from './video/VideoContainer';
import { ProgressBar } from './video/ProgressBar';
import { VideoControls } from './video/VideoControls';
import { TranscriptPanel } from './video/TranscriptPanel';
import { useVideoPlayer } from './video/useVideoPlayer';

interface VideoPlayerProps {
  video: VideoContent;
  onComplete?: () => void;
}

const VideoControlsOverlay: React.FC<{
  currentTime: number;
  duration: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  playbackSpeed: number;
  showTranscript: boolean;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onChangeSpeed: (speed: number) => void;
  onToggleTranscript: () => void;
  formatTime: (seconds: number) => string;
}> = ({
  currentTime,
  duration,
  videoRef,
  isPlaying,
  playbackSpeed,
  showTranscript,
  onTogglePlay,
  onSkip,
  onChangeSpeed,
  onToggleTranscript,
  formatTime
}) => (
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
    <ProgressBar
      currentTime={currentTime}
      duration={duration}
      videoRef={videoRef}
    />
    
    <VideoControls
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      playbackSpeed={playbackSpeed}
      showTranscript={showTranscript}
      onTogglePlay={onTogglePlay}
      onSkip={onSkip}
      onChangeSpeed={onChangeSpeed}
      onToggleTranscript={onToggleTranscript}
      formatTime={formatTime}
    />
  </div>
);

const ActiveSubtitle: React.FC<{ segment: any }> = ({ segment }) => (
  <div className="absolute bottom-20 left-0 right-0 text-center px-4">
    <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg">
      <p className="text-lg">{segment.text}</p>
    </div>
  </div>
);

const getYouTubeInfo = (url: string) => {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const youtubeId = isYouTube ? url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] : null;
  return { isYouTube, youtubeId };
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onComplete }) => {
  const playerState = useVideoPlayer({ video, onComplete });
  const { isYouTube, youtubeId } = getYouTubeInfo(video.url);
  const activeSegment = playerState.getActiveTranscriptSegment();

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      <VideoContainer
        video={video}
        videoRef={playerState.videoRef}
        isYouTube={isYouTube}
        youtubeId={youtubeId}
      />

      {!isYouTube && (
        <VideoControlsOverlay
          currentTime={playerState.currentTime}
          duration={video.duration}
          videoRef={playerState.videoRef}
          isPlaying={playerState.isPlaying}
          playbackSpeed={playerState.playbackSpeed}
          showTranscript={playerState.showTranscript}
          onTogglePlay={playerState.togglePlayPause}
          onSkip={playerState.skipTime}
          onChangeSpeed={playerState.changeSpeed}
          onToggleTranscript={() => playerState.setShowTranscript(!playerState.showTranscript)}
          formatTime={playerState.formatTime}
        />
      )}

      {playerState.showTranscript && (
        <TranscriptPanel
          video={video}
          currentTime={playerState.currentTime}
          videoRef={playerState.videoRef}
          formatTime={playerState.formatTime}
        />
      )}

      {activeSegment && !playerState.showTranscript && (
        <ActiveSubtitle segment={activeSegment} />
      )}
    </div>
  );
};