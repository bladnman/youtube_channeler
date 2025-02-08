import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const youtube = google.youtube('v3');

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const handle = params.handle;
    let channelId = handle;

    // If the handle starts with @, we need to search for the channel first
    if (handle.startsWith('@')) {
      try {
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
      } catch (error: any) {
        // Pass through the YouTube API error
        return NextResponse.json(
          { error: error.message || 'YouTube API Error' },
          { status: error.code || 500 }
        );
      }
    }

    try {
      // Get channel details
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
      const videosResponse = await youtube.search.list({
        part: ['snippet'],
        channelId: channelId,
        maxResults: 50,
        order: 'date',
        type: ['video'],
        key: process.env.YOUTUBE_API_KEY,
      });

      return NextResponse.json({
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
      });
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