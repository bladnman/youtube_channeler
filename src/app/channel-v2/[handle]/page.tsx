'use client';

import { GlassmorphicPanel } from '@/app/components/GlassmorphicPanel';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ChannelHeaderV2 } from '@/app/features/youtube/components/ChannelHeaderV2';
import { VideoDetail } from '@/app/features/youtube/components/VideoDetail';
import { VideoGridV2 } from '@/app/features/youtube/components/VideoGridV2';
import { useChannel } from '@/app/features/youtube/hooks/useChannel';
import { useVideoSelection } from '@/app/features/youtube/hooks/useVideoSelection';
import { CrispText } from '@/app/styles/typography';
import { Box, Container, Fade, Flex } from '@chakra-ui/react';
import { useParams } from 'next/navigation';

function LoadingState() {
  return (
    <Container maxW="container.xl" height="100%" display="flex" alignItems="center" justifyContent="center">
      <GlassmorphicPanel 
        blurStrength="light" 
        variant="light" 
        p={8}
        width="auto"
        height="auto"
      >
        <LoadingSpinner />
      </GlassmorphicPanel>
    </Container>
  );
}

function ChannelPanel({ channel }: { channel: any }) {
  return (
    <Container maxW="container.xl" height="90vh">
      {/* Main Container with Light Blur */}
      <GlassmorphicPanel blurStrength="light" variant="light" height="100%">
        {/* Channel Header Section */}
        <Box px={6} py={4}>
          <ChannelHeaderV2 channel={channel} />
        </Box>

        {/* Content Area */}
        <Box px={10} py={5} height="calc(100% - 100px)"> {/* Adjust based on header height */}
          {/* Brighter Content Container */}
          <GlassmorphicPanel 
            blurStrength="stronger" 
            noBorder
            noShadow
            variant="light"
            height="100%"
            sx={{
              '& *': { color: 'gray.800' },
              backgroundColor: 'rgba(255, 255, 255, 0.55) !important',
            }}
          >
            <Flex height="100%">
              {/* Left Panel - Video List */}
              <CrispText 
                flex={1}
                height="100%"
                overflowY="auto"
                borderRight="1px solid rgba(0, 0, 0, 0.1)"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                  },
                }}
              >
                <Box p={4}>
                  <VideoGridV2 videos={channel.videos || []} />
                </Box>
              </CrispText>

              {/* Right Panel - Video Details */}
              <CrispText 
                flex={1.5}
                height="100%"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                  },
                }}
              >
                <Box p={4}>
                  <VideoDetail />
                </Box>
              </CrispText>
            </Flex>
          </GlassmorphicPanel>
        </Box>
      </GlassmorphicPanel>
    </Container>
  );
}

function ChannelContent() {
  const params = useParams();
  const handle = params.handle as string;
  const { channel } = useChannel(handle);
  useVideoSelection(channel);

  if (!channel) {
    return <LoadingState />;
  }

  return <ChannelPanel channel={channel} />;
}

export default function ChannelPageV2() {
  return (
    <Fade in>
      <ChannelContent />
    </Fade>
  );
} 