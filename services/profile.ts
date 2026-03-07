'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserAvatar(avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id);

  if (error) {
    console.error('[Services:Profile] Error updating avatar:', error);
    throw new Error('Failed to update avatar');
  }

  revalidatePath('/profile');
  return { success: true };
}

export async function updateUserCover(coverUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ cover_url: coverUrl })
    .eq('id', user.id);

  if (error) {
    console.error('[Services:Profile] Error updating cover:', error);
    throw new Error('Failed to update cover');
  }

  revalidatePath('/profile');
  return { success: true };
}
