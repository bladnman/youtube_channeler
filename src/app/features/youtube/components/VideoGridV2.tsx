'use client';

import { Box } from '@chakra-ui/react';
import { useYouTubeContext, Video } from '../context/YouTubeContext';
import { VideoTileV2 } from './VideoTileV2';

interface VideoGridV2Props {
  videos: Video[];
}

export function VideoGridV2({ videos }: VideoGridV2Props) {
  const { selectedVideo, selectVideo } = useYouTubeContext();

  return (
    <Box width="100%">
      {videos.map((video) => (
        <VideoTileV2
          key={video.id}
          video={video}
          onClick={() => selectVideo(video)}
          isSelected={selectedVideo?.id === video.id}
        />
      ))}
    </Box>
  );
} 