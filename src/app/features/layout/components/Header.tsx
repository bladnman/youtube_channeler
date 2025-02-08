'use client';

import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <Box as="header" bg="white" boxShadow="sm" position="fixed" width="100%" top={0} zIndex={10}>
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
                <MenuItem as={Link} href="/favorites">
                  My Favorite Channels
                </MenuItem>
                <MenuItem onClick={() => signOut()}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              onClick={() => signIn('google')}
              colorScheme="brand"
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