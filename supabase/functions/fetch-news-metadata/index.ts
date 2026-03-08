import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// Use proper typing for Deno environment
declare const Deno: any;

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const gnewsApiKey = Deno.env.get("GNEWS_API_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), { status: 400, headers });
    }

    let metadata: NewsMetadata = {
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
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        metadata.title = $('meta[property="og:title"]').attr('content') || $('title').text() || null;
        metadata.description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || null;
        metadata.image_url = $('meta[property="og:image"]').attr('content') || null;
        metadata.source = $('meta[property="og:site_name"]').attr('content') || null;
      }
    } catch (e) {
      console.error("Error fetching HTML:", e);
    }

    // 2. Fallback/Enrich with GNews if missing core fields (title/image)
    if ((!metadata.title || !metadata.image_url) && gnewsApiKey) {
      try {
        const searchQuery = metadata.title ? encodeURIComponent(metadata.title) : encodeURIComponent(url);
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
       } catch (e) {
          // ignore
       }
    }


    // 4. Return the data to the Next.js API route that called us
    // Note: Saving to Supabase is handled by the Next.js API route as per the plan.
    return new Response(JSON.stringify(metadata), { headers });

  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});
