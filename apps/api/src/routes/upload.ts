import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { uploadFile } from '../lib/s3cloud.js';

export const uploadRoutes = new OpenAPIHono();

const UploadSchema = z
  .object({
    file: z
      .file()
      .max(2 * 1024 * 1024)
      .mime(['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  })
  .openapi('UploadRequest');

uploadRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: UploadSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: z.object({ url: z.url() }).openapi('UploadResponse'),
          },
        },
        description: 'File uploaded successfully',
      },
      400: { description: 'Invalid input' },
      500: { description: 'Internal server error' },
    },
  }),
  async c => {
    const { file } = c.req.valid('form');

    console.log('[Upload] Processing file:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const url = await uploadFile(file);
    return c.json({ url }, 201);
  },
);
