'use client';

import { GlassmorphicPanel } from '@/app/components/GlassmorphicPanel';
import { FavoritesMenu } from '@/app/features/channels/components/FavoritesMenu';
import { SearchBar } from '@/app/features/youtube/components/SearchBar';
import { useYouTubeContext } from '@/app/features/youtube/context/YouTubeContext';
import { WarningIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLayout } from '../../../theme/layout';

export function GlassmorphicHeader() {
  const { data: session, status } = useSession();
  const { apiError } = useYouTubeContext();
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = status === 'loading';
  const [mounted, setMounted] = useState(false);
  const layout = useLayout();
  const isHomePage = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <Box 
      as="header" 
      position="fixed"
      width="100%"
      top={0}
      zIndex={10}
      height={layout.header.height}
      bg="transparent"
    >
      <GlassmorphicPanel
        height="100%"
        borderRadius="none"
        blurStrength="medium"
        noBorder
        variant="light"
      >
        <Flex h="100%" align="center" justify="space-between" maxW="container.xl" mx="auto" gap={4} px={4}>
          <Link href="/" passHref>
            <Flex align="center" gap={2} cursor="pointer">
              <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center">
                <Image
                  src="/images/channeler_icon.png"
                  alt="YouTube Channeler Logo"
                  width={32}
                  height={32}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Text 
                fontSize="xl" 
                fontWeight="bold"
                color="white"
                textShadow="0 1px 2px rgba(0, 0, 0, 0.8)"
              >
                YouTube Channeler
              </Text>
            </Flex>
          </Link>

          {!isHomePage && (
            <Box maxW="600px" flex={1}>
              <SearchBar variant="compact" />
            </Box>
          )}

          <Flex gap={4} align="center">
            {apiError && (
              <Tooltip 
                label={apiError.message}
                placement="bottom"
                hasArrow
              >
                <IconButton
                  aria-label="API Status Warning"
                  icon={<WarningIcon />}
                  variant="solid"
                  colorScheme="yellow"
                  size="sm"
                  animation="pulse 2s infinite"
                  sx={{
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }}
                />
              </Tooltip>
            )}
            
            {session && <FavoritesMenu />}
            
            <Box>
              {isLoading ? (
                <Avatar size="sm" />
              ) : session ? (
                <Menu>
                  <MenuButton>
                    <Avatar 
                      size="sm" 
                      src={session.user?.image || undefined}
                      name={session.user?.name || 'User'}
                    />
                  </MenuButton>
                  <MenuList 
                    bg="rgba(0, 0, 0, 0.8)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
                    backdropFilter="blur(10px)"
                  >
                    <Text px={3} py={2} fontSize="sm" color="whiteAlpha.700">
                      Signed in as {session.user?.email}
                    </Text>
                    <MenuItem 
                      onClick={() => router.push('/')}
                      _hover={{ bg: 'whiteAlpha.200' }}
                      color="white"
                    >
                      My Favorite Channels
                    </MenuItem>
                    <MenuItem 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      _hover={{ bg: 'whiteAlpha.200' }}
                      color="white"
                    >
                      Sign Out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  onClick={() => signIn('google')}
                  colorScheme="red"
                  size="sm"
                  variant="solid"
                  _hover={{ 
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Flex>
        </Flex>
      </GlassmorphicPanel>
    </Box>
  );
} 