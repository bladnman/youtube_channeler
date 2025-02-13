'use client';

import { Box } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useLayout } from '../../../theme/layout';
import { Header } from './Header';

interface LayoutContentProps {
  children: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const layout = useLayout();
  const isChannelV2Page = pathname?.startsWith('/channel-v2/');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <Box>
      {!isChannelV2Page && <Header />}
      <Box
        as="main"
        pt={!isChannelV2Page ? layout.header.height : 0}
        minH="calc(100vh - 60px)"
        bg="gray.50"
      >
        {children}
      </Box>
    </Box>
  );
} 