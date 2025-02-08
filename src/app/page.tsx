'use client'

import { Box, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import FavoriteChannelsGrid from './features/channels/components/FavoriteChannelsGrid';
import { SearchBar } from './features/youtube/components/SearchBar';
import { getRandomBackground } from './utils/backgrounds';

const HomeContent = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const headerHeight = '54px'; // This should match your header height
  
  const favoritesHeight = useBreakpointValue({
    base: '30vh',
    md: '160px'
  });

  useEffect(() => {
    setBackgroundImage(getRandomBackground());
  }, []);

  return (
    <Box
      as="main"
      position="fixed"
      top={headerHeight}
      left="0"
      right="0"
      bottom="0"
      height={`calc(100vh - ${headerHeight})`}
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: 'brightness(0.9)',
        zIndex: 0,
      }}
    >
      <VStack 
        spacing={0} 
        align="stretch" 
        h="full" 
        position="relative" 
        zIndex={1}
      >
        {/* Search Section */}
        <Box 
          pt={{ base: 6, md: 8 }}
          px={4}
          mb="auto"
          display="flex"
          justifyContent="center"
        >
          <Box
            maxW={{ base: "90%", md: "900px", lg: "1000px" }}
            w="full"
            p={8}
            borderRadius="2xl"
            backdropFilter="blur(16px)"
            bg="rgba(255, 255, 255, 0.2)"
            boxShadow="xl"
            border="1px solid rgba(255, 255, 255, 0.3)"
            _dark={{
              bg: 'rgba(26, 32, 44, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <SearchBar />
          </Box>
        </Box>

        {/* Favorites Section */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          display="flex"
          justifyContent="center"
          h={favoritesHeight}
        >
          <Box
            maxW={{ base: "90%", md: "900px", lg: "1000px" }}
            w="full"
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(16px)"
            borderTop="1px solid rgba(255, 255, 255, 0.3)"
            borderTopLeftRadius="2xl"
            borderTopRightRadius="2xl"
            boxShadow="xl"
            overflow="hidden"
            _dark={{
              bg: 'rgba(26, 32, 44, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box
              h="full"
              overflowY="auto"
              sx={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  _dark: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                },
              }}
            >
              <Box p={4}>
                <FavoriteChannelsGrid />
              </Box>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default function Home() {
  return <HomeContent />;
}
