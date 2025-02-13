import { CACHE_KEYS } from '@/app/constants/services';
import ServerCache from '@/app/utils/serverCache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  try {
    // Check cache first
    const cachedTranscript = ServerCache.get(`${CACHE_KEYS.TRANSCRIPT_PREFIX}${videoId}`);
    if (cachedTranscript) {
      console.log(`✅ Cache hit: Using cached transcript for video "${videoId}"`);
      return NextResponse.json({ transcript: cachedTranscript });
    }

    // Use innertube API to fetch transcript
    const innertubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Origin': 'https://www.youtube.com',
      'Referer': innertubeUrl
    };

    // First fetch the video page to get the initial data
    console.log('Fetching video page:', innertubeUrl);
    const pageResponse = await fetch(innertubeUrl, { headers });
    if (!pageResponse.ok) {
      console.error('Failed to fetch video page:', pageResponse.status);
      return NextResponse.json({ error: 'Failed to fetch video page' }, { status: pageResponse.status });
    }

    const pageHtml = await pageResponse.text();

    // Extract the ytInitialData
    const ytInitialDataMatch = pageHtml.match(/ytInitialData\s*=\s*({.+?});/);
    if (!ytInitialDataMatch) {
      console.error('Could not find ytInitialData');
      return NextResponse.json({ error: 'Failed to extract video data' }, { status: 500 });
    }

    const ytInitialData = JSON.parse(ytInitialDataMatch[1]);
    console.log('Successfully extracted ytInitialData');

    // Try to find transcript data in different possible locations
    const hasTranscript = JSON.stringify(ytInitialData).includes('"transcriptRenderer"') ||
                         JSON.stringify(ytInitialData).includes('"captionTracks"') ||
                         pageHtml.includes('"captions":') ||
                         pageHtml.includes('"playerCaptionsTracklistRenderer"');

    if (!hasTranscript) {
      console.log('No transcript data found in video page');
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 404 });
    }

    // Try to extract caption track data directly from the page
    const playerResponse = pageHtml.match(/ytInitialPlayerResponse\s*=\s*({.+?});/)?.[1];
    if (!playerResponse) {
      console.error('Could not find player response data');
      return NextResponse.json({ error: 'Failed to extract player data' }, { status: 500 });
    }

    const playerData = JSON.parse(playerResponse);
    console.log('Successfully parsed player data');

    // Try to get captions data from player response
    const captions = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captions || captions.length === 0) {
      console.log('No caption tracks found in player data');
      return NextResponse.json({ error: 'No captions available' }, { status: 404 });
    }

    // Find English captions, preferring manual over auto-generated
    const englishTrack = captions.find((track: any) => 
      track.languageCode === 'en' && !track.kind
    ) || captions.find((track: any) => 
      track.languageCode === 'en'
    ) || captions[0];

    if (!englishTrack?.baseUrl) {
      console.log('No suitable caption track found');
      return NextResponse.json({ error: 'No suitable captions found' }, { status: 404 });
    }

    // Fetch the actual transcript
    console.log('Fetching transcript from:', englishTrack.baseUrl);
    const transcriptResponse = await fetch(englishTrack.baseUrl, { headers });
    if (!transcriptResponse.ok) {
      console.error('Failed to fetch transcript:', transcriptResponse.status);
      return NextResponse.json({ error: 'Failed to fetch transcript data' }, { status: transcriptResponse.status });
    }

    const transcriptXml = await transcriptResponse.text();
    console.log('Successfully fetched transcript XML');

    // Parse the XML to extract text
    const transcript = transcriptXml
      .match(/<text[^>]*>(.*?)<\/text>/g)
      ?.map(segment => {
        const text = segment.match(/<text[^>]*>(.*?)<\/text>/)?.[1] || '';
        return text
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
      })
      .filter(Boolean)
      .join(' ');

    if (!transcript) {
      console.log('Failed to extract text from transcript XML');
      return NextResponse.json({ error: 'Failed to parse transcript' }, { status: 500 });
    }

    // Cache the transcript
    ServerCache.set(`${CACHE_KEYS.TRANSCRIPT_PREFIX}${videoId}`, transcript);
    console.log(`💾 Cached transcript for video "${videoId}"`);

    console.log('Successfully parsed transcript. Length:', transcript.length);
    return NextResponse.json({ transcript });

  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch transcript' 
    }, { status: 500 });
  }
} 