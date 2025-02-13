'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import type { Video } from '../context/YouTubeContext'
import { useYouTubeContext } from '../context/YouTubeContext'
import { VideoListCard } from './VideoListCard'

interface VideoGridProps {
  videos: Video[]
  hideChannelInfo?: boolean
  currentChannel?: any
}

export const VideoGrid = ({ videos, hideChannelInfo }: VideoGridProps) => {
  const { selectedVideo, selectVideo } = useYouTubeContext()

  if (!videos?.length) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No videos found.</Text>
      </Box>
    )
  }

  return (
    <Flex direction="column" gap={2}>
      {videos.map((video) => (
        <VideoListCard
          key={video.id}
          video={video}
          isSelected={selectedVideo?.id === video.id}
          onSelect={selectVideo}
          hideChannelInfo={hideChannelInfo}
        />
      ))}
    </Flex>
  )
} 