import { useFirebaseAuth } from '@/app/hooks/useFirebaseAuth';
import { FavoriteChannel, getFavoriteChannels } from '@/app/models/FavoriteChannel';
import { WarningIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ChannelCard } from './ChannelCard';
import { ChannelGridSkeleton } from './ChannelCardSkeleton';
import { EmptyFavorites } from './EmptyFavorites';

export default function FavoriteChannelsGrid() {
  const { data: session } = useSession();
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  const [channels, setChannels] = useState<FavoriteChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  const loadFavorites = useCallback(async () => {
    if (!firebaseUser) {
      console.log('loadFavorites: No Firebase user available', {
        session: session?.user?.email,
        firebaseLoading
      });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('loadFavorites: Starting to fetch favorites');
      const favorites = await getFavoriteChannels();
      console.log('loadFavorites: Fetched favorites successfully', {
        count: favorites.length
      });
      setChannels(favorites);
    } catch (error) {
      console.error('Error loading favorite channels:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load favorite channels: ${errorMessage}`);
      toast({
        title: 'Error loading favorites',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, session, firebaseLoading, toast]);

  useEffect(() => {
    if (session && !firebaseLoading) {
      console.log('FavoriteChannelsGrid: Loading favorites', {
        session: session?.user?.email,
        firebaseUser: firebaseUser?.email,
        firebaseLoading
      });
      void loadFavorites();
    }
  }, [loadFavorites, session, firebaseUser, firebaseLoading]);

  if (!session) {
    return (
      <Box p={6} textAlign="center">
        <Heading size="md">Please sign in to view your favorite channels</Heading>
      </Box>
    );
  }

  if (firebaseLoading || loading) {
    return (
      <Box>
        <Text mb={4} color="gray.600">Loading your favorite channels...</Text>
        <ChannelGridSkeleton />
      </Box>
    );
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
    <Box>
      <Flex
        justify="center"
        align="center"
        wrap="wrap"
        gap={3}
        mx="auto"
      >
        {channels.map((channel) => (
          <Box 
            key={channel.id}
            w={{ base: "100%", sm: "45%", md: "200px" }}
            maxW="100%"
            flexGrow={0}
            flexShrink={0}
            flexBasis="auto"
          >
            <ChannelCard
              channel={channel}
              onClick={() => router.push(`/channel-v2/${channel.customUrl || channel.channelId}`)}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
} 