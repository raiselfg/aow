import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  clean: true,
  minify: true,
  external: ['sharp', '@prisma/client'],
  noExternal: ['@aow/types', '@aow/database'],
  env: {
    NODE_ENV: 'production',
  },
});
