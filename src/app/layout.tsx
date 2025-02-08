import type { Metadata } from 'next';
import { Header } from './features/layout/components/Header';
import { Providers } from './providers';

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
      <body>
        <Providers>
          <Header />
          <main style={{ marginTop: '60px', padding: '20px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
