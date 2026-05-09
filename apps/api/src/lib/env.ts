import 'dotenv/config';
import { z } from '@hono/zod-openapi';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.string().min(1),
  AWS_ENDPOINT: z.url(),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY: z.string().min(1),
  AWS_SECRET_KEY: z.string().min(1),
  AWS_BUCKET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
