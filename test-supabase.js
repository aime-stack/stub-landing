import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      reshared_from,
      original_post:posts!reshared_from (
        id
      )
    `)
    .limit(1);

  console.log({ data, error });
}

test();
