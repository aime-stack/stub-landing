import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL formatting' }, { status: 400 });
    }

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

    let metadata = {
      url: url,
      title: null as string | null,
      description: null as string | null,
      image_url: null as string | null,
      source: null as string | null,
    };

    const host = targetUrl.hostname.toLowerCase();
    let oembedSuccess = false;

    // Strategy 0: OEmbed Discovery
    if (host.includes('twitter.com') || host.includes('x.com')) {
      // Rewrite to twitter.com for OEmbed
      const encodedUrl = encodeURIComponent(url.replace('x.com', 'twitter.com'));
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const oeRes = await fetch(`https://publish.twitter.com/oembed?url=${encodedUrl}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (oeRes.ok) {
          const oeData = await oeRes.json();
          metadata.title = oeData.title || `Post by ${oeData.author_name}`;
          metadata.image_url = oeData.thumbnail_url || null; // Twitter usually doesn't return one in standard OEmbed but good to map
          metadata.source = oeData.provider_name || 'Twitter';
          oembedSuccess = true;
        }
      } catch (err) {
         console.log('Twitter OEmbed failed', err);
      }
    } 
    else if (host.includes('tiktok.com')) {
      const encodedUrl = encodeURIComponent(url);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const oeRes = await fetch(`https://www.tiktok.com/oembed?url=${encodedUrl}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (oeRes.ok) {
           const oeData = await oeRes.json();
           metadata.title = oeData.title || `TikTok by ${oeData.author_name}`;
           metadata.image_url = oeData.thumbnail_url || null;
           metadata.source = oeData.provider_name || 'TikTok';
           oembedSuccess = true;
        }
      } catch (err) {
         console.log('TikTok OEmbed failed', err);
      }
    }
    else if (host.includes('youtube.com') || host.includes('youtu.be')) {
      const encodedUrl = encodeURIComponent(url);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const oeRes = await fetch(`https://www.youtube.com/oembed?url=${encodedUrl}&format=json`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (oeRes.ok) {
          const oeData = await oeRes.json();
          metadata.title = oeData.title;
          metadata.image_url = oeData.thumbnail_url;
          metadata.source = oeData.provider_name || 'YouTube';
          oembedSuccess = true;
        }
      } catch (err) {
         console.log('YouTube OEmbed failed', err);
      }
    }

    // Strategy 1: HTML Scraper
    if (!oembedSuccess) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          signal: controller.signal,
          redirect: 'follow'
        });
        clearTimeout(timeoutId);
        
        const finalUrl = res.url || url;
        targetUrl = new URL(finalUrl);
        metadata.url = finalUrl; // Ensure we save the redirected URL

        // Even on 401/403, proceed to parse HTML since OpenGraph tags are often still sent
        const html = await res.text();
        const $ = cheerio.load(html);
        
        metadata.title = $('meta[property="og:title"]').attr('content') || 
                         $('meta[name="twitter:title"]').attr('content') || 
                         $('title').text() || null;
                         
        metadata.description = $('meta[property="og:description"]').attr('content') || 
                               $('meta[name="twitter:description"]').attr('content') || 
                               $('meta[name="description"]').attr('content') || null;
                               
        metadata.image_url = $('meta[property="og:image"]').attr('content') || 
                             $('meta[name="twitter:image"]').attr('content') || null;
                             
        metadata.source = $('meta[property="og:site_name"]').attr('content') || 
                          $('meta[name="twitter:site"]').attr('content') || null;

        // Normalize relative URLs
        if (metadata.image_url && !metadata.image_url.startsWith('http')) {
          try {
              metadata.image_url = new URL(metadata.image_url, targetUrl.origin).href;
            } catch (e) {
              // ignore
            }
        }
      } catch (e) {
         console.warn("Direct HTML scraper failed for URL:", url);
      }
    }

    // fallback source to domain 
    if (!metadata.source) {
      metadata.source = targetUrl.hostname.replace(/^www\./, '');
    }

    // Strategy 2: Specialized News API Fallback
    const gnewsApiKey = process.env.GNEWS_API_KEY || '';
    
    const isGenericTitle = metadata.title && (
      metadata.title.toLowerCase().includes('.com') || 
      metadata.title.toLowerCase() === targetUrl.hostname.replace('www.', '')
    );

    if ((!metadata.title || !metadata.image_url || isGenericTitle) && gnewsApiKey) {
      try {
        let keywords = '';
        if (metadata.title && !isGenericTitle) {
          keywords = metadata.title;
        } else {
          const parsedPath = targetUrl.pathname;
          keywords = parsedPath.replace(/[-/_]/g, ' ').trim() || targetUrl.hostname;
        }

        const searchQuery = encodeURIComponent(keywords);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const gnewsRes = await fetch(`https://gnews.io/api/v4/search?q=${searchQuery}&token=${gnewsApiKey}&lang=en&max=1`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (gnewsRes.ok) {
           const gnewsData = await gnewsRes.json();
           if (gnewsData.articles && gnewsData.articles.length > 0) {
              const article = gnewsData.articles[0];
              metadata.title = metadata.title || article.title;
              metadata.description = metadata.description || article.description;
              metadata.image_url = metadata.image_url || article.image;
              metadata.source = metadata.source || article.source.name;
           }
        }
      } catch (e) {
        console.error("GNews fallback failed:", e);
      }
    }

    // 3. Save to Supabase news_links
    const { data: savedRecord, error: insertError } = await supabase
       .from('news_links')
       .insert({
          url: metadata.url,
          title: metadata.title,
          description: metadata.description,
          image_url: metadata.image_url,
          source: metadata.source,
       })
       .select('*')
       .single();

    if (insertError) {
       if (insertError.code === '23505') {
          const { data: duplicate } = await supabase.from('news_links').select('*').eq('url', metadata.url).single();
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
