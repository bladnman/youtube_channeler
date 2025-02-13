'use client'

import { ViewGridIcon, ViewListIcon } from '@/app/components/Icons'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { Box, Flex, GridItem, IconButton, Stack, Text, Tooltip, useBreakpointValue } from '@chakra-ui/react'
import { useYouTubeContext } from '../context/YouTubeContext'
import { useVideoSelection } from '../hooks/useVideoSelection'
import { ChannelHeader } from './ChannelHeader'
import { VideoCard } from './VideoCard'
import { VideoDetail } from './VideoDetail'
import { VideoGridLayout } from './VideoGridLayout'
import { VideoListCard } from './VideoListCard'

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
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('videoViewMode', 'list')
  
  const detailWidth = useBreakpointValue({
    base: 'full',
    lg: '500px',
    xl: '600px'
  }) || '500px'

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
          maxW={selectedVideo ? `calc(100% - ${detailWidth})` : "full"}
          transition="max-width 0.3s"
        >
          <Box maxW="1400px" mx="auto">
            <Flex justify="flex-end" px={4} pt={4} pb={2}>
              <Tooltip label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}>
                <IconButton
                  aria-label="Toggle view"
                  icon={viewMode === 'grid' ? <ViewListIcon /> : <ViewGridIcon />}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  variant="ghost"
                  colorScheme="gray"
                  size="sm"
                />
              </Tooltip>
            </Flex>
            
            {viewMode === 'grid' ? (
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
            ) : (
              <Box p={4}>
                <Stack spacing={3}>
                  {videos.map((video) => (
                    <VideoListCard
                      key={video.id}
                      video={video}
                      isSelected={selectedVideo?.id === video.id}
                      onSelect={handleVideoSelect}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
        
        {selectedVideo && (
          <Box
            w={detailWidth}
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