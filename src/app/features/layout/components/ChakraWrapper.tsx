'use client';

import { Providers } from '@/app/providers';
import { ReactNode } from 'react';

interface ChakraWrapperProps {
  children: ReactNode;
}

export function ChakraWrapper({ children }: ChakraWrapperProps) {
  return <Providers>{children}</Providers>;
} 