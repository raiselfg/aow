import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // Используем современные модули
  target: 'node20', // Vercel Node.js runtime
  clean: true, // Чистим папку перед билдом
  outDir: 'api', // Vercel ожидает функции в папке api
  minify: false, // Для бэкенда минификация обычно не нужна
  sourcemap: true,
  splitting: false,
  shims: true,

  // Бандлим все внутренние пакеты, чтобы Vercel не искал их в node_modules
  noExternal: [/^@aow\//],
});
