/**
 * SearchSection Component
 * Renders the search bar section with glassmorphism effects
 */

import { GlassmorphicPanel } from '@/app/components/GlassmorphicPanel';
import { LAYOUT } from '@/app/constants/ui';
import { useLayout } from '@/app/theme/layout';
import { Box } from '@chakra-ui/react';
import { SearchBar } from './SearchBar';

export const SearchSection = () => {
  const layout = useLayout();
  
  return (
    <Box 
      pt={`calc(${layout.header.height} + 2rem)`}
      px={4}
      mb="auto"
      display="flex"
      justifyContent="center"
    >
      <GlassmorphicPanel
        maxW={{ 
          base: LAYOUT.CONTAINER_MAX_WIDTH.BASE, 
          md: LAYOUT.CONTAINER_MAX_WIDTH.MD, 
          lg: LAYOUT.CONTAINER_MAX_WIDTH.LG 
        }}
        w="full"
        p={8}
        borderRadius="2xl"
        variant="light"
        blurStrength="medium"
      >
        <SearchBar />
      </GlassmorphicPanel>
    </Box>
  );
}; 