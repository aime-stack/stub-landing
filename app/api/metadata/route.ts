import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'StubgramBot/1.0 (+https://stubgram.com/bot)',
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
        image: null, // Could use a placeholder or thumbnail if generated
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
