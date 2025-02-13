/**
 * Home Page Component
 * Main landing page of the application
 */

'use client'

import { VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FavoritesSection } from './features/channels/components/FavoritesSection';
import { HomeBackground } from './features/layout/components/HomeBackground';
import { SearchSection } from './features/youtube/components/SearchSection';
import { getRandomBackground } from './utils/backgrounds';

const HomeContent = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    setBackgroundImage(getRandomBackground());
  }, []);

  return (
    <HomeBackground backgroundImage={backgroundImage}>
      <VStack 
        spacing={0} 
        align="stretch" 
        h="full" 
        position="relative" 
        zIndex={1}
      >
        <SearchSection />
        <FavoritesSection />
      </VStack>
    </HomeBackground>
  );
};

export default function Home() {
  return <HomeContent />;
}
