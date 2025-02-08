import { useYouTubeContext } from '../context/YouTubeContext'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url?: string
}

export const useVideoSelection = () => {
  const { selectedVideo, selectVideo } = useYouTubeContext()

  const handleVideoSelect = (video: Video) => {
    void selectVideo({
      ...video,
      url: video.url || `https://www.youtube.com/watch?v=${video.id}`
    })
  }

  return {
    selectedVideo,
    handleVideoSelect
  }
} 