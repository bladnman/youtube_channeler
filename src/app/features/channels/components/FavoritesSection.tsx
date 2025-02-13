/**
 * FavoritesSection Component
 * Renders the favorites grid section with glassmorphism effects and custom scrollbar
 */

import { GlassmorphicPanel } from '@/app/components/GlassmorphicPanel';
import { LAYOUT, SCROLLBAR } from '@/app/constants/ui';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import FavoriteChannelsGrid from './FavoriteChannelsGrid';

export const FavoritesSection = () => {
  const favoritesHeight = useBreakpointValue({
    base: LAYOUT.FAVORITES_HEIGHT.BASE,
    md: LAYOUT.FAVORITES_HEIGHT.MD
  });

  return (
    <Box
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      display="flex"
      justifyContent="center"
      h={favoritesHeight}
    >
      <GlassmorphicPanel
        maxW={{ 
          base: LAYOUT.CONTAINER_MAX_WIDTH.BASE, 
          md: LAYOUT.CONTAINER_MAX_WIDTH.MD, 
          lg: LAYOUT.CONTAINER_MAX_WIDTH.LG 
        }}
        w="full"
        variant="light"
        blurStrength="medium"
        borderRadius="2xl"
        borderBottomRadius="none"
      >
        <Box
          h="full"
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: SCROLLBAR.WIDTH,
              borderRadius: SCROLLBAR.BORDER_RADIUS,
              backgroundColor: SCROLLBAR.BACKGROUND.LIGHT,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: SCROLLBAR.BACKGROUND.THUMB_LIGHT,
              borderRadius: SCROLLBAR.BORDER_RADIUS,
              _dark: {
                backgroundColor: SCROLLBAR.BACKGROUND.THUMB_DARK,
              }
            },
          }}
        >
          <Box p={4}>
            <FavoriteChannelsGrid />
          </Box>
        </Box>
      </GlassmorphicPanel>
    </Box>
  );
}; 