'use client';

import FavoriteButton from '@/app/features/channels/components/FavoriteButton';
import { VideoGrid } from '@/app/features/youtube/components/VideoGrid';
import { useYouTubeContext } from '@/app/features/youtube/context/YouTubeContext';
import { Box, Container, Fade, Flex, HStack, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

function ChannelPageLoading() {
  return (
    <Flex justify="center" align="center" minH="50vh">
      <Spinner size="xl" color="brand.500" thickness="4px" />
    </Flex>
  );
}

function ChannelPageContent() {
  const params = useParams();
  const { 
    setCurrentChannel, 
    handleAPIError, 
    clearSelectedVideo, 
    selectVideo,
    currentChannel,
    selectedVideo
  } = useYouTubeContext();
  const handle = params.handle as string;
  const hasSelectedFirstVideo = useRef(false);

  const fetchChannelData = useCallback(async () => {
    try {
      const response = await fetch(`/api/youtube/channel/${handle}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch channel');
      }
      
      setCurrentChannel(data);
    } catch (error) {
      console.error('Error fetching channel data:', error);
      if (error instanceof Error) {
        handleAPIError(error);
      }
    }
  }, [handle, setCurrentChannel, handleAPIError]);

  // Effect for fetching channel data
  useEffect(() => {
    hasSelectedFirstVideo.current = false;
    void fetchChannelData();

    return () => {
      setCurrentChannel(null);
      clearSelectedVideo();
      hasSelectedFirstVideo.current = false;
    };
  }, [handle, fetchChannelData, clearSelectedVideo, setCurrentChannel]);

  // Effect for handling initial video selection
  useEffect(() => {
    const videos = currentChannel?.videos;
    const firstVideo = videos?.[0];

    if (!hasSelectedFirstVideo.current && firstVideo && !selectedVideo) {
      hasSelectedFirstVideo.current = true;
      void selectVideo(firstVideo);
    }
  }, [currentChannel, selectedVideo, selectVideo]);

  if (!currentChannel) {
    return <ChannelPageLoading />;
  }

  return (
    <Container maxW="container.xl">
      <Box py={4}>
        <Flex alignItems="center" mb={8}>
          {currentChannel.thumbnail && (
            <Box
              as="img"
              src={currentChannel.thumbnail}
              alt={currentChannel.title}
              boxSize="80px"
              borderRadius="full"
              mr={4}
            />
          )}
          <Box flex={1}>
            <HStack justify="space-between" align="start" width="100%">
              <Box>
                <Text fontSize="2xl" fontWeight="bold">{currentChannel.title}</Text>
                <Text color="gray.600">
                  {currentChannel.subscriberCount} subscribers
                </Text>
              </Box>
              <FavoriteButton
                channelId={currentChannel.id}
                channelTitle={currentChannel.title}
                channelThumbnail={currentChannel.thumbnail}
                description={currentChannel.description}
                customUrl={currentChannel.customUrl}
              />
            </HStack>
          </Box>
        </Flex>

        <Text fontSize="xl" fontWeight="semibold" mb={4}>Videos</Text>
        <VideoGrid 
          videos={currentChannel.videos || []} 
          hideChannelInfo 
          currentChannel={currentChannel}
        />
      </Box>
    </Container>
  );
}

export default function ChannelPage() {
  return (
    <Fade in>
      <ChannelPageContent />
    </Fade>
  );
} 