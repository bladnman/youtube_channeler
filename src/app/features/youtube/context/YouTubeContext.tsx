'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

// Add cache interfaces
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  channels: { [key: string]: CacheEntry<Channel> };
  videos: { [key: string]: CacheEntry<Video> };
  searches: { [key: string]: CacheEntry<Channel> };
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
  description?: string
  duration?: string
  likeCount?: string
  viewCount?: string
  channelTitle?: string
}

interface Channel {
  id: string
  title: string
  thumbnail: string
  description: string
  customUrl?: string
  subscriberCount?: string
}

interface APIError {
  message: string;
  timestamp: number;
}

interface YouTubeContextType {
  loading: boolean
  error: string | null
  selectedVideo: Video | null
  currentChannel: Channel | null
  searchChannel: (query: string) => Promise<Channel | null>
  selectVideo: (video: Video) => Promise<void>
  setCurrentChannel: (channel: Channel | null) => void
  apiError: APIError | null
  handleAPIError: (error: Error) => void
  clearSelectedVideo: () => void
}

const YouTubeContext = createContext<YouTubeContextType | undefined>(undefined)

export const useYouTubeContext = () => {
  const context = useContext(YouTubeContext)
  if (!context) {
    throw new Error('useYouTubeContext must be used within a YouTubeProvider')
  }
  return context
}

export const YouTubeProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [cache] = useState<Cache>({ channels: {}, videos: {}, searches: {} })
  const [apiError, setApiError] = useState<APIError | null>(null)

  const getCachedData = useCallback((
    cacheKey: string,
    cacheType: keyof Cache
  ): Channel | Video | null => {
    const entry = cache[cacheType][cacheKey];
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry.data;
    }
    return null;
  }, [cache]);

  const setCachedData = useCallback((
    cacheKey: string,
    cacheType: keyof Cache,
    data: Channel | Video
  ) => {
    if (cacheType === 'videos' && 'url' in data) {
      (cache.videos as any)[cacheKey] = {
        data,
        timestamp: Date.now(),
      };
    } else if ((cacheType === 'channels' || cacheType === 'searches') && !('url' in data)) {
      (cache[cacheType] as any)[cacheKey] = {
        data,
        timestamp: Date.now(),
      };
    }
  }, [cache]);

  const handleAPIError = useCallback((error: any) => {
    // Check for quota exceeded error in various formats
    const errorMessage = error?.message || error?.error?.message || '';
    const isQuotaError = 
      errorMessage.includes('quota') || 
      errorMessage.includes('exceeded') ||
      (error?.error?.errors?.[0]?.reason === 'quotaExceeded');

    if (isQuotaError) {
      setApiError({
        message: 'YouTube API quota exceeded. Some features may be limited. Please try again later.',
        timestamp: Date.now()
      });
    } else if (errorMessage.includes('API') || error?.error?.code === 403) {
      setApiError({
        message: 'YouTube API error. Some features may be limited.',
        timestamp: Date.now()
      });
    }
    setError(errorMessage || 'An error occurred');
  }, []);

  const searchChannel = async (query: string) => {
    setLoading(true)
    setError(null)
    setSelectedVideo(null)

    try {
      // Check cache first
      const cachedResult = getCachedData(query, 'searches') as Channel | null;
      if (cachedResult) {
        setCurrentChannel(cachedResult);
        setLoading(false);
        return cachedResult;
      }

      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch channel');
      }
      
      // Cache the result
      setCachedData(query, 'searches', data.channel);
      setCurrentChannel(data.channel)
      return data.channel
    } catch (err) {
      handleAPIError(err);
      setCurrentChannel(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  const selectVideo = async (video: Video) => {
    try {
      setSelectedVideo(video)
      
      // Check cache first
      const cachedVideo = getCachedData(video.id, 'videos') as Video | null;
      if (cachedVideo) {
        setSelectedVideo(prevVideo => ({
          ...prevVideo!,
          ...cachedVideo
        }));
        return;
      }

      const response = await fetch(`/api/youtube/video/${video.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch video details')
      }
      
      // Cache the result
      setCachedData(video.id, 'videos', data.video);
      setSelectedVideo(prevVideo => ({
        ...prevVideo!,
        ...data.video
      }))
    } catch (err) {
      handleAPIError(err);
    }
  }

  const clearSelectedVideo = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  return (
    <YouTubeContext.Provider value={{ 
      loading, 
      error, 
      searchChannel, 
      selectedVideo, 
      selectVideo,
      currentChannel,
      setCurrentChannel,
      apiError,
      handleAPIError,
      clearSelectedVideo
    }}>
      {children}
    </YouTubeContext.Provider>
  )
} 