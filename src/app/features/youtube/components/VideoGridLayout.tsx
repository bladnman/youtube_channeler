import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface VideoGridLayoutProps {
  children: ReactNode;
  hasDetails?: boolean;
}

export function VideoGridLayout({ children, hasDetails }: VideoGridLayoutProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "1fr", // Mobile: single column
        md: "repeat(auto-fit, 320px)", // Tablet and up: auto-fit 320px columns
      }}
      gap={6}
      p={4}
      justifyContent="center"
    >
      {children}
    </Box>
  );
} 