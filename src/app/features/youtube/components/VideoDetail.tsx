'use client'

import { GlassmorphicButton } from '@/app/components/GlassmorphicButton'
import { LoadingSpinner } from '@/app/components/LoadingSpinner'
import { copyToClipboard, generateVideoMarkdown } from '@/app/utils/copyToClipboard'
import { formatCompactNumber } from '@/app/utils/formatters'
import { CalendarIcon, CopyIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, Icon, IconButton, Image, Link, Skeleton, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { FaThumbsUp } from 'react-icons/fa'
import { useYouTubeContext } from '../context/YouTubeContext'

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
  const [tabIndex, setTabIndex] = useState(0);
  
  // Reset tab index when video changes
  useEffect(() => {
    setTabIndex(0);
    setTranscript(null);
  }, [selectedVideo?.id]);
  
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
      height="100%"
      overflowY="auto"
      overflowX="hidden"
      color="white"
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Box
          position="relative"
          width="100%"
          paddingTop="56.25%"  // 16:9 aspect ratio
          borderRadius="xl"
          overflow="hidden"
          shadow="lg"
        >
          <Image
            src={selectedVideo.thumbnail}
            alt={selectedVideo.title}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
        
        <Stack spacing={{ base: 3, md: 4 }} maxW="850px" mx="auto" w="100%">
          <Box display="flex" alignItems="flex-start" gap={3}>
            <Heading size="md" flex={1} color="white">{selectedVideo.title}</Heading>
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
            <VStack spacing={0.5} align="flex-start">
              <Text 
                fontSize="md" 
                color="gray.800" 
                fontWeight="semibold"
              >
                {selectedVideo.channelTitle}
              </Text>
              {selectedVideo.subscriberCount && (
                <Text 
                  fontSize="sm" 
                  color="gray.700" 
                  fontWeight="medium"
                >
                  {formatCompactNumber(selectedVideo.subscriberCount)} subscribers
                </Text>
              )}
            </VStack>
          )}
          
          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            spacing={{ base: 2, sm: 4 }} 
            color="whiteAlpha.700"
            fontSize="sm"
            divider={
              <Box 
                display={{ base: 'none', sm: 'block' }} 
                as="span" 
                color="whiteAlpha.200"
                opacity={0.3}
              >
                •
              </Box>
            }
          >
            {selectedVideo.viewCount && (
              <HStack spacing={1.5}>
                <ViewIcon boxSize={3.5} />
                <Text>{formatCompactNumber(selectedVideo.viewCount)} views</Text>
              </HStack>
            )}
            {selectedVideo.likeCount && (
              <HStack spacing={1.5}>
                <Icon as={FaThumbsUp} boxSize={3.5} />
                <Text>{formatCompactNumber(selectedVideo.likeCount)} likes</Text>
              </HStack>
            )}
            {selectedVideo.duration && (
              <HStack spacing={1.5}>
                <TimeIcon boxSize={3.5} />
                <Text>{selectedVideo.duration}</Text>
              </HStack>
            )}
            <HStack spacing={1.5}>
              <CalendarIcon boxSize={3.5} />
              <Text>{new Date(selectedVideo.publishedAt).toLocaleDateString()}</Text>
            </HStack>
          </Stack>
          
          <GlassmorphicButton
            variant="text"
            as="a"
            href={selectedVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="brand"
            size="md"
            width="full"
            glassStrength="medium"
          >
            Watch on YouTube
          </GlassmorphicButton>
          
          <Tabs 
            variant="line" 
            colorScheme="brand"
            mt={2} 
            index={tabIndex}
            onChange={(index) => {
              setTabIndex(index);
              if (index === 1 && !transcript && !loadingTranscript) {
                void handleTranscript();
              }
            }}
          >
            <TabList>
              <Tab>Description</Tab>
              <Tab>Transcript</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <Box color="whiteAlpha.900">
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
              <TabPanel px={0}>
                {loadingTranscript ? (
                  <LoadingSpinner spinnerSize="md" minHeight="100px" fadeDuration={0.5} />
                ) : transcript ? (
                  <Box>
                    <Text whiteSpace="pre-wrap" color="gray.800" fontSize="sm">
                      {transcript}
                    </Text>
                  </Box>
                ) : null}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </VStack>
    </Box>
  )
} 