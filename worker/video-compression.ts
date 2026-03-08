import express from 'express';
import { createClient } from '@supabase/supabase-js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

app.post('/webhook/video-process', async (req, res) => {
  const { record } = req.body;
  
  if (!record || !record.name) {
    return res.status(400).send('Invalid payload');
  }

  // Only process files in the posts bucket that are videos
  if (record.bucket_id !== 'posts' || !record.metadata?.mimetype?.startsWith('video/')) {
    return res.status(200).send('Ignored: Not a video or wrong bucket');
  }

  // Prevent infinite loops from processing already compressed videos
  if (record.name.includes('_compressed')) {
    return res.status(200).send('Ignored: Already compressed');
  }

  // We acknowledge the webhook immediately so it doesn't timeout
  res.status(202).send('Processing started');

  try {
    const filename = record.name;
    const { data, error } = await supabase.storage.from('posts').download(filename);
    
    if (error || !data) {
      throw new Error(`Failed to download ${filename}: ${error?.message}`);
    }

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input_${Date.now()}.mp4`);
    const outputPath = path.join(tempDir, `output_${Date.now()}.mp4`);
    const thumbnailPath = path.join(tempDir, `thumb_${Date.now()}.jpg`);

    fs.writeFileSync(inputPath, Buffer.from(await data.arrayBuffer()));

    // 1. Generate Thumbnail
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '640x?'
        })
        .on('end', () => resolve())
        .on('error', (err: any) => reject(err));
    });

    // 2. Compress Video (Fast H.264 encode for web, muted as per UX requirement)
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-vcodec libx264',
          '-crf 28',         // Constant Rate Factor (28 is good compression/quality tradeoff)
          '-preset veryfast', // Encoding speed
          '-an',             // Remove audio (UX requirement: muted autoplaying feed)
          '-movflags +faststart' // Optimize for web streaming
        ])
        .save(outputPath)
        .on('end', () => resolve())
        .on('error', (err: any) => reject(err));
    });

    // Upload processed items
    const parsedName = path.parse(filename);
    const compressedName = `${parsedName.dir}/${parsedName.name}_compressed.mp4`;
    const finalThumbName = `${parsedName.dir}/${parsedName.name}_thumb.jpg`;

    // Overwrite the original video or save side-by-side. 
    // Usually best to overwrite the original URL or keep both and update DB.
    // We'll upload side-by-side and update the DB row.
    const thumbFile = fs.readFileSync(thumbnailPath);
    await supabase.storage.from('posts').upload(finalThumbName, thumbFile, {
      contentType: 'image/jpeg',
      upsert: true
    });

    const videoFile = fs.readFileSync(outputPath);
    await supabase.storage.from('posts').upload(compressedName, videoFile, {
      contentType: 'video/mp4',
      upsert: true
    });

    const { data: thumbUrlData } = supabase.storage.from('posts').getPublicUrl(finalThumbName);
    const { data: videoUrlData } = supabase.storage.from('posts').getPublicUrl(compressedName);
    
    // Find the post linking to the original video and update it.
    const originalPublicUrl = supabase.storage.from('posts').getPublicUrl(filename).data.publicUrl;
    
    await supabase
      .from('posts')
      .update({
        video_url: videoUrlData.publicUrl,
        thumbnail_url: thumbUrlData.publicUrl,
      })
      .eq('video_url', originalPublicUrl);

    // Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    fs.unlinkSync(thumbnailPath);
    
    // Delete the original uncompressed video
    await supabase.storage.from('posts').remove([filename]);

    console.log(`Successfully processed ${filename}`);

  } catch (err) {
    console.error('Processing failed:', err);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Video processing worker listening on port ${PORT} (POST /webhook/video-process)`);
});
