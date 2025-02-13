'use client';

import { Box } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { useLayout } from '../../../theme/layout';
import { getRandomBackground } from '../../../utils/backgrounds';
import { GlassmorphicHeader } from './GlassmorphicHeader';
import { HomeBackground } from './HomeBackground';

interface LayoutContentProps {
  children: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const layout = useLayout();
  const [mounted, setMounted] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    setMounted(true);
    setBackgroundImage(getRandomBackground());
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <HomeBackground backgroundImage={backgroundImage}>
      <Box position="relative" height="100vh" bg="transparent" m={0} p={0} overflow="hidden">
        <GlassmorphicHeader />
        <Box
          as="main"
          position="relative"
          zIndex={1}
          height={`calc(100vh - ${layout.header.height})`}
          bg="transparent"
          m={0}
          mt={layout.header.height}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          {children}
        </Box>
      </Box>
    </HomeBackground>
  );
} 