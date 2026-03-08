import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ articles: [] });
  }

  const apiKey = process.env.GNEWS_API_KEY || process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  if (!apiKey) {
    console.error('[API:News:Search] Missing GNEWS_API_KEY');
    return NextResponse.json({ error: 'News configuration missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=10&apikey=${apiKey}`, {
      next: { revalidate: 1800 } // Cache for 30 mins
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('[API:News:Search] Gnews API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ articles: data.articles || [] });
  } catch (error: any) {
    console.error('[API:News:Search] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
