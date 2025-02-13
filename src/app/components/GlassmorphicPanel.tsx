'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface GlassmorphicPanelProps extends BoxProps {
  children: ReactNode;
  blurStrength?: 'light' | 'medium' | 'strong' | 'stronger';
  noBorder?: boolean;
  noShadow?: boolean;
  borderRadius?: string;
}

const BLUR_STRENGTHS = {
  light: 10,
  medium: 20,
  strong: 30,
  stronger: 40,
};

const BG_OPACITIES = {
  light: 0.02,
  medium: 0.03,
  strong: 0.4,
  stronger: 0.7,
};

export function GlassmorphicPanel({ 
  children, 
  blurStrength = 'medium',
  noBorder = false,
  noShadow = false,
  borderRadius = 'xl',
  ...props 
}: GlassmorphicPanelProps) {
  return (
    <Box
      backdropFilter={`blur(${BLUR_STRENGTHS[blurStrength]}px)`}
      backgroundColor={`rgba(0, 0, 0, ${BG_OPACITIES[blurStrength]})`}
      borderRadius={borderRadius}
      border={noBorder ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'}
      boxShadow={noShadow ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.2)'}
      overflow="hidden"
      {...props}
    >
      {children}
    </Box>
  );
} 