import { CACHE_KEYS, YOUTUBE_API } from '@/app/constants/services';
import ServerCache from '@/app/utils/serverCache';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube('v3');

// Helper function to extract channel ID from URL
function extractChannelInfo(input: string): { type: 'id' | 'handle' | 'custom', value: string } {
  // Handle YouTube channel URLs
  if (input.includes('youtube.com')) {
    try {
      const url = new URL(input.startsWith('http') ? input : `https://${input}`);
      const pathSegments = url.pathname.split('/').filter(Boolean);

      if (pathSegments[0] === 'channel') {
        return { type: 'id', value: pathSegments[1] };
      }
      if (pathSegments[0] === 'c') {
        return { type: 'custom', value: pathSegments[1] };
      }
      if (pathSegments[0]?.startsWith('@')) {
        return { type: 'handle', value: pathSegments[0] };
      }
    } catch {
      // If URL parsing fails, continue with other checks
      console.log('URL parsing failed, continuing with direct checks');
    }
  }
  
  // Handle direct channel IDs (they start with UC)
  if (input.startsWith('UC')) {
    return { type: 'id', value: input };
  }
  
  // Handle @ mentions
  if (input.startsWith('@')) {
    return { type: 'handle', value: input };
  }
  
  // Treat as custom URL
  return { type: 'custom', value: input };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ handle: string }> }
) {
  const { handle } = await context.params;
  let channelId = handle;

  try {
    const channelInfo = extractChannelInfo(handle);
    
    // Check cache first
    const cachedChannelId = ServerCache.get(`${CACHE_KEYS.HANDLE_PREFIX}${handle}`);
    if (cachedChannelId) {
      channelId = cachedChannelId;
    } else {
      try {
        let channelResponse;
        
        switch (channelInfo.type) {
          case 'handle':
            // We can use channels.list with forHandle parameter (more efficient than search)
            console.log(`📺 YouTube API Channels: https://youtube.googleapis.com/youtube/v3/channels - Looking up by handle "${channelInfo.value}"`);
            channelResponse = await youtube.channels.list({
              part: ['snippet'],
              forHandle: channelInfo.value.replace('@', ''), // API expects handle without @ prefix
              key: process.env.YOUTUBE_API_KEY,
            } as any); // Type assertion needed because types are outdated
            break;
            
          case 'id':
            channelId = channelInfo.value;
            break;
            
          case 'custom':
            console.log(`📺 YouTube API Channels: https://youtube.googleapis.com/youtube/v3/channels - Looking up by username "${channelInfo.value}"`);
            channelResponse = await youtube.channels.list({
              part: ['snippet'],
              forUsername: channelInfo.value,
              key: process.env.YOUTUBE_API_KEY,
            });
            break;
        }

        if (channelResponse?.data.items?.[0]) {
          channelId = channelResponse.data.items[0].id as string;
          // Cache the channel ID
          ServerCache.set(`${CACHE_KEYS.HANDLE_PREFIX}${handle}`, channelId);
        } else if (channelInfo.type !== 'id') {
          // If direct lookup failed and it wasn't an ID, try broader search as last resort
          console.log(`🔍 YouTube API Search: https://youtube.googleapis.com/youtube/v3/search - Falling back to broad search for "${handle}"`);
          const searchResponse = await youtube.search.list({
            part: ['snippet'],
            q: handle,
            type: ['channel'],
            key: process.env.YOUTUBE_API_KEY,
          });

          if (!searchResponse.data.items?.[0]) {
            return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
          }

          channelId = searchResponse.data.items[0].id?.channelId as string;
          // Cache the channel ID
          ServerCache.set(`${CACHE_KEYS.HANDLE_PREFIX}${handle}`, channelId);
        }
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || 'YouTube API Error' },
          { status: error.code || 500 }
        );
      }
    }

    // Check cache for channel data
    const cachedChannelData = ServerCache.get(`${CACHE_KEYS.CHANNEL_PREFIX}${channelId}`);
    if (cachedChannelData) {
      console.log(`✅ Cache hit: Using cached data for channel "${channelId}"`);
      return NextResponse.json(cachedChannelData);
    }

    try {
      // Get channel details
      console.log(`📺 YouTube API Channels: https://youtube.googleapis.com/youtube/v3/channels - Fetching details for "${channelId}"`);
      const channelResponse = await youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [channelId],
        key: process.env.YOUTUBE_API_KEY,
      });

      const channel = channelResponse.data.items?.[0];
      if (!channel) {
        return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
      }

      // Get channel's latest videos using playlistItems instead of search
      const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
      console.log(`📺 YouTube API PlaylistItems: https://youtube.googleapis.com/youtube/v3/playlistItems - Fetching latest ${YOUTUBE_API.MAX_RESULTS} videos for channel "${channelId}"`);
      const videosResponse = await youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: uploadsPlaylistId,
        maxResults: YOUTUBE_API.MAX_RESULTS,
        key: process.env.YOUTUBE_API_KEY,
      });

      const responseData = {
        id: channel.id,
        title: channel.snippet?.title,
        description: channel.snippet?.description,
        customUrl: channel.snippet?.customUrl,
        thumbnail: channel.snippet?.thumbnails?.default?.url,
        subscriberCount: channel.statistics?.subscriberCount,
        videos: videosResponse.data.items?.map((item) => ({
          id: item.snippet?.resourceId?.videoId,
          title: item.snippet?.title,
          description: item.snippet?.description,
          thumbnail: item.snippet?.thumbnails?.medium?.url,
          publishedAt: item.snippet?.publishedAt,
        })),
      };

      // Cache the channel data
      ServerCache.set(`${CACHE_KEYS.CHANNEL_PREFIX}${channelId}`, responseData);
      console.log(`💾 Cached channel data for "${channelId}"`);

      return NextResponse.json(responseData);
    } catch (error: any) {
      // Pass through the YouTube API error
      return NextResponse.json(
        { error: error.message || 'YouTube API Error' },
        { status: error.code || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching channel data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch channel data' },
      { status: error.code || 500 }
    );
  }
} 