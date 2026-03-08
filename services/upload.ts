import { uploadMediaAction } from './uploadServer';

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
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  
  return uploadMediaAction(formData);
}
