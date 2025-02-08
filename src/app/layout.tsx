import type { Metadata } from 'next';
import { ChakraHead } from './features/layout/components/ChakraHead';
import { LayoutContent } from './features/layout/components/LayoutContent';
import { RootClientWrapper } from './features/layout/components/RootClientWrapper';
import { YouTubeProvider } from './features/youtube/context/YouTubeContext';
import RootStyleRegistry from './registry';

export const metadata: Metadata = {
  title: 'YouTube Channeler',
  description: 'Your favorite YouTube channels in one place',
  icons: {
    icon: '/images/channeler_icon.png',
    apple: '/images/channeler_icon.png',
  },
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
            <YouTubeProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </YouTubeProvider>
          </RootClientWrapper>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
