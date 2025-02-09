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
        sm: "repeat(auto-fit, minmax(240px, 1fr))", // Small screens: 240px minimum
        md: "repeat(auto-fit, minmax(260px, 1fr))", // Medium screens: 260px minimum
        lg: hasDetails ? "repeat(auto-fit, minmax(260px, 1fr))" : "repeat(auto-fit, minmax(280px, 1fr))", // Large screens
      }}
      gap={4}
      p={4}
      justifyContent="center"
    >
      {children}
    </Box>
  );
} 