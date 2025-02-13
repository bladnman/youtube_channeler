/**
 * HomeBackground Component
 * Renders the main background container with a random background image
 */

import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useLayout } from '../../../theme/layout';

interface HomeBackgroundProps {
  backgroundImage: string;
  children: ReactNode;
}

export const HomeBackground = ({ backgroundImage, children }: HomeBackgroundProps) => {
  const layout = useLayout();
  
  return (
    <Box
      as="main"
      position="fixed"
      top={0}
      left="0"
      right="0"
      bottom="0"
      minH="100vh"
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