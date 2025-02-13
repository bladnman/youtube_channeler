'use client'

import { copyToClipboard, generateVideoMarkdown } from '@/app/utils/copyToClipboard'
import { CopyIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, IconButton, Image, Link, Skeleton, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, VStack, useToast } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
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
  const toast = useToast()
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  
  const handleTranscript = async () => {
    if (!selectedVideo) return;
    setLoadingTranscript(true);
    try {
      console.log('Fetching transcript for video:', selectedVideo.id);
      const response = await fetch(`/api/transcript?videoId=${selectedVideo.id}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Transcript loaded successfully');
        setTranscript(data.transcript);
        toast({
          title: 'Transcript loaded',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
      } else {
        console.error('Failed to fetch transcript:', data.error);
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch transcript',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error in handleTranscript:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transcript. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoadingTranscript(false);
    }
  };
  
  const formattedDescription = useMemo(() => {
    return formatDescription(selectedVideo?.description)
  }, [selectedVideo?.description])
  
  const handleCopy = async () => {
    if (!selectedVideo) return;
    
    const markdown = generateVideoMarkdown(selectedVideo);
    const success = await copyToClipboard(markdown);
    
    toast({
      title: success ? 'Copied!' : 'Failed to copy',
      description: success ? 'Video information copied to clipboard' : 'Please try again',
      status: success ? 'success' : 'error',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right'
    });
  };
  
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
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Heading size="md" flex={1}>{selectedVideo.title}</Heading>
            <Tooltip 
              label="Copy video info" 
              placement="top"
              hasArrow
            >
              <IconButton
                icon={<CopyIcon />}
                aria-label="Copy video information"
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                colorScheme="brand"
              />
            </Tooltip>
          </Box>
          
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
          
          <Tabs variant="enclosed" mt={2}>
            <TabList>
              <Tab>Description</Tab>
              <Tab>Transcript</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>
                <Button
                  onClick={handleTranscript}
                  colorScheme="brand"
                  size="lg"
                  isLoading={loadingTranscript}
                  mb={2}
                >
                  {transcript ? "Refresh Transcript" : "Load Transcript"}
                </Button>
                {transcript && (
                  <Box mt={4}>
                    <Heading size="sm" mb={2}>Transcript</Heading>
                    <Text whiteSpace="pre-wrap" color="gray.700">
                      {transcript}
                    </Text>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </VStack>
    </Box>
  )
} 