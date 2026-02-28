import { createClient } from '@/lib/supabase/client';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
];

export async function uploadMedia(file: File, bucket: 'posts' | 'avatars' = 'posts'): Promise<string> {
  // 1. Validate Size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File exceeds 10MB limit');
  }

  // 2. Validate MIME Type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, MP4, WEBM.`);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized upload attempt');
  }

  // 3. Construct Safe Path (UID/timestamp_filename)
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = `${user.id}/${safeFilename}`;

  // 4. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('[Services:Upload] Error uploading to bucket:', error);
    throw new Error('Failed to upload media. Ensure RLS allows insert.');
  }

  // 5. Retrieve Public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return urlData.publicUrl;
}
