'use client';

import { useCallback, useEffect } from 'react';
import { useYouTubeContext } from '../context/YouTubeContext';

export function useChannel(handle: string) {
  const { 
    setCurrentChannel, 
    handleAPIError, 
    currentChannel 
  } = useYouTubeContext();

  const fetchChannelData = useCallback(async () => {
    try {
      const response = await fetch(`/api/youtube/channel/${handle}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch channel');
      }
      
      setCurrentChannel(data);
    } catch (error) {
      console.error('Error fetching channel data:', error);
      if (error instanceof Error) {
        handleAPIError(error);
      }
    }
  }, [handle, setCurrentChannel, handleAPIError]);

  useEffect(() => {
    void fetchChannelData();

    return () => {
      setCurrentChannel(null);
    };
  }, [handle, fetchChannelData, setCurrentChannel]);

  return {
    channel: currentChannel,
    refetch: fetchChannelData
  };
} 