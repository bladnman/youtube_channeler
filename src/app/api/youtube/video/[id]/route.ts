import { CACHE_KEYS } from '@/app/constants/services';
import ServerCache from '@/app/utils/serverCache';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube('v3')

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: videoId } = await context.params;

  try {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured')
    }

    // Check cache first
    const cachedVideo = ServerCache.get(`${CACHE_KEYS.VIDEO_PREFIX}${videoId}`);
    if (cachedVideo) {
      console.log(`✅ Cache hit: Using cached data for video "${videoId}"`);
      return NextResponse.json({ video: cachedVideo });
    }

    console.log(`🎬 YouTube API: Fetching video details for "${videoId}"`);
    const response = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      id: [videoId],
      part: ['snippet', 'contentDetails', 'statistics'] as const,
    })

    const videoData = response.data.items?.[0]

    if (!videoData) {
      return NextResponse.json(
        { message: 'Video not found' },
        { status: 404 }
      )
    }

    // Format duration from ISO 8601 to human readable
    const duration = videoData.contentDetails?.duration || ''
    const formattedDuration = duration
      .replace('PT', '')
      .replace('H', ':')
      .replace('M', ':')
      .replace('S', '')
      .split(':')
      .map(part => part.padStart(2, '0'))
      .join(':')

    const video = {
      id: videoData.id,
      title: videoData.snippet?.title,
      description: videoData.snippet?.description,
      thumbnail: videoData.snippet?.thumbnails?.maxres?.url || videoData.snippet?.thumbnails?.high?.url,
      publishedAt: videoData.snippet?.publishedAt,
      channelTitle: videoData.snippet?.channelTitle,
      duration: formattedDuration,
      viewCount: videoData.statistics?.viewCount,
      likeCount: videoData.statistics?.likeCount,
      url: `https://www.youtube.com/watch?v=${videoData.id}`
    }

    // Cache the video data
    ServerCache.set(`${CACHE_KEYS.VIDEO_PREFIX}${videoId}`, video);
    console.log(`💾 Cached video data for "${videoId}"`);

    return NextResponse.json({ video })
  } catch (error) {
    console.error('Error fetching video details:', error)
    return NextResponse.json(
      { message: 'Failed to fetch video details' },
      { status: 500 }
    )
  }
} 