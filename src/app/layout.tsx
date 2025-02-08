import type { Metadata } from 'next';
import { ChakraHead } from './features/layout/components/ChakraHead';
import { LayoutContent } from './features/layout/components/LayoutContent';
import { RootClientWrapper } from './features/layout/components/RootClientWrapper';
import RootStyleRegistry from './registry';

export const metadata: Metadata = {
  title: 'Channel Surfer',
  description: 'Your favorite YouTube channels in one place',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ChakraHead />
      </head>
      <body>
        <RootStyleRegistry>
          <RootClientWrapper>
            <LayoutContent>
              {children}
            </LayoutContent>
          </RootClientWrapper>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
