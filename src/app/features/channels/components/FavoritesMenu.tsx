'use client';

import { useFirebaseAuth } from '@/app/hooks/useFirebaseAuth';
import { FavoriteChannel, getFavoriteChannels } from '@/app/models/FavoriteChannel';
import { ChevronDownIcon, StarIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Portal,
    Text,
    useToast
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function FavoritesMenu() {
  const { data: session } = useSession();
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  const [favorites, setFavorites] = useState<FavoriteChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const loadFavorites = useCallback(async () => {
    if (!firebaseUser) return;
    
    try {
      setLoading(true);
      const channels = await getFavoriteChannels();
      setFavorites(channels);
    } catch (error) {
      console.error('Error loading favorite channels:', error);
      toast({
        title: 'Error loading favorites',
        description: 'Failed to load your favorite channels',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, toast]);

  useEffect(() => {
    if (session && !firebaseLoading) {
      void loadFavorites();
    }
  }, [loadFavorites, session, firebaseLoading]);

  const handleChannelClick = (channel: FavoriteChannel) => {
    router.push(`/channel-v2/${channel.customUrl || channel.channelId}`);
  };

  if (!session) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<StarIcon />}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        size="sm"
        isLoading={loading}
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
        _active={{ bg: 'whiteAlpha.300' }}
      >
        Favorites
      </MenuButton>
      <Portal>
        <MenuList
          bg="rgba(0, 0, 0, 0.8)"
          borderColor="rgba(255, 255, 255, 0.1)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
          backdropFilter="blur(10px)"
          maxH="400px"
          overflowY="auto"
          style={{ zIndex: 9999 }}
        >
          {favorites.length === 0 ? (
            <Box p={4}>
              <Text color="whiteAlpha.700">No favorite channels yet</Text>
            </Box>
          ) : (
            <>
              {favorites.map((channel) => (
                <MenuItem
                  key={channel.channelId}
                  onClick={() => handleChannelClick(channel)}
                  _hover={{ bg: 'whiteAlpha.200' }}
                  bg="transparent"
                  color="white"
                >
                  <HStack spacing={3}>
                    <Avatar
                      size="sm"
                      src={channel.channelThumbnail}
                      name={channel.channelTitle}
                    />
                    <Text noOfLines={1}>{channel.channelTitle}</Text>
                  </HStack>
                </MenuItem>
              ))}
              <MenuDivider borderColor="whiteAlpha.200" />
              <MenuItem 
                onClick={() => router.push('/')}
                _hover={{ bg: 'whiteAlpha.200' }}
                bg="transparent"
                color="white"
              >
                View All Favorites
              </MenuItem>
            </>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
} 