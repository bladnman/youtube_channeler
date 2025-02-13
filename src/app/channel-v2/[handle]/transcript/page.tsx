'use client';

import { GlassmorphicPanel } from '@/app/components/GlassmorphicPanel';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { HomeBackground } from '@/app/features/layout/components/HomeBackground';
import { CrispText } from '@/app/styles/typography';
import { getRandomBackground } from '@/app/utils/backgrounds';
import { Box, Container, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TranscriptData {
  transcript: string;
}

export default function TranscriptPage() {
  const { handle } = useParams();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    setBackgroundImage(getRandomBackground());
  }, []);

  useEffect(() => {
    if (!handle) return;

    const fetchTranscript = async () => {
      try {
        const response = await fetch(`/api/transcript?handle=${handle}`);
        const data: TranscriptData = await response.json();
        if (!response.ok) {
          throw new Error(data.transcript || 'Failed to fetch transcript');
        }
        setTranscript(data.transcript);
      } catch (err) {
        console.error('Error fetching transcript:', err);
        setError('Error loading transcript. Please try again.');
      }
    };

    void fetchTranscript();
  }, [handle]);

  if (!transcript && !error) {
    return <LoadingSpinner />;
  }

  return (
    <HomeBackground backgroundImage={backgroundImage}>
      <Box position="relative" zIndex={1}>
        <Container maxW="container.xl" pb={8}>
          <GlassmorphicPanel mt={8} blurStrength="light">
            <Box px={6} py={4}>
              <CrispText>
                {error ? (
                  <Text color="red.500">{error}</Text>
                ) : (
                  <Box>
                    <Text fontSize="xl" mb={4} color="white">Transcript</Text>
                    <Text whiteSpace="pre-wrap" color="whiteAlpha.900">{transcript}</Text>
                  </Box>
                )}
              </CrispText>
            </Box>
          </GlassmorphicPanel>
        </Container>
      </Box>
    </HomeBackground>
  );
} 