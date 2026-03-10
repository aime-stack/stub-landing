import * as cheerio from "npm:cheerio";

async function test() {
  const url = "https://mobile.igihe.com/ikoranabuhanga/article/harimo-uwo-gukoresha-ai-mu-gusuzuma-indembe-imishinga-myiza-yahembwe-na-santech";
  console.log("Fetching:", url);
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });
  
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
}

test();
