import {
  S3Client,
  PutObjectCommand,
  S3ServiceException,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { env } from './env.js';
import { ValidationError, StorageError } from './errors.js';

const ENDPOINT = env.S3_ENDPOINT;
const REGION = env.S3_REGION;
const ACCESS_KEY = env.S3_ACCESS_KEY;
const SECRET_KEY = env.S3_SECRET_KEY;
const BUCKET = env.S3_BUCKET;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const client = new S3Client({
  forcePathStyle: true,
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

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

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    Body: optimizedBuffer,
    ContentType: 'image/avif',
    ContentLength: optimizedBuffer.byteLength,
  });

  try {
    await client.send(command);
    return `${ENDPOINT}/${BUCKET}/${fileName}`;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`[S3] Upload failed: ${error.name}`, {
        status: error.$metadata.httpStatusCode,
        message: error.message,
      });
      throw new StorageError(`Storage failed: ${error.name}`);
    }

    console.error('[S3] Unexpected upload error:', error);
    throw new StorageError('Internal upload error');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const fileName = fileUrl.split(`/${BUCKET}/`)[1];

  if (!fileName) {
    console.warn(`[S3] Attempted to delete invalid file URL: ${fileUrl}`);
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
  });

  try {
    await client.send(command);
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`[S3] Delete failed: ${error.name}`, {
        status: error.$metadata.httpStatusCode,
        message: error.message,
      });
      throw new StorageError(`Storage failed: ${error.name}`);
    }

    console.error('[S3] Unexpected delete error:', error);
    throw new StorageError('Internal delete error');
  }
}
