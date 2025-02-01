'use client'

import { Box } from '@chakra-ui/react'
import { SearchBar } from './features/youtube/components/SearchBar'
import { VideoGrid } from './features/youtube/components/VideoGrid'
import { YouTubeProvider } from './features/youtube/context/YouTubeContext'

export default function Home() {
  return (
    <YouTubeProvider>
      <Box minH="100vh" bg="gray.50">
        <SearchBar />
        <Box maxW="container.xl" mx="auto" px={4}>
          <VideoGrid />
        </Box>
      </Box>
    </YouTubeProvider>
  )
}
