import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to proxy screenshot requests
 * This allows us to use screenshot services without exposing API keys to the client
 * and provides better error handling and caching
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      'konkani.ai',
      'dartmaster.ai',
      'gwith.ai',
      'vitapet.ai',
    ];

    if (!allowedDomains.includes(urlObj.hostname)) {
      return NextResponse.json(
        { error: 'URL not allowed' },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format' },
      { status: 400 }
    );
  }

  // Try multiple screenshot services for reliability
  // Service 1: screenshot.rocks (free, no API key needed)
  const screenshotServices = [
    `https://screenshot.rocks/api?url=${encodeURIComponent(url)}&width=1200&height=800&format=png`,
    `https://api.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&width=1200&height=800&format=png&full_page=false`,
  ];

  for (const screenshotApiUrl of screenshotServices) {
    try {
      const response = await fetch(screenshotApiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/png,image/*,*/*',
        },
        // Add timeout
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (response.ok && response.headers.get('content-type')?.includes('image')) {
        const imageBuffer = await response.arrayBuffer();

        // Return the image with appropriate headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
          },
        });
      }
    } catch (error) {
      // Try next service
      console.warn(`Screenshot service failed, trying next: ${error instanceof Error ? error.message : 'Unknown error'}`);
      continue;
    }
  }

  // All services failed
  console.error('All screenshot services failed for URL:', url);
  return NextResponse.json(
    { error: 'Failed to fetch screenshot from all services' },
    { status: 500 }
  );
}
