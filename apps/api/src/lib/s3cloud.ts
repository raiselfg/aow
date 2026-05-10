import { put, del } from '@vercel/blob';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { ValidationError, StorageError } from './errors.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function uploadFile(fileBody: File): Promise<string> {
  if (fileBody.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size exceeds 2MB limit: ${(fileBody.size / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  const inputBuffer = Buffer.from(await fileBody.arrayBuffer());
  const fileName = `${randomUUID()}.avif`;

  const optimizedBuffer = await sharp(inputBuffer)
    .resize({
      width: 1280,
      height: 1280,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .avif({
      quality: 70,
      effort: 5,
    })
    .toBuffer();

  try {
    const { url } = await put(fileName, optimizedBuffer, {
      access: 'public',
      contentType: 'image/avif',
      addRandomSuffix: false,
    });

    return url;
  } catch (error) {
    console.error('[Blob] Unexpected upload error:', error);
    throw new StorageError('Internal upload error');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) {
    console.warn('[Blob] Attempted to delete invalid file URL:', fileUrl);
    return;
  }

  try {
    await del(fileUrl);
  } catch (error) {
    console.error('[Blob] Unexpected delete error:', error);
    throw new StorageError('Internal delete error');
  }
}
