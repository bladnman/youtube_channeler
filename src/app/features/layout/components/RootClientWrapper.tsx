'use client';

import { ReactNode } from 'react';
import { ChakraWrapper } from './ChakraWrapper';

interface RootClientWrapperProps {
  children: ReactNode;
}

export function RootClientWrapper({ children }: RootClientWrapperProps) {
  return (
    <ChakraWrapper>
      {children}
    </ChakraWrapper>
  );
} 