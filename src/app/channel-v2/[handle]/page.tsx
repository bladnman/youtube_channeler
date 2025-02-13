'use client';

import { GlassmorphicPanel } from '@/app/components/GlassmorphicPanel';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { HomeBackground } from '@/app/features/layout/components/HomeBackground';
import { ChannelHeaderV2 } from '@/app/features/youtube/components/ChannelHeaderV2';
import { VideoDetail } from '@/app/features/youtube/components/VideoDetail';
import { VideoGridV2 } from '@/app/features/youtube/components/VideoGridV2';
import { useChannel } from '@/app/features/youtube/hooks/useChannel';
import { useVideoSelection } from '@/app/features/youtube/hooks/useVideoSelection';
import { CrispText } from '@/app/styles/typography';
import { useLayout } from '@/app/theme/layout';
import { getRandomBackground } from '@/app/utils/backgrounds';
import { Box, Container, Fade, Flex } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function ChannelContent() {
  const params = useParams();
  const handle = params.handle as string;
  const [backgroundImage, setBackgroundImage] = useState('');
  const { channel } = useChannel(handle);
  const layout = useLayout();
  useVideoSelection(channel);

  useEffect(() => {
    setBackgroundImage(getRandomBackground());
  }, []);

  if (!channel) {
    return <LoadingSpinner />;
  }

  return (
    <HomeBackground backgroundImage={backgroundImage}>
      <Box position="relative" zIndex={1} pt={`calc(${layout.header.height} + 2rem)`}>
        <Container maxW="container.xl" pb={8}>
          {/* Main Container with Light Blur */}
          <GlassmorphicPanel blurStrength="light" variant="light">
            {/* Channel Header Section */}
            <Box px={6} py={4}>
              <ChannelHeaderV2 channel={channel} />
            </Box>

            {/* Content Area */}
            <Box px={10} py={5}>
              {/* Brighter Content Container */}
              <GlassmorphicPanel 
                blurStrength="stronger" 
                noBorder
                noShadow
                variant="light"
                sx={{
                  '& *': { color: 'gray.800' },
                  backgroundColor: 'rgba(255, 255, 255, 0.55) !important',
                }}
              >
                <Flex>
                  {/* Left Panel - Video List */}
                  <CrispText 
                    flex={1}
                    maxH="calc(100vh - 250px)"
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
                    maxH="calc(100vh - 250px)"
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
      </Box>
    </HomeBackground>
  );
}

export default function ChannelPageV2() {
  return (
    <Fade in>
      <ChannelContent />
    </Fade>
  );
} 