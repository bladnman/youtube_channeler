/**
 * SearchSection Component
 * Renders the search bar section with glassmorphism effects
 */

import { GLASSMORPHISM, LAYOUT } from '@/app/constants/ui';
import { Box } from '@chakra-ui/react';
import { SearchBar } from './SearchBar';

export const SearchSection = () => {
  return (
    <Box 
      pt={{ base: 6, md: 8 }}
      px={4}
      mb="auto"
      display="flex"
      justifyContent="center"
    >
      <Box
        maxW={{ 
          base: LAYOUT.CONTAINER_MAX_WIDTH.BASE, 
          md: LAYOUT.CONTAINER_MAX_WIDTH.MD, 
          lg: LAYOUT.CONTAINER_MAX_WIDTH.LG 
        }}
        w="full"
        p={8}
        borderRadius="2xl"
        backdropFilter={`blur(${GLASSMORPHISM.BLUR})`}
        bg={GLASSMORPHISM.BACKGROUND.LIGHT}
        boxShadow="xl"
        border={`1px solid ${GLASSMORPHISM.BORDER.LIGHT}`}
        _dark={{
          bg: GLASSMORPHISM.BACKGROUND.DARK,
          borderColor: GLASSMORPHISM.BORDER.DARK
        }}
      >
        <SearchBar />
      </Box>
    </Box>
  );
}; 