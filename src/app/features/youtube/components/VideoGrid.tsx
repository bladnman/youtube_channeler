'use client'

import { Box, Flex, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useYouTubeContext } from '../context/YouTubeContext'
import { useVideoSelection } from '../hooks/useVideoSelection'
import { ChannelHeader } from './ChannelHeader'
import { VideoCard } from './VideoCard'
import { VideoDetail } from './VideoDetail'

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
    <Flex direction="column" align="center">
      {displayChannel && !hideChannelInfo && (
        <ChannelHeader channel={displayChannel} />
      )}
      
      <Flex justify="center">
        <Box 
          flex={{ base: '1', lg: selectedVideo ? '0.6' : '1' }} 
          transition="flex 0.3s"
          maxW="1400px"
          w="full"
          mx="auto"
        >
          <Wrap 
            spacing={6} 
            justify="center"
            p={4}
            display="flex"
            alignItems="center"
          >
            {videos.map((video) => (
              <WrapItem key={video.id}>
                <VideoCard
                  video={video}
                  isSelected={selectedVideo?.id === video.id}
                  onSelect={handleVideoSelect}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
        
        {selectedVideo && (
          <Box
            flex="0.4"
            maxW="600px"
            display={{ base: 'none', lg: 'block' }}
            height="calc(100vh - 72px)"
            position="sticky"
            top="72px"
            overflowX="hidden"
          >
            <VideoDetail />
          </Box>
        )}
      </Flex>
    </Flex>
  )
} 