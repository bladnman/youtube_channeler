import { CACHE_KEYS, YOUTUBE_API } from '@/app/constants/services';
import ServerCache from '@/app/utils/serverCache';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube('v3');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ handle: string }> }
) {
  const { handle } = await context.params;
  let channelId = handle;

  try {
    // Check cache for channel ID if it's a handle
    if (handle.startsWith('@')) {
      const cachedChannelId = ServerCache.get(`${CACHE_KEYS.HANDLE_PREFIX}${handle}`);
      if (cachedChannelId) {
        channelId = cachedChannelId;
      } else {
        try {
          console.log(`🔍 YouTube API: Searching for channel handle "${handle}"`);
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
          // Cache the channel ID for this handle
          ServerCache.set(`${CACHE_KEYS.HANDLE_PREFIX}${handle}`, channelId);
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message || 'YouTube API Error' },
            { status: error.code || 500 }
          );
        }
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
      console.log(`📺 YouTube API: Fetching channel details for "${channelId}"`);
      const channelResponse = await youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [channelId],
        key: process.env.YOUTUBE_API_KEY,
      });

      const channel = channelResponse.data.items?.[0];
      if (!channel) {
        return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
      }

      // Get channel's videos
      console.log(`🎥 YouTube API: Fetching latest ${YOUTUBE_API.MAX_RESULTS} videos for channel "${channelId}"`);
      const videosResponse = await youtube.search.list({
        part: ['snippet'],
        channelId: channelId,
        maxResults: YOUTUBE_API.MAX_RESULTS,
        order: 'date',
        type: ['video'],
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
          id: item.id?.videoId,
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