'use client';

import { GlassmorphicButton } from '@/app/components/GlassmorphicButton';
import { useFirebaseAuth } from '@/app/hooks/useFirebaseAuth';
import { addFavoriteChannel, getFavoriteChannels, removeFavoriteChannel } from '@/app/models/FavoriteChannel';
import { StarIcon } from '@chakra-ui/icons';
import { Spinner, Tooltip, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface FavoriteButtonProps {
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  description: string;
  customUrl?: string;
}

export default function FavoriteButton({ 
  channelId, 
  channelTitle, 
  channelThumbnail, 
  description,
  customUrl
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!firebaseUser) return;
      
      try {
        setLoading(true);
        const favorites = await getFavoriteChannels();
        setIsFavorite(favorites.some(fav => fav.channelId === channelId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setLoading(false);
      }
    };

    void checkIfFavorite();
  }, [firebaseUser, channelId]);

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      console.log('FavoriteButton: No NextAuth session', { session });
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to favorite channels',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!firebaseUser) {
      console.error('FavoriteButton: No Firebase user despite having NextAuth session', {
        nextAuthUser: session.user,
        firebaseLoading,
        firebaseUser
      });
      toast({
        title: 'Error',
        description: 'Authentication error. Please try signing out and back in.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      console.log('FavoriteButton: Attempting to toggle favorite', {
        isFavorite,
        channelId,
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email
        }
      });

      if (isFavorite) {
        await removeFavoriteChannel(channelId);
        setIsFavorite(false);
        toast({
          title: 'Channel removed from favorites',
          status: 'success',
          duration: 2000,
        });
      } else {
        await addFavoriteChannel({
          channelId,
          channelTitle,
          channelThumbnail,
          description,
          customUrl,
        });
        setIsFavorite(true);
        toast({
          title: 'Channel added to favorites',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('FavoriteButton: Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (firebaseLoading || loading) {
    return (
      <Spinner size="sm" />
    );
  }

  return (
    <Tooltip label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
      <GlassmorphicButton
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        colorScheme={isFavorite ? 'yellow' : 'gray'}
        onClick={handleToggleFavorite}
        size="md"
        glassStrength={isFavorite ? 'strong' : 'medium'}
      >
        <StarIcon />
      </GlassmorphicButton>
    </Tooltip>
  );
} 