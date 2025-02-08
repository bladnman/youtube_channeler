import { StarIcon } from '@chakra-ui/icons';
import { Box, Text, VStack } from '@chakra-ui/react';

export function EmptyFavorites() {
  return (
    <VStack spacing={6} p={8} textAlign="center">
      <Box
        w="100px"
        h="100px"
        borderRadius="full"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StarIcon boxSize={10} color="gray.400" />
      </Box>
      <Text fontSize="lg" color="gray.600">
        No favorite channels yet
      </Text>
      <Text color="gray.500">
        When you find a channel you like, click the star icon next to it to add it to your favorites
      </Text>
    </VStack>
  );
} 