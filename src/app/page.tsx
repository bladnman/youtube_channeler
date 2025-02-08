'use client'

import { Box, Container, Divider, Heading, VStack } from '@chakra-ui/react'
import FavoriteChannelsGrid from './features/channels/components/FavoriteChannelsGrid'
import { SearchBar } from './features/youtube/components/SearchBar'
import { VideoGrid } from './features/youtube/components/VideoGrid'
import { YouTubeProvider } from './features/youtube/context/YouTubeContext'

export default function Home() {
  return (
    <YouTubeProvider>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={12} align="stretch">
            {/* Search Section */}
            <VStack spacing={6} align="stretch">
              <Heading size="lg">YouTube Channel Explorer</Heading>
              <SearchBar />
              <VideoGrid />
            </VStack>

            {/* Divider with text */}
            <Divider />
            
            {/* Favorites Section */}
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Your Favorite Channels</Heading>
              <FavoriteChannelsGrid />
            </VStack>
          </VStack>
        </Container>
      </Box>
    </YouTubeProvider>
  )
}
