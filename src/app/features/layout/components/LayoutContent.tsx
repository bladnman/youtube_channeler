'use client';

import { Box } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Header';

interface LayoutContentProps {
  children: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <Box 
        as="main" 
        mt="60px"
        minH="calc(100vh - 60px)"
        bg="gray.50"
        position="relative"
      >
        {children}
      </Box>
    </>
  );
} 