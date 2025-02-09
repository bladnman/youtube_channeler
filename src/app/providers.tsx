'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { theme } from './theme';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ChakraProvider 
        theme={theme}
        toastOptions={{ defaultOptions: { position: 'top' } }}
      >
        {children}
      </ChakraProvider>
    </SessionProvider>
  );
} 