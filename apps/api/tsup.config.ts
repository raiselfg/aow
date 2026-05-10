import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  outDir: 'dist',
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: [
    'sharp',
    '@prisma/client',
    '@prisma/adapter-pg',
    'pg',
    'pg-native',
    'zod',
    '@hono/zod-openapi',
    'hono',
  ],
  noExternal: ['@aow/types', '@aow/database'],
});
