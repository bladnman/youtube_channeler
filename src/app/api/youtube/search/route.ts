import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube('v3');

// This will need to be moved to an environment variable
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      { message: 'YouTube API key is not configured' },
      { status: 500 }
    )
  }

  if (!query) {
    return NextResponse.json(
      { message: 'Query parameter is required' },
      { status: 400 }
    )
  }

  try {
    // First, search for the channel
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['channel'],
      key: process.env.YOUTUBE_API_KEY,
    });

    if (!searchResponse.data.items?.length) {
      return NextResponse.json(
        { message: 'No channel found' },
        { status: 404 }
      )
    }

    const channelId = searchResponse.data.items[0].id?.channelId;

    // Get detailed channel information including custom URL
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      id: [channelId as string],
      key: process.env.YOUTUBE_API_KEY,
    });

    const channel = channelResponse.data.items?.[0];
    if (!channel) {
      return NextResponse.json(
        { message: 'Channel details not found' },
        { status: 404 }
      )
    }

    // Only return channel info, no videos
    return NextResponse.json({
      channel: {
        id: channelId,
        title: channel.snippet?.title,
        thumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.medium?.url,
        description: channel.snippet?.description,
        customUrl: channel.snippet?.customUrl,
        subscriberCount: channel.statistics?.subscriberCount,
      }
    });
  } catch (error) {
    console.error('Error fetching YouTube data:', error)
    return NextResponse.json(
      { message: 'Error fetching YouTube data' },
      { status: 500 }
    )
  }
} 