'use client';

import { useEffect, useRef } from 'react';
import { Channel, useYouTubeContext } from '../context/YouTubeContext';

export function useVideoSelection(channel: Channel | null) {
  const { 
    clearSelectedVideo, 
    selectVideo,
    selectedVideo
  } = useYouTubeContext();
  const hasSelectedFirstVideo = useRef(false);

  // Reset selection when channel changes
  useEffect(() => {
    hasSelectedFirstVideo.current = false;
    return () => {
      clearSelectedVideo();
      hasSelectedFirstVideo.current = false;
    };
  }, [channel?.id, clearSelectedVideo]);

  // Auto-select first video when channel loads
  useEffect(() => {
    const videos = channel?.videos;
    const firstVideo = videos?.[0];

    if (!hasSelectedFirstVideo.current && firstVideo && !selectedVideo) {
      hasSelectedFirstVideo.current = true;
      void selectVideo(firstVideo);
    }
  }, [channel, selectedVideo, selectVideo]);

  return {
    selectedVideo,
    selectVideo
  };
} 