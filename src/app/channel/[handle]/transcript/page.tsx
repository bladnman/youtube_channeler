'use client';

import { LoadingSpinner } from '@/app/components/LoadingSpinner';
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
    return <LoadingSpinner spinnerSize="lg" minHeight="50vh" fadeDuration={0.5} />;
  }

  return (
    <Container maxW="container.lg" py={4}>
      {error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box>
          <Text fontSize="xl" mb={4}>Transcript</Text>
          <Text whiteSpace="pre-wrap">{transcript}</Text>
        </Box>
      )}
    </Container>
  );
} 