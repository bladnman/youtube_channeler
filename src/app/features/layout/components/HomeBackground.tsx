/**
 * HomeBackground Component
 * Renders the main background container with a random background image
 */

import { LAYOUT } from '@/app/constants/ui';
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface HomeBackgroundProps {
  backgroundImage: string;
  children: ReactNode;
}

export const HomeBackground = ({ backgroundImage, children }: HomeBackgroundProps) => {
  return (
    <Box
      as="main"
      position="fixed"
      top={LAYOUT.HEADER_HEIGHT}
      left="0"
      right="0"
      bottom="0"
      height={`calc(100vh - ${LAYOUT.HEADER_HEIGHT})`}
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
      {children}
    </Box>
  );
}; 