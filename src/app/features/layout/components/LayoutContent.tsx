'use client';

import { Box } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { useLayout } from '../../../theme/layout';
import { GlassmorphicHeader } from './GlassmorphicHeader';

interface LayoutContentProps {
  children: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const layout = useLayout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <Box position="relative" minH="100vh" bg="transparent" m={0} p={0}>
      <GlassmorphicHeader />
      <Box
        as="main"
        position="relative"
        zIndex={1}
        minH="100vh"
        bg="transparent"
        m={0}
        mt={`-${layout.header.height}`}
      >
        {children}
      </Box>
    </Box>
  );
} 