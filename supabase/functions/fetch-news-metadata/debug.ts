import * as cheerio from "npm:cheerio";

async function test() {
  const url = Deno.args[0] || "https://mobile.igihe.com/ikoranabuhanga/article/harimo-uwo-gukoresha-ai-mu-gusuzuma-indembe-imishinga-myiza-yahembwe-na-santech";
  console.log("Fetching:", url);
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow'
    });
    
    console.log("Response status:", res.status, res.statusText);
    console.log("Final URL (after redirects):", res.url);
    
    // Proceed even if not ok
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || 
                  $('meta[name="twitter:title"]').attr('content') || 
                  $('title').text() || null;
                  
    const description = $('meta[property="og:description"]').attr('content') || 
                        $('meta[name="twitter:description"]').attr('content') || 
                        $('meta[name="description"]').attr('content') || null;
                        
    const ogImage = $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content');
                    
    const source = $('meta[property="og:site_name"]').attr('content') || 
                   $('meta[name="twitter:site"]').attr('content') || null;

    console.log({ title, description, ogImage, source });
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

test();
