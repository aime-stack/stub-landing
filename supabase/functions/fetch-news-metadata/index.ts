import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// Use proper typing for Deno environment
declare const Deno: { env: { get(key: string): string | undefined } };

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const gnewsApiKey = Deno.env.get("GNEWS_API_KEY") ?? "";

const _supabase = createClient(supabaseUrl, supabaseServiceKey);

interface NewsMetadata {
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  source: string | null;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), { status: 400, headers });
    }

    const metadata: NewsMetadata = {
       url,
       title: null,
       description: null,
       image_url: null,
       source: null,
    };

    // 1. Fetch HTML
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

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

      // Prefer the final URL (post-redirect) for better fallback keyword extraction
      const finalUrl = res.url || url;
      metadata.url = finalUrl;

      // Even if not ok (like 401/403), some sites still return HTML with OG tags for previews
      const html = await res.text();
      const $ = cheerio.load(html);

        metadata.title = $('meta[property="og:title"]').attr('content') || 
                         $('meta[name="twitter:title"]').attr('content') || 
                         $('title').text() || null;
        
        metadata.description = $('meta[property="og:description"]').attr('content') || 
                               $('meta[name="twitter:description"]').attr('content') || 
                               $('meta[name="description"]').attr('content') || null;
        
        const ogImage = $('meta[property="og:image"]').attr('content') || 
                        $('meta[name="twitter:image"]').attr('content');
        
        metadata.image_url = ogImage || null;
        metadata.source = $('meta[property="og:site_name"]').attr('content') || 
                          $('meta[name="twitter:site"]').attr('content') || null;

        // Resolve relative image URL
        if (metadata.image_url && !metadata.image_url.startsWith('http')) {
          try {
            const baseUrl = new URL(url);
            metadata.image_url = new URL(metadata.image_url, baseUrl.origin).href;
          } catch (e) {
            console.error("Relative image resolution failed:", e);
          }
        }
    } catch (e) {
      console.error("Error fetching HTML:", e);
    }

    // 2. Fallback/Enrich with GNews if missing core fields (title/image) or title is just the domain
    const isGenericTitle = metadata.title && (
      metadata.title.toLowerCase().includes('.com') || 
      metadata.title.toLowerCase() === new URL(url).hostname.replace('www.', '')
    );

    if ((!metadata.title || !metadata.image_url || isGenericTitle) && gnewsApiKey) {
      try {
        let keywords = '';
        if (metadata.title && !isGenericTitle) {
          keywords = metadata.title;
        } else {
          // Extract keywords from URL path (e.g. /news/article-name-here)
          const parsedPath = new URL(url).pathname;
          keywords = parsedPath.replace(/[-/_]/g, ' ').trim() || new URL(url).hostname;
        }

        const searchQuery = encodeURIComponent(keywords);
        const gnewsRes = await fetch(`https://gnews.io/api/v4/search?q=${searchQuery}&token=${gnewsApiKey}&lang=en&max=1`);
        
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
        console.error("Error fetching from GNews:", e);
      }
    }

    // 3. Fallback source to domain name if still empty
    if (!metadata.source) {
       try {
         const parsedUrl = new URL(url);
         metadata.source = parsedUrl.hostname.replace('www.', '');
       } catch (_e) {
          // ignore
       }
    }


    // 4. Return the data to the Next.js API route that called us
    // Note: Saving to Supabase is handled by the Next.js API route as per the plan.
    return new Response(JSON.stringify(metadata), { headers });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
