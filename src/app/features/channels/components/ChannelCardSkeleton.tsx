import { Box, Card, CardBody, Grid, GridItem, Skeleton, SkeletonCircle, VStack } from '@chakra-ui/react';

export function ChannelCardSkeleton() {
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
  );
}

export function ChannelGridSkeleton() {
  return (
    <Box p={6}>
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
        {[...Array(4)].map((_, i) => (
          <GridItem key={i}>
            <ChannelCardSkeleton />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
} 