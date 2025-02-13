'use client';

import FavoriteButton from '@/app/features/channels/components/FavoriteButton';
import { VideoGrid } from '@/app/features/youtube/components/VideoGrid';
import { useYouTubeContext } from '@/app/features/youtube/context/YouTubeContext';
import { Box, Container, Fade, Flex, HStack, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description?: string;
}

interface ChannelData {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  subscriberCount: string;
  videos: Video[];
  customUrl: string;
}

function ChannelPageLoading() {
  return (
    <Flex align="center" justify="center" minHeight="70vh">
      <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="brand.500" size="xl" />
      </Fade>
    </Flex>
  );
}

function ChannelPageContent() {
  const params = useParams();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const { setCurrentChannel, handleAPIError, clearSelectedVideo } = useYouTubeContext();
  const handle = params.handle as string;

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await fetch(`/api/youtube/channel/${handle}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch channel');
        }
        
        setChannelData(data);
        
        // Set the channel in the context
        const channelInfo = { ...data };
        delete channelInfo.videos;
        setCurrentChannel(channelInfo);
      } catch (error) {
        console.error('Error fetching channel data:', error);
        if (error instanceof Error) {
          handleAPIError(error);
        }
      }
    };

    if (handle) {
      void fetchChannelData();
    }

    // Clean up the context when unmounting
    return () => {
      setCurrentChannel(null);
      clearSelectedVideo();
    };
  }, [handle, setCurrentChannel, handleAPIError, clearSelectedVideo]);

  if (!channelData) {
    return <ChannelPageLoading />;
  }

  const { videos, ...channelInfo } = channelData;

  return (
    <Container maxW="container.xl">
      <Box py={4}>
        <Flex alignItems="center" mb={8}>
          {channelData.thumbnail && (
            <Box
              as="img"
              src={channelData.thumbnail}
              alt={channelData.title}
              boxSize="80px"
              borderRadius="full"
              mr={4}
            />
          )}
          <Box flex={1}>
            <HStack justify="space-between" align="start" width="100%">
              <Box>
                <Text fontSize="2xl" fontWeight="bold">{channelData.title}</Text>
                <Text color="gray.600">
                  {channelData.subscriberCount} subscribers
                </Text>
              </Box>
              <FavoriteButton
                channelId={channelData.id}
                channelTitle={channelData.title}
                channelThumbnail={channelData.thumbnail}
                description={channelData.description}
                customUrl={channelData.customUrl}
              />
            </HStack>
          </Box>
        </Flex>

        <Text fontSize="xl" fontWeight="semibold" mb={4}>Videos</Text>
        <VideoGrid 
          videos={videos} 
          hideChannelInfo 
          currentChannel={channelInfo}
        />
      </Box>
    </Container>
  );
}

export default function ChannelPage() {
  return <ChannelPageContent />;
} 