'use client'

import { Box, Button, Heading, Image, Link, Skeleton, Stack, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useYouTubeContext } from '../context/YouTubeContext'

const formatNumber = (num?: string) => {
  if (!num) return ''
  const n = parseInt(num)
  if (isNaN(n)) return num
  return new Intl.NumberFormat('en-US').format(n)
}

const formatDescription = (description: string = '') => {
  // Split description into lines
  const lines = description.split('\n')
  
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g
  
  return lines.map((line, index) => {
    // Replace URLs with links
    const parts = line.split(urlPattern)
    const formattedParts = parts.map((part, i) => {
      if (part.match(urlPattern)) {
        return (
          <Link key={i} href={part} color="blue.500" isExternal>
            {part}
          </Link>
        )
      }
      return part
    })
    
    return (
      <Text key={index} mb={2}>
        {formattedParts}
      </Text>
    )
  })
}

export const VideoDetail = () => {
  const { selectedVideo, loading } = useYouTubeContext()
  
  const formattedDescription = useMemo(() => {
    return formatDescription(selectedVideo?.description)
  }, [selectedVideo?.description])
  
  if (!selectedVideo) return null
  
  return (
    <Box
      p={{ base: 4, md: 6 }}
      borderLeft="1px"
      borderColor="gray.200"
      height="100%"
      overflowY="auto"
      overflowX="hidden"
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Box
          position="relative"
          width="100%"
          paddingTop="56.25%"  // 16:9 aspect ratio
        >
          <Image
            src={selectedVideo.thumbnail}
            alt={selectedVideo.title}
            borderRadius="lg"
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
        
        <Stack spacing={{ base: 3, md: 4 }} maxW="850px" mx="auto" w="100%">
          <Heading size="md">{selectedVideo.title}</Heading>
          
          {selectedVideo.channelTitle && (
            <Text fontSize="md" color="gray.700" fontWeight="medium">
              {selectedVideo.channelTitle}
            </Text>
          )}
          
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} color="gray.600">
            {selectedVideo.viewCount && (
              <Text>👁️ {formatNumber(selectedVideo.viewCount)} views</Text>
            )}
            {selectedVideo.likeCount && (
              <Text>👍 {formatNumber(selectedVideo.likeCount)} likes</Text>
            )}
            {selectedVideo.duration && (
              <Text>⏱️ {selectedVideo.duration}</Text>
            )}
          </Stack>
          
          <Text color="gray.600">
            📅 Published {new Date(selectedVideo.publishedAt).toLocaleDateString()}
          </Text>
          
          <Button
            as="a"
            href={selectedVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="brand"
            leftIcon={<span>▶️</span>}
            size="lg"
          >
            Watch on YouTube
          </Button>
          
          <Box>
            <Heading size="sm" mb={3}>Description</Heading>
            <Box color="gray.700">
              {loading ? (
                <Stack spacing={2}>
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                formattedDescription
              )}
            </Box>
          </Box>
        </Stack>
      </VStack>
    </Box>
  )
} 