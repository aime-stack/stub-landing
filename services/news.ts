'use server';

export async function getTopNews() {
  const apiKey = process.env.GNEWS_API_KEY || process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  if (!apiKey) {
    console.warn('[Services:News] Missing GNEWS_API_KEY');
    return [];
  }

  try {
    const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=4&apikey=${apiKey}`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) {
      console.error('[Services:News] Gnews API returned', res.status);
      return [];
    }
    const data = await res.json();
    return data.articles || [];
  } catch (e) {
    console.error('[Services:News] Failed to fetch Gnews', e);
    return [];
  }
}
