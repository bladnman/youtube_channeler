import { Box, Card, CardBody, Skeleton, SkeletonCircle, VStack } from '@chakra-ui/react'

export function ChannelTileSkeleton() {
  return (
    <Card>
      <CardBody>
        <VStack align="start" spacing={3}>
          <Box display="flex" alignItems="center" width="100%">
            <SkeletonCircle size="50px" />
            <Box flex="1" ml={4}>
              <Skeleton height="24px" width="80%" />
            </Box>
          </Box>
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="60%" />
        </VStack>
      </CardBody>
    </Card>
  )
} 