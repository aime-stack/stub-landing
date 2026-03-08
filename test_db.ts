import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const lines = envFile.split('\n');
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (e) {
  console.log('Error reading .env.local', e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing connection...', supabaseUrl);
  // Log in as an anonymous user or we will get RLS errors
  // Wait, if RLS requires auth, we can just insert with a random UUID and see if it's an RLS error or a schema error.
  const { error } = await supabase.from('posts').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    type: 'text',
    content: 'test',
  });
  console.dir(error, { depth: null });
}

check();
