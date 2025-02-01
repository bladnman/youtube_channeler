import { google } from 'googleapis'
import { NextResponse } from 'next/server'

const youtube = google.youtube('v3')

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured')
    }

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
      thumbnail: videoData.snippet?.thumbnails?.high?.url,
      publishedAt: videoData.snippet?.publishedAt,
      channelTitle: videoData.snippet?.channelTitle,
      duration: formattedDuration,
      viewCount: videoData.statistics?.viewCount,
      likeCount: videoData.statistics?.likeCount,
      url: `https://www.youtube.com/watch?v=${videoData.id}`
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error('Error fetching video details:', error)
    return NextResponse.json(
      { message: 'Failed to fetch video details' },
      { status: 500 }
    )
  }
} 