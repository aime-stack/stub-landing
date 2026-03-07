'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadMediaAction(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  const bucket = (formData.get('bucket') as 'posts' | 'avatars') || 'posts';

  if (!file) {
    throw new Error('No file provided');
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File exceeds 10MB limit');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, MP4, WEBM.`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized upload attempt');
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = `${user.id}/${safeFilename}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('[Services:UploadServer] Error uploading to bucket:', error);
    throw new Error('Failed to upload media. Ensure RLS allows insert.');
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return urlData.publicUrl;
}
