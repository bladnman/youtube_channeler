'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

interface YouTubeContextType {
  videos: Video[]
  loading: boolean
  error: string | null
  searchChannel: (query: string) => Promise<void>
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

  const searchChannel = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Implement the actual API call to fetch YouTube videos
      // This will need to be implemented with YouTube Data API
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch videos')
      }
      
      setVideos(data.videos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <YouTubeContext.Provider value={{ videos, loading, error, searchChannel }}>
      {children}
    </YouTubeContext.Provider>
  )
} 