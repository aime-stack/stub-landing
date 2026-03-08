import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
  // Edge Functions typically handle POST requests for custom logic
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { url } = await req.json()
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing URL" }), { 
        status: 400,
        headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
      })
    }

    const res = await fetch(url)
    const html = await res.text()

    // Enhanced extraction logic
    const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<title>(.*?)<\/title>/i)
    const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta name="description" content="(.*?)"/i)
    const imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)

    const metadata = {
      title: titleMatch ? titleMatch[1] : null,
      description: descMatch ? descMatch[1] : null,
      image: imageMatch ? imageMatch[1] : null,
      url
    }

    return new Response(JSON.stringify(metadata), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || String(error) }), { 
      status: 500,
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
    })
  }
})
