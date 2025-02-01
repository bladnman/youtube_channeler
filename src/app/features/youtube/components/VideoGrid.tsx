'use client'

import { Box, Image, LinkBox, LinkOverlay, SimpleGrid, Text } from '@chakra-ui/react'
import { useYouTubeContext } from '../context/YouTubeContext'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

export const VideoGrid = () => {
  const { videos, loading } = useYouTubeContext()

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
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} p={4}>
      {videos.map((video: Video) => (
        <LinkBox
          key={video.id}
          borderRadius="lg"
          overflow="hidden"
          shadow="md"
          transition="transform 0.2s"
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
            <LinkOverlay href={video.url} target="_blank">
              <Text fontWeight="semibold" noOfLines={2}>
                {video.title}
              </Text>
            </LinkOverlay>
            <Text fontSize="sm" color="gray.600" mt={2}>
              {new Date(video.publishedAt).toLocaleDateString()}
            </Text>
          </Box>
        </LinkBox>
      ))}
    </SimpleGrid>
  )
} 