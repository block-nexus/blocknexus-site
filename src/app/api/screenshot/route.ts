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

  // Use screenshotapi.net or similar service
  // You can add your API key here if needed: process.env.SCREENSHOT_API_KEY
  const screenshotApiUrl = `https://api.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&width=1200&height=800&format=png&full_page=false`;

  try {
    const response = await fetch(screenshotApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Screenshot API returned ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Screenshot fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screenshot' },
      { status: 500 }
    );
  }
}
