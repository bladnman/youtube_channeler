'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface GlassmorphicBackgroundProps extends BoxProps {
  children: ReactNode;
  backgroundImage?: string;
}

export function GlassmorphicBackground({ 
  children, 
  backgroundImage = '/images/gradient-bg.svg',
  ...props 
}: GlassmorphicBackgroundProps) {
  return (
    <Box
      position="relative"
      minH="100vh"
      {...props}
    >
      {/* Background Image */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${backgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        filter="brightness(0.9)"
        zIndex={-1}
      />

      {/* Content */}
      <Box
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>
    </Box>
  );
} 