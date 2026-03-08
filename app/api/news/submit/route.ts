import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL formatting' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the link already exists in the DB to avoid redundant fetch
    const { data: existingLink } = await supabase
      .from('news_links')
      .select('*')
      .eq('url', url)
      .single();

    if (existingLink) {
      return NextResponse.json(existingLink);
    }

    // 2. Call Edge Function (must use the anonKey or serviceKey for Authorization header)
    const edgeFuncUrl = `${supabaseUrl}/functions/v1/fetch-news-metadata`;
    
    // We send a 10-second timeout to avoid long blocking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let edgeRes;
    try {
      edgeRes = await fetch(edgeFuncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (edgeErr: any) {
      clearTimeout(timeoutId);
      console.error('[API:News] Edge function fetch failed or timed out:', edgeErr);
      return NextResponse.json({ error: 'Timeout fetching metadata' }, { status: 504 });
    }

    if (!edgeRes.ok) {
       const text = await edgeRes.text();
       console.error('[API:News] Edge function failed:', edgeRes.status, text);
       return NextResponse.json({ error: 'Failed to extract metadata' }, { status: edgeRes.status });
    }

    const metadata = await edgeRes.json();
    const finalUrl = metadata.url || url;

    // 3. Save to Supabase news_links
    const { data: savedRecord, error: insertError } = await supabase
       .from('news_links')
       .insert({
          url: finalUrl,
          title: metadata.title,
          description: metadata.description,
          image_url: metadata.image_url,
          source: metadata.source,
       })
       .select('*')
       .single();

    if (insertError) {
       // Handle unique violation (23505) in case of concurrent inserts
       if (insertError.code === '23505') {
          const { data: duplicate } = await supabase.from('news_links').select('*').eq('url', finalUrl).single();
          return NextResponse.json(duplicate);
       }
       console.error('[API:News] Failed to save to DB:', insertError);
       return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 });
    }

    return NextResponse.json(savedRecord);

  } catch (err: any) {
    console.error('[API:News] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
