'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

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
}

interface YouTubeContextType {
  videos: Video[]
  loading: boolean
  error: string | null
  selectedVideo: Video | null
  currentChannel: Channel | null
  searchChannel: (query: string) => Promise<void>
  selectVideo: (video: Video) => Promise<void>
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
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

  const searchChannel = async (query: string) => {
    setLoading(true)
    setError(null)
    setSelectedVideo(null)
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch videos')
      }
      
      setCurrentChannel(data.channel)
      setVideos(data.videos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setVideos([])
      setCurrentChannel(null)
    } finally {
      setLoading(false)
    }
  }

  const selectVideo = async (video: Video) => {
    try {
      // First set the basic video info we already have
      setSelectedVideo(video)
      
      // Then fetch detailed information
      const response = await fetch(`/api/youtube/video/${video.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch video details')
      }
      
      // Update the selected video with detailed information
      setSelectedVideo(prevVideo => ({
        ...prevVideo!,
        ...data.video
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video details')
      // Keep the basic video information even if details fetch fails
    }
  }

  return (
    <YouTubeContext.Provider value={{ 
      videos, 
      loading, 
      error, 
      searchChannel, 
      selectedVideo, 
      selectVideo,
      currentChannel 
    }}>
      {children}
    </YouTubeContext.Provider>
  )
} 