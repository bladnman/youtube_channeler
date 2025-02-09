'use client'

import { Box, Flex, GridItem, Text } from '@chakra-ui/react'
import { useYouTubeContext } from '../context/YouTubeContext'
import { useVideoSelection } from '../hooks/useVideoSelection'
import { ChannelHeader } from './ChannelHeader'
import { VideoCard } from './VideoCard'
import { VideoDetail } from './VideoDetail'
import { VideoGridLayout } from './VideoGridLayout'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url?: string
}

interface Channel {
  id: string
  title: string
  thumbnail: string
  description: string
}

interface VideoGridProps {
  videos: Video[]
  hideChannelInfo?: boolean
  currentChannel?: Channel
}

export const VideoGrid = ({ videos, hideChannelInfo, currentChannel: propChannel }: VideoGridProps) => {
  const { currentChannel: contextChannel } = useYouTubeContext()
  const { selectedVideo, handleVideoSelect } = useVideoSelection()
  const displayChannel = propChannel || contextChannel

  if (!videos?.length) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No videos found.</Text>
      </Box>
    )
  }

  return (
    <Flex direction="column" w="full">
      {displayChannel && !hideChannelInfo && (
        <ChannelHeader channel={displayChannel} />
      )}
      
      <Flex w="full">
        <Box 
          flex="1"
          maxW={selectedVideo ? "calc(100% - 400px)" : "full"}
          transition="max-width 0.3s"
        >
          <Box maxW="1400px" mx="auto">
            <VideoGridLayout hasDetails={!!selectedVideo}>
              {videos.map((video) => (
                <GridItem key={video.id}>
                  <VideoCard
                    video={video}
                    isSelected={selectedVideo?.id === video.id}
                    onSelect={handleVideoSelect}
                  />
                </GridItem>
              ))}
            </VideoGridLayout>
          </Box>
        </Box>
        
        {selectedVideo && (
          <Box
            w="400px"
            flexShrink={0}
            display={{ base: 'none', lg: 'block' }}
            height="calc(100vh - 72px)"
            position="sticky"
            top="72px"
            overflowX="hidden"
            borderLeft="1px"
            borderColor="gray.200"
            _dark={{ borderColor: 'gray.700' }}
          >
            <VideoDetail />
          </Box>
        )}
      </Flex>
    </Flex>
  )
} 