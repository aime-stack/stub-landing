import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 1. YouTube API Integration
    const youtubeKey = process.env.YOUTUBE_API_KEY;
    const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    if (youtubeMatch && youtubeKey) {
      const videoId = youtubeMatch[1];
      try {
        const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeKey}&part=snippet`);
        if (ytRes.ok) {
          const ytData = await ytRes.json();
          if (ytData.items?.length > 0) {
            const snippet = ytData.items[0].snippet;
            return NextResponse.json({
              title: snippet.title,
              description: snippet.description,
              image: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
              url: url,
              siteName: 'YouTube'
            });
          }
        }
      } catch (e) {
        console.warn('[API:Metadata] YouTube API fetch failed, falling back to scraper:', e);
      }
    }

    // 2. Performance Scraper with better headers
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('image/')) {
      return NextResponse.json({
        title: url.split('/').pop() || 'Image',
        image: url,
        url: url
      });
    }

    if (contentType.includes('video/')) {
      return NextResponse.json({
        title: url.split('/').pop() || 'Video',
        image: null,
        url: url
      });
    }

    const html = await res.text();
    const sourceUrl = new URL(url);

    const metadata = {
      title: extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title') || extractTag(html, 'title'),
      description: extractMeta(html, 'og:description') || extractMeta(html, 'twitter:description') || extractMeta(html, 'description'),
      image: extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image'),
      url: extractMeta(html, 'og:url') || url,
      siteName: extractMeta(html, 'og:site_name') || extractMeta(html, 'twitter:site'),
    };

    // Resolve relative image URLs
    if (metadata.image && !metadata.image.startsWith('http')) {
      try {
        metadata.image = new URL(metadata.image, sourceUrl.origin).href;
      } catch (e) {
        console.warn('[API:Metadata] Image resolution failed for:', metadata.image);
      }
    }

    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('[API:Metadata] Scraping error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractMeta(html: string, name: string) {
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
                html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, 'i'));
  return match ? decodeHtml(match[1]) : null;
}

function extractTag(html: string, tag: string) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i'));
  return match ? decodeHtml(match[1]) : null;
}

function decodeHtml(html: string) {
  return html.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#039;/g, "'")
             .replace(/&nbsp;/g, ' ');
}
