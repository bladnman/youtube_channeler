'use client';

import { Fade, Flex, Spinner } from '@chakra-ui/react';

export interface LoadingSpinnerProps {
  spinnerSize?: string;
  minHeight?: string;
  fadeDuration?: number;
  spinnerColor?: string;
  thickness?: string;
  speed?: string;
  emptyColor?: string;
}

export function LoadingSpinner({
  spinnerSize = 'xl',
  minHeight = '70vh',
  fadeDuration = 0.5,
  spinnerColor = 'brand.500',
  thickness = '4px',
  speed = '0.65s',
  emptyColor = 'gray.200',
}: LoadingSpinnerProps) {
  return (
    <Flex align="center" justify="center" minHeight={minHeight}>
      <Fade in={true} transition={{ enter: { duration: fadeDuration } }}>
        <Spinner thickness={thickness} speed={speed} emptyColor={emptyColor} color={spinnerColor} size={spinnerSize} />
      </Fade>
    </Flex>
  );
} 