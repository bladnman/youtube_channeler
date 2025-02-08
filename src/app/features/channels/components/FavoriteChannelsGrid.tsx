import { useFirebaseAuth } from '@/app/hooks/useFirebaseAuth';
import { FavoriteChannel, getFavoriteChannels } from '@/app/models/FavoriteChannel';
import { WarningIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ChannelGridSkeleton } from './ChannelCardSkeleton';
import { EmptyFavorites } from './EmptyFavorites';

export default function FavoriteChannelsGrid() {
  const { data: session } = useSession();
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  const [channels, setChannels] = useState<FavoriteChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadFavorites = useCallback(async () => {
    if (!firebaseUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const favorites = await getFavoriteChannels();
      setChannels(favorites);
    } catch (error) {
      console.error('Error loading favorite channels:', error);
      setError('Failed to load favorite channels. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  if (!session) {
    return (
      <Box p={6} textAlign="center">
        <Heading size="md">Please sign in to view your favorite channels</Heading>
      </Box>
    );
  }

  if (firebaseLoading || loading) {
    return <ChannelGridSkeleton />;
  }

  if (error) {
    return (
      <Box p={6} textAlign="center">
        <VStack spacing={4}>
          <WarningIcon boxSize={8} color="red.500" />
          <Text color="gray.600">{error}</Text>
          <Button
            onClick={() => {
              setError(null);
              void loadFavorites();
            }}
          >
            Try Again
          </Button>
        </VStack>
      </Box>
    );
  }

  if (channels.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <Box p={6}>
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
        {channels.map((channel) => (
          <GridItem key={channel.id}>
            <Card 
              cursor="pointer" 
              onClick={() => router.push(`/channel/${channel.channelId}`)}
              _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
            >
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Box position="relative" width="50px" height="50px" borderRadius="full" overflow="hidden">
                      <Image
                        src={channel.channelThumbnail}
                        alt={channel.channelTitle}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <Heading size="md" ml={4} noOfLines={1}>
                      {channel.channelTitle}
                    </Heading>
                  </Box>
                  <Text color="gray.600" noOfLines={2}>
                    {channel.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
} 