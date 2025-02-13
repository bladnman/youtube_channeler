'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface GlassmorphicPanelProps extends BoxProps {
  children: ReactNode;
  blurStrength?: 'light' | 'medium' | 'strong' | 'stronger';
  noBorder?: boolean;
  noShadow?: boolean;
  borderRadius?: string;
  variant?: 'light' | 'dark';
}

const BLUR_STRENGTHS = {
  light: 10,
  medium: 20,
  strong: 30,
  stronger: 40,
};

const BG_OPACITIES = {
  light: {
    light: 0.1,
    medium: 0.15,
    strong: 0.2,
    stronger: 0.25,
  },
  dark: {
    light: 0.2,
    medium: 0.3,
    strong: 0.4,
    stronger: 0.7,
  },
};

export function GlassmorphicPanel({ 
  children, 
  blurStrength = 'medium',
  noBorder = false,
  noShadow = false,
  borderRadius = 'xl',
  variant = 'dark',
  ...props 
}: GlassmorphicPanelProps) {
  const bgColor = variant === 'light' 
    ? `rgba(255, 255, 255, ${BG_OPACITIES[variant][blurStrength]})`
    : `rgba(0, 0, 0, ${BG_OPACITIES[variant][blurStrength]})`;

  const borderColor = variant === 'light'
    ? 'rgba(255, 255, 255, 0.3)'
    : 'rgba(255, 255, 255, 0.1)';

  return (
    <Box
      backdropFilter={`blur(${BLUR_STRENGTHS[blurStrength]}px)`}
      backgroundColor={bgColor}
      borderRadius={borderRadius}
      border={noBorder ? 'none' : `1px solid ${borderColor}`}
      boxShadow={noShadow ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.2)'}
      overflow="hidden"
      {...props}
    >
      {children}
    </Box>
  );
} 