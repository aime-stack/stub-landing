'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFollow(targetUsername: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // get target user id
  const { data: targetProfile, error: targetError } = await supabase
    .from('profiles')
    .select('id, followers_count')
    .eq('username', targetUsername)
    .single();

  if (targetError || !targetProfile) throw new Error('User not found');
  if (targetProfile.id === user.id) throw new Error('Cannot follow yourself');

  // check if already following
  const { data: existingFollow } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetProfile.id)
    .single();

  const { data: currentProfile } = await supabase.from('profiles').select('following_count').eq('id', user.id).single();

  if (existingFollow) {
    // unfollow
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetProfile.id);
    
    // decrement counts
    await supabase.from('profiles').update({ followers_count: Math.max(0, (targetProfile.followers_count || 0) - 1) }).eq('id', targetProfile.id);
    if (currentProfile) {
      await supabase.from('profiles').update({ following_count: Math.max(0, (currentProfile.following_count || 0) - 1) }).eq('id', user.id);
    }
  } else {
    // follow
    await supabase.from('follows').insert({ follower_id: user.id, following_id: targetProfile.id });
    
    // increment counts
    await supabase.from('profiles').update({ followers_count: (targetProfile.followers_count || 0) + 1 }).eq('id', targetProfile.id);
    if (currentProfile) {
      await supabase.from('profiles').update({ following_count: (currentProfile.following_count || 0) + 1 }).eq('id', user.id);
    }
  }

  revalidatePath('/profile/' + targetUsername);
  return { success: true, following: !existingFollow };
}

export async function checkIsFollowing(targetUsername: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', targetUsername)
    .single();

  if (!targetProfile) return false;

  const { data: existingFollow } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetProfile.id)
    .single();

  return !!existingFollow;
}
