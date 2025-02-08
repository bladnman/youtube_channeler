'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ChakraProvider 
        toastOptions={{ defaultOptions: { position: 'top' } }}
        cssVarsRoot="body"
        disableGlobalStyle={true}
      >
        {children}
      </ChakraProvider>
    </SessionProvider>
  );
} 