

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export async function uploadMedia(file: File, bucket: 'posts' | 'avatars' | 'stories' = 'posts'): Promise<string> {
  const res = await fetch('/api/video/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, bucket, contentType: file.type }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to get upload URL');
  }

  const { signedUrl, publicUrl } = await res.json();

  const uploadRes = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload file to storage');
  }

  return publicUrl;
}
