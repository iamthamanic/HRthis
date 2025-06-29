import React from 'react';
import { VideoContent } from '../../types/learning';

interface VideoContainerProps {
  video: VideoContent;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isYouTube: boolean;
  youtubeId: string | null | undefined;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({
  video,
  videoRef,
  isYouTube,
  youtubeId
}) => (
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
  </div>
);