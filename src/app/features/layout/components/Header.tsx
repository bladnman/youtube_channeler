'use client';

import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const [mounted, setMounted] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <Box as="header" bg={bgColor} boxShadow="sm" position="fixed" width="100%" top={0} zIndex={10}>
      <Flex px={4} py={2} align="center" justify="space-between" maxW="container.xl" mx="auto">
        <Link href="/" passHref>
          <Text fontSize="xl" fontWeight="bold" cursor="pointer">
            Channel Surfer
          </Text>
        </Link>

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
              <MenuList>
                <Text px={3} py={2} fontSize="sm" color="gray.500">
                  Signed in as {session.user?.email}
                </Text>
                <MenuItem onClick={() => router.push('/')}>
                  My Favorite Channels
                </MenuItem>
                <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>
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
    </Box>
  );
} 