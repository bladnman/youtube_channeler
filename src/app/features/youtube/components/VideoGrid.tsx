'use client'

import { Box, Flex, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { useYouTubeContext } from '../context/YouTubeContext'
import { VideoDetail } from './VideoDetail'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

export const VideoGrid = () => {
  const { videos, loading, selectedVideo, selectVideo } = useYouTubeContext()

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Loading videos...</Text>
      </Box>
    )
  }

  if (!videos?.length) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No videos found. Try searching for a YouTube channel.</Text>
      </Box>
    )
  }

  return (
    <Flex>
      <Box flex={{ base: '1', lg: selectedVideo ? '0.6' : '1' }} transition="flex 0.3s">
        <SimpleGrid columns={{ base: 1, sm: 2, md: selectedVideo ? 2 : 3, lg: selectedVideo ? 2 : 4 }} spacing={6} p={4}>
          {videos.map((video: Video) => (
            <Box
              key={video.id}
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => selectVideo(video)}
              position="relative"
              borderWidth="2px"
              borderColor={selectedVideo?.id === video.id ? 'brand.500' : 'transparent'}
              _hover={{ transform: 'scale(1.02)' }}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width="100%"
                height="auto"
                objectFit="cover"
              />
              <Box p={4}>
                <Text fontWeight="semibold" noOfLines={2}>
                  {video.title}
                </Text>
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {new Date(video.publishedAt).toLocaleDateString()}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      
      {selectedVideo && (
        <Box
          flex="0.4"
          maxW="600px"
          display={{ base: 'none', lg: 'block' }}
          height="calc(100vh - 72px)"  // Adjust based on your header height
          position="sticky"
          top="72px"  // Should match your header height
          overflowX="hidden"
        >
          <VideoDetail />
        </Box>
      )}
    </Flex>
  )
} 