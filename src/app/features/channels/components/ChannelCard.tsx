import { GLASSMORPHISM } from '@/app/constants/ui';
import { FavoriteChannel } from '@/app/models/FavoriteChannel';
import { Box, Card, CardBody, Text } from '@chakra-ui/react';
import Image from 'next/image';

interface ChannelCardProps {
  channel: FavoriteChannel;
  onClick: () => void;
}

export function ChannelCard({ channel, onClick }: ChannelCardProps) {
  return (
    <Card 
      cursor="pointer" 
      onClick={onClick}
      _hover={{ 
        transform: 'scale(1.02)', 
        transition: 'transform 0.2s',
        bg: 'whiteAlpha.200',
        _dark: {
          bg: 'blackAlpha.400'
        }
      }}
      size="sm"
      bg="whiteAlpha.100"
      backdropFilter={`blur(${GLASSMORPHISM.BLUR})`}
      border="1px solid"
      borderColor="whiteAlpha.200"
      _dark={{
        bg: 'blackAlpha.300',
        borderColor: 'whiteAlpha.100'
      }}
    >
      <CardBody p={3}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box 
            position="relative" 
            width="40px" 
            height="40px" 
            borderRadius="full" 
            overflow="hidden" 
            flexShrink={0}
            boxShadow="sm"
          >
            <Image
              src={channel.channelThumbnail}
              alt={channel.channelTitle}
              fill
              sizes="40px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Text 
            fontWeight="medium" 
            fontSize="sm" 
            noOfLines={2}
            wordBreak="break-word"
            color="whiteAlpha.900"
            _dark={{
              color: 'whiteAlpha.900'
            }}
          >
            {channel.channelTitle}
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
} 