import { NextRequest, NextResponse } from 'next/server'

// This will need to be moved to an environment variable
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!YOUTUBE_API_KEY) {
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
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
        query
      )}&key=${YOUTUBE_API_KEY}`
    )

    const channelData = await channelResponse.json()
    
    if (!channelData.items?.length) {
      return NextResponse.json(
        { message: 'No channel found' },
        { status: 404 }
      )
    }

    const channelId = channelData.items[0].id.channelId

    // Then, get the channel's videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=50&type=video&key=${YOUTUBE_API_KEY}`
    )

    const videosData = await videosResponse.json()

    const videos = videosData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }))

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching YouTube data:', error)
    return NextResponse.json(
      { message: 'Error fetching YouTube data' },
      { status: 500 }
    )
  }
} 